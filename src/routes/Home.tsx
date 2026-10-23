import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Headphones, Search, Sparkle } from "lucide-react";
import { Link } from "react-router-dom";
import { CATEGORIES, CONCEPTS, CONCEPT_BY_SLUG, TOTAL_CITATIONS } from "../content";
import type { CategoryId } from "../content/types";
import { useReview } from "../context/ReviewContext";
import { useTransport } from "../context/TransportContext";
import { PianoKeyboard } from "../components/PianoKeyboard";
import { StaffNotation } from "../components/StaffNotation";
import { PlayControl } from "../components/ui";
import { CATEGORY_STYLES } from "../components/category";
import { useSearch } from "../components/SearchDialog";

function HeroSleeve() {
  const concept = CONCEPT_BY_SLUG["ii-v-i"];
  const example = concept.examples[0];
  const { play, stop, previewNote, previewChord, state, isExamplePlaying } = useTransport();
  const playing = isExamplePlaying(example.id);
  const [previewNotes, setPreviewNotes] = useState<number[]>([]);
  const previewTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (previewTimer.current) window.clearTimeout(previewTimer.current);
    };
  }, []);

  const flashNotes = (midis: number[]) => {
    setPreviewNotes(midis);
    if (previewTimer.current) window.clearTimeout(previewTimer.current);
    previewTimer.current = window.setTimeout(() => setPreviewNotes([]), 900);
  };

  const handleKey = (midi: number) => {
    previewNote(midi);
    flashNotes([midi]);
  };

  const handleStaffEvent = (event: { notes: Array<{ midi: number }> }) => {
    const midis = event.notes.map((note) => note.midi);
    if (midis.length === 1) previewNote(midis[0]);
    else previewChord(midis);
    flashNotes(midis);
  };

  const activeNotes = playing
    ? [...new Set([...state.activeNotes, ...previewNotes])]
    : previewNotes;

  const toggle = () => {
    if (playing) stop();
    else play(example, { conceptSlug: concept.slug, conceptTitle: concept.title });
  };

  return (
    <div className="sleeve-in min-w-0 border border-ink bg-paper text-ink">
      <div className="flex items-start justify-between border-b border-ink px-4 py-3">
        <div>
          <p className="mono-label text-muted">TR-001 / SIDE A / 33⅓</p>
          <h2 className="mt-1.5 text-xl font-semibold leading-tight sm:text-2xl">
            Dm9 → G13 → Cmaj9
          </h2>
        </div>
        <PlayControl
          playing={playing}
          onClick={toggle}
          label={playing ? "停止 ii–V–I 示例" : "播放 ii–V–I 示例"}
          tone="cadmium"
          size="lg"
        />
      </div>
      <div className="px-2 pt-2">
        <StaffNotation
          example={example}
          measuresPerRow={3}
          onEventPlay={handleStaffEvent}
        />
      </div>
      <div className="border-t border-line px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <span className="mono-label text-muted">点击谱面或琴键 · 听见和弦骨架</span>
          <Link
            to={`/theory/${concept.slug}`}
            className="mono-label inline-flex items-center gap-1 text-cobalt-ink hover:text-ink"
          >
            读条目 <ArrowUpRight size={12} aria-hidden />
          </Link>
        </div>
        <PianoKeyboard
          activeNotes={activeNotes}
          onNote={handleKey}
          compact
          className="mt-2"
        />
        <p className="mt-3 text-xs leading-relaxed text-muted">{example.caption}</p>
      </div>
    </div>
  );
}

function ReviewStrip() {
  const { stats } = useReview();
  const items = [
    { label: "DUE / 待复习", value: stats.due, tone: "text-cobalt-ink" },
    { label: "NEW / 新卡", value: stats.fresh, tone: "text-cadmium-ink" },
    {
      label: "ACCURACY / 准确率",
      value: stats.reviews === 0 ? "—" : `${Math.round(stats.accuracy * 100)}%`,
      tone: "text-ink",
    },
  ];
  return (
    <div className="grid grid-cols-1 border-y border-line bg-paper-2 sm:grid-cols-3">
      {items.map((item, index) => (
        <div
          key={item.label}
          className={`px-4 py-4 sm:px-6 ${index > 0 ? "border-t border-line sm:border-l sm:border-t-0" : ""}`}
        >
          <p className="mono-label text-muted">{item.label}</p>
          <p className={`mt-1 text-2xl font-semibold ${item.tone}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}

function CategoryShelf({ category }: { category: (typeof CATEGORIES)[number] }) {
  const concepts = CONCEPTS.filter((concept) => concept.category === category.id);
  const style = CATEGORY_STYLES[category.id as CategoryId];

  return (
    <section className="border border-line bg-paper">
      <div className={`flex items-end justify-between px-4 py-4 ${style.field}`}>
        <div>
          <p className="mono-label">{category.nameEn}</p>
          <h2 className="zh-display mt-1 text-2xl">{category.name}</h2>
        </div>
        <span className="display text-4xl">{concepts.length.toString().padStart(2, "0")}</span>
      </div>
      <p className="border-b border-line px-4 py-3 text-xs leading-relaxed text-muted">
        {category.description}
      </p>
      <ul>
        {concepts.slice(0, 4).map((concept) => (
          <li key={concept.slug} className="border-b border-line last:border-b-0">
            <Link
              to={`/theory/${concept.slug}`}
              className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-paper-2"
            >
              <span className="mono-label mt-0.5 w-9 shrink-0 text-muted">{concept.number}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold group-hover:text-cobalt-ink">
                  {concept.title}
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted">
                  {concept.summary}
                </span>
              </span>
              <ArrowRight
                size={14}
                className="mt-1 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-cobalt-ink"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
      <Link
        to={`/library?category=${category.id}`}
        className="mono-label flex items-center justify-between border-t border-line px-4 py-3 text-muted hover:text-ink"
      >
        查看全部 {concepts.length} 条
        <ArrowRight size={12} aria-hidden />
      </Link>
    </section>
  );
}

export function Home() {
  const { openSearch } = useSearch();
  const { due } = useReview();

  return (
    <div>
      <section className="bg-cobalt text-paper">
        <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-8 sm:py-12 xl:px-12">
          <div className="flex items-center justify-between border-b border-paper/50 pb-3">
            <span className="mono-label text-paper">TONIC / 主音</span>
            <span className="mono-label hidden text-paper sm:inline">
              LOCAL-FIRST THEORY WORKBENCH
            </span>
            <span className="mono-label text-paper">EST. 2026</span>
          </div>

          <div className="mt-8 grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
            <div className="min-w-0">
              <h1 className="display text-[clamp(4.5rem,13vw,10.5rem)] text-paper">Tonic</h1>
              <p className="zh-display mt-1 text-3xl text-acid sm:text-4xl">主音</p>
              <p className="reading-column mt-5 max-w-[42ch] text-base leading-relaxed text-paper sm:text-lg">
                把乐理变成可听、可查、可复习的个人知识库。每个概念都有谱例、章节级引用与间隔复习卡。
              </p>

              <button
                type="button"
                onClick={openSearch}
                className="group mt-7 flex w-full max-w-xl items-center gap-3 border border-paper/35 bg-ink px-4 py-3.5 text-left transition-colors hover:border-acid"
              >
                <Search size={18} className="text-acid" aria-hidden />
                <span className="flex-1 text-sm text-paper/60 group-hover:text-paper">
                  检索概念、和弦、进行或英文术语…
                </span>
                <span className="mono-label border border-paper/40 px-1.5 py-1 text-paper/65">
                  ⌘K
                </span>
              </button>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                <span className="mono-label text-paper">
                  {CONCEPTS.length} CONCEPTS
                </span>
                <span className="mono-label text-paper">{TOTAL_CITATIONS} CITATIONS</span>
                <span className="mono-label text-paper">3 SOURCE BOOKS</span>
                {due.length > 0 ? (
                  <Link to="/drill" className="mono-label text-acid hover:underline">
                    {due.length} DUE NOW →
                  </Link>
                ) : null}
              </div>
            </div>

            <HeroSleeve />
          </div>
        </div>
      </section>

      <ReviewStrip />

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-8 sm:py-10 xl:px-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mono-label text-muted">CATALOG / 知识库</p>
            <h2 className="zh-display mt-2 text-3xl sm:text-4xl">三条学习线，一套语法</h2>
          </div>
          <Link
            to="/library"
            className="mono-label inline-flex items-center gap-1.5 text-cobalt-ink hover:text-ink"
          >
            打开完整索引 <ArrowRight size={13} aria-hidden />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <CategoryShelf key={category.id} category={category} />
          ))}
        </div>

        <section className="mt-10 grid grid-cols-1 gap-6 border border-line bg-ink p-5 text-paper sm:p-7 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center">
          <div>
            <p className="mono-label text-acid">HOW IT WORKS / 读法</p>
            <h2 className="zh-display mt-2 text-2xl sm:text-3xl">检索 → 试听 → 复习</h2>
            <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-paper/70">
              先用检索定位，再用谱例把概念听成声音，最后把条目加入复习队列。Agent 读取的是同一份知识包。
            </p>
            <Link
              to="/agent"
              className="mono-label mt-5 inline-flex items-center gap-1.5 border border-paper/40 px-3 py-2 text-paper/85 hover:border-acid hover:text-acid"
            >
              <Sparkle size={13} aria-hidden />
              查看 Agent 接口
            </Link>
          </div>
          <ol className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: Search, title: "检索", body: "中英文、别名、标签与正文统一索引。" },
              { icon: Headphones, title: "试听", body: "五线谱、琴键与试听坞共用一套音符数据。" },
              { icon: ArrowRight, title: "复习", body: "SM-2 式间隔重复，复习状态可导出给 Agent。" },
            ].map(({ icon: Icon, title, body }, index) => (
              <li key={title} className="border border-line-dark p-4">
                <div className="flex items-center justify-between">
                  <Icon size={16} className="text-acid" aria-hidden />
                  <span className="mono-label text-paper/65">0{index + 1}</span>
                </div>
                <p className="mt-3 text-sm font-semibold">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-paper/60">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          <p className="reading-column text-xs leading-relaxed text-muted">
            理论依据：Levine《The Jazz Theory Book》、Laitz &amp; Callahan《The Complete Musician》第 5 版、
            斯波索宾等《和声学教程》第 3 版。引用为章节级定位，不虚构页码。
          </p>
          <Link to="/references" className="mono-label text-cobalt-ink hover:text-ink">
            REFERENCES →
          </Link>
        </footer>
      </div>
    </div>
  );
}
