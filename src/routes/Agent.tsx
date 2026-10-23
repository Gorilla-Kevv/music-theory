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
          页面、搜索、谱例、复习卡、书库与 Agent 输出共用一套 TypeScript 数据。首版提供本地知识包、类型化查询函数与 Node CLI；接口按 MCP 工具形状设计，下一阶段可直接包装成 stdio MCP server。
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
                href="/knowledge.json"
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
const queue = window.TONIC.reviewQueue();`}
            />
            <CodeBlock
              label="NODE / TS"
              code={`import { theoryApi } from "./src/lib/theory-api";

theoryApi.search("五度圈", { category: "foundations" });
theoryApi.concept("voice-leading");
theoryApi.examples({ kind: "progression" });
theoryApi.searchSources("转调", { book: "sposobin" });
theoryApi.bookOutline("laitz");`}
            />
          </section>

          <section className="border border-line p-4 sm:p-5">
            <h2 className="text-lg font-semibold">4 · MCP 工具映射</h2>
            <p className="reading-column mt-2 text-sm leading-relaxed text-muted">
              下列 schema 已按 MCP <code className="font-mono text-xs">tools/list</code> 形状定义；首版不启动 server，但接口名称、输入与输出已固定，后续可直接注册。
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
            <h2 className="text-lg font-semibold">5 · 一个编曲现场</h2>
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
                className="mono-label flex w-full items-center justify-between border border-ink/25 px-3 py-2 text-muted hover:border-ink hover:text-ink"
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
              页面、音频、搜索、知识包与 CLI 全部离线运行。没有账户、云端同步或遥测；只有你主动点击外部书目链接时才会离开本地。
            </p>
          </div>

          <div className="border border-line p-4">
            <p className="mono-label text-muted">NEXT / 扩展点</p>
            <ul className="mt-2 space-y-2 text-xs leading-relaxed text-muted">
              <li>· 把 TOOL_SCHEMAS 包装成 stdio MCP server。</li>
              <li>· 让 FL Studio 脚本读取 knowledge.json 的谱例事件。</li>
              <li>· 增加和弦进行分析工具与复习弱项路由。</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
