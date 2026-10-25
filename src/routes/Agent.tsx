import { useRef, useState } from "react";
import {
  Check,
  Copy,
  Cpu,
  Download,
  ExternalLink,
  FileJson,
  Upload,
  TerminalSquare,
} from "lucide-react";
import { ALL_EXAMPLES, BOOK_STATS, CONCEPTS, SOURCE_NOTES, TOTAL_CITATIONS } from "../content";
import { useReview } from "../context/ReviewContext";
import { TOOL_SCHEMAS } from "../lib/theory-api";
import { formatPercent } from "../lib/format";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label="复制代码"
      className="mono-label inline-flex items-center gap-1 border border-paper/50 px-2 py-1 text-paper/65 hover:border-acid hover:text-acid"
    >
      {copied ? <Check size={11} aria-hidden /> : <Copy size={11} aria-hidden />}
      {copied ? "COPIED" : "COPY"}
    </button>
  );
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="mt-3 border border-line-dark bg-ink text-paper">
      <div className="flex items-center justify-between border-b border-line-dark px-3 py-2">
        <span className="mono-label text-paper/65">{label}</span>
        <CopyButton text={code} />
      </div>
      <pre className="dark-scroll overflow-x-auto whitespace-pre-wrap break-words p-4 font-mono text-[0.72rem] leading-relaxed text-paper/85 sm:whitespace-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function Agent() {
  const { stats, earStats, exportState, importState } = useReview();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      const raw = JSON.parse(await file.text()) as unknown;
      const ok = importState(raw);
      setMessage(ok ? "学习状态已导入。" : "导入失败：文件不是有效的 TONIC 学习状态。");
    } catch {
      setMessage("导入失败：JSON 解析错误。");
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-10 pt-6 sm:px-8 sm:pt-8 xl:px-12">
      <div className="border-b border-line pb-5">
        <p className="mono-label text-muted">AGENT / 接口</p>
        <h1 className="zh-display mt-2 text-4xl sm:text-5xl">让 Agent 读到同一份乐理</h1>
        <p className="reading-column mt-3 max-w-[64ch] text-sm leading-relaxed text-muted">
          页面、搜索、谱例、复习卡、书库与 Agent 输出共用一套 TypeScript 数据。已提供本地知识包、类型化查询、Node CLI、stdio MCP server（
          <code className="font-mono text-xs">npm run mcp</code>）与 FL Studio 2026 桥（
          <code className="font-mono text-xs">npm run fl:bridge -- --launch-fl --panel</code>）。
        </p>
        <p className="mono-label mt-3 text-muted">
          {BOOK_STATS.chapters} CHAPTERS · {SOURCE_NOTES.length} SOURCE NOTES · NO FULL-TEXT COPY
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["CONCEPTS", CONCEPTS.length],
          ["EXAMPLES", ALL_EXAMPLES.length],
          ["CITATIONS", TOTAL_CITATIONS],
          ["LEARNED", `${stats.learned}/${stats.total}`],
        ].map(([label, value]) => (
          <div key={String(label)} className="border border-line px-3 py-2.5">
            <p className="mono-label text-muted">{label}</p>
            <p className="mt-1 text-xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="space-y-6">
          <section className="border border-line p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileJson size={16} className="text-cobalt-ink" aria-hidden />
                <h2 className="text-lg font-semibold">1 · 本地知识包</h2>
              </div>
              <a
                href={`${import.meta.env.BASE_URL}knowledge.json`}
                target="_blank"
                rel="noreferrer"
                className="mono-label inline-flex items-center gap-1 text-cobalt-ink hover:text-ink"
              >
                knowledge.json
                <ExternalLink size={11} aria-hidden />
              </a>
            </div>
            <p className="reading-column mt-2 text-sm leading-relaxed text-muted">
              运行 <code className="font-mono text-xs">npm run knowledge</code> 生成。包含书目、
              {CONCEPTS.length} 个概念全文、{ALL_EXAMPLES.length} 个谱例的事件级音符、
              {BOOK_STATS.chapters} 个章目、{SOURCE_NOTES.length} 条原创章节笔记、工具 schema
              与引用政策；不含任何外部请求。
            </p>
            <CodeBlock
              label="TERMINAL / 生成"
              code={`npm run knowledge
# → public/knowledge.json
# ${CONCEPTS.length} concepts, ${ALL_EXAMPLES.length} examples, ${TOTAL_CITATIONS} citations
# ${BOOK_STATS.chapters} chapters, ${SOURCE_NOTES.length} source notes`}
            />
          </section>

          <section className="border border-line p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <TerminalSquare size={16} className="text-cobalt-ink" aria-hidden />
              <h2 className="text-lg font-semibold">2 · Node CLI</h2>
            </div>
            <p className="reading-column mt-2 text-sm leading-relaxed text-muted">
              适合让 FL Studio 侧的本地 Agent 直接调用；输出可切换 JSON。学习状态从网页导出后再传给 CLI，避免浏览器存储与进程隔离。
            </p>
            <CodeBlock
              label="TERMINAL / 查询"
              code={`npm run theory -- search "三全音替代" --json
npm run theory -- concept tritone-substitution --json
npm run theory -- examples --concept ii-v-i --json
npm run theory -- refs --json
npm run theory -- books
npm run theory -- source levine-13 --json
npm run theory -- sources "转调" --book sposobin --dimension relationship
npm run theory -- videos --status read
npm run theory -- videos --query "调式"
npm run theory -- queue --state ./tonic-review-state.json --json`}
            />
          </section>

          <section className="border border-line p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-cobalt-ink" aria-hidden />
              <h2 className="text-lg font-semibold">3 · TypeScript / 浏览器 API</h2>
            </div>
            <p className="reading-column mt-2 text-sm leading-relaxed text-muted">
              页面运行时在 <code className="font-mono text-xs">window.TONIC</code> 上暴露只读查询接口，供浏览器型 Agent 或自动化脚本使用；与控制台交互无关。
            </p>
            <CodeBlock
              label="BROWSER / window.TONIC"
              code={`const hits = window.TONIC.search("ii-V-I");
const concept = window.TONIC.concept("tritone-substitution");
const examples = window.TONIC.examples({ concept: "ii-v-i" });
const book = window.TONIC.bookOutline("levine");
const note = window.TONIC.sourceNote("sposobin-47");
const relatedSources = window.TONIC.sources("harmonic-color");
const videos = window.TONIC.videos({ status: "read" });
const queue = window.TONIC.reviewQueue();`}
            />
            <CodeBlock
              label="NODE / TS"
              code={`import { theoryApi } from "./src/lib/theory-api";

theoryApi.search("五度圈", { category: "foundations" });
theoryApi.concept("voice-leading");
theoryApi.examples({ kind: "progression" });
theoryApi.searchSources("转调", { book: "sposobin" });
theoryApi.bookOutline("laitz");
theoryApi.videos({ status: "read" });`}
            />
          </section>

          <section className="border border-line p-4 sm:p-5">
            <h2 className="text-lg font-semibold">4 · MCP 工具映射</h2>
            <p className="reading-column mt-2 text-sm leading-relaxed text-muted">
              <code className="font-mono text-xs">npm run mcp</code> 已启动 stdio server（27 个知识/FL 工具）；下列为知识侧 schema。FL 侧另有
              <code className="font-mono text-xs"> get_fl_payload </code>、<code className="font-mono text-xs">apply_example</code>、
              <code className="font-mono text-xs"> fl_status </code>、<code className="font-mono text-xs">fl_list_tools</code>、
              <code className="font-mono text-xs"> fl_call_tool </code>，以及操作封装层
              <code className="font-mono text-xs"> fl_session_report </code>、<code className="font-mono text-xs">fl_mixer_routing</code>、
              <code className="font-mono text-xs"> fl_route </code>、<code className="font-mono text-xs">fl_bus</code>、
              <code className="font-mono text-xs"> fl_send </code>、<code className="font-mono text-xs">fl_set_levels</code>、
              <code className="font-mono text-xs"> fl_write_notes </code>、<code className="font-mono text-xs">fl_compose</code>、
              <code className="font-mono text-xs"> fl_arrange </code>、<code className="font-mono text-xs">analyze_audio</code>。
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-y border-line bg-paper-2">
                    <th className="mono-label px-3 py-2 text-muted">TOOL</th>
                    <th className="mono-label px-3 py-2 text-muted">USE</th>
                    <th className="mono-label px-3 py-2 text-muted">INPUT</th>
                  </tr>
                </thead>
                <tbody>
                  {TOOL_SCHEMAS.map((tool) => (
                    <tr key={tool.name} className="border-b border-line align-top">
                      <td className="whitespace-nowrap px-3 py-2.5 font-mono text-[0.7rem] text-cobalt-ink">
                        {tool.name}
                      </td>
                      <td className="px-3 py-2.5 leading-relaxed">{tool.description}</td>
                      <td className="px-3 py-2.5 font-mono text-[0.68rem] text-muted">
                        {String(
                          (tool.inputSchema as { required?: string[] }).required?.join(", ") ?? "—",
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="border border-line p-4 sm:p-5">
            <h2 className="text-lg font-semibold">5 · FL Studio 2026</h2>
            <p className="reading-column mt-2 text-sm leading-relaxed text-muted">
              本地桥通过 WebView2 CDP 复用 FL 2026 官方内置 MCP（实测 48 个工具），把 TONIC 面板嵌进 Gopher；外部 Agent 走 stdio MCP。面板 Agent 支持 OpenAI Chat Completions / Responses、Anthropic、Gemini、Ollama 五种协议；FL 标签页显示 session 结构诊断（路由/总线/发送/通道电平），并可直接分析 FL 导出的 WAV（true peak、LUFS/LRA、倍频程频谱/多段热力图、目标/参考对比、削波、立体声）。写钢琴卷帘前先用
              <code className="font-mono text-xs"> get_fl_payload </code>
              核对音符，写入后桥会读回实际音符数。
            </p>
            <p className="reading-column mt-2 text-sm leading-relaxed text-muted">
              Windows 上双击项目根
              <code className="font-mono text-xs"> start-tonic-fl.bat </code>
              即可启动桥与 FL（桥已运行时会切回面板）；等价命令是
              <code className="font-mono text-xs"> npm run fl:start </code>
              ，FL 已带调试端口时用
              <code className="font-mono text-xs"> npm run fl:attach </code>
              。LLM 的 Base URL / 模型 / Key 在面板「设置」里填，只存本机 localStorage；Gopher WebView2 与普通浏览器各存一份。
            </p>
            <CodeBlock
              label="TERMINAL / FL 桥与 MCP"
              code={`start-tonic-fl.bat
npm run fl:attach
npm run mcp`}
            />
            <CodeBlock
              label="MCP / FL 工具"
              code={`get_fl_payload({ conceptSlug: "ii-v-i" })
apply_example({ conceptSlug: "ii-v-i", mode: "replace", channel: 6 })
fl_session_report()
fl_mixer_routing()
fl_bus({ buses: [{ name: "Drums", mixerTrack: "16", channels: "808 Kick,808 Clap" }] })
fl_send({ sends: [{ source: "16", dest: "15", active: true, level: 0.35 }] })
fl_set_levels({ tracks: [{ target: "16", volumeDb: -12, pan: 0.2 }] })
fl_write_notes({ channel: "6", notes: [{ midi: 36, beat: 0, duration: 1 }] })
fl_compose({ parts: [{ channel: "6", conceptSlug: "ii-v-i", mode: "replace" }] })
fl_arrange({ conceptSlug: "ii-v-i", write: true, parts: [
  { role: "bass", channel: "Bass" },
  { role: "comp", channel: "Keys", pattern: "half" },
  { role: "melody", channel: "Lead" }
] })
analyze_audio({ path: "F:\\Exports\\mix.wav" })
analyze_audio({
  path: "F:\\Exports\\mix.wav",
  referencePath: "F:\\Exports\\reference.wav",
  target: { preset: "streaming" }
})`}
            />
            <p className="mt-3 text-xs leading-relaxed text-muted">
              完整安装、MCP 配置、Agent 引用规则与故障排查见仓库根目录
              <a
                href="https://github.com/Gorilla-Kevv/music-theory/blob/dev/TONIC-FL.md"
                target="_blank"
                rel="noreferrer"
                className="ml-1 text-cobalt-ink hover:text-ink"
              >
                TONIC-FL.md ↗
              </a>
            </p>
          </section>

          <section className="border border-line p-4 sm:p-5">
            <h2 className="text-lg font-semibold">6 · 一个编曲现场</h2>
            <p className="reading-column mt-2 text-sm leading-relaxed text-muted">
              当 Agent 接到“把这段 ii–V–I 换成更爵士的终止”时，先用搜索定位三全音替代，再读谱例与引用，最后用导出的复习状态决定是否把该概念排进今天的复习。
            </p>
            <CodeBlock
              label="FLOW / 查询 → 解释 → 复习"
              code={`search_theory({ query: "tritone substitution", category: "jazz" })
get_concept({ slug: "tritone-substitution" })
list_examples({ concept: "tritone-substitution" })
search_sources({ query: "重配和声", book: "levine" })
get_source_note({ chapterId: "levine-13" })
get_review_queue({ state: exportedState })`}
            />
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6">
          <div className="border border-line bg-paper-2 p-4">
            <p className="mono-label text-muted">SYNC / 学习状态</p>
            <p className="mt-2 text-sm leading-relaxed">
              复习记录与听辨统计保存在浏览器本地。导出 JSON 后，Agent 可据此安排下一轮练习或解释薄弱概念。
            </p>
            <div className="mt-3 space-y-2">
              <button
                type="button"
                onClick={exportState}
                className="mono-label flex w-full items-center justify-between border border-ink px-3 py-2 hover:bg-ink hover:text-paper"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Download size={12} aria-hidden />
                  导出学习状态
                </span>
                JSON
              </button>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mono-label flex w-full items-center justify-between border border-ink/40 px-3 py-2 text-muted transition-colors hover:bg-ink hover:text-paper"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Upload size={12} aria-hidden />
                  导入学习状态
                </span>
                JSON
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                className="sr-only"
                onChange={(event) => {
                  void handleImport(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </div>
            {message ? <p className="mt-2 text-xs text-cobalt-ink">{message}</p> : null}
            <dl className="mt-4 divide-y divide-line border-t border-line text-xs">
              {[
                ["已学", `${stats.learned}`],
                ["到期", `${stats.due}`],
                ["复习准确率", stats.reviews === 0 ? "—" : formatPercent(stats.accuracy)],
                ["听辨准确率", earStats.attempts === 0 ? "—" : formatPercent(earStats.correct / earStats.attempts)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-1.5">
                  <dt className="text-muted">{label}</dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="border border-line bg-ink p-4 text-paper">
            <p className="mono-label text-acid">LOCAL FIRST</p>
            <p className="mt-2 text-xs leading-relaxed text-paper/65">
              页面、音频、搜索、知识包、CLI、MCP 与 FL 桥全部在本机运行。没有账户、云端同步或遥测；只有你主动点击外部书目链接、或在 FL 面板配置 LLM 时才会访问外部端点。
            </p>
          </div>

          <div className="border border-line p-4">
            <p className="mono-label text-muted">NEXT / 扩展点</p>
            <ul className="mt-2 space-y-2 text-xs leading-relaxed text-muted">
              <li>· 把 FL 面板 Agent 接到你的实际 LLM。</li>
              <li>· 补更多 FL 组合动作（进行/音阶批量写入、通道/混音）。</li>
              <li>· 增加和弦进行分析工具与复习弱项路由。</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
