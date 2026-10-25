#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  BIBLIOGRAPHY,
  CITATION_STYLE_NOTE,
  getBookOutline,
  getConcept,
  getSourceNote,
} from "../src/content";
import {
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
import { getFlPayload } from "./fl-payload";
import { analyzeWavBuffer, analyzeWavFile } from "./audio-analyze";

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
      "分析导出的 WAV：true peak（4× 过采样 windowed-sinc）、sample peak、RMS、ITU-R BS.1770 integrated LUFS、LRA、倍频程频谱、crest、DC、削波、立体声相关。FL 不能渲染，需先在 FL 导出 WAV；只支持 PCM/float WAV。",
    inputSchema: {
      type: "object",
      properties: {
        path: { type: "string", description: "本机 WAV 路径" },
        base64: { type: "string", description: "WAV base64（无路径时使用）" },
        filename: { type: "string" },
      },
    },
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
      if (typeof args.path === "string" && args.path.trim()) {
        return analyzeWavFile(args.path);
      }
      if (typeof args.base64 === "string" && args.base64.trim()) {
        const buffer = Buffer.from(args.base64, "base64");
        return analyzeWavBuffer(
          buffer,
          typeof args.filename === "string" ? args.filename : null,
        );
      }
      throw new Error("需要 path 或 base64。");
    }
    default:
      throw new Error(`未知工具：${name}`);
  }
}

const server = new Server(
  { name: "tonic-music-theory", version: "0.4.0" },
  {
    capabilities: { tools: {} },
    instructions: `TONIC 是一个本地乐理知识库，与 FL Studio 2026 通过桥服务协同。
使用规则：
1. 任何理论问题先调用 search_theory；需要解释或引用时调用 get_concept / get_concept_sources。
2. 理论断言必须带工具返回的章节级 locator（如 "Laitz, Chapter 19 Tonicization and Modulation"）；不能编造引用、页码或原文。
3. 写钢琴卷帘前先用 get_fl_payload 核对音符，再调用 apply_example；多通道/多段作曲用 fl_compose，多声部编配用 fl_arrange（默认只预览，write:true 才写入），原始音符用 fl_write_notes；不要凭空生成 MIDI。
4. 混音/路由改动前先调用 fl_session_report 或 fl_mixer_routing；用 fl_route 路由通道、fl_bus 建总线、fl_send 建发送、fl_set_levels 调整绝对电平/声像/静音/独奏。这些操作会修改 FL 工程，执行前说明，执行后报告 verified 结果。
5. 其他 FL 操作先调用 fl_list_tools 查看目录，再用 fl_call_tool；写入后报告实际提交的 payload。
6. fl_session_report 的诊断基于推子/声像/路由/插件链/通道电平，不包含峰值/LUFS；不要声称已测量响度或削波。真实混音测量用 analyze_audio 分析导出的 WAV（4× true peak/LUFS/LRA/倍频程频谱；FL 不能渲染，true peak 是近似值）。
7. FL 2026 必须通过 \`npm run fl:bridge -- --launch-fl --panel\` 启动，并打开 Gopher 面板（Alt+F1）；桥服务地址可用 TONIC_FL_BRIDGE 覆盖。`,
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

const transport = new StdioServerTransport();
await server.connect(transport);
console.error(`[tonic-mcp] ready · bridge=${BRIDGE_URL} · tools=${ALL_TOOLS.length}`);
