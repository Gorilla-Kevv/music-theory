import { ArrowLeft, ArrowRight, Check, Headphones, Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  BIBLIOGRAPHY_BY_ID,
  CITATION_STYLE_NOTE,
  CONCEPTS,
  HARMONY_DIMENSIONS,
  citationKey,
  citationNumberMap,
  collectCitations,
  getCategory,
  getChaptersForConcept,
  getConcept,
  getRelatedConcepts,
} from "../content";
import type { CitationRef, Concept } from "../content/types";
import { ExampleFigure } from "../components/ExampleFigure";
import { VisualizationCard } from "../components/VisualizationCard";
import { CATEGORY_STYLES } from "../components/category";
import { PlayControl } from "../components/ui";
import { useReview } from "../context/ReviewContext";
import { useTransport } from "../context/TransportContext";
import { NotFound } from "./NotFound";

function CitationSup({
  cites,
  numberMap,
}: {
  cites?: CitationRef[];
  numberMap: Map<string, number>;
}) {
  if (!cites || cites.length === 0) return null;
  const numbers = cites
    .map((ref) => numberMap.get(citationKey(ref)))
    .filter((value): value is number => typeof value === "number");
  if (numbers.length === 0) return null;
  return (
    <sup className="ml-0.5 whitespace-nowrap font-mono text-[0.62rem] leading-none text-cobalt-ink">
      <a href={`#note-${numbers[0]}`} className="hover:underline">
        [{numbers.join(",")}]
      </a>
    </sup>
  );
}

function CitedText({
  text,
  cites,
  numberMap,
}: {
  text?: string;
  cites?: CitationRef[];
  numberMap: Map<string, number>;
}) {
  const value = text ?? "";
  if (!cites || cites.length === 0) return <>{value}</>;
  const keep = Math.min(4, value.length);
  const head = value.slice(0, value.length - keep);
  const tail = value.slice(value.length - keep);
  return (
    <>
      {head}
      <span className="whitespace-nowrap">
        {tail}
        <CitationSup cites={cites} numberMap={numberMap} />
      </span>
    </>
  );
}

function SectionBody({
  concept,
  numberMap,
}: {
  concept: Concept;
  numberMap: Map<string, number>;
}) {
  return (
    <>
      {concept.sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24 border-t border-line pt-6">
          <h2 className="zh-display text-xl sm:text-2xl">{section.heading}</h2>
          {section.blocks.map((block, index) => {
            if (block.type === "list") {
              return (
                <div key={index} className="mt-4">
                  <ul className="reading-column list-disc space-y-2 pl-5 text-[1.0625rem] leading-[1.8]">
                    {block.items?.map((item, itemIndex) => (
                      <li key={`${item}-${itemIndex}`}>
                        {item}
                        {itemIndex === (block.items?.length ?? 0) - 1 ? (
                          <CitationSup cites={block.cites} numberMap={numberMap} />
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
            if (block.type === "callout") {
              return (
                <aside key={index} className="mt-5 border border-ink/20 bg-paper-2 p-4">
                  {block.title ? (
                    <p className="mono-label text-cobalt-ink">{block.title}</p>
                  ) : null}
                  <p className="reading-column mt-2 text-sm leading-relaxed">
                    <CitedText text={block.text} cites={block.cites} numberMap={numberMap} />
                  </p>
                </aside>
              );
            }
            if (block.type === "quote") {
              return (
                <blockquote key={index} className="reading-column mt-5 border-y border-line py-4">
                  <p className="text-lg italic leading-relaxed">
                    <CitedText text={block.text} cites={block.cites} numberMap={numberMap} />
                  </p>
                </blockquote>
              );
            }
            return (
              <p
                key={index}
                className="reading-column mt-4 text-[1.0625rem] leading-[1.85] text-ink/90"
              >
                <CitedText text={block.text} cites={block.cites} numberMap={numberMap} />
              </p>
            );
          })}
        </section>
      ))}
    </>
  );
}

function ReviewAction({ concept, onDark = false }: { concept: Concept; onDark?: boolean }) {
  const { isAdded, addConcept, due } = useReview();
  const added = isAdded(concept);
  const dueRecord = due.find((record) => record.conceptSlug === concept.slug);
  const actionClass = onDark
    ? "border-paper/80 text-paper hover:border-acid hover:text-acid"
    : "border-ink/80 text-ink hover:border-cobalt hover:text-cobalt-ink";

  if (added) {
    return (
      <Link
        to="/drill"
        className={`inline-flex items-center gap-2 border px-3 py-2 text-sm ${actionClass}`}
      >
        <Check size={15} aria-hidden />
        {dueRecord ? "今天到期 · 去复习" : "已在复习队列"}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={() => addConcept(concept)}
      className={`inline-flex items-center gap-2 border px-3 py-2 text-sm ${actionClass}`}
    >
      <Plus size={15} aria-hidden />
      加入复习
    </button>
  );
}

export function ConceptPage() {
  const { slug } = useParams();
  const concept = slug ? getConcept(slug) : undefined;
  const { play, stop, state, isExamplePlaying } = useTransport();
  const { isAdded, due } = useReview();

  if (!concept) return <NotFound />;

  const categoryMeta = getCategory(concept.category);
  const style = CATEGORY_STYLES[concept.category];
  const onDark = concept.category === "foundations";
  const mutedText = onDark ? "text-paper" : "text-ink/80";
  const numberMap = citationNumberMap(concept);
  const numbered = collectCitations(concept);
  const related = getRelatedConcepts(concept);
  const index = CONCEPTS.findIndex((item) => item.slug === concept.slug);
  const previous = index > 0 ? CONCEPTS[index - 1] : null;
  const next = index >= 0 && index < CONCEPTS.length - 1 ? CONCEPTS[index + 1] : null;
  const primaryExample = concept.examples[0];
  const playingPrimary = primaryExample ? isExamplePlaying(primaryExample.id) : false;
  const added = isAdded(concept);
  const dueRecord = due.find((record) => record.conceptSlug === concept.slug);

  const uniqueSources = [...new Set(numbered.map(({ ref }) => ref.source))];
  const sourceChapters = getChaptersForConcept(concept.slug);
  const mobileOutline = [
    { id: "top", label: "页首" },
    ...concept.sections.map((section) => ({ id: section.id, label: section.heading })),
    ...(concept.examples.length > 0 ? [{ id: "figures", label: "谱例 / Figures" }] : []),
    ...(concept.visual ? [{ id: "visual", label: "可视化 / Visual" }] : []),
    { id: "notes", label: "本页引用 / Notes" },
  ];

  return (
    <article>
      <header id="top" className={`scroll-mt-24 border-b border-line ${style.field}`}>
        <div className="mx-auto max-w-[1400px] px-4 py-7 sm:px-8 sm:py-9 xl:px-12">
          <div className={`flex flex-wrap items-center gap-2 text-[0.7rem] ${mutedText}`}>
            <Link to="/library" className="mono-label hover:underline">
              LIBRARY
            </Link>
            <span aria-hidden>/</span>
            <span className="mono-label">{categoryMeta?.nameEn}</span>
            <span aria-hidden>/</span>
            <span className="mono-label">{concept.number}</span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`mono-label border px-2 py-1 ${onDark ? "border-paper/80" : "border-ink/60"}`}>
                  {categoryMeta?.nameEn ?? concept.category}
                </span>
                <span className={`mono-label border px-2 py-1 ${onDark ? "border-paper/80" : "border-ink/60"}`}>
                  {concept.level}
                </span>
                {concept.dimensions?.map((dimension) => {
                  const meta = HARMONY_DIMENSIONS.find((item) => item.id === dimension);
                  return (
                    <span
                      key={dimension}
                      className={`mono-label border px-2 py-1 ${onDark ? "border-paper/80" : "border-ink/60"}`}
                    >
                      {meta?.label ?? dimension}
                    </span>
                  );
                })}
                <span className={`mono-label ${mutedText}`}>{concept.examples.length} FIGURES</span>
                <span className={`mono-label ${mutedText}`}>{numbered.length} REFS</span>
              </div>
              <h1 className="zh-display mt-4 text-[clamp(2.4rem,6vw,4.8rem)]">{concept.title}</h1>
              <p className={`display mt-2 text-xl sm:text-2xl ${onDark ? "text-paper" : "text-ink"}`}>
                {concept.titleEn}
              </p>
              <p className={`reading-column mt-4 max-w-[58ch] text-base leading-relaxed ${onDark ? "text-paper" : "text-ink/90"}`}>
                {concept.summary}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-stretch">
              {primaryExample ? (
                <div
                  className={`inline-flex items-center gap-2 border px-2 py-1.5 text-sm ${
                    onDark ? "border-paper/80 text-paper" : "border-ink/80 text-ink"
                  }`}
                >
                  <PlayControl
                    playing={playingPrimary}
                    onClick={() => {
                      if (playingPrimary) stop();
                      else play(primaryExample, { conceptSlug: concept.slug, conceptTitle: concept.title });
                    }}
                    label={playingPrimary ? "停止主谱例" : "播放主谱例"}
                    tone={onDark ? "paper" : "cadmium"}
                    size="sm"
                  />
                  <span className="pr-1">{playingPrimary ? "停止主谱例" : "播放主谱例"}</span>
                </div>
              ) : null}
              <ReviewAction concept={concept} onDark={onDark} />
              {added && dueRecord ? (
                <span className={`mono-label ${mutedText}`}>DUE / TODAY</span>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <details className="border-b border-line bg-paper-2 px-4 py-3 sm:px-8 lg:hidden">
        <summary className="mono-label cursor-pointer text-muted">
          ON THIS PAGE / 本章大纲 · {mobileOutline.length} ITEMS
        </summary>
        <nav aria-label="本章大纲" className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2">
          {mobileOutline.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="border border-line bg-paper px-3 py-2 text-xs text-ink/80 hover:border-cobalt hover:text-cobalt-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </details>

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-8 sm:py-10 xl:px-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_290px] lg:items-start">
          <div className="min-w-0">
            <SectionBody concept={concept} numberMap={numberMap} />

            {concept.examples.length > 0 ? (
              <section id="figures" className="scroll-mt-24 border-t border-line pt-6">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="mono-label text-muted">FIGURES / 谱例</p>
                    <h2 className="zh-display mt-1.5 text-xl sm:text-2xl">把概念听成声音</h2>
                  </div>
                  <span className="mono-label text-muted">{concept.examples.length} CUES</span>
                </div>
                <div className="mt-5 space-y-6">
                  {concept.examples.map((example, exampleIndex) => (
                    <ExampleFigure
                      key={example.id}
                      example={example}
                      figureNumber={`FIG. ${(exampleIndex + 1).toString().padStart(2, "0")}`}
                      conceptSlug={concept.slug}
                      conceptTitle={concept.title}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            <VisualizationCard concept={concept} />

            <section id="notes" className="scroll-mt-24 border-t border-line pt-6">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="mono-label text-muted">NOTES / 注释</p>
                  <h2 className="zh-display mt-1.5 text-xl sm:text-2xl">本页引用</h2>
                </div>
                <span className="mono-label text-muted">{numbered.length} NOTES</span>
              </div>
              <ol className="mt-4 border-t border-line">
                {numbered.map(({ ref, number }) => {
                  const entry = BIBLIOGRAPHY_BY_ID[ref.source];
                  return (
                    <li
                      key={`${ref.source}-${ref.locator}`}
                      id={`note-${number}`}
                      className="scroll-mt-24 border-b border-line py-3 text-xs leading-relaxed sm:text-sm"
                    >
                      <div className="flex gap-3">
                        <span className="mono-label shrink-0 text-cobalt-ink">[{number}]</span>
                        <div className="min-w-0">
                          <p>
                            {entry.authors}. <span className="italic">{entry.title}</span>.{" "}
                            {entry.publisher}, {entry.year}. {ref.locator}.
                            {ref.note ? <span className="text-muted"> {ref.note}</span> : null}
                          </p>
                          <Link
                            to={`/references#${entry.id}`}
                            className="mono-label mt-1 inline-block text-muted hover:text-cobalt-ink"
                          >
                            查看书目与版次 →
                          </Link>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-3 text-xs leading-relaxed text-muted">{CITATION_STYLE_NOTE}</p>
            </section>

            {related.length > 0 ? (
              <section className="border-t border-line pt-6">
                <p className="mono-label text-muted">RELATED / 相关</p>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {related.map((item) => (
                    <Link
                      key={item.slug}
                      to={`/theory/${item.slug}`}
                      className="group border border-line px-3 py-3 hover:border-cobalt"
                    >
                      <span className="mono-label text-muted">{item.number}</span>
                      <span className="mt-1 block text-sm font-semibold group-hover:text-cobalt-ink">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted">{item.summary}</span>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            <nav className="mt-10 grid grid-cols-1 gap-3 border-t border-line pt-5 sm:grid-cols-2" aria-label="概念导航">
              {previous ? (
                <Link
                  to={`/theory/${previous.slug}`}
                  className="group flex items-start gap-3 border border-line px-3 py-3 hover:border-cobalt"
                >
                  <ArrowLeft size={15} className="mt-0.5 shrink-0 text-muted" aria-hidden />
                  <span>
                    <span className="mono-label text-muted">PREV / {previous.number}</span>
                    <span className="mt-1 block text-sm font-semibold group-hover:text-cobalt-ink">
                      {previous.title}
                    </span>
                  </span>
                </Link>
              ) : (
                <Link
                  to="/library"
                  className="flex items-start gap-3 border border-line px-3 py-3 hover:border-cobalt"
                >
                  <ArrowLeft size={15} className="mt-0.5 text-muted" aria-hidden />
                  <span className="text-sm">返回知识库</span>
                </Link>
              )}
              {next ? (
                <Link
                  to={`/theory/${next.slug}`}
                  className="group flex items-start justify-between gap-3 border border-line px-3 py-3 text-right hover:border-cobalt sm:text-right"
                >
                  <span>
                    <span className="mono-label block text-muted">NEXT / {next.number}</span>
                    <span className="mt-1 block text-sm font-semibold group-hover:text-cobalt-ink">
                      {next.title}
                    </span>
                  </span>
                  <ArrowRight size={15} className="mt-0.5 shrink-0 text-muted" aria-hidden />
                </Link>
              ) : (
                <Link
                  to="/drill"
                  className="flex items-start justify-between gap-3 border border-line px-3 py-3 hover:border-cobalt"
                >
                  <span className="text-sm">去复习这个条目</span>
                  <ArrowRight size={15} className="mt-0.5 text-muted" aria-hidden />
                </Link>
              )}
            </nav>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6">
            <div className="border border-line bg-paper-2 p-4">
              <p className="mono-label text-muted">REVIEW / 强化</p>
              <p className="mt-2 text-sm leading-relaxed">
                {added
                  ? dueRecord
                    ? "这张卡今天到期，先试着回忆，再看答案。"
                    : "已在复习队列；到期时会出现在复习页。"
                  : "加入间隔复习队列，用主动回忆巩固这条概念。"}
              </p>
              <div className="mt-3">
                <ReviewAction concept={concept} />
              </div>
              {added ? (
                <Link to="/drill" className="mono-label mt-3 inline-block text-cobalt-ink hover:text-ink">
                  打开复习与听辨 →
                </Link>
              ) : null}
            </div>

            <div className="border border-line p-4">
              <p className="mono-label text-muted">QUICK FACTS</p>
              <dl className="mt-2 divide-y divide-line text-sm">
                {[
                  ["分类", categoryMeta?.name ?? concept.category],
                  ["级别", concept.level],
                  ["谱例", `${concept.examples.length}`],
                  ["引用", `${numbered.length}`],
                  ["编号", concept.number],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-3 py-1.5">
                    <dt className="text-xs text-muted">{label}</dt>
                    <dd className="text-xs font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="border border-line p-4">
              <p className="mono-label text-muted">ALIASES / 别名</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[...new Set([...concept.aliases, ...concept.tags])].map((alias) => (
                  <span key={alias} className="border border-ink/15 px-2 py-1 text-[0.7rem] text-ink/70">
                    {alias}
                  </span>
                ))}
              </div>
            </div>

            <div className="border border-line p-4">
              <p className="mono-label text-muted">SOURCES / 依据</p>
              <ul className="mt-2 space-y-2">
                {uniqueSources.map((source) => {
                  const entry = BIBLIOGRAPHY_BY_ID[source];
                  return (
                    <li key={source}>
                      <Link to={`/references#${entry.id}`} className="text-xs hover:text-cobalt-ink">
                        <span className="block font-medium">{entry.title}</span>
                        <span className="mono-label text-muted">{entry.edition}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {sourceChapters.length > 0 ? (
              <div className="border border-line p-4">
                <p className="mono-label text-muted">BOOK NOTES / 书库笔记</p>
                <ul className="mt-2 space-y-2">
                  {sourceChapters.map((chapter) => (
                    <li key={chapter.id}>
                      <Link
                        to={`/books?book=${chapter.book}&chapter=${chapter.id}`}
                        className="text-xs hover:text-cobalt-ink"
                      >
                        <span className="mono-label text-muted">
                          {chapter.book.toUpperCase()} {chapter.number}
                        </span>
                        <span className="mt-0.5 block font-medium">
                          {chapter.titleZh ?? chapter.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="border border-line p-4">
              <p className="mono-label flex items-center gap-1.5 text-muted">
                <Headphones size={12} aria-hidden />
                AUDIO
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                所有谱例由本地 Salamander 钢琴采样驱动，Web Audio 合成作为回退；不加载外部采样。点击谱面音符/和弦、播放键或琴键即可试听。
              </p>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
