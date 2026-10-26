import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { LiveAnalyzer, type LiveSnapshot } from "./live-analyze";

interface CaptureMeta {
  device: string;
  deviceIndex: number;
  rate: number;
  channels: number;
  frames: number;
  sampleFormat: string;
}

export interface LiveStatus {
  running: boolean;
  starting: boolean;
  meta: CaptureMeta | null;
  snapshot: LiveSnapshot | null;
  error: string | null;
  stderr: string;
}

export interface LiveStartOptions {
  device?: string;
  rate?: number;
  channels?: number;
}

function pythonCandidates(): string[] {
  const candidates = [];
  if (process.env.TONIC_PYTHON) candidates.push(process.env.TONIC_PYTHON);
  candidates.push(resolve(process.cwd(), ".venv-audio", "Scripts", "python.exe"));
  candidates.push(resolve(process.cwd(), ".venv-audio", "bin", "python"));
  candidates.push("python");
  return candidates;
}

export class LiveCapture {
  private child: ChildProcessWithoutNullStreams | null = null;
  private analyzer: LiveAnalyzer | null = null;
  private meta: CaptureMeta | null = null;
  private pending: Buffer[] = [];
  private stderr = "";
  private error: string | null = null;
  private starting = false;

  status(): LiveStatus {
    return {
      running: Boolean(this.child),
      starting: this.starting,
      meta: this.meta,
      snapshot: this.analyzer?.snapshot() ?? null,
      error: this.error,
      stderr: this.stderr.slice(-1200),
    };
  }

  start(options: LiveStartOptions = {}): LiveStatus {
    if (this.child) return this.status();
    this.starting = true;
    this.error = null;
    this.meta = null;
    this.analyzer = null;
    this.pending = [];
    this.stderr = "";

    const python = pythonCandidates().find((candidate) =>
      candidate === "python" ? true : existsSync(candidate),
    );
    if (!python) {
      this.starting = false;
      this.error =
        "找不到 Python。请运行 setup-live-audio.bat，或设置 TONIC_PYTHON 指向 Python。";
      return this.status();
    }
    const helper = resolve(process.cwd(), "scripts", "live-capture.py");
    if (!existsSync(helper)) {
      this.starting = false;
      this.error = `找不到实时抓取脚本：${helper}`;
      return this.status();
    }
    const args = ["-u", helper, "--watch-stdin"];
    if (options.device) args.push("--device", options.device);
    if (typeof options.rate === "number" && options.rate > 0) {
      args.push("--rate", String(Math.round(options.rate)));
    }
    if (typeof options.channels === "number" && options.channels > 0) {
      args.push("--channels", String(Math.round(options.channels)));
    }

    const child = spawn(python, args, {
      cwd: process.cwd(),
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"],
    });
    this.child = child;
    child.stderr.on("data", (chunk: Buffer) => {
      const text = chunk.toString("utf8");
      this.stderr = `${this.stderr}${text}`.slice(-4000);
      for (const line of text.split(/\r?\n/)) {
        if (!line.startsWith("TONIC_META ")) continue;
        try {
          const meta = JSON.parse(line.slice("TONIC_META ".length)) as CaptureMeta;
          this.meta = meta;
          this.analyzer = new LiveAnalyzer(meta.rate, meta.channels);
          this.starting = false;
          if (this.pending.length) {
            for (const pending of this.pending) this.analyzer.pushPcm(pending);
            this.pending = [];
          }
        } catch {
          this.error = "实时抓取返回了无法解析的设备信息。";
          this.starting = false;
        }
      }
    });
    child.stdout.on("data", (chunk: Buffer) => {
      if (this.analyzer) this.analyzer.pushPcm(chunk);
      else if (this.pending.length < 64) this.pending.push(chunk);
    });
    child.on("error", (error) => {
      this.error = `无法启动实时抓取：${error.message}`;
      this.starting = false;
      this.child = null;
    });
    child.on("exit", (code, signal) => {
      this.child = null;
      this.starting = false;
      if (code !== 0 && code !== null) {
        const detail = this.stderr.trim().split(/\r?\n/).slice(-3).join(" ");
        this.error = `实时抓取已退出（code ${code}${signal ? `, ${signal}` : ""}）${
          detail ? `：${detail}` : ""
        }`;
      }
    });
    return this.status();
  }

  stop(): LiveStatus {
    const child = this.child;
    this.child = null;
    this.starting = false;
    this.pending = [];
    this.analyzer = null;
    this.meta = null;
    if (child) {
      try {
        child.kill();
      } catch {
        // 进程可能已经退出。
      }
    }
    return this.status();
  }
}
