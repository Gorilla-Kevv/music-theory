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
import {
  getFlPayload,
  listFlExamples,
  makePianoRollScript,
  payloadSummary,
  type ApplyMode,
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
  const channel = typeof input.channel === "number" ? input.channel : undefined;
  const payload = getFlPayload({ conceptSlug, exampleId, startBeat });
  if (!payload) throw new Error("找不到对应的谱例；请提供有效的 conceptSlug 或 exampleId。");
  await requireFl();
  if (channel) {
    await fl.callTool("open_piano_roll_for_channel", { target_channel: String(channel) });
  }
  const script = makePianoRollScript(payload, mode);
  const result = await fl.callTool("run_piano_roll_script", { source: script });
  let verifiedNotes: number | null = null;
  try {
    // FL 的脚本工具不返回 stdout；抛异常是唯一可靠的读回方式，且不会弹窗。
    const verify = await fl.callTool("run_piano_roll_script", {
      source: 'import flpianoroll as fp\nraise Exception("TONIC_NOTES=" + str(fp.score.noteCount))',
    });
    const match = JSON.stringify(verify).match(/TONIC_NOTES=(\d+)/);
    if (match) verifiedNotes = Number(match[1]);
  } catch {
    verifiedNotes = null;
  }
  return { ok: true, payload, summary: payloadSummary(payload), script, result, verifiedNotes };
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
];

interface ChatConfig {
  baseUrl?: string;
  apiKey?: string;
  model?: string;
  temperature?: number;
}

interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_calls?: Array<{ id: string; type: "function"; function: { name: string; arguments: string } }>;
  tool_call_id?: string;
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
3. 用户要写钢琴卷帘时，先 get_fl_payload 或直接 apply_example；不要凭空发明 MIDI 音符。apply_example 会把 TONIC 谱例写入 FL 当前钢琴卷帘。
4. 其他 FL 操作先调用 fl_list_tools 查看目录，再用 fl_call_tool；执行前说明意图。
5. 用中文回答：先结论，再依据，最后说明实际写入了什么。不要声称自己听到了声音。
6. 如果工具失败，如实报告错误，并给出下一步（例如先打开钢琴卷帘或通道）。`;

async function callChatCompletion(
  config: ChatConfig,
  messages: ChatMessage[],
  useTools: boolean,
): Promise<{ status: number; ok: boolean; data: unknown; text: string }> {
  if (!config.baseUrl || !config.model) {
    throw new Error("请先在面板设置里填写 LLM Base URL 与模型名。");
  }
  const endpoint = `${config.baseUrl.replace(/\/$/, "")}/chat/completions`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: config.temperature ?? 0.3,
      ...(useTools ? { tools: AGENT_TOOLS, tool_choice: "auto" } : {}),
    }),
    signal: AbortSignal.timeout(90_000),
  });
  const text = await response.text();
  let data: unknown = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = null;
  }
  return { status: response.status, ok: response.ok, data, text };
}

async function runAgent(
  rawMessages: unknown,
  config: ChatConfig,
): Promise<{ content: string; trace: Array<Record<string, unknown>> }> {
  const history = Array.isArray(rawMessages)
    ? rawMessages
        .filter(
          (item): item is { role: string; content: string } =>
            Boolean(item) &&
            typeof item === "object" &&
            typeof (item as { content?: unknown }).content === "string",
        )
        .slice(-12)
        .map((item) => ({ role: item.role, content: item.content }))
    : [];
  const lastUser = [...history].reverse().find((item) => item.role === "user")?.content ?? "";
  const context = preSearchContext(lastUser);
  const messages: ChatMessage[] = [
    {
      role: "system",
      content: `${AGENT_SYSTEM_PROMPT}${context ? `\n\nTONIC 预检索（可继续调用工具核对）：\n${context}` : ""}`,
    },
    ...history.map((item) => ({
      role: (item.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
      content: item.content,
    })),
  ];
  const trace: Array<Record<string, unknown>> = [];
  let useTools = true;
  for (let round = 0; round < 6; round += 1) {
    let response = await callChatCompletion(config, messages, useTools);
    if (!response.ok && useTools && /tool|function/i.test(response.text)) {
      useTools = false;
      response = await callChatCompletion(config, messages, false);
    }
    if (!response.ok) {
      throw new Error(`LLM 请求失败 (${response.status})：${response.text.slice(0, 500)}`);
    }
    const data = response.data as {
      choices?: Array<{
        message?: {
          content?: string | null;
          tool_calls?: ChatMessage["tool_calls"];
        };
      }>;
    };
    const message = data.choices?.[0]?.message;
    if (!message) throw new Error("LLM 返回为空。");
    if (useTools && message.tool_calls?.length) {
      messages.push({
        role: "assistant",
        content: message.content ?? null,
        tool_calls: message.tool_calls,
      });
      for (const call of message.tool_calls) {
        let parsedArgs: Record<string, unknown> = {};
        try {
          parsedArgs = JSON.parse(call.function.arguments || "{}") as Record<string, unknown>;
        } catch {
          parsedArgs = {};
        }
        let result: unknown;
        let ok = true;
        try {
          result = await executeAgentTool(call.function.name, parsedArgs);
        } catch (error) {
          ok = false;
          result = { error: error instanceof Error ? error.message : String(error) };
        }
        const serialized = JSON.stringify(result);
        trace.push({
          name: call.function.name,
          args: parsedArgs,
          ok,
          preview: serialized.length > 400 ? `${serialized.slice(0, 400)}…` : serialized,
        });
        messages.push({
          role: "tool",
          tool_call_id: call.id,
          content: serialized.length > 20_000 ? `${serialized.slice(0, 20_000)}…` : serialized,
        });
      }
      continue;
    }
    return { content: message.content?.trim() || "（模型没有返回文本）", trace };
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
  fl.close();
  server.close(() => process.exit(0));
});
