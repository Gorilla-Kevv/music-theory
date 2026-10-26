import { createServer, type Server, type Socket } from "node:net";
import { LiveAnalyzer, type LiveSnapshot } from "./live-analyze";

const PORT = Number(process.env.TONIC_PLUGIN_PORT ?? 5128);
const MAGIC = 0x434e4f54;
const MAX_FRAMES = 8192;

export interface PluginMeta {
  event: "start";
  device: string;
  deviceIndex: number;
  rate: number;
  channels: number;
  frames: number;
  sampleFormat: string;
}

export interface PluginLiveStatus {
  running: boolean;
  starting: false;
  connected: boolean;
  source: "fl-clap";
  meta: PluginMeta | null;
  snapshot: LiveSnapshot | null;
  error: string | null;
  stderr: string;
}

export class PluginLiveServer {
  private server: Server | null = null;
  private socket: Socket | null = null;
  private analyzer: LiveAnalyzer | null = null;
  private meta: PluginMeta | null = null;
  private error: string | null = null;

  constructor() {
    this.server = createServer((socket) => this.handleConnection(socket));
    this.server.on("error", (error) => {
      this.error = `CLAP 音频端口 ${PORT} 无法监听：${error.message}`;
    });
    this.server.listen(PORT, "127.0.0.1");
  }

  status(): PluginLiveStatus {
    return {
      running: this.socket !== null,
      starting: false,
      connected: this.socket !== null,
      source: "fl-clap",
      meta: this.meta,
      snapshot: this.analyzer?.snapshot() ?? null,
      error: this.error,
      stderr: "",
    };
  }

  close(): void {
    this.socket?.destroy();
    this.socket = null;
    this.server?.close();
    this.server = null;
  }

  private handleConnection(socket: Socket): void {
    if (this.socket) {
      this.socket.destroy();
      this.socket = null;
    }
    this.socket = socket;
    this.analyzer = null;
    this.meta = null;
    this.error = null;
    socket.setNoDelay(true);
    let pending = Buffer.alloc(0);
    let handshakeDone = false;

    socket.on("data", (chunk: Buffer) => {
      pending = pending.length ? Buffer.concat([pending, chunk]) : chunk;
      if (!handshakeDone) {
        const newline = pending.indexOf(0x0a);
        if (newline < 0) return;
        const line = pending.subarray(0, newline).toString("ascii").trim();
        pending = pending.subarray(newline + 1);
        const match = /^TONIC1\s+(\d+)\s+(\d+)$/.exec(line);
        if (!match) {
          this.error = `CLAP 握手无效：${line.slice(0, 120)}`;
          socket.destroy();
          return;
        }
        const rate = Number(match[1]);
        const channels = Number(match[2]);
        if (!Number.isFinite(rate) || rate < 8000 || rate > 192000 || channels < 1 || channels > 8) {
          this.error = `CLAP 音频参数无效：${rate} Hz / ${channels} ch`;
          socket.destroy();
          return;
        }
        this.meta = {
          event: "start",
          device: "FL Mixer CLAP",
          deviceIndex: 0,
          rate,
          channels,
          frames: 0,
          sampleFormat: "f32le",
        };
        this.analyzer = new LiveAnalyzer(rate, channels);
        handshakeDone = true;
      }

      while (handshakeDone && this.analyzer && pending.length >= 8) {
        const magic = pending.readUInt32LE(0);
        const frames = pending.readUInt32LE(4);
        if (magic !== MAGIC || frames === 0 || frames > MAX_FRAMES) {
          this.error = `CLAP 音频帧无效：magic=0x${magic.toString(16)} frames=${frames}`;
          socket.destroy();
          return;
        }
        const bytes = 8 + frames * this.meta!.channels * 4;
        if (pending.length < bytes) return;
        this.analyzer.pushFloat32(pending.subarray(8, bytes), frames, this.meta!.channels);
        pending = pending.subarray(bytes);
      }
    });
    socket.on("error", (error) => {
      this.error = `CLAP 连接错误：${error.message}`;
    });
    socket.on("close", () => {
      if (this.socket === socket) {
        this.socket = null;
        this.analyzer = null;
      }
    });
  }
}
