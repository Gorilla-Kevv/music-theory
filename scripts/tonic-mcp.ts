#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  BIBLIOGRAPHY,
  CITATION_STYLE_NOTE,
  getBookOutline,
  getConcept,
  getSourceNote,
  CONCEPTS,
  BILIBILI_COLLECTIONS,
  BILIBILI_VIDEOS,
} from "../src/content";
import {
  buildKnowledgePack,
  getConceptSources,
  getRelated,
  getReviewQueue,
  listExamples,
  listVideoResearch,
  searchSources,
  searchTheory,
  TOOL_SCHEMAS,
  type ToolSchema,
} from "../src/lib/theory-api";
import { REVIEW_CARD_BY_ID } from "../src/lib/cards";
import { getFlPayload } from "./fl-payload";
import { analyzeWavBuffer, analyzeWavFile } from "./audio-analyze";
import { compareAudioAnalyses } from "./audio-compare";

const BRIDGE_URL = (process.env.TONIC_FL_BRIDGE ?? "http://127.0.0.1:5127").replace(/\/$/, "");

const FL_TOOLS: ToolSchema[] = [
  {
    name: "get_concept_sources",
    description:
      "读取一个概念对应的全部书库章节（章号、标题、摘要）与章节级引用 locator。理论引用优先用这个工具核对。",
    inputSchema: {
      type: "object",
      properties: { slug: { type: "string" } },
      required: ["slug"],
    },
  },
  {
    name: "get_fl_payload",
    description:
      "把 TONIC 谱例转换成 FL Studio 音符事件（MIDI、拍、时值、力度）与章节引用，不直接写 FL。适合先检查再决定写入。",
    inputSchema: {
      type: "object",
      properties: {
        conceptSlug: { type: "string", description: "概念 slug；默认取该概念的第一个谱例" },
        exampleId: { type: "string", description: "谱例 id；与 conceptSlug 二选一" },
        startBeat: { type: "number", description: "整体后移多少拍，默认 0" },
        velocity: { type: "number", description: "FL velocity 1–100，默认 85" },
      },
    },
  },
  {
    name: "apply_example",
    description:
      "把 TONIC 谱例写入 FL Studio 2026 当前钢琴卷帘（通过 FL 内置 MCP 的 run_piano_roll_script）。需要先运行 `npm run fl:bridge -- --launch-fl --panel`。",
    inputSchema: {
      type: "object",
      properties: {
        conceptSlug: { type: "string" },
        exampleId: { type: "string" },
        mode: { type: "string", enum: ["append", "replace"], default: "append" },
        channel: { type: "number", description: "可选，1-based 通道号；省略则写入当前钢琴卷帘" },
        startBeat: { type: "number", description: "整体后移多少拍，默认 0" },
      },
    },
  },
  {
    name: "fl_status",
    description: "查看 FL 2026 CDP 桥的连接状态、Gopher 面板目标与工具数量。",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "fl_list_tools",
    description:
      "读取 FL Studio 2026 内置 MCP 的完整工具目录（实测 48 个：传输/通道/混音/插件/钢琴卷帘等）。",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "fl_call_tool",
    description:
      "调用 FL Studio 2026 内置 MCP 的任意工具。先调用 fl_list_tools 查看工具名与参数；钢琴卷帘可调用 run_piano_roll_script。",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        arguments: { type: "object", description: "工具参数对象" },
      },
      required: ["name"],
    },
  },
  {
    name: "fl_session_report",
    description:
      "FL session 结构诊断（只读）：通道路由、混音器推子/声像、插件链、发送、命名问题。不含峰值/LUFS 测量。",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "fl_route",
    description:
      "把通道路由到混音器轨道（会修改工程）。assignments 例：[{channels:'808 Kick,808 Clap', mixerTrack:'6'}]。",
    inputSchema: {
      type: "object",
      properties: {
        assignments: {
          type: "array",
          items: {
            type: "object",
            properties: {
              channels: { type: "string" },
              mixerTrack: { type: "string" },
            },
            required: ["channels", "mixerTrack"],
          },
        },
      },
      required: ["assignments"],
    },
  },
  {
    name: "fl_set_levels",
    description:
      "调整混音器轨道绝对电平/声像/静音/独奏（会修改工程）。tracks 例：[{target:'808 Kick', volumeDb:-6, pan:-0.2}]。",
    inputSchema: {
      type: "object",
      properties: {
        tracks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              target: { type: "string" },
              volumeDb: { type: "number" },
              pan: { type: "number" },
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
  {
    name: "fl_write_notes",
    description:
      "把任意 MIDI 音符写入 FL 当前/指定通道的钢琴卷帘，写后读回音符数。notes 每项 {midi,beat,duration,velocity}。",
    inputSchema: {
      type: "object",
      properties: {
        channel: { type: "string" },
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
  {
    name: "fl_compose",
    description:
      "多通道作曲写入：parts 每项可用 conceptSlug/exampleId 或显式 notes，指定 channel/mode/startBeat/transpose。",
    inputSchema: {
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
  {
    name: "fl_mixer_routing",
    description:
      "只读：完整混音发送矩阵、总线/返回轨、环路、死端与最深路由层级。",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "fl_send",
    description:
      "创建/修改/移除混音器发送（会修改工程）。sends 例：[{source:'6',dest:'10',active:true,level:0.5}]，写后验证。",
    inputSchema: {
      type: "object",
      properties: {
        sends: {
          type: "array",
          items: {
            type: "object",
            properties: {
              source: { type: "string" },
              dest: { type: "string" },
              active: { type: "boolean" },
              level: { type: "number" },
            },
            required: ["source", "dest"],
          },
        },
      },
      required: ["sends"],
    },
  },
  {
    name: "fl_bus",
    description:
      "安全建立总线：重命名混音器轨道、把通道路由到总线、确保总线回到主轨（会修改工程）。默认拒绝覆盖已有内容的轨道。",
    inputSchema: {
      type: "object",
      properties: {
        buses: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              mixerTrack: { type: "string" },
              channels: { type: "string" },
              masterLevel: { type: "number" },
              allowExisting: { type: "boolean" },
            },
            required: ["name", "mixerTrack"],
          },
        },
      },
      required: ["buses"],
    },
  },
  {
    name: "fl_arrange",
    description:
      "把 TONIC 谱例展开成多声部（bass/comp/pad/melody/arp），支持音域、移调、节奏型。默认只预览；write:true 才写入多个钢琴卷帘。不会自动创建通道。",
    inputSchema: {
      type: "object",
      properties: {
        conceptSlug: { type: "string" },
        exampleId: { type: "string" },
        startBeat: { type: "number" },
        mode: { type: "string", enum: ["append", "replace"] },
        write: { type: "boolean" },
        parts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              role: { type: "string", enum: ["bass", "comp", "pad", "melody", "arp"] },
              channel: { type: "string" },
              range: { type: "array", items: { type: "number" } },
              pattern: { type: "string" },
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
  {
    name: "analyze_audio",
    description:
      "分析导出的 WAV：true peak（4× 过采样 windowed-sinc）、sample peak、RMS、ITU-R BS.1770 integrated LUFS、LRA、倍频程频谱/多段频谱、crest、DC、削波、立体声相关。可对比目标 LUFS/LRA/true peak，或与参考 WAV 比较频段。FL 不能渲染，需先在 FL 导出 WAV；只支持 PCM/float WAV。",
    inputSchema: {
      type: "object",
      properties: {
        path: { type: "string", description: "本机 WAV 路径" },
        base64: { type: "string", description: "WAV base64（无路径时使用）" },
        filename: { type: "string" },
        referencePath: { type: "string", description: "参考 WAV 路径" },
        referenceBase64: { type: "string", description: "参考 WAV base64" },
        referenceFilename: { type: "string" },
        target: {
          type: "object",
          description: "preset='streaming' 或自定义 targetLufs/lraMinLu/lraMaxLu/truePeakMaxDbtp/toleranceLu",
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
  {
    name: "live_audio_start",
    description:
      "开始 Windows WASAPI loopback 实时分析默认系统输出（含 FL 与其他应用）。只在内存分析、不录音落盘；仅在用户明确要求实时分析时调用。需要先安装 PyAudioWPatch（setup-live-audio.bat）。",
    inputSchema: {
      type: "object",
      properties: {
        device: { type: "string", description: "可选 loopback 设备索引或名称片段" },
        rate: { type: "number", description: "可选采样率；默认设备采样率" },
      },
    },
  },
  {
    name: "live_audio_stop",
    description: "停止 WASAPI 实时分析并释放音频设备。",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "live_audio_status",
    description:
      "读取实时分析：momentary/short-term LUFS、sample/true peak、RMS、crest、相关、vectorscope 点与倍频程频谱。",
    inputSchema: { type: "object", properties: {} },
  },
];

const ALL_TOOLS: ToolSchema[] = [...TOOL_SCHEMAS, ...FL_TOOLS];

function requireArg(args: Record<string, unknown>, key: string): string {
  const value = args[key];
  if (typeof value !== "string" || !value.trim()) throw new Error(`缺少参数 ${key}`);
  return value;
}

async function bridgeJson(path: string, init?: RequestInit): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(`${BRIDGE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...init,
    });
  } catch {
    throw new Error(
      "FL 桥服务未运行。请先在项目目录运行 `npm run fl:bridge -- --launch-fl --panel`，并打开 FL 的 Gopher 面板（Alt+F1）。",
    );
  }
  const text = await response.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? String((data as { error: unknown }).error)
        : text || `HTTP ${response.status}`;
    throw new Error(message);
  }
  return data;
}

async function runTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case "search_theory":
      return searchTheory(requireArg(args, "query"), {
        category: args.category as never,
        level: args.level as never,
        limit: typeof args.limit === "number" ? args.limit : 8,
      });
    case "get_concept": {
      const concept = getConcept(requireArg(args, "slug"));
      if (!concept) throw new Error(`未找到概念：${args.slug}`);
      return concept;
    }
    case "get_concept_sources": {
      const slug = requireArg(args, "slug");
      const concept = getConcept(slug);
      if (!concept) throw new Error(`未找到概念：${slug}`);
      return getConceptSources(slug);
    }
    case "list_examples":
      return listExamples({
        concept: typeof args.concept === "string" ? args.concept : undefined,
        category: args.category as never,
        kind: args.kind as never,
      });
    case "get_related":
      return getRelated(requireArg(args, "slug"));
    case "get_review_queue":
      return getReviewQueue(args.state);
    case "search_sources":
      return searchSources(requireArg(args, "query"), {
        book: args.book as never,
        dimension: args.dimension as never,
        onlyExpanded: Boolean(args.onlyExpanded),
      });
    case "get_book_outline": {
      const book = requireArg(args, "book");
      const outline = getBookOutline(book as never);
      if (!outline) throw new Error(`未知书籍：${book}`);
      return outline;
    }
    case "get_source_note": {
      const note = getSourceNote(requireArg(args, "chapterId"));
      if (!note) throw new Error(`未找到章节笔记：${args.chapterId}`);
      return note;
    }
    case "get_bibliography":
      return BIBLIOGRAPHY;
    case "get_citation_policy":
      return { note: CITATION_STYLE_NOTE };
    case "get_video_research":
      return listVideoResearch({
        status: args.status as never,
        query: typeof args.query === "string" ? args.query : undefined,
        theme: typeof args.theme === "string" ? args.theme : undefined,
        collection: typeof args.collection === "string" ? args.collection : undefined,
      });
    case "get_fl_payload": {
      const payload = getFlPayload({
        conceptSlug: typeof args.conceptSlug === "string" ? args.conceptSlug : undefined,
        exampleId: typeof args.exampleId === "string" ? args.exampleId : undefined,
        startBeat: typeof args.startBeat === "number" ? args.startBeat : 0,
        velocity: typeof args.velocity === "number" ? args.velocity : 85,
      });
      if (!payload) throw new Error("找不到谱例；请提供 conceptSlug 或 exampleId。");
      return payload;
    }
    case "apply_example": {
      return bridgeJson("/api/apply", {
        method: "POST",
        body: JSON.stringify({
          ...(typeof args.conceptSlug === "string" ? { conceptSlug: args.conceptSlug } : {}),
          ...(typeof args.exampleId === "string" ? { exampleId: args.exampleId } : {}),
          ...(args.mode === "replace" ? { mode: "replace" } : { mode: "append" }),
          ...(typeof args.channel === "number" ? { channel: args.channel } : {}),
          ...(typeof args.startBeat === "number" ? { startBeat: args.startBeat } : {}),
        }),
      });
    }
    case "fl_status":
      return bridgeJson("/api/status");
    case "fl_list_tools":
      return bridgeJson("/api/fl/tools");
    case "fl_call_tool": {
      const toolName = requireArg(args, "name");
      const toolArgs =
        args.arguments && typeof args.arguments === "object"
          ? (args.arguments as Record<string, unknown>)
          : {};
      return bridgeJson("/api/fl/call", {
        method: "POST",
        body: JSON.stringify({ name: toolName, arguments: toolArgs }),
      });
    }
    case "fl_session_report":
      return bridgeJson("/api/fl/report");
    case "fl_route":
      return bridgeJson("/api/fl/route", {
        method: "POST",
        body: JSON.stringify({ assignments: args.assignments }),
      });
    case "fl_set_levels":
      return bridgeJson("/api/fl/levels", {
        method: "POST",
        body: JSON.stringify({ tracks: args.tracks }),
      });
    case "fl_write_notes":
      return bridgeJson("/api/fl/write", {
        method: "POST",
        body: JSON.stringify(args),
      });
    case "fl_compose":
      return bridgeJson("/api/fl/compose", {
        method: "POST",
        body: JSON.stringify(args),
      });
    case "fl_mixer_routing":
      return bridgeJson("/api/fl/routing");
    case "fl_send":
      return bridgeJson("/api/fl/send", {
        method: "POST",
        body: JSON.stringify({ sends: args.sends }),
      });
    case "fl_bus":
      return bridgeJson("/api/fl/bus", {
        method: "POST",
        body: JSON.stringify({ buses: args.buses }),
      });
    case "fl_arrange":
      return bridgeJson("/api/fl/arrange", {
        method: "POST",
        body: JSON.stringify(args),
      });
    case "analyze_audio": {
      const readSource = async (
        pathValue: unknown,
        base64Value: unknown,
        filenameValue: unknown,
      ) => {
        if (typeof pathValue === "string" && pathValue.trim()) {
          return analyzeWavFile(pathValue);
        }
        if (typeof base64Value === "string" && base64Value.trim()) {
          return analyzeWavBuffer(
            Buffer.from(base64Value, "base64"),
            typeof filenameValue === "string" ? filenameValue : null,
          );
        }
        return null;
      };
      const mix = await readSource(args.path, args.base64, args.filename);
      if (!mix) throw new Error("需要 path 或 base64。");
      const reference = await readSource(
        args.referencePath,
        args.referenceBase64,
        args.referenceFilename,
      );
      const comparison = compareAudioAnalyses(mix, reference, args.target);
      return comparison ? { ...mix, comparison } : mix;
    }
    case "study_pack": {
      const slug = requireArg(args, "slug");
      const concept = getConcept(slug);
      if (!concept) throw new Error(`未找到概念：${slug}`);
      return {
        concept,
        sources: getConceptSources(slug),
        related: getRelated(slug),
        examples: listExamples({ concept: slug }),
        reviewCard: REVIEW_CARD_BY_ID[slug] ?? null,
      };
    }
    case "live_audio_start":
      return bridgeJson("/api/live/start", {
        method: "POST",
        body: JSON.stringify({
          ...(typeof args.device === "string" ? { device: args.device } : {}),
          ...(typeof args.rate === "number" ? { rate: args.rate } : {}),
        }),
      });
    case "live_audio_stop":
      return bridgeJson("/api/live/stop", { method: "POST", body: "{}" });
    case "live_audio_status":
      return bridgeJson("/api/live/status");
    default:
      throw new Error(`未知工具：${name}`);
  }
}

const BOOK_LABELS: Record<string, string> = {
  levine: "Levine《爵士理论》",
  laitz: "Laitz《完全音乐理论》4e",
  sposobin: "斯波索宾《和声学教程》",
};

function optionalString(args: Record<string, unknown>, key: string): string | undefined {
  const value = args[key];
  return typeof value === "string" && value.trim() ? value : undefined;
}

function buildConceptBriefPrompt(args: Record<string, unknown>): string {
  const concept = getConcept(requireArg(args, "slug"));
  if (!concept) throw new Error(`未找到概念：${args.slug}`);
  const sources = getConceptSources(concept.slug);
  const related = getRelated(concept.slug).flatMap((item) =>
    item ? [{ slug: item.slug, title: item.title }] : [],
  );
  return [
    `请讲解乐理概念「${concept.title}（${concept.titleEn}）」（slug=${concept.slug}），面向正在自学和声/爵士理论的学习者。`,
    "",
    "TONIC 知识库摘要：" + concept.summary,
    ...(concept.dimensions?.length
      ? [`和声维度：${concept.dimensions.join("、")}。讲解时点明涉及哪些维度。`]
      : []),
    ...(related.length
      ? [`相关概念：${related.map((item) => `${item.title}（${item.slug}）`).join("、")}。`]
      : []),
    ...(sources.length
      ? [
          "",
          "书库章节支撑（理论断言必须落到这里）：",
          ...sources.map(
            (chapter) =>
              `- ${BOOK_LABELS[chapter.book] ?? chapter.book} 第${chapter.number}章 ${chapter.titleZh || chapter.title}（chapterId=${chapter.id}）`,
          ),
        ]
      : []),
    "",
    "要求：",
    "1. 用白话讲：先说它解决什么问题，再给判断顺序与听感抓手，最后给 2–3 个能在钢琴上验证的练习。",
    "2. 每个理论断言都标注上面的章节级 locator（书名 + 章号 + 章名）；不要编造页码，Sposobin 只标到章。",
    "3. 需要更多细节时调用 get_source_note（chapterId）或 study_pack（slug）。",
  ].join("\n");
}

function buildChapterDeepReadPrompt(args: Record<string, unknown>): string {
  const note = getSourceNote(requireArg(args, "chapterId"));
  if (!note) throw new Error(`未找到章节笔记：${args.chapterId}`);
  const lines = [
    `请带我深读 ${BOOK_LABELS[note.book] ?? note.book} 第${note.number}章「${note.titleZh || note.title}」的读书笔记，并把它变成一次可执行的学习。`,
    "",
    "TONIC 章节笔记（原创归纳，非原文）：",
    `摘要：${note.summary ?? "（未写摘要）"}`,
    ...(note.keyPoints?.length
      ? ["关键点：", ...note.keyPoints.map((point) => `- ${point}`)]
      : []),
    ...(note.deepSummary ? ["", "深入归纳：", note.deepSummary] : []),
    ...(note.analysis?.length ? ["", "分析清单：", ...note.analysis.map((item) => `- ${item}`)] : []),
    ...(note.crossBook?.length
      ? ["", "跨书对应：", ...note.crossBook.map((item) => `- ${item}`)]
      : []),
    ...(note.confusions?.length
      ? [
          "",
          "常见误解：",
          ...note.confusions.map((item) => `- 误解：${item.question}｜正解：${item.answer}`),
        ]
      : []),
    ...(note.concepts?.length
      ? ["", `关联概念（可用 study_pack 展开）：${note.concepts.join("、")}`]
      : []),
    "",
    "要求：",
    "1. 先给 5 分钟速览（这一章在讲什么问题、结论是什么），再逐个关键点展开。",
    "2. 笔记是原创归纳，不要声称引用了原文；需要理论定位时用 get_concept_sources 核对章节级 locator。",
    "3. 最后出 3 道自测题（含误解陷阱），我答完你再给正解。",
  ];
  return lines.join("\n");
}

function buildReviewSessionPrompt(args: Record<string, unknown>): string {
  const statePath = optionalString(args, "statePath");
  const limit = typeof args.limit === "number" ? Math.min(30, Math.max(1, args.limit)) : 10;
  let state: unknown = undefined;
  if (statePath) {
    try {
      state = JSON.parse(readFileSync(statePath, "utf8"));
    } catch {
      throw new Error(`无法读取复习状态文件：${statePath}（请先在 /agent 页导出 review-state.json）`);
    }
  }
  const queue = getReviewQueue(state);
  const cards = queue.due.slice(0, limit);
  const lines = [
    cards.length
      ? `请主持一次间隔复习：下面是 ${cards.length} 张到期卡片（共 ${queue.due.length} 张到期）。`
      : `当前没有到期卡片（另有 ${queue.newCards.length} 张新卡未开始）。请从我要复习的概念入手：让我报一个主题，用 study_pack 取它的复习卡出题。`,
    "",
    ...cards.map(
      (card, index) =>
        `${index + 1}. [${card.kind}] ${card.title}\n   问题：${card.question}\n   答案要点：${card.answer}\n   卡片 id：${card.cardId}`,
    ),
    "",
    "规则：",
    "1. 一次只问一题；等我回答后再公布答案要点并给反馈。",
    "2. 每题按我的表现建议 SM-2 评分（again/hard/good/easy）并说明理由。",
    "3. 结束后汇总：答对几题、哪些卡片需要重看章节笔记（给 chapterId 或 /theory/ 链接）。",
  ];
  return lines.join("\n");
}

function buildFlWriteExamplePrompt(args: Record<string, unknown>): string {
  const payload = getFlPayload({
    conceptSlug: optionalString(args, "conceptSlug"),
    exampleId: optionalString(args, "exampleId"),
  });
  if (!payload) {
    return "没有找到匹配的谱例。请先用 search_theory 找概念，或用 list_examples 列出谱例（可按 concept/category/kind 过滤），再重试 fl_write_example。";
  }
  const preview = payload.notes.slice(0, 8);
  return [
    `请把 TONIC 谱例「${payload.title}」（概念 ${payload.conceptTitle}，${payload.conceptSlug}）写入 FL Studio 2026 的钢琴卷帘。`,
    "",
    `谱面参数：${payload.tempo} BPM，${payload.timeSignature[0]}/${payload.timeSignature[1]}，共 ${payload.notes.length} 个音符。`,
    `前 ${preview.length} 个音符（midi/beat/duration/velocity）：`,
    ...preview.map((note) => `- ${note.midi} / ${note.beat} / ${note.duration} / ${note.velocity}`),
    ...(payload.citations.length
      ? ["", "引用：", ...payload.citations.map((citation) => `- ${citation.source} · ${citation.locator}`)]
      : []),
    "",
    args.channel !== undefined ? `目标通道：${args.channel}（1-based）。` : "目标通道：当前钢琴卷帘。",
    "",
    "流程：",
    "1. 先核对上面音符是否符合我的意图（移调/换声部要先说明）。",
    "2. 确认后调用 apply_example 写入（或 fl_write_notes 做精确控制）；FL 桥未运行时提示 `npm run fl:bridge -- --launch-fl --panel`。",
    "3. 写入后报告返回的 verifiedNotes；多声部用 fl_arrange（默认预览），多通道多段用 fl_compose。",
    "4. 不要凭空生成这套谱例之外的 MIDI；要改编请先说明改了什么。",
  ].join("\n");
}

function buildMixCheckPrompt(args: Record<string, unknown>): string {
  const path = requireArg(args, "path");
  const referencePath = optionalString(args, "referencePath");
  const preset = optionalString(args, "preset") ?? "streaming";
  return [
    "请检查我导出的混音 WAV 并解读测量结果。",
    "",
    `文件：${path}`,
    referencePath ? `参考 WAV：${referencePath}` : "参考 WAV：未提供。",
    `目标：preset=${preset}（通用检查值，不是平台强制标准）。`,
    "",
    "流程：",
    "1. 调用 analyze_audio（path；有参考再传 referencePath；目标传 target:{preset}）。",
    "2. 逐项解读：integrated LUFS、4× true peak（dBTP，与 sample peak 的差值说明 intersample 风险）、LRA、倍频程频谱占比/质心/tilt、削波、立体声相关。",
    "3. 有参考时按频段差异（占比归一化 dB）说明哪些频段偏多/偏少，只描述测量，不武断开药方。",
    "4. 明确边界：true peak 是 4× windowed-sinc 近似，频谱是声道平均倍频程；FL 不能自动渲染，测量只针对这份导出 WAV。",
    "5. 最后给 2–3 条可执行的下一步（如把某插件调整多少 dB 再导出复测）。",
  ].join("\n");
}

const MCP_PROMPTS: Array<{
  name: string;
  description: string;
  arguments: Array<{ name: string; description: string; required?: boolean }>;
  build: (args: Record<string, unknown>) => string;
}> = [
  {
    name: "concept_brief",
    description: "生成一个概念的讲解请求：内嵌知识库摘要、相关概念与书库章节，要求全部断言带章节级 locator。",
    arguments: [{ name: "slug", description: "概念 slug，如 ii-v-i", required: true }],
    build: buildConceptBriefPrompt,
  },
  {
    name: "chapter_deep_read",
    description: "深读书库章节笔记：内嵌摘要/关键点/深入归纳/误解，生成速览、展开与自测题。",
    arguments: [{ name: "chapterId", description: "章节 id，如 levine-13", required: true }],
    build: buildChapterDeepReadPrompt,
  },
  {
    name: "review_session",
    description: "把到期复习卡变成一次问答式复习（用 /agent 页导出的 review-state.json）。",
    arguments: [
      { name: "statePath", description: "review-state.json 路径；省略则按无状态处理" },
      { name: "limit", description: "出题数量，默认 10，上限 30" },
    ],
    build: buildReviewSessionPrompt,
  },
  {
    name: "fl_write_example",
    description: "把 TONIC 谱例写入 FL 钢琴卷帘的流程模板：先核对 payload，再写入并报告 verifiedNotes。",
    arguments: [
      { name: "conceptSlug", description: "概念 slug；与 exampleId 二选一" },
      { name: "exampleId", description: "谱例 id；与 conceptSlug 二选一" },
      { name: "channel", description: "可选目标通道（1-based）" },
    ],
    build: buildFlWriteExamplePrompt,
  },
  {
    name: "mix_check",
    description: "用 analyze_audio 检查导出 WAV 的响度/true peak/LRA/频谱，并按边界解读结果。",
    arguments: [
      { name: "path", description: "本机 WAV 路径", required: true },
      { name: "referencePath", description: "可选参考 WAV 路径" },
      { name: "preset", description: "目标预设，默认 streaming" },
    ],
    build: buildMixCheckPrompt,
  },
];

interface McpResourceSpec {
  uri: string;
  name: string;
  description: string;
  read: () => unknown;
}

const MCP_RESOURCES: McpResourceSpec[] = [
  {
    uri: "tonic://meta",
    name: "TONIC 知识库元信息",
    description: "概念/谱例/引用/书库/复习卡/B 站台账数量与版本。",
    read: () => buildKnowledgePack().meta,
  },
  {
    uri: "tonic://concepts",
    name: "概念目录",
    description: "全部 66 个概念的 slug、标题、分类、级别与摘要索引。",
    read: () =>
      CONCEPTS.map((concept) => ({
        slug: concept.slug,
        number: concept.number,
        title: concept.title,
        titleEn: concept.titleEn,
        category: concept.category,
        level: concept.level,
        summary: concept.summary,
        tags: concept.tags,
      })),
  },
  {
    uri: "tonic://bibliography",
    name: "书目",
    description: "三本理论著作与 SoundQuest 站点的完整书目、版次与定位政策。",
    read: () => BIBLIOGRAPHY,
  },
  {
    uri: "tonic://citation-policy",
    name: "引用体例",
    description: "章节级引用规则：locator 格式、页码政策、两层来源制。",
    read: () => ({ note: CITATION_STYLE_NOTE }),
  },
  ...["levine", "laitz", "sposobin"].map((bookId) => ({
    uri: `tonic://books/${bookId}`,
    name: `${BOOK_LABELS[bookId]} 章目`,
    description: "完整章目（章号、原书章名、中文对照、Part、电子书深链定位），笔记正文用 get_source_note 读取。",
    read: () => {
      const outline = getBookOutline(bookId as never);
      if (!outline) throw new Error(`未知书籍：${bookId}`);
      return {
        id: outline.id,
        noteCount: outline.noteCount,
        ...(outline.sourceBook
          ? { embeddedBook: { file: outline.sourceBook.file, kind: outline.sourceBook.kind, label: outline.sourceBook.label } }
          : {}),
        chapters: outline.chapters.map((chapter) => ({
          id: chapter.id,
          number: chapter.number,
          title: chapter.title,
          ...(chapter.titleZh ? { titleZh: chapter.titleZh } : {}),
          ...(chapter.part ? { part: chapter.part } : {}),
          expanded: chapter.expanded,
          ...(chapter.pdfPage ? { pdfPage: chapter.pdfPage } : {}),
          ...(chapter.sourceFile ? { sourceFile: chapter.sourceFile } : {}),
        })),
      };
    },
  })),
  {
    uri: "tonic://video-research",
    name: "B 站调研台账目录",
    description: "合集/板块元数据与读取状态统计；条目明细用 get_video_research 工具查询。",
    read: () => ({
      collections: BILIBILI_COLLECTIONS,
      counts: {
        total: BILIBILI_VIDEOS.length,
        read: BILIBILI_VIDEOS.filter((video) => video.status === "read").length,
        catalogued: BILIBILI_VIDEOS.filter((video) => video.status === "catalogued").length,
      },
    }),
  },
];

const server = new Server(
  { name: "tonic-music-theory", version: "0.4.0" },
  {
    capabilities: { tools: {}, prompts: {}, resources: {} },
    instructions: `TONIC 是一个本地乐理知识库，与 FL Studio 2026 通过桥服务协同。
使用规则：
1. 任何理论问题先调用 search_theory；需要解释或引用时调用 get_concept / get_concept_sources；一次要全量材料用 study_pack。
2. 理论断言必须带工具返回的章节级 locator（如 "Laitz, Chapter 19 Tonicization and Modulation"）；不能编造引用、页码或原文。
3. 写钢琴卷帘前先用 get_fl_payload 核对音符，再调用 apply_example；多通道/多段作曲用 fl_compose，多声部编配用 fl_arrange（默认只预览，write:true 才写入），原始音符用 fl_write_notes；不要凭空生成 MIDI。
4. 混音/路由改动前先调用 fl_session_report 或 fl_mixer_routing；用 fl_route 路由通道、fl_bus 建总线、fl_send 建发送、fl_set_levels 调整绝对电平/声像/静音/独奏。这些操作会修改 FL 工程，执行前说明，执行后报告 verified 结果。
5. 其他 FL 操作先调用 fl_list_tools 查看目录，再用 fl_call_tool；写入后报告实际提交的 payload。
6. fl_session_report 的诊断基于推子/声像/路由/插件链/通道电平，不包含峰值/LUFS；不要声称已测量响度或削波。真实混音测量用 analyze_audio 分析导出的 WAV（4× true peak/LUFS/LRA/倍频程频谱；FL 不能渲染，true peak 是近似值）。
7. 实时分析只在用户明确要求时用 live_audio_start 启动；它捕获默认系统输出（含其他应用），只在内存分析、不落盘；用完调用 live_audio_stop。
8. FL 2026 必须通过 \`npm run fl:bridge -- --launch-fl --panel\` 启动，并打开 Gopher 面板（Alt+F1）；桥服务地址可用 TONIC_FL_BRIDGE 覆盖。
9. 另有 prompts（concept_brief / chapter_deep_read / review_session / fl_write_example / mix_check）与 resources（tonic://meta、tonic://concepts、tonic://bibliography、tonic://citation-policy、tonic://books/<id>、tonic://video-research）。`,
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: ALL_TOOLS.map((tool) => ({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  try {
    const result = await runTool(name, args as Record<string, unknown>);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (error) {
    return {
      isError: true,
      content: [{ type: "text", text: error instanceof Error ? error.message : String(error) }],
    };
  }
});

server.setRequestHandler(ListPromptsRequestSchema, async () => ({
  prompts: MCP_PROMPTS.map(({ name, description, arguments: promptArguments }) => ({
    name,
    description,
    arguments: promptArguments,
  })),
}));

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  const prompt = MCP_PROMPTS.find((item) => item.name === name);
  if (!prompt) throw new Error(`未知 prompt：${name}`);
  return {
    description: prompt.description,
    messages: [
      {
        role: "user" as const,
        content: { type: "text" as const, text: prompt.build(args as Record<string, unknown>) },
      },
    ],
  };
});

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: MCP_RESOURCES.map((resource) => ({
    uri: resource.uri,
    name: resource.name,
    description: resource.description,
    mimeType: "application/json",
  })),
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const resource = MCP_RESOURCES.find((item) => item.uri === request.params.uri);
  if (!resource) throw new Error(`未知资源：${request.params.uri}`);
  return {
    contents: [
      {
        uri: resource.uri,
        mimeType: "application/json",
        text: JSON.stringify(resource.read(), null, 2),
      },
    ],
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error(
  `[tonic-mcp] ready · bridge=${BRIDGE_URL} · tools=${ALL_TOOLS.length} · prompts=${MCP_PROMPTS.length} · resources=${MCP_RESOURCES.length}`,
);
