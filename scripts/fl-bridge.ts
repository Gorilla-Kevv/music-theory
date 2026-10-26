import { execFileSync, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { extname, join, resolve } from "node:path";
import {
  BIBLIOGRAPHY_BY_ID,
  collectCitations,
  getChaptersForConcept,
  getConcept,
} from "../src/content";
import { searchTheory } from "../src/lib/theory-api";
import { FlCdp } from "./fl-cdp";
import { buildArrangement, type ArrangementPartRequest } from "./arranger";
import { analyzeWavBuffer } from "./audio-analyze";
import { compareAudioAnalyses } from "./audio-compare";
import { LiveCapture } from "./live-capture";
import { PluginLiveServer } from "./plugin-live";
import {
  getFlPayload,
  listFlExamples,
  makePianoRollScript,
  makeRawNoteScript,
  payloadSummary,
  type ApplyMode,
  type RawFlNote,
} from "./fl-payload";

const PORT = Number(process.env.TONIC_FL_PORT ?? 5127);
const DEBUG_PORT = Number(process.env.FL_DEBUG_PORT ?? 9222);
const FL_PATH =
  process.env.FL_STUDIO_PATH ?? "C:\\Program Files\\Image-Line\\FL Studio 2026\\FL64.exe";
const PANEL_DIR = resolve(process.cwd(), "fl-panel");
const PANEL_URL = `http://127.0.0.1:${PORT}/panel`;
const FLAGS = new Set(process.argv.slice(2));
const LAUNCH_FL = FLAGS.has("--launch-fl");
const OPEN_PANEL = FLAGS.has("--panel");

const fl = new FlCdp(DEBUG_PORT);
const liveCapture = new LiveCapture();
const pluginLive = new PluginLiveServer();
let lastFlError = "";
let lastTools: unknown = null;
let panelInjected = false;

function log(message: string): void {
  console.log(`[TONIC-FL] ${message}`);
}

function json(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(payload);
}

async function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  if (chunks.length === 0) return {};
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw.trim()) return {};
  const parsed = JSON.parse(raw) as unknown;
  return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
}

async function debugPortOpen(): Promise<boolean> {
  try {
    const response = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/version`, {
      signal: AbortSignal.timeout(1200),
    });
    return response.ok;
  } catch {
    return false;
  }
}

function flIsRunning(): boolean {
  try {
    const output = execFileSync("tasklist", ["/FI", "IMAGENAME eq FL64.exe"], {
      encoding: "utf8",
      windowsHide: true,
    });
    return /FL64\.exe/i.test(output);
  } catch {
    return false;
  }
}

async function launchFl(): Promise<void> {
  if (await debugPortOpen()) {
    log(`FL 调试端口 ${DEBUG_PORT} 已开启，直接附加。`);
    return;
  }
  if (flIsRunning()) {
    log("检测到 FL Studio 已在运行，但它没有开启 WebView2 调试端口。");
    log("请先保存工程，然后关闭 FL，再运行 `npm run fl:bridge -- --launch-fl --panel`。");
    log("（不会自动关闭你的 FL，避免丢失未保存工程。）");
    return;
  }
  if (!existsSync(FL_PATH)) {
    log(`找不到 FL Studio：${FL_PATH}`);
    log("请设置环境变量 FL_STUDIO_PATH 指向 FL64.exe。");
    return;
  }
  log(`启动 FL Studio（WebView2 调试端口 ${DEBUG_PORT}）...`);
  const child = spawn(FL_PATH, [], {
    env: {
      ...process.env,
      WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: `--remote-debugging-port=${DEBUG_PORT}`,
    },
    detached: true,
    stdio: "ignore",
    windowsHide: false,
  });
  child.unref();
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 2500));
  log("FL 已启动。请在 FL 中打开 Gopher 面板（工具栏 Gopher / Alt+F1）；打开后调试端口才会出现。");
}

async function tryAttach(): Promise<boolean> {
  if (fl.connected) return true;
  try {
    const target = await fl.waitForTarget(2500);
    if (!target) return false;
    await fl.connect();
    lastFlError = "";
    lastTools = await fl.listTools();
    log(`已附加 FL：${target.title || target.url}`);
    if (OPEN_PANEL && !panelInjected && target.url !== PANEL_URL) {
      await fl.navigate(PANEL_URL);
      panelInjected = true;
      log(`Gopher 面板已切换到 TONIC：${PANEL_URL}`);
    }
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message !== lastFlError) {
      lastFlError = message;
      log(`FL 附加失败：${message}`);
    }
    return false;
  }
}

async function requireFl(): Promise<void> {
  if (await tryAttach()) return;
  const target = await fl.findTarget();
  if (!target) {
    throw new Error(
      "找不到 FL 的 Gopher WebView。请用 `npm run fl:bridge -- --launch-fl --panel` 启动 FL，并打开一次 Gopher 面板（Alt+F1）。",
    );
  }
  throw new Error(lastFlError || "FL 未连接");
}

const SOURCE_SHORT: Record<string, string> = {
  levine: "Levine",
  laitz: "Laitz",
  sposobin: "Sposobin",
  soundquest: "SoundQuest",
};

function flResultText(result: unknown): string {
  if (typeof result === "string") {
    const marker = result.indexOf('"text": "');
    if (marker >= 0) {
      const start = marker + '"text": "'.length;
      const isError = result.indexOf('"isError"', start);
      const end =
        isError > start ? result.lastIndexOf('"', isError - 1) : result.lastIndexOf('"');
      if (end > start) return result.slice(start, end);
    }
    return result;
  }
  if (result && typeof result === "object") {
    const content = (result as { content?: unknown }).content;
    if (Array.isArray(content)) {
      return content
        .map((item) =>
          item && typeof item === "object" && typeof (item as { text?: unknown }).text === "string"
            ? (item as { text: string }).text
            : "",
        )
        .join("\n");
    }
  }
  return String(result ?? "");
}

function flResultJson<T>(result: unknown): T | null {
  const rawText = flResultText(result);
  const candidates = new Set<string>([rawText]);
  let nested = rawText;
  for (let level = 0; level < 3; level += 1) {
    nested = nested
      .replace(/\\\\n/g, "\n")
      .replace(/\\\\r/g, "\r")
      .replace(/\\\\t/g, "\t")
      .replace(/\\\\"/g, '"');
    candidates.add(nested);
  }
  candidates.add(
    rawText
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t")
      .replace(/\\"/g, '"'),
  );
  for (const candidate of candidates) {
    let text = candidate;
    for (let depth = 0; depth < 3; depth += 1) {
      try {
        const parsed = JSON.parse(text) as unknown;
        if (typeof parsed === "string") {
          text = parsed;
          continue;
        }
        return parsed as T;
      } catch {
        break;
      }
    }
  }
  return null;
}

async function flCall(name: string, args: Record<string, unknown> = {}): Promise<unknown> {
  await requireFl();
  return fl.callTool(name, args);
}

async function openPianoRoll(channel: string | number | undefined): Promise<void> {
  if (channel === undefined || channel === null || channel === "") return;
  await flCall("open_piano_roll_for_channel", { target_channel: String(channel) });
}

async function runPianoRoll(source: string): Promise<unknown> {
  return flCall("run_piano_roll_script", { source });
}

async function verifyPianoRollCount(): Promise<number | null> {
  try {
    const result = await runPianoRoll(
      'import flpianoroll as fp\nraise Exception("TONIC_NOTES=" + str(fp.score.noteCount))',
    );
    const match = flResultText(result).match(/TONIC_NOTES=(\d+)/);
    return match ? Number(match[1]) : null;
  } catch {
    return null;
  }
}

interface FlSessionChannel {
  index: number;
  name: string;
  generator_plugin?: string | null;
  volume_db?: number;
  pan?: number;
  routed_to_mixer_track?: number | null;
}

interface FlSessionMixerTrack {
  index: number;
  name: string;
  is_master?: boolean;
  volume_db?: number;
  pan?: number;
  effect_plugins?: Array<{ slot?: number; name?: string }>;
  sends?: Array<{ to_track?: number; to_name?: string; level?: number }>;
}

interface FlSessionContext {
  tempo_bpm?: number;
  active_channels?: FlSessionChannel[];
  active_mixer_tracks?: FlSessionMixerTrack[];
}

async function getSessionContext(): Promise<FlSessionContext> {
  const result = await flCall("get_session_context", {});
  const data = flResultJson<FlSessionContext>(result);
  if (!data) {
    throw new Error(`无法解析 FL session 快照：${flResultText(result).slice(0, 300)}`);
  }
  return data;
}

interface FlRoutingSend {
  to_track?: number;
  to_name?: string;
  level?: number;
}

interface FlRoutingRow {
  from_track?: number;
  from_name?: string;
  sends?: FlRoutingSend[];
}

interface RoutingEdge {
  from: number;
  fromName: string;
  to: number;
  toName: string;
  level: number;
}

type RoutingNodeKind = "master" | "bus" | "return" | "strip" | "empty";

interface RoutingNode {
  index: number;
  name: string;
  kind: RoutingNodeKind;
  channels: string[];
  plugins: string[];
  incomingSends: number;
  outgoingSends: number;
  reachableToMaster: boolean;
}

interface RoutingGraph {
  nodes: RoutingNode[];
  edges: RoutingEdge[];
  buses: RoutingNode[];
  returns: RoutingNode[];
  cycles: string[];
  maxDepth: number;
}

async function getRoutingMatrix(): Promise<FlRoutingRow[]> {
  const result = await flCall("get_mixer_routing", {});
  const data = flResultJson<FlRoutingRow[]>(result);
  if (!Array.isArray(data)) {
    throw new Error(`无法解析 FL 混音路由矩阵：${flResultText(result).slice(0, 300)}`);
  }
  return data;
}

function sessionRoutingMatrix(session: FlSessionContext): FlRoutingRow[] {
  return (session.active_mixer_tracks ?? []).map((track) => ({
    from_track: track.index,
    from_name: track.name,
    sends: track.sends,
  }));
}

function buildRoutingGraph(
  matrix: FlRoutingRow[],
  channels: FlSessionChannel[],
  mixerTracks: FlSessionMixerTrack[],
): RoutingGraph {
  const nodes = new Map<number, RoutingNode>();
  for (const track of mixerTracks) {
    nodes.set(track.index, {
      index: track.index,
      name: track.name || (track.index === 0 ? "Master" : `插入 ${track.index}`),
      kind: track.index === 0 || track.is_master ? "master" : "empty",
      channels: [],
      plugins: (track.effect_plugins ?? [])
        .map((plugin) => plugin.name)
        .filter((name): name is string => Boolean(name)),
      incomingSends: 0,
      outgoingSends: 0,
      reachableToMaster: track.index === 0 || track.is_master === true,
    });
  }
  for (const row of matrix) {
    const index = Number(row.from_track);
    if (!Number.isFinite(index)) continue;
    const current = nodes.get(index) ?? {
      index,
      name: row.from_name || `插入 ${index}`,
      kind: index === 0 ? "master" : "empty",
      channels: [],
      plugins: [],
      incomingSends: 0,
      outgoingSends: 0,
      reachableToMaster: index === 0,
    };
    current.name = row.from_name || current.name;
    nodes.set(index, current);
  }

  const edges: RoutingEdge[] = [];
  for (const row of matrix) {
    const from = Number(row.from_track);
    if (!Number.isFinite(from)) continue;
    const fromNode = nodes.get(from);
    for (const send of row.sends ?? []) {
      const to = Number(send.to_track);
      const level = Number(send.level ?? 0);
      if (!Number.isFinite(to) || !Number.isFinite(level) || level <= 0.0001) continue;
      edges.push({
        from,
        fromName: fromNode?.name ?? `插入 ${from}`,
        to,
        toName: send.to_name ?? nodes.get(to)?.name ?? (to === 0 ? "Master" : `插入 ${to}`),
        level,
      });
      if (fromNode) fromNode.outgoingSends += 1;
      const toNode = nodes.get(to);
      if (toNode) toNode.incomingSends += 1;
    }
  }

  for (const channel of channels) {
    const target = channel.routed_to_mixer_track;
    if (typeof target !== "number") continue;
    const node = nodes.get(target);
    if (node) node.channels.push(channel.name || `#${channel.index}`);
  }

  const adjacency = new Map<number, RoutingEdge[]>();
  for (const edge of edges) {
    const list = adjacency.get(edge.from) ?? [];
    list.push(edge);
    adjacency.set(edge.from, list);
  }

  const canReachMaster = (start: number): boolean => {
    if (start === 0) return true;
    const visited = new Set<number>();
    const stack = [start];
    while (stack.length) {
      const current = stack.pop()!;
      if (current === 0) return true;
      if (visited.has(current)) continue;
      visited.add(current);
      for (const edge of adjacency.get(current) ?? []) stack.push(edge.to);
    }
    return false;
  };

  const depthToMaster = new Map<number, number>();
  const measureDepth = (start: number, visiting: Set<number>): number => {
    if (start === 0) return 0;
    if (depthToMaster.has(start)) return depthToMaster.get(start)!;
    if (visiting.has(start)) return 0;
    visiting.add(start);
    let best = -1;
    for (const edge of adjacency.get(start) ?? []) {
      const child = measureDepth(edge.to, visiting);
      if (child >= 0) best = Math.max(best, child + 1);
    }
    visiting.delete(start);
    depthToMaster.set(start, best);
    return best;
  };

  const cycles = new Set<string>();
  const color = new Map<number, 0 | 1 | 2>();
  const stack: number[] = [];
  const visit = (node: number): void => {
    color.set(node, 1);
    stack.push(node);
    for (const edge of adjacency.get(node) ?? []) {
      const state = color.get(edge.to) ?? 0;
      if (state === 1) {
        const start = stack.indexOf(edge.to);
        const cycleNodes = stack.slice(start >= 0 ? start : 0).concat(edge.to);
        cycles.add(cycleNodes.map((index) => nodes.get(index)?.name ?? String(index)).join(" → "));
      } else if (state === 0) {
        visit(edge.to);
      }
    }
    stack.pop();
    color.set(node, 2);
  };
  for (const index of nodes.keys()) {
    if ((color.get(index) ?? 0) === 0) visit(index);
  }

  let maxDepth = 0;
  for (const node of nodes.values()) {
    node.reachableToMaster = canReachMaster(node.index);
    const depth = measureDepth(node.index, new Set());
    if (depth > maxDepth) maxDepth = depth;
    if (node.index === 0) {
      node.kind = "master";
      continue;
    }
    const outgoingToNonMaster = (adjacency.get(node.index) ?? []).some((edge) => edge.to !== 0);
    if (node.channels.length > 0 && (node.channels.length > 1 || outgoingToNonMaster || !isDefaultMixerName(node.name))) {
      node.kind = "bus";
    } else if (node.channels.length === 0 && node.incomingSends > 0) {
      node.kind = "return";
    } else if (node.channels.length > 0) {
      node.kind = "strip";
    } else {
      node.kind = "empty";
    }
  }

  const sortedNodes = [...nodes.values()].sort((a, b) => a.index - b.index);
  return {
    nodes: sortedNodes,
    edges,
    buses: sortedNodes.filter((node) => node.kind === "bus"),
    returns: sortedNodes.filter((node) => node.kind === "return"),
    cycles: [...cycles],
    maxDepth,
  };
}

function isMasterToken(token: string): boolean {
  return /^(0|master|master track|主|主轨)$/i.test(token.trim());
}

function asciiJson(value: unknown): string {
  return JSON.stringify(value).replace(/[^\x00-\x7f]+/g, (chunk) =>
    [...chunk]
      .map((char) => {
        const code = char.codePointAt(0)!;
        if (code <= 0xffff) return `\\u${code.toString(16).padStart(4, "0")}`;
        const offset = code - 0x10000;
        const high = 0xd800 + (offset >> 10);
        const low = 0xdc00 + (offset & 0x3ff);
        return `\\u${high.toString(16).padStart(4, "0")}\\u${low
          .toString(16)
          .padStart(4, "0")}`;
      })
      .join(""),
  );
}

function findMixerTrack(
  session: FlSessionContext,
  token: string,
): FlSessionMixerTrack | undefined {
  const numeric = Number(token);
  return (session.active_mixer_tracks ?? []).find((track) =>
    isMasterToken(token)
      ? track.index === 0 || track.is_master === true
      : track.name === token || (Number.isFinite(numeric) && track.index === numeric),
  );
}

function findRoutingRow(matrix: FlRoutingRow[], token: string): FlRoutingRow | undefined {
  const numeric = Number(token);
  return matrix.find(
    (row) =>
      (isMasterToken(token) && row.from_track === 0) ||
      row.from_name === token ||
      (Number.isFinite(numeric) && row.from_track === numeric),
  );
}

function sourceLabel(source: string): string {
  return SOURCE_SHORT[source] ?? BIBLIOGRAPHY_BY_ID[source as keyof typeof BIBLIOGRAPHY_BY_ID]?.authors ?? source;
}

function conceptView(slug: string) {
  const concept = getConcept(slug);
  if (!concept) return null;
  const citations = collectCitations(concept).map(({ ref }) => ({
    source: sourceLabel(ref.source),
    locator: ref.locator,
    ...(ref.note ? { note: ref.note } : {}),
  }));
  return {
    slug: concept.slug,
    number: concept.number,
    title: concept.title,
    titleEn: concept.titleEn,
    category: concept.category,
    level: concept.level,
    summary: concept.summary,
    dimensions: concept.dimensions ?? [],
    aliases: concept.aliases,
    tags: concept.tags,
    citations,
    sources: getChaptersForConcept(concept.slug).map((chapter) => ({
      id: chapter.id,
      book: chapter.book,
      number: chapter.number,
      title: chapter.title,
      titleZh: chapter.titleZh,
      summary: chapter.summary,
      link: `/books?book=${chapter.book}&chapter=${chapter.id}`,
    })),
    examples: concept.examples.map((item) => ({
      id: item.id,
      title: item.title,
      caption: item.caption,
      kind: item.kind,
      tempo: item.tempo,
      beats: item.beats,
      noteCount: item.events.reduce((sum, event) => sum + event.notes.length, 0),
    })),
  };
}

async function applyExample(input: Record<string, unknown>) {
  const conceptSlug = typeof input.conceptSlug === "string" ? input.conceptSlug : undefined;
  const exampleId = typeof input.exampleId === "string" ? input.exampleId : undefined;
  const startBeat = typeof input.startBeat === "number" ? input.startBeat : 0;
  const mode: ApplyMode = input.mode === "replace" ? "replace" : "append";
  const channel =
    typeof input.channel === "number" || typeof input.channel === "string"
      ? input.channel
      : undefined;
  const payload = getFlPayload({ conceptSlug, exampleId, startBeat });
  if (!payload) throw new Error("找不到对应的谱例；请提供有效的 conceptSlug 或 exampleId。");
  await requireFl();
  await openPianoRoll(channel);
  const script = makePianoRollScript(payload, mode);
  const result = await runPianoRoll(script);
  // FL 的脚本工具不返回 stdout；抛异常是唯一可靠的读回方式，且不会弹窗。
  const verifiedNotes = await verifyPianoRollCount();
  return { ok: true, payload, summary: payloadSummary(payload), script, result, verifiedNotes };
}

interface SessionFinding {
  code: string;
  severity: "info" | "warn" | "risk";
  message: string;
  evidence?: string;
  suggestion?: string;
}

function isDefaultMixerName(name: string): boolean {
  return !name.trim() || /^(插入|Insert)\s*\d+$/i.test(name.trim());
}

async function sessionReport() {
  const session = await getSessionContext();
  const channels = session.active_channels ?? [];
  const mixerTracks = session.active_mixer_tracks ?? [];
  let routingMatrix = sessionRoutingMatrix(session);
  try {
    routingMatrix = await getRoutingMatrix();
  } catch {
    // session 快照里的 sends 作为回退；矩阵工具失败时不阻断整个报告。
  }
  const routingGraph = buildRoutingGraph(routingMatrix, channels, mixerTracks);
  const routed = new Map<number, string[]>();
  const usedMixerIndexes = new Set<number>([0]);
  for (const channel of channels) {
    const target = channel.routed_to_mixer_track;
    if (typeof target === "number") {
      usedMixerIndexes.add(target);
      const names = routed.get(target) ?? [];
      names.push(channel.name || `#${channel.index}`);
      routed.set(target, names);
    }
  }
  for (const track of mixerTracks) {
    const hasPlugins = (track.effect_plugins?.length ?? 0) > 0;
    const hasExtraSends = (track.sends ?? []).some(
      (send) => typeof send.to_track === "number" && send.to_track !== 0,
    );
    if (hasPlugins || hasExtraSends || !isDefaultMixerName(track.name)) {
      usedMixerIndexes.add(track.index);
    }
  }

  const findings: SessionFinding[] = [];
  for (const channel of channels) {
    if (channel.routed_to_mixer_track == null) {
      findings.push({
        code: "channel-unrouted",
        severity: "warn",
        message: `通道「${channel.name || `#${channel.index}`}」没有分配到混音器轨道。`,
        evidence: `channel index=${channel.index}`,
        suggestion: "用 fl_route 把它路由到一个混音器插入轨道。",
      });
    }
    if (!channel.name.trim()) {
      findings.push({
        code: "channel-unnamed",
        severity: "info",
        message: `通道 #${channel.index} 没有名称，后续按名字操作会不稳定。`,
        suggestion: "在 FL 通道机架重命名，或用索引操作。",
      });
    }
    const track = mixerTracks.find((item) => item.index === channel.routed_to_mixer_track);
    if (
      typeof channel.volume_db === "number" &&
      channel.volume_db >= -0.05 &&
      (track?.volume_db ?? 0) > 0.5
    ) {
      findings.push({
        code: "channel-gain-stack",
        severity: "risk",
        message: `通道「${channel.name || `#${channel.index}`}」在 0 dB，且下游「${track?.name ?? "混音器"}」推子为 +${(track?.volume_db ?? 0).toFixed(1)} dB，增益叠加（实际峰值未测量）。`,
        evidence: `channel ${channel.index} → mixer ${track?.index ?? "?"}`,
        suggestion: "先把通道或混音器推子降回 0 dB，再用 WAV 分析确认峰值与 LUFS。",
      });
    }
    if (typeof channel.volume_db === "number" && channel.volume_db <= -24) {
      findings.push({
        code: "channel-quiet",
        severity: "info",
        message: `通道「${channel.name || `#${channel.index}`}」电平很低（${channel.volume_db.toFixed(1)} dB），检查是否靠下游增益补偿。`,
        evidence: `channel ${channel.index}`,
      });
    }
    if (Math.abs(channel.pan ?? 0) >= 0.95) {
      findings.push({
        code: "channel-hard-pan",
        severity: "info",
        message: `通道「${channel.name || `#${channel.index}`}」几乎硬声像（${(channel.pan ?? 0).toFixed(2)}）。`,
        evidence: `channel ${channel.index}`,
      });
    }
  }

  for (const cycle of routingGraph.cycles) {
    findings.push({
      code: "routing-cycle",
      severity: "risk",
      message: `混音发送存在环路：${cycle}。`,
      suggestion: "用 fl_send 关闭环路中的一条发送；反馈环路可能导致失控增益。",
    });
  }
  for (const node of routingGraph.nodes) {
    const receivesSignal = node.channels.length > 0 || node.incomingSends > 0;
    if (node.index !== 0 && receivesSignal && !node.reachableToMaster) {
      findings.push({
        code: "routing-dead-end",
        severity: "risk",
        message: `「${node.name}」有输入但没有任何路径到主轨，声音会被丢弃。`,
        evidence: `mixer ${node.index}`,
        suggestion: "用 fl_send 把它或它的上游接回主轨/总线。",
      });
    }
  }
  for (const edge of routingGraph.edges) {
    if (edge.from === edge.to) {
      findings.push({
        code: "send-to-self",
        severity: "risk",
        message: `「${edge.fromName}」发送到自身，可能形成反馈。`,
        evidence: `mixer ${edge.from} → ${edge.to}`,
        suggestion: "关闭这条自发发送。",
      });
    } else if (edge.to !== 0 && edge.level >= 0.999) {
      findings.push({
        code: "send-full",
        severity: "info",
        message: `「${edge.fromName}」以 100% 发送到「${edge.toName}」，会与干声并行叠加。`,
        evidence: `mixer ${edge.from} → ${edge.to}`,
      });
    }
  }
  if (routingGraph.maxDepth > 3) {
    findings.push({
      code: "routing-deep",
      severity: "info",
      message: `混音路由最深 ${routingGraph.maxDepth} 级才到主轨，排查链路时要注意上下游顺序。`,
    });
  }

  const master = mixerTracks.find((track) => track.index === 0 || track.is_master);
  if (master) {
    if ((master.volume_db ?? 0) > 0) {
      findings.push({
        code: "master-hot",
        severity: "risk",
        message: `主轨推子为 +${(master.volume_db ?? 0).toFixed(1)} dB，存在削波风险（实际峰值未测量）。`,
        suggestion: "把主轨降回 0 dB，或先检查各分轨电平。",
      });
    }
    if ((master.effect_plugins?.length ?? 0) > 0) {
      findings.push({
        code: "master-chain",
        severity: "info",
        message: `主轨有 ${master.effect_plugins!.length} 个效果器：${master.effect_plugins!.map((item) => item.name ?? "?").join(" / ")}。`,
      });
    }
  }

  for (const track of mixerTracks) {
    if (!usedMixerIndexes.has(track.index) || track.is_master || track.index === 0) continue;
    const name = track.name || `插入 ${track.index}`;
    if ((track.volume_db ?? 0) > 0.5) {
      findings.push({
        code: "track-hot",
        severity: "warn",
        message: `「${name}」推子为 +${(track.volume_db ?? 0).toFixed(1)} dB，处于增益状态（实际峰值未测量）。`,
        evidence: `mixer ${track.index}`,
        suggestion: "结合峰值表确认；必要时用 fl_set_levels 降回 0 dB 或更低。",
      });
    }
    if ((track.volume_db ?? 0) <= -24) {
      findings.push({
        code: "track-quiet",
        severity: "info",
        message: `「${name}」推子很低（${(track.volume_db ?? 0).toFixed(1)} dB），可能被其他轨道淹没。`,
        evidence: `mixer ${track.index}`,
      });
    }
    if (Math.abs(track.pan ?? 0) >= 0.95) {
      findings.push({
        code: "track-hard-pan",
        severity: "info",
        message: `「${name}」几乎硬声像（${(track.pan ?? 0).toFixed(2)}），检查是否符合编曲意图。`,
        evidence: `mixer ${track.index}`,
      });
    }
    const extraSends = (track.sends ?? []).filter(
      (send) => typeof send.to_track === "number" && send.to_track !== 0,
    );
    if (extraSends.length) {
      findings.push({
        code: "track-sends",
        severity: "info",
        message: `「${name}」有额外发送：${extraSends
          .map((send) => `${send.to_name ?? send.to_track} @${Math.round((send.level ?? 0) * 100)}%`)
          .join(" / ")}。`,
        evidence: `mixer ${track.index}`,
      });
    }
  }

  for (const [trackIndex, names] of routed.entries()) {
    if (trackIndex === 0 || names.length <= 1) continue;
    const track = mixerTracks.find((item) => item.index === trackIndex);
    findings.push({
      code: "shared-mixer-track",
      severity: "info",
      message: `${names.length} 个通道共享混音器「${track?.name ?? trackIndex}」：${names.join(" / ")}。`,
      evidence: `mixer ${trackIndex}`,
      suggestion: "若这是总线/鼓组，属正常；否则检查是否误路由。",
    });
  }

  const severityRank = { risk: 0, warn: 1, info: 2 } as const;
  findings.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);

  return {
    ok: true,
    measurementAvailable: false,
    measurementNote:
      "这是基于推子、声像、路由拓扑、插件链与通道电平的结构诊断；FL 内置 MCP 不提供峰值/LUFS/频谱。需要真实响度时，先在 FL 导出 WAV，再用 analyze_audio 分析（true peak/LUFS/LRA/频谱）。",
    tempoBpm: session.tempo_bpm ?? null,
    channelCount: channels.length,
    mixerTrackCount: mixerTracks.length,
    routing: channels.map((channel) => ({
      channel: channel.name,
      channelIndex: channel.index,
      mixerTrack: channel.routed_to_mixer_track ?? null,
    })),
    channelLevels: channels.map((channel) => ({
      channel: channel.name,
      channelIndex: channel.index,
      volumeDb: channel.volume_db ?? null,
      pan: channel.pan ?? null,
      mixerTrack: channel.routed_to_mixer_track ?? null,
      generator: channel.generator_plugin ?? null,
    })),
    routingGraph: {
      nodes: routingGraph.nodes,
      edges: routingGraph.edges,
      buses: routingGraph.buses,
      returns: routingGraph.returns,
      cycles: routingGraph.cycles,
      maxDepth: routingGraph.maxDepth,
    },
    master: master
      ? {
          name: master.name,
          volumeDb: master.volume_db ?? null,
          pan: master.pan ?? null,
          effects: master.effect_plugins ?? [],
        }
      : null,
    findings,
    summary: {
      risk: findings.filter((item) => item.severity === "risk").length,
      warn: findings.filter((item) => item.severity === "warn").length,
      info: findings.filter((item) => item.severity === "info").length,
    },
  };
}

async function mixerRoutingReport() {
  const session = await getSessionContext();
  const matrix = await getRoutingMatrix();
  const graph = buildRoutingGraph(
    matrix,
    session.active_channels ?? [],
    session.active_mixer_tracks ?? [],
  );
  return {
    ok: true,
    measurementAvailable: false,
    measurementNote:
      "路由拓扑来自 FL 的 send/receive 矩阵；不含真实峰值/LUFS。电平诊断请结合 analyze_audio 分析导出的 WAV。",
    tempoBpm: session.tempo_bpm ?? null,
    channelCount: (session.active_channels ?? []).length,
    mixerTrackCount: (session.active_mixer_tracks ?? []).length,
    graph,
    matrix: matrix.map((row) => ({
      from: row.from_track ?? null,
      fromName: row.from_name ?? null,
      sends: (row.sends ?? [])
        .filter((send) => (send.level ?? 0) > 0.0001)
        .map((send) => ({
          to: send.to_track ?? null,
          toName: send.to_name ?? null,
          level: send.level ?? null,
        })),
    })),
  };
}

interface SendChange {
  source: string;
  dest: string;
  active: boolean;
  level: number;
}

function normalizeSendChanges(input: Record<string, unknown>): SendChange[] {
  const raw = Array.isArray(input.sends)
    ? input.sends
    : [{ source: input.source, dest: input.dest, active: input.active, level: input.level }];
  return raw.map((item) => {
    if (!item || typeof item !== "object") throw new Error("发送路由格式无效。");
    const entry = item as Record<string, unknown>;
    const source = String(entry.source ?? "");
    const dest = String(entry.dest ?? "");
    if (!source.trim() || !dest.trim()) throw new Error("每条发送需要 source 与 dest。");
    const active = entry.active === undefined ? true : Boolean(entry.active);
    const level = entry.level === undefined ? 1 : Number(entry.level);
    if (!Number.isFinite(level) || level < 0 || level > 1) {
      throw new Error(`发送电平必须在 0–1：${entry.level}`);
    }
    return { source, dest, active, level: active ? level : 0 };
  });
}

async function setSends(input: Record<string, unknown>) {
  const changes = normalizeSendChanges(input);
  const session = await getSessionContext();
  const beforeMatrix = await getRoutingMatrix();
  const canReach = (from: number, to: number, visited = new Set<number>()): boolean => {
    if (from === to) return true;
    if (visited.has(from)) return false;
    visited.add(from);
    const row = beforeMatrix.find((item) => item.from_track === from);
    return (row?.sends ?? []).some(
      (send) =>
        (send.level ?? 0) > 0.0001 &&
        typeof send.to_track === "number" &&
        canReach(send.to_track, to, visited),
    );
  };
  const resolved = changes.map((change) => {
    const source = findMixerTrack(session, change.source);
    const dest = findMixerTrack(session, change.dest);
    if (!source) throw new Error(`找不到源混音器轨道：${change.source}`);
    if (!dest) throw new Error(`找不到目标混音器轨道：${change.dest}`);
    if (source.index === 0 || source.is_master) {
      throw new Error("不能从主轨创建发送；请选择插入轨道。");
    }
    if (source.index === dest.index) throw new Error("发送的源和目标不能相同。");
    if (change.active && canReach(dest.index, source.index)) {
      throw new Error(
        `发送 ${change.source} → ${change.dest} 会形成反馈环路；如确实需要，请用 fl_call_tool 直接设置。`,
      );
    }
    return { change, sourceIndex: source.index, destIndex: dest.index };
  });

  const results: Array<Record<string, unknown>> = [];
  for (const entry of resolved) {
    results.push({
      ...entry.change,
      result: await flCall("set_mixer_routing", {
        source_track: String(entry.sourceIndex),
        dest_track: String(entry.destIndex),
        active: entry.change.active ? 1 : 0,
        level: entry.change.level,
      }),
    });
  }

  const afterSession = await getSessionContext();
  const matrix = await getRoutingMatrix();
  const verified = changes.map((change) => {
    const source = findMixerTrack(afterSession, change.source);
    const dest = findMixerTrack(afterSession, change.dest);
    const row = matrix.find((item) => item.from_track === source?.index);
    const edge = row?.sends?.find((send) => send.to_track === dest?.index);
    const actualLevel = edge?.level ?? 0;
    return {
      source: change.source,
      dest: change.dest,
      expectedActive: change.active,
      expectedLevel: change.level,
      actualLevel: edge ? actualLevel : null,
      verified: change.active
        ? Boolean(edge) && Math.abs(actualLevel - change.level) <= 0.02
        : !edge || actualLevel <= 0.001,
    };
  });
  return { ok: verified.every((item) => item.verified), results, verified };
}

interface BusSpec {
  name: string;
  mixerTrack: string;
  channels: string;
  masterLevel?: number;
  allowExisting: boolean;
}

function normalizeBusSpecs(input: Record<string, unknown>): BusSpec[] {
  const raw = Array.isArray(input.buses)
    ? input.buses
    : [{ name: input.name, mixerTrack: input.mixerTrack, channels: input.channels }];
  return raw.map((item) => {
    if (!item || typeof item !== "object") throw new Error("总线格式无效。");
    const entry = item as Record<string, unknown>;
    const name = String(entry.name ?? "").trim();
    const mixerTrack = String(entry.mixerTrack ?? "").trim();
    if (!name || !mixerTrack) throw new Error("每条总线需要 name 与 mixerTrack。");
    const channels = Array.isArray(entry.channels)
      ? entry.channels.map(String).join(",")
      : String(entry.channels ?? "");
    const tokens = channels
      .split(",")
      .map((token) => token.trim())
      .filter(Boolean);
    if (tokens.some((token) => /^(all|selected)$/i.test(token))) {
      throw new Error("fl_bus 不接受 all/selected，请列出具体通道。");
    }
    const masterLevel =
      entry.masterLevel === undefined ? undefined : Number(entry.masterLevel);
    if (
      masterLevel !== undefined &&
      (!Number.isFinite(masterLevel) || masterLevel < 0 || masterLevel > 1)
    ) {
      throw new Error(`masterLevel 必须在 0–1：${entry.masterLevel}`);
    }
    return {
      name,
      mixerTrack,
      channels: tokens.join(","),
      masterLevel,
      allowExisting: entry.allowExisting === true,
    };
  });
}

async function setupBuses(input: Record<string, unknown>) {
  const specs = normalizeBusSpecs(input);
  const prepared: Array<Record<string, unknown>> = [];
  for (const spec of specs) {
    const session = await getSessionContext();
    const target = findMixerTrack(session, spec.mixerTrack);
    if (!target) throw new Error(`找不到混音器轨道：${spec.mixerTrack}`);
    if (target.index === 0 || target.is_master) throw new Error("不能把主轨当作总线。");
    const duplicate = (session.active_mixer_tracks ?? []).find(
      (track) => track.index !== target.index && track.name === spec.name,
    );
    if (duplicate) throw new Error(`混音器轨道名已被占用：${spec.name}`);
    const existingChannels = (session.active_channels ?? [])
      .filter((channel) => channel.routed_to_mixer_track === target.index)
      .map((channel) => channel.name || `#${channel.index}`);
    const existingPlugins = target.effect_plugins ?? [];
    const pristine =
      isDefaultMixerName(target.name) &&
      existingChannels.length === 0 &&
      existingPlugins.length === 0;
    if (!pristine && !spec.allowExisting) {
      throw new Error(
        `混音器 ${target.index}「${target.name}」已有内容（${existingChannels.length} 通道 / ${existingPlugins.length} 插件）；如确认要改，传 allowExisting: true。`,
      );
    }
    let channelIndexes: number[] = [];
    if (spec.channels) {
      const channelTokens = spec.channels.split(",").map((item) => item.trim()).filter(Boolean);
      for (const token of channelTokens) {
        const channel = (session.active_channels ?? []).find(
          (entry) => entry.name === token || String(entry.index) === token,
        );
        if (!channel) throw new Error(`找不到要路由的通道：${token}`);
      }
      channelIndexes = channelTokens.map((token) => {
        const channel = (session.active_channels ?? []).find(
          (entry) => entry.name === token || String(entry.index) === token,
        )!;
        return channel.index;
      });
    }
    await flCall("rename_mixer_tracks", {
      track_mapping: asciiJson({ [target.index]: spec.name }),
    });
    if (channelIndexes.length) {
      await flCall("route_channels_to_mixer", {
        target_channels: channelIndexes.join(","),
        mixer_track_target: String(target.index),
      });
    }
    const matrixBefore = await getRoutingMatrix();
    const row = matrixBefore.find((item) => item.from_track === target.index);
    const masterEdge = row?.sends?.find((send) => send.to_track === 0);
    const masterLevel = spec.masterLevel ?? masterEdge?.level ?? 0.8;
    if (!masterEdge || spec.masterLevel !== undefined) {
      await flCall("set_mixer_routing", {
        source_track: String(target.index),
        dest_track: "0",
        active: 1,
        level: masterLevel,
      });
    }
    prepared.push({
      name: spec.name,
      mixerTrack: spec.mixerTrack,
      targetIndex: target.index,
      previousName: target.name,
      channels: spec.channels,
      masterLevel,
    });
  }

  const afterSession = await getSessionContext();
  const matrixAfter = await getRoutingMatrix();
  const verified = prepared.map((item) => {
    const track = (afterSession.active_mixer_tracks ?? []).find(
      (entry) => entry.index === Number(item.targetIndex),
    );
    const channelTokens = String(item.channels ?? "")
      .split(",")
      .map((token) => token.trim())
      .filter(Boolean);
    const channelChecks = channelTokens.map((token) => {
      const channel = (afterSession.active_channels ?? []).find(
        (entry) => entry.name === token || String(entry.index) === token,
      );
      return {
        channel: token,
        matched: Boolean(channel),
        actualMixerTrack: channel?.routed_to_mixer_track ?? null,
        verified:
          Boolean(channel) &&
          channel?.routed_to_mixer_track === Number(item.targetIndex),
      };
    });
    const row = matrixAfter.find((entry) => entry.from_track === Number(item.targetIndex));
    const masterEdge = row?.sends?.find((send) => send.to_track === 0);
    return {
      name: item.name,
      mixerTrack: item.mixerTrack,
      targetIndex: item.targetIndex,
      previousName: item.previousName,
      nameVerified: track?.name === item.name,
      masterSendVerified:
        Boolean(masterEdge) &&
        Math.abs((masterEdge?.level ?? 0) - Number(item.masterLevel)) <= 0.02,
      channels: channelChecks,
      verified:
        track?.name === item.name &&
        Boolean(masterEdge) &&
        Math.abs((masterEdge?.level ?? 0) - Number(item.masterLevel)) <= 0.02 &&
        channelChecks.every((check) => check.verified),
    };
  });
  return { ok: verified.every((item) => item.verified), buses: verified };
}

interface RouteAssignment {
  channels: string;
  mixerTrack: string;
}

function normalizeRouteAssignments(input: Record<string, unknown>): RouteAssignment[] {
  const raw = Array.isArray(input.assignments)
    ? input.assignments
    : [{ channels: input.channels, mixerTrack: input.mixerTrack }];
  return raw.map((item) => {
    if (!item || typeof item !== "object") throw new Error("路由分配格式无效。");
    const entry = item as Record<string, unknown>;
    const channels = Array.isArray(entry.channels)
      ? entry.channels.map(String).join(",")
      : String(entry.channels ?? "");
    const mixerTrack = String(entry.mixerTrack ?? "");
    if (!channels.trim() || !mixerTrack.trim()) {
      throw new Error("每条路由需要 channels 与 mixerTrack。");
    }
    return { channels, mixerTrack };
  });
}

async function routeChannels(input: Record<string, unknown>) {
  const assignments = normalizeRouteAssignments(input);
  const results: Array<Record<string, unknown>> = [];
  for (const assignment of assignments) {
    const result = await flCall("route_channels_to_mixer", {
      target_channels: assignment.channels,
      mixer_track_target: assignment.mixerTrack,
    });
    results.push({ ...assignment, result });
  }
  const session = await getSessionContext();
  const mixerTracks = session.active_mixer_tracks ?? [];
  const verified = assignments.flatMap((assignment) => {
    const targetNumber = Number(assignment.mixerTrack);
    const targetTrack = Number.isFinite(targetNumber)
      ? targetNumber
      : mixerTracks.find((track) => track.name === assignment.mixerTrack)?.index;
    return assignment.channels.split(",").map((token) => {
      const value = token.trim();
      const channel = (session.active_channels ?? []).find(
        (item) => item.name === value || String(item.index) === value,
      );
      return {
        channel: value,
        mixerTrack: assignment.mixerTrack,
        matched: Boolean(channel),
        actualMixerTrack: channel?.routed_to_mixer_track ?? null,
        verified:
          Boolean(channel) &&
          targetTrack !== undefined &&
          channel!.routed_to_mixer_track === targetTrack,
      };
    });
  });
  return { ok: true, results, verified };
}

interface LevelChange {
  target: string;
  volumeDb?: number;
  pan?: number;
  muted?: boolean;
  solo?: boolean;
}

function normalizeLevelChanges(input: Record<string, unknown>): LevelChange[] {
  if (!Array.isArray(input.tracks) || input.tracks.length === 0) {
    throw new Error("需要 tracks 数组，例如 [{ target: '808 Kick', volumeDb: -6 }]。");
  }
  return input.tracks.map((item) => {
    if (!item || typeof item !== "object") throw new Error("电平变更格式无效。");
    const entry = item as Record<string, unknown>;
    const target = String(entry.target ?? "");
    if (!target.trim()) throw new Error("每条电平变更需要 target。");
    const volumeDb = entry.volumeDb;
    const pan = entry.pan;
    const change: LevelChange = { target };
    if (volumeDb !== undefined) {
      const value = Number(volumeDb);
      if (!Number.isFinite(value) || value < -60 || value > 12) {
        throw new Error(`volumeDb 必须在 -60–12 之间：${volumeDb}`);
      }
      change.volumeDb = value;
    }
    if (pan !== undefined) {
      const value = Number(pan);
      if (!Number.isFinite(value) || value < -1 || value > 1) {
        throw new Error(`pan 必须在 -1–1 之间：${pan}`);
      }
      change.pan = value;
    }
    if (typeof entry.muted === "boolean") change.muted = entry.muted;
    if (typeof entry.solo === "boolean") change.solo = entry.solo;
    if (
      change.volumeDb === undefined &&
      change.pan === undefined &&
      change.muted === undefined &&
      change.solo === undefined
    ) {
      throw new Error(`target ${target} 没有任何变更。`);
    }
    return change;
  });
}

async function setLevels(input: Record<string, unknown>) {
  const changes = normalizeLevelChanges(input);
  const results: Array<Record<string, unknown>> = [];
  for (const change of changes) {
    const calls: Array<{ tool: string; args: Record<string, unknown> }> = [];
    if (change.volumeDb !== undefined) {
      calls.push({
        tool: "set_mixer_tracks_volume_db",
        args: { target_tracks: change.target, volume_db: String(change.volumeDb) },
      });
    }
    if (change.pan !== undefined) {
      calls.push({
        tool: "set_mixer_tracks_pan",
        args: { target_tracks: change.target, pan: String(change.pan) },
      });
    }
    if (change.muted !== undefined) {
      calls.push({
        tool: "mute_mixer_tracks",
        args: { target_tracks: change.target, muted: change.muted ? 1 : 0 },
      });
    }
    if (change.solo !== undefined) {
      calls.push({
        tool: "solo_mixer_tracks",
        args: { target_tracks: change.target, value: change.solo ? 1 : 0 },
      });
    }
    const changeResults = [];
    for (const call of calls) changeResults.push(await flCall(call.tool, call.args));
    results.push({ ...change, results: changeResults });
  }
  const session = await getSessionContext();
  const verified = changes.map((change) => {
    const numeric = Number(change.target);
    const track = (session.active_mixer_tracks ?? []).find(
      (item) => item.name === change.target || (Number.isFinite(numeric) && item.index === numeric),
    );
    return {
      target: change.target,
      matched: Boolean(track),
      volumeDb: track?.volume_db ?? null,
      pan: track?.pan ?? null,
      volumeVerified:
        change.volumeDb === undefined ||
        (typeof track?.volume_db === "number" &&
          Math.abs(track.volume_db - change.volumeDb) <= 0.15),
      panVerified:
        change.pan === undefined ||
        (typeof track?.pan === "number" && Math.abs(track.pan - change.pan) <= 0.02),
      note: "mute/solo 不在 get_session_context 快照中，无法自动核对。",
    };
  });
  return { ok: true, results, verified };
}

function normalizeRawNotes(input: Record<string, unknown>): RawFlNote[] {
  if (!Array.isArray(input.notes) || input.notes.length === 0) {
    throw new Error("需要 notes 数组，每项包含 midi/beat/duration/velocity。");
  }
  return input.notes.map((item) => {
    if (!item || typeof item !== "object") throw new Error("音符格式无效。");
    const note = item as Record<string, unknown>;
    const midi = Number(note.midi);
    const beat = Number(note.beat);
    const duration = Number(note.duration);
    const velocity = note.velocity === undefined ? 85 : Number(note.velocity);
    if (!Number.isFinite(midi) || midi < 0 || midi > 127) throw new Error(`midi 无效：${note.midi}`);
    if (!Number.isFinite(beat) || beat < 0) throw new Error(`beat 无效：${note.beat}`);
    if (!Number.isFinite(duration) || duration <= 0) throw new Error(`duration 无效：${note.duration}`);
    if (!Number.isFinite(velocity) || velocity < 1 || velocity > 100) {
      throw new Error(`velocity 必须在 1–100：${note.velocity}`);
    }
    return {
      midi: Math.round(midi),
      beat: beat + (typeof input.startBeat === "number" ? input.startBeat : 0),
      duration,
      velocity: Math.round(velocity),
    };
  });
}

async function writeNotes(input: Record<string, unknown>) {
  const notes = normalizeRawNotes(input);
  const mode: ApplyMode = input.mode === "replace" ? "replace" : "append";
  const channel =
    typeof input.channel === "number" || typeof input.channel === "string"
      ? input.channel
      : undefined;
  await requireFl();
  await openPianoRoll(channel);
  const script = makeRawNoteScript(notes, mode, "TONIC · raw notes");
  const result = await runPianoRoll(script);
  const verifiedNotes = await verifyPianoRollCount();
  return {
    ok: true,
    channel: channel ?? "current",
    expectedNotes: notes.length,
    verifiedNotes,
    script,
    result,
  };
}

interface ComposePart {
  channel?: string | number;
  conceptSlug?: string;
  exampleId?: string;
  notes?: RawFlNote[];
  mode?: ApplyMode;
  startBeat?: number;
  transpose?: number;
  velocity?: number;
}

async function compose(input: Record<string, unknown>) {
  if (!Array.isArray(input.parts) || input.parts.length === 0) {
    throw new Error("需要 parts 数组，例如 [{ channel: 6, conceptSlug: 'ii-v-i' }]。");
  }
  const globalMode: ApplyMode = input.mode === "replace" ? "replace" : "append";
  const results: Array<Record<string, unknown>> = [];
  for (const item of input.parts) {
    if (!item || typeof item !== "object") throw new Error("part 格式无效。");
    const part = item as ComposePart;
    const mode = part.mode === "replace" ? "replace" : globalMode;
    const channel =
      typeof part.channel === "number" || typeof part.channel === "string"
        ? part.channel
        : undefined;
    try {
      let notes: RawFlNote[];
      let title: string;
      if (Array.isArray(part.notes) && part.notes.length > 0) {
        notes = normalizeRawNotes({
          notes: part.notes,
          startBeat: typeof part.startBeat === "number" ? part.startBeat : 0,
        });
        if (typeof part.velocity === "number") {
          notes = notes.map((note) => ({ ...note, velocity: part.velocity }));
        }
        title = "TONIC · raw notes";
      } else {
        const payload = getFlPayload({
          conceptSlug: part.conceptSlug,
          exampleId: part.exampleId,
          startBeat: typeof part.startBeat === "number" ? part.startBeat : 0,
          velocity: typeof part.velocity === "number" ? part.velocity : 85,
        });
        if (!payload) throw new Error("找不到谱例；需要 notes 或有效的 conceptSlug/exampleId。");
        notes = payload.notes;
        title = `TONIC · ${payload.conceptTitle} / ${payload.title}`;
      }
      const transpose = Number(part.transpose ?? 0);
      if (!Number.isFinite(transpose)) throw new Error("transpose 必须是数字。");
      if (transpose !== 0) {
        notes = notes.map((note) => ({ ...note, midi: note.midi + Math.round(transpose) }));
      }
      if (notes.some((note) => note.midi < 0 || note.midi > 127)) {
        throw new Error("transpose 后超出 MIDI 0–127。");
      }
      await openPianoRoll(channel);
      const script = makeRawNoteScript(notes, mode, title);
      const result = await runPianoRoll(script);
      const verifiedNotes = await verifyPianoRollCount();
      results.push({
        ok: true,
        channel: channel ?? "current",
        title,
        mode,
        expectedNotes: notes.length,
        verifiedNotes,
        result,
      });
    } catch (error) {
      results.push({
        ok: false,
        channel: channel ?? "current",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  return {
    ok: results.every((item) => item.ok === true),
    parts: results,
  };
}

async function arrange(input: Record<string, unknown>) {
  const parts: ArrangementPartRequest[] = Array.isArray(input.parts)
    ? (input.parts as Array<Record<string, unknown>>).map((part) => ({
        role: String(part.role ?? "") as ArrangementPartRequest["role"],
        channel:
          typeof part.channel === "string" || typeof part.channel === "number"
            ? part.channel
            : undefined,
        range:
          Array.isArray(part.range) && part.range.length === 2
            ? [Number(part.range[0]), Number(part.range[1])]
            : undefined,
        mode: part.mode === "append" ? "append" : part.mode === "replace" ? "replace" : undefined,
        startBeat: typeof part.startBeat === "number" ? part.startBeat : undefined,
        transpose: typeof part.transpose === "number" ? part.transpose : undefined,
        velocity: typeof part.velocity === "number" ? part.velocity : undefined,
        pattern:
          typeof part.pattern === "string"
            ? (part.pattern as ArrangementPartRequest["pattern"])
            : undefined,
      }))
    : [];
  const plan = buildArrangement({
    conceptSlug: typeof input.conceptSlug === "string" ? input.conceptSlug : undefined,
    exampleId: typeof input.exampleId === "string" ? input.exampleId : undefined,
    startBeat: typeof input.startBeat === "number" ? input.startBeat : 0,
    mode: input.mode === "append" ? "append" : "replace",
    parts,
  });
  if (input.write !== true) {
    return { ok: true, written: false, note: "未写入；传 write: true 才写 FL。", ...plan };
  }
  const missing = plan.parts.filter((part) => part.channel === undefined);
  if (missing.length) {
    throw new Error(`写入需要每个声部都有 channel；缺少：${missing.map((part) => part.role).join(" / ")}`);
  }
  const writeResult = await compose({
    mode: input.mode === "append" ? "append" : "replace",
    parts: plan.parts.map((part) => ({
      channel: part.channel,
      notes: part.notes,
      mode: part.mode,
    })),
  });
  return { ok: writeResult.ok, written: true, ...plan, writeResult };
}

const MAX_AUDIO_BYTES = 200 * 1024 * 1024;

async function loadAudioInput(
  pathValue: unknown,
  base64Value: unknown,
  filenameValue: unknown,
): Promise<{ buffer: Buffer; file: string | null } | null> {
  let buffer: Buffer;
  let file: string | null = null;
  if (typeof pathValue === "string" && pathValue.trim()) {
    file = resolve(pathValue);
    buffer = await readFile(file);
  } else if (typeof base64Value === "string" && base64Value.trim()) {
    buffer = Buffer.from(base64Value, "base64");
    file = typeof filenameValue === "string" ? filenameValue : null;
  } else {
    return null;
  }
  if (buffer.length > MAX_AUDIO_BYTES) {
    throw new Error(`WAV 超过 ${MAX_AUDIO_BYTES / 1024 / 1024} MB，请先缩短或降低采样率。`);
  }
  return { buffer, file };
}

async function analyzeAudio(input: Record<string, unknown>) {
  const mixSource = await loadAudioInput(input.path, input.base64, input.filename);
  if (!mixSource) {
    throw new Error("需要 path（本机 WAV 路径）或 base64（面板上传）。");
  }
  const analysis = analyzeWavBuffer(mixSource.buffer, mixSource.file);
  const referenceSource = await loadAudioInput(
    input.referencePath,
    input.referenceBase64,
    input.referenceFilename,
  );
  const reference = referenceSource
    ? analyzeWavBuffer(referenceSource.buffer, referenceSource.file)
    : null;
  const comparison = compareAudioAnalyses(analysis, reference, input.target);
  return comparison ? { ...analysis, comparison } : analysis;
}

const AGENT_TOOLS = [
  {
    type: "function",
    function: {
      name: "search_theory",
      description: "在 TONIC 乐理库中检索概念，返回 slug、标题、摘要。任何理论回答前先调用。",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "中文/英文/和弦记号查询" },
          limit: { type: "number", description: "返回条数，默认 6" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_concept",
      description: "读取一个概念的完整摘要、维度与章节引用。",
      parameters: {
        type: "object",
        properties: { slug: { type: "string" } },
        required: ["slug"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_concept_sources",
      description: "读取一个概念对应的全部书库章节与章节级引用。",
      parameters: {
        type: "object",
        properties: { slug: { type: "string" } },
        required: ["slug"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_examples",
      description: "列出可写入 FL 的谱例；可按概念筛选。",
      parameters: {
        type: "object",
        properties: { conceptSlug: { type: "string" } },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_fl_payload",
      description: "把一个 TONIC 谱例转成 FL 音符事件（MIDI/拍/时值/力度）与章节引用。",
      parameters: {
        type: "object",
        properties: {
          conceptSlug: { type: "string" },
          exampleId: { type: "string" },
          startBeat: { type: "number" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "apply_example",
      description: "把谱例写入 FL 当前钢琴卷帘（FL 2026 内置 MCP run_piano_roll_script）。",
      parameters: {
        type: "object",
        properties: {
          conceptSlug: { type: "string" },
          exampleId: { type: "string" },
          mode: { type: "string", enum: ["append", "replace"] },
          channel: { type: "number", description: "可选，1-based 通道号；省略则用当前钢琴卷帘" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "fl_list_tools",
      description: "读取 FL Studio 2026 内置 MCP 的完整工具目录。",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "fl_call_tool",
      description: "调用 FL Studio 2026 内置 MCP 的任意工具。先 fl_list_tools 查看名称和参数。",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          arguments: { type: "object" },
        },
        required: ["name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "fl_session_report",
      description:
        "读取 FL 当前 session 的结构诊断：通道路由、混音器推子/声像、插件链、发送与命名问题。只读；不含峰值/LUFS 测量。",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "fl_route",
      description:
        "把通道路由到混音器轨道。assignments 例：[{channels:'808 Kick,808 Clap', mixerTrack:'6'}]。会修改工程，执行前说明。",
      parameters: {
        type: "object",
        properties: {
          assignments: {
            type: "array",
            items: {
              type: "object",
              properties: {
                channels: { type: "string", description: "逗号分隔的通道名或 1-based 索引" },
                mixerTrack: { type: "string", description: "混音器轨道名或编号（Master=0）" },
              },
              required: ["channels", "mixerTrack"],
            },
          },
        },
        required: ["assignments"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "fl_set_levels",
      description:
        "调整混音器轨道的绝对电平/声像/静音/独奏。tracks 例：[{target:'808 Kick', volumeDb:-6, pan:-0.2, muted:false}]。会修改工程。",
      parameters: {
        type: "object",
        properties: {
          tracks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                target: { type: "string", description: "混音器轨道名或编号" },
                volumeDb: { type: "number", description: "-60–12 dB" },
                pan: { type: "number", description: "-1–1" },
                muted: { type: "boolean" },
                solo: { type: "boolean" },
              },
              required: ["target"],
            },
          },
        },
        required: ["tracks"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "fl_write_notes",
      description:
        "把任意 MIDI 音符写入 FL 当前/指定通道的钢琴卷帘。notes 每项 {midi,beat,duration,velocity}。写后读回音符数。",
      parameters: {
        type: "object",
        properties: {
          channel: { type: "string", description: "通道名或 1-based 索引；省略则用当前钢琴卷帘" },
          notes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                midi: { type: "number" },
                beat: { type: "number" },
                duration: { type: "number" },
                velocity: { type: "number" },
              },
              required: ["midi", "beat", "duration"],
            },
          },
          mode: { type: "string", enum: ["append", "replace"] },
          startBeat: { type: "number" },
        },
        required: ["notes"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "fl_compose",
      description:
        "多通道作曲写入：parts 每项可用 conceptSlug/exampleId 或显式 notes，指定 channel、mode、startBeat、transpose。会修改多个钢琴卷帘。",
      parameters: {
        type: "object",
        properties: {
          parts: {
            type: "array",
            items: {
              type: "object",
              properties: {
                channel: { type: "string" },
                conceptSlug: { type: "string" },
                exampleId: { type: "string" },
                notes: { type: "array", items: { type: "object" } },
                mode: { type: "string", enum: ["append", "replace"] },
                startBeat: { type: "number" },
                transpose: { type: "number" },
                velocity: { type: "number" },
              },
            },
          },
          mode: { type: "string", enum: ["append", "replace"] },
        },
        required: ["parts"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "fl_mixer_routing",
      description:
        "只读：读取完整混音发送矩阵、总线/返回轨、环路、死端与最深路由层级。",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "fl_send",
      description:
        "创建/修改/移除混音器发送。sends 例：[{source:'6',dest:'10',active:true,level:0.5}]；读写后都会验证。会修改工程。",
      parameters: {
        type: "object",
        properties: {
          sends: {
            type: "array",
            items: {
              type: "object",
              properties: {
                source: { type: "string", description: "源混音器轨道名或编号" },
                dest: { type: "string", description: "目标混音器轨道名或编号（Master=0）" },
                active: { type: "boolean" },
                level: { type: "number", description: "0–1 发送电平" },
              },
              required: ["source", "dest"],
            },
          },
        },
        required: ["sends"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "fl_bus",
      description:
        "安全建立总线：重命名混音器轨道、把通道路由到总线、确保总线回到主轨。buses 例：[{name:'Drums',mixerTrack:'16',channels:'Kick,Snare'}]；默认拒绝覆盖已有内容的轨道。",
      parameters: {
        type: "object",
        properties: {
          buses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                mixerTrack: { type: "string" },
                channels: { type: "string", description: "逗号分隔的通道名或索引" },
                masterLevel: { type: "number", description: "0–1，省略则保留现有主发送" },
                allowExisting: { type: "boolean", description: "允许覆盖非空/已命名轨道" },
              },
              required: ["name", "mixerTrack"],
            },
          },
        },
        required: ["buses"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "fl_arrange",
      description:
        "把 TONIC 谱例展开成多声部：bass/comp/pad/melody/arp，支持音域、移调、节奏型。默认只预览；write:true 才写入多个钢琴卷帘。不会自动创建通道。",
      parameters: {
        type: "object",
        properties: {
          conceptSlug: { type: "string" },
          exampleId: { type: "string" },
          startBeat: { type: "number" },
          mode: { type: "string", enum: ["append", "replace"] },
          write: { type: "boolean", description: "true 时写入 FL；每段必须有 channel" },
          parts: {
            type: "array",
            items: {
              type: "object",
              properties: {
                role: { type: "string", enum: ["bass", "comp", "pad", "melody", "arp"] },
                channel: { type: "string", description: "通道名或 1-based 索引" },
                range: {
                  type: "array",
                  items: { type: "number" },
                  description: "[低, 高] MIDI 音域",
                },
                pattern: {
                  type: "string",
                  description: "bass: roots/root-fifth/pulse；comp/pad: sustain/half/quarter/eighth",
                },
                transpose: { type: "number" },
                velocity: { type: "number" },
                mode: { type: "string", enum: ["append", "replace"] },
                startBeat: { type: "number" },
              },
              required: ["role"],
            },
          },
        },
        required: ["parts"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "live_audio_start",
      description:
        "开始 Windows WASAPI loopback 实时分析默认系统输出（含 FL）。只做内存分析，不录音落盘；需用户明确同意后调用。",
      parameters: {
        type: "object",
        properties: {
          device: { type: "string", description: "可选 loopback 设备索引或名称片段" },
          rate: { type: "number", description: "可选采样率；默认设备采样率" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "live_audio_stop",
      description: "停止 WASAPI 实时分析并释放音频设备。",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "live_audio_status",
      description:
        "读取实时分析状态：momentary/short-term LUFS、sample/true peak、RMS、crest、立体声相关、vectorscope 点与倍频程频谱。",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "analyze_audio",
      description:
        "分析导出的 WAV：true peak（4× 过采样 windowed-sinc）、sample peak、RMS、BS.1770 integrated LUFS、LRA、倍频程频谱/多段频谱、crest、DC、削波、立体声相关。可对比目标 LUFS/LRA/true peak，或与参考 WAV 比较频段。FL 不能渲染，需先在 FL 导出 WAV；只支持 PCM/IEEE float WAV。",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "本机 WAV 绝对路径" },
          base64: { type: "string", description: "WAV 文件的 base64（面板上传时用）" },
          filename: { type: "string" },
          referencePath: { type: "string", description: "参考 WAV 的本机路径" },
          referenceBase64: { type: "string", description: "参考 WAV 的 base64" },
          referenceFilename: { type: "string" },
          target: {
            type: "object",
            description:
              "目标：preset='streaming'，或自定义 targetLufs/lraMinLu/lraMaxLu/truePeakMaxDbtp/toleranceLu",
            properties: {
              preset: { type: "string" },
              targetLufs: { type: "number" },
              lraMinLu: { type: "number" },
              lraMaxLu: { type: "number" },
              truePeakMaxDbtp: { type: "number" },
              toleranceLu: { type: "number" },
            },
          },
        },
      },
    },
  },
];

type LlmProtocol = "openai-chat" | "openai-responses" | "anthropic" | "gemini" | "ollama";

interface ChatConfig {
  protocol?: LlmProtocol;
  baseUrl?: string;
  apiKey?: string;
  model?: string;
  temperature?: number;
}

interface AgentToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
}

interface AgentMessage {
  role: "user" | "assistant" | "tool";
  content: string;
  toolCalls?: AgentToolCall[];
  toolCallId?: string;
  toolName?: string;
}

interface ModelTurn {
  content: string;
  toolCalls: AgentToolCall[];
}

interface ModelResult {
  ok: boolean;
  status: number;
  text: string;
  turn: ModelTurn;
}

function normalizeProtocol(value: unknown): LlmProtocol {
  return value === "openai-responses" ||
    value === "anthropic" ||
    value === "gemini" ||
    value === "ollama"
    ? value
    : "openai-chat";
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object") return value as Record<string, unknown>;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (parsed && typeof parsed === "object") return parsed as Record<string, unknown>;
    } catch {
      // fall through
    }
  }
  return {};
}

function trimBase(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

function providerEndpoint(protocol: LlmProtocol, baseUrl: string, model: string): string {
  const base = trimBase(baseUrl);
  if (protocol === "openai-chat") {
    return base.endsWith("/chat/completions") ? base : `${base}/chat/completions`;
  }
  if (protocol === "openai-responses") {
    return base.endsWith("/responses") ? base : `${base}/responses`;
  }
  if (protocol === "anthropic") {
    if (base.endsWith("/messages")) return base;
    if (/\/v1$/.test(base)) return `${base}/messages`;
    return `${base}/v1/messages`;
  }
  if (protocol === "gemini") {
    if (base.includes(":generateContent")) return base;
    const suffix = `/models/${encodeURIComponent(model)}:generateContent`;
    return /\/v1beta$|\/v1$/.test(base) ? `${base}${suffix}` : `${base}/v1beta${suffix}`;
  }
  if (base.endsWith("/api/chat")) return base;
  return /\/api$/.test(base) ? `${base}/chat` : `${base}/api/chat`;
}

function providerHeaders(protocol: LlmProtocol, config: ChatConfig): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (!config.apiKey) return headers;
  if (protocol === "anthropic") {
    headers["x-api-key"] = config.apiKey;
    headers["anthropic-version"] = "2023-06-01";
  } else if (protocol === "gemini") {
    headers["x-goog-api-key"] = config.apiKey;
  } else if (protocol !== "ollama") {
    headers.Authorization = `Bearer ${config.apiKey}`;
  }
  return headers;
}

function toOpenAiChatMessages(system: string, messages: AgentMessage[]) {
  return [
    { role: "system", content: system },
    ...messages.map((message) => {
      if (message.role === "tool") {
        return { role: "tool", tool_call_id: message.toolCallId, content: message.content };
      }
      if (message.role === "assistant") {
        return {
          role: "assistant",
          content: message.content || null,
          ...(message.toolCalls?.length
            ? {
                tool_calls: message.toolCalls.map((call) => ({
                  id: call.id,
                  type: "function",
                  function: { name: call.name, arguments: JSON.stringify(call.args) },
                })),
              }
            : {}),
        };
      }
      return { role: "user", content: message.content };
    }),
  ];
}

function toResponsesInput(messages: AgentMessage[]) {
  const input: Array<Record<string, unknown>> = [];
  for (const message of messages) {
    if (message.role === "user") {
      input.push({ role: "user", content: [{ type: "input_text", text: message.content }] });
    } else if (message.role === "assistant") {
      if (message.content) {
        input.push({ role: "assistant", content: [{ type: "output_text", text: message.content }] });
      }
      for (const call of message.toolCalls ?? []) {
        input.push({
          type: "function_call",
          call_id: call.id,
          name: call.name,
          arguments: JSON.stringify(call.args),
        });
      }
    } else {
      input.push({
        type: "function_call_output",
        call_id: message.toolCallId,
        output: message.content,
      });
    }
  }
  return input;
}

function toAnthropicMessages(messages: AgentMessage[]) {
  const result: Array<Record<string, unknown>> = [];
  for (const message of messages) {
    if (message.role === "user") {
      result.push({ role: "user", content: [{ type: "text", text: message.content }] });
    } else if (message.role === "assistant") {
      const content: Array<Record<string, unknown>> = [];
      if (message.content) content.push({ type: "text", text: message.content });
      for (const call of message.toolCalls ?? []) {
        content.push({ type: "tool_use", id: call.id, name: call.name, input: call.args });
      }
      result.push({ role: "assistant", content: content.length ? content : [{ type: "text", text: "" }] });
    } else {
      result.push({
        role: "user",
        content: [
          { type: "tool_result", tool_use_id: message.toolCallId, content: message.content },
        ],
      });
    }
  }
  return result;
}

function toGeminiContents(messages: AgentMessage[]) {
  const result: Array<Record<string, unknown>> = [];
  for (const message of messages) {
    if (message.role === "user") {
      result.push({ role: "user", parts: [{ text: message.content }] });
    } else if (message.role === "assistant") {
      const parts: Array<Record<string, unknown>> = [];
      if (message.content) parts.push({ text: message.content });
      for (const call of message.toolCalls ?? []) {
        parts.push({ functionCall: { name: call.name, args: call.args } });
      }
      result.push({ role: "model", parts: parts.length ? parts : [{ text: "" }] });
    } else {
      result.push({
        role: "user",
        parts: [
          {
            functionResponse: {
              name: message.toolName ?? "unknown_tool",
              response: { content: message.content },
            },
          },
        ],
      });
    }
  }
  return result;
}

function openAiTools() {
  return AGENT_TOOLS;
}

function responsesTools() {
  return AGENT_TOOLS.map((tool) => ({
    type: "function",
    name: tool.function.name,
    description: tool.function.description,
    parameters: tool.function.parameters,
  }));
}

function anthropicTools() {
  return AGENT_TOOLS.map((tool) => ({
    name: tool.function.name,
    description: tool.function.description,
    input_schema: tool.function.parameters,
  }));
}

function geminiTools() {
  return [
    {
      functionDeclarations: AGENT_TOOLS.map((tool) => ({
        name: tool.function.name,
        description: tool.function.description,
        parameters: tool.function.parameters,
      })),
    },
  ];
}

async function requestModel(
  protocol: LlmProtocol,
  config: ChatConfig,
  system: string,
  messages: AgentMessage[],
  useTools: boolean,
): Promise<ModelResult> {
  if (!config.baseUrl || !config.model) {
    throw new Error("请先在面板设置里填写 LLM Base URL 与模型名。");
  }
  const endpoint = providerEndpoint(protocol, config.baseUrl, config.model);
  const temperature = config.temperature ?? 0.3;
  let body: Record<string, unknown>;
  if (protocol === "openai-chat") {
    body = {
      model: config.model,
      messages: toOpenAiChatMessages(system, messages),
      temperature,
      ...(useTools ? { tools: openAiTools(), tool_choice: "auto" } : {}),
    };
  } else if (protocol === "openai-responses") {
    body = {
      model: config.model,
      instructions: system,
      input: toResponsesInput(messages),
      temperature,
      ...(useTools ? { tools: responsesTools(), tool_choice: "auto" } : {}),
    };
  } else if (protocol === "anthropic") {
    body = {
      model: config.model,
      max_tokens: 2048,
      system,
      messages: toAnthropicMessages(messages),
      temperature,
      ...(useTools ? { tools: anthropicTools() } : {}),
    };
  } else if (protocol === "gemini") {
    body = {
      contents: toGeminiContents(messages),
      systemInstruction: { parts: [{ text: system }] },
      generationConfig: { temperature },
      ...(useTools ? { tools: geminiTools() } : {}),
    };
  } else {
    body = {
      model: config.model,
      stream: false,
      messages: toOpenAiChatMessages(system, messages),
      options: { temperature },
      ...(useTools ? { tools: openAiTools() } : {}),
    };
  }
  const response = await fetch(endpoint, {
    method: "POST",
    headers: providerHeaders(protocol, config),
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(90_000),
  });
  const text = await response.text();
  let data: unknown = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = null;
  }
  const payload = (data ?? {}) as Record<string, unknown>;
  const turn: ModelTurn = { content: "", toolCalls: [] };
  if (protocol === "openai-chat") {
    const message = ((payload.choices as Array<{ message?: Record<string, unknown> }> | undefined)?.[0]?.message ?? {}) as Record<string, unknown>;
    turn.content = typeof message.content === "string" ? message.content : "";
    const calls = Array.isArray(message.tool_calls) ? message.tool_calls : [];
    turn.toolCalls = calls.map((call: Record<string, unknown>, index) => {
      const fn = (call.function ?? {}) as Record<string, unknown>;
      return {
        id: typeof call.id === "string" ? call.id : `openai-${index}`,
        name: String(fn.name ?? ""),
        args: asRecord(fn.arguments),
      };
    });
  } else if (protocol === "openai-responses") {
    turn.content = typeof payload.output_text === "string" ? payload.output_text : "";
    const output = Array.isArray(payload.output) ? payload.output : [];
    for (const item of output) {
      if (!item || typeof item !== "object") continue;
      const entry = item as Record<string, unknown>;
      if (entry.type === "message" && Array.isArray(entry.content)) {
        for (const part of entry.content) {
          if (part && typeof part === "object" && (part as { type?: string }).type === "output_text") {
            const value = (part as { text?: unknown }).text;
            if (typeof value === "string") turn.content += value;
          }
        }
      } else if (entry.type === "function_call") {
        turn.toolCalls.push({
          id: String(entry.call_id ?? entry.id ?? crypto.randomUUID()),
          name: String(entry.name ?? ""),
          args: asRecord(entry.arguments),
        });
      }
    }
  } else if (protocol === "anthropic") {
    const content = Array.isArray(payload.content) ? payload.content : [];
    for (const block of content) {
      if (!block || typeof block !== "object") continue;
      const entry = block as Record<string, unknown>;
      if (entry.type === "text" && typeof entry.text === "string") turn.content += entry.text;
      if (entry.type === "tool_use") {
        turn.toolCalls.push({
          id: String(entry.id ?? crypto.randomUUID()),
          name: String(entry.name ?? ""),
          args: asRecord(entry.input),
        });
      }
    }
  } else if (protocol === "gemini") {
    const candidates = Array.isArray(payload.candidates) ? payload.candidates : [];
    const parts = ((candidates[0] as Record<string, unknown> | undefined)?.content as { parts?: unknown } | undefined)?.parts;
    for (const [index, part] of (Array.isArray(parts) ? parts : []).entries()) {
      if (!part || typeof part !== "object") continue;
      const entry = part as Record<string, unknown>;
      if (typeof entry.text === "string") turn.content += entry.text;
      if (entry.functionCall && typeof entry.functionCall === "object") {
        const call = entry.functionCall as Record<string, unknown>;
        turn.toolCalls.push({
          id: `gemini-${index}-${crypto.randomUUID()}`,
          name: String(call.name ?? ""),
          args: asRecord(call.args),
        });
      }
    }
  } else {
    const message = (payload.message ?? {}) as Record<string, unknown>;
    turn.content = typeof message.content === "string" ? message.content : "";
    const calls = Array.isArray(message.tool_calls) ? message.tool_calls : [];
    turn.toolCalls = calls.map((call: Record<string, unknown>, index) => {
      const fn = (call.function ?? {}) as Record<string, unknown>;
      return {
        id: typeof call.id === "string" ? call.id : `ollama-${index}-${crypto.randomUUID()}`,
        name: String(fn.name ?? ""),
        args: asRecord(fn.arguments),
      };
    });
  }
  return { ok: response.ok, status: response.status, text, turn };
}

async function executeAgentTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case "search_theory": {
      const query = String(args.query ?? "");
      const limit = Number(args.limit ?? 6);
      return searchTheory(query, { limit: Math.max(1, Math.min(12, limit)) });
    }
    case "get_concept": {
      return conceptView(String(args.slug ?? ""));
    }
    case "get_concept_sources": {
      const view = conceptView(String(args.slug ?? ""));
      return view ? { slug: view.slug, citations: view.citations, sources: view.sources } : null;
    }
    case "list_examples": {
      return listFlExamples(
        typeof args.conceptSlug === "string" ? args.conceptSlug : undefined,
      );
    }
    case "get_fl_payload": {
      return getFlPayload({
        conceptSlug: typeof args.conceptSlug === "string" ? args.conceptSlug : undefined,
        exampleId: typeof args.exampleId === "string" ? args.exampleId : undefined,
        startBeat: typeof args.startBeat === "number" ? args.startBeat : 0,
      });
    }
    case "apply_example":
      return applyExample(args);
    case "fl_list_tools":
      await requireFl();
      return fl.listTools();
    case "fl_call_tool": {
      await requireFl();
      const argsValue = args.arguments;
      const toolArgs =
        argsValue && typeof argsValue === "object"
          ? (argsValue as Record<string, unknown>)
          : {};
      return fl.callTool(String(args.name ?? ""), toolArgs);
    }
    case "fl_session_report":
      return sessionReport();
    case "fl_route":
      return routeChannels(args);
    case "fl_set_levels":
      return setLevels(args);
    case "fl_write_notes":
      return writeNotes(args);
    case "fl_compose":
      return compose(args);
    case "fl_mixer_routing":
      return mixerRoutingReport();
    case "fl_send":
      return setSends(args);
    case "fl_bus":
      return setupBuses(args);
    case "fl_arrange":
      return arrange(args);
    case "live_audio_start":
      return liveCapture.start({
        device: typeof args.device === "string" ? args.device : undefined,
        rate: typeof args.rate === "number" ? args.rate : undefined,
      });
    case "live_audio_stop":
      return liveCapture.stop();
    case "live_audio_status":
      return liveCapture.status();
    case "analyze_audio":
      return analyzeAudio(args);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function preSearchContext(text: string): string {
  const hits = searchTheory(text, { limit: 5 });
  if (hits.length === 0) return "";
  return hits
    .map(
      (hit) =>
        `${hit.number} ${hit.title} (${hit.slug})：${hit.summary}`,
    )
    .join("\n");
}

const AGENT_SYSTEM_PROMPT = `你是 TONIC-FL，一个乐理优先的 FL Studio 2026 编曲助手。
规则：
1. 回答理论问题前先调用 search_theory；需要解释或引用时调用 get_concept / get_concept_sources。
2. 每条理论断言必须带工具返回的章节级 locator，不能编造引用或页码。
3. 用户要写钢琴卷帘时，先 get_fl_payload 或直接 apply_example；多通道/多段作曲用 fl_compose，多声部编配用 fl_arrange（默认只预览，write:true 才写入），原始音符用 fl_write_notes；不要凭空发明 MIDI 音符。
4. 混音/路由改动前先调用 fl_session_report 或 fl_mixer_routing；用 fl_route 路由通道、fl_bus 建总线、fl_send 建发送、fl_set_levels 调整绝对电平/声像/静音/独奏。这些会修改工程，执行前说明，执行后报告 verified 结果。
5. 其他 FL 操作先调用 fl_list_tools 查看目录，再用 fl_call_tool；执行前说明意图。
6. fl_session_report 的诊断基于推子/声像/路由/插件链/通道电平，不包含峰值/LUFS；不要声称已测量响度或削波。真实混音测量用 analyze_audio 分析导出的 WAV（4× true peak/LUFS/LRA/倍频程频谱）；true peak 是近似值，不是实验室级表。
7. 用中文回答：先结论，再依据，最后说明实际写入了什么。不要声称自己听到了声音。
8. 如果工具失败，如实报告错误，并给出下一步（例如先打开钢琴卷帘或通道）。
9. 实时分析只在用户明确要求时用 live_audio_start 启动；它捕获默认系统输出（含其他应用），只在内存分析、不落盘；用完调用 live_audio_stop。`;

async function runAgent(
  rawMessages: unknown,
  config: ChatConfig,
): Promise<{ content: string; trace: Array<Record<string, unknown>> }> {
  const protocol = normalizeProtocol(config.protocol);
  const history = Array.isArray(rawMessages)
    ? rawMessages
        .filter(
          (item): item is { role: string; content: string } =>
            Boolean(item) &&
            typeof item === "object" &&
            typeof (item as { content?: unknown }).content === "string",
        )
        .slice(-12)
        .map((item) => ({
          role: (item.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
          content: item.content,
        }))
    : [];
  const lastUser = [...history].reverse().find((item) => item.role === "user")?.content ?? "";
  const context = preSearchContext(lastUser);
  const system = `${AGENT_SYSTEM_PROMPT}${context ? `

TONIC 预检索（可继续调用工具核对）：
${context}` : ""}`;
  const messages: AgentMessage[] = history.map((item) => ({
    role: item.role,
    content: item.content,
  }));
  const trace: Array<Record<string, unknown>> = [];
  let useTools = true;
  for (let round = 0; round < 6; round += 1) {
    let result = await requestModel(protocol, config, system, messages, useTools);
    if (!result.ok && useTools && /tool|function/i.test(result.text)) {
      useTools = false;
      result = await requestModel(protocol, config, system, messages, false);
    }
    if (!result.ok) {
      throw new Error(
        `LLM 请求失败 (${result.status}, ${protocol})：${result.text.slice(0, 500)}`,
      );
    }
    if (useTools && result.turn.toolCalls.length) {
      messages.push({
        role: "assistant",
        content: result.turn.content,
        toolCalls: result.turn.toolCalls,
      });
      for (const call of result.turn.toolCalls) {
        let parsedArgs: Record<string, unknown> = {};
        try {
          parsedArgs = call.args;
        } catch {
          parsedArgs = {};
        }
        let toolResult: unknown;
        let ok = true;
        try {
          toolResult = await executeAgentTool(call.name, parsedArgs);
        } catch (error) {
          ok = false;
          toolResult = { error: error instanceof Error ? error.message : String(error) };
        }
        const serialized = JSON.stringify(toolResult);
        trace.push({
          name: call.name,
          args: parsedArgs,
          ok,
          preview: serialized.length > 400 ? `${serialized.slice(0, 400)}…` : serialized,
        });
        messages.push({
          role: "tool",
          toolCallId: call.id,
          toolName: call.name,
          content: serialized.length > 20_000 ? `${serialized.slice(0, 20_000)}…` : serialized,
        });
      }
      continue;
    }
    return { content: result.turn.content.trim() || "（模型没有返回文本）", trace };
  }
  return { content: "工具调用超过 6 轮，已停止。请缩小请求范围。", trace };
}

async function serveStatic(res: ServerResponse, pathname: string): Promise<boolean> {
  const name = pathname === "/" || pathname === "/panel" ? "index.html" : pathname.replace(/^\//, "");
  const filePath = join(PANEL_DIR, name);
  if (!filePath.startsWith(PANEL_DIR)) return false;
  try {
    const data = await readFile(filePath);
    const type =
      extname(filePath) === ".css"
        ? "text/css; charset=utf-8"
        : extname(filePath) === ".js"
          ? "text/javascript; charset=utf-8"
          : "text/html; charset=utf-8";
    res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store" });
    res.end(data);
    return true;
  } catch {
    return false;
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://127.0.0.1:${PORT}`);
  try {
    if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/panel" || url.pathname.endsWith(".js") || url.pathname.endsWith(".css"))) {
      if (await serveStatic(res, url.pathname)) return;
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/status") {
      const target = await fl.findTarget();
      json(res, 200, {
        ok: true,
        panelUrl: PANEL_URL,
        debugPort: DEBUG_PORT,
        fl: {
          attached: fl.connected,
          target: target ? { title: target.title, url: target.url } : null,
          tools: Array.isArray(lastTools)
            ? lastTools.length
            : lastTools && typeof lastTools === "object" && Array.isArray((lastTools as { tools?: unknown[] }).tools)
              ? (lastTools as { tools: unknown[] }).tools.length
              : null,
          error: lastFlError || null,
        },
        note: target
          ? "FL Gopher WebView 已找到。"
          : "未找到 Gopher WebView：请用 --launch-fl 启动 FL，并打开一次 Gopher（Alt+F1）。",
      });
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/search") {
      const query = url.searchParams.get("q")?.trim() ?? "";
      if (!query) {
        json(res, 400, { error: "缺少 q 参数" });
        return;
      }
      json(res, 200, { results: searchTheory(query, { limit: 12 }) });
      return;
    }
    if (req.method === "GET" && url.pathname.startsWith("/api/concept/")) {
      const slug = decodeURIComponent(url.pathname.slice("/api/concept/".length));
      const view = conceptView(slug);
      if (!view) {
        json(res, 404, { error: `未找到概念：${slug}` });
        return;
      }
      json(res, 200, view);
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/examples") {
      const conceptSlug = url.searchParams.get("concept") ?? undefined;
      json(res, 200, { examples: listFlExamples(conceptSlug) });
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/fl/tools") {
      await requireFl();
      lastTools = await fl.listTools();
      json(res, 200, { tools: lastTools });
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/audio/analyze") {
      json(res, 200, await analyzeAudio(await readJson(req)));
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/live/start") {
      if (pluginLive.status().connected) {
        json(res, 200, pluginLive.status());
        return;
      }
      const body = await readJson(req);
      json(
        res,
        200,
        liveCapture.start({
          device: typeof body.device === "string" ? body.device : undefined,
          rate: typeof body.rate === "number" ? body.rate : undefined,
          channels: typeof body.channels === "number" ? body.channels : undefined,
        }),
      );
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/live/stop") {
      liveCapture.stop();
      json(res, 200, pluginLive.status().connected ? pluginLive.status() : liveCapture.status());
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/live/status") {
      const plugin = pluginLive.status();
      json(res, 200, plugin.connected ? plugin : { ...liveCapture.status(), source: "system" });
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/fl/report") {
      json(res, 200, await sessionReport());
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/fl/routing") {
      json(res, 200, await mixerRoutingReport());
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/fl/send") {
      json(res, 200, await setSends(await readJson(req)));
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/fl/bus") {
      json(res, 200, await setupBuses(await readJson(req)));
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/fl/arrange") {
      json(res, 200, await arrange(await readJson(req)));
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/fl/route") {
      json(res, 200, await routeChannels(await readJson(req)));
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/fl/levels") {
      json(res, 200, await setLevels(await readJson(req)));
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/fl/write") {
      json(res, 200, await writeNotes(await readJson(req)));
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/fl/compose") {
      json(res, 200, await compose(await readJson(req)));
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/fl/call") {
      const body = await readJson(req);
      await requireFl();
      const result = await fl.callTool(String(body.name ?? ""), body.arguments as Record<string, unknown> ?? {});
      json(res, 200, { ok: true, result });
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/apply") {
      const body = await readJson(req);
      const result = await applyExample(body);
      json(res, 200, result);
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/chat") {
      const body = await readJson(req);
      const result = await runAgent(body.messages, (body.config ?? {}) as ChatConfig);
      json(res, 200, result);
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/panel") {
      await requireFl();
      await fl.navigate(PANEL_URL);
      panelInjected = true;
      json(res, 200, { ok: true, panelUrl: PANEL_URL });
      return;
    }
    json(res, 404, { error: "Not found" });
  } catch (error) {
    json(res, 503, { error: error instanceof Error ? error.message : String(error) });
  }
});

server.listen(PORT, "127.0.0.1", async () => {
  log(`面板：${PANEL_URL}`);
  log(`FL 调试端口：${DEBUG_PORT}${LAUNCH_FL ? "（将尝试启动 FL）" : "（仅附加）"}`);
  if (LAUNCH_FL) await launchFl();
  void tryAttach();
  setInterval(() => {
    if (!fl.connected) void tryAttach();
    else void fl.ensureBridge();
  }, 5000);
});

process.on("SIGINT", () => {
  liveCapture.stop();
  pluginLive.close();
  fl.close();
  server.close(() => process.exit(0));
});

process.on("SIGTERM", () => {
  liveCapture.stop();
  pluginLive.close();
  fl.close();
  server.close(() => process.exit(0));
});

process.on("exit", () => {
  liveCapture.stop();
  pluginLive.close();
});
