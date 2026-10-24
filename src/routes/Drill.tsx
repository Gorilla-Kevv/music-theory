import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Headphones, RefreshCw, Volume2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { CONCEPT_BY_SLUG } from "../content";
import type { Concept } from "../content/types";
import { useReview } from "../context/ReviewContext";
import { useTransport } from "../context/TransportContext";
import { generateEarQuestion, type EarMode, type EarQuestion } from "../lib/ear";
import type { Grade } from "../lib/review";
import { formatPercent } from "../lib/format";
import { CategoryTag, EmptyState, ProgressBar } from "../components/ui";
import { CATEGORY_STYLES } from "../components/category";

type Tab = "review" | "ear";

const GRADES: Array<{ grade: Grade; label: string; hint: string; className: string }> = [
  { grade: "again", label: "重来", hint: "1", className: "border-cadmium-ink text-cadmium-ink hover:bg-cadmium hover:text-ink" },
  { grade: "hard", label: "困难", hint: "2", className: "border-ink/50 hover:bg-paper-2" },
  { grade: "good", label: "记住", hint: "3", className: "border-cobalt text-cobalt-ink hover:bg-cobalt hover:text-paper" },
  { grade: "easy", label: "轻松", hint: "4", className: "border-ink bg-ink text-paper hover:bg-cobalt" },
];

function ReviewStage() {
  const { due, fresh, grade, stats, isAdded } = useReview();
  const { play } = useTransport();
  const [revealed, setRevealed] = useState(false);

  const current: Concept | undefined = useMemo(() => {
    const dueSlug = due[0]?.conceptSlug;
    if (dueSlug) return CONCEPT_BY_SLUG[dueSlug];
    return fresh[0];
  }, [due, fresh]);

  const isNew = current ? !isAdded(current) : false;

  useEffect(() => {
    setRevealed(false);
  }, [current?.slug]);

  useEffect(() => {
    if (!revealed || !current) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
      const map: Record<string, Grade> = { "1": "again", "2": "hard", "3": "good", "4": "easy" };
      const value = map[event.key];
      if (value) {
        event.preventDefault();
        grade(current, value);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [revealed, current, grade]);

  if (!current) {
    return (
      <EmptyState
        title="到期卡已清空"
        body="没有待复习的卡片。可以去知识库把更多概念加入队列，或继续做听辨训练。"
        action={
          <Link
            to="/library"
            className="mono-label inline-flex items-center gap-1.5 border border-ink px-3 py-2 hover:bg-ink hover:text-paper"
          >
            打开知识库 <ArrowRight size={13} aria-hidden />
          </Link>
        }
      />
    );
  }

  const categoryStyle = CATEGORY_STYLES[current.category];
  const answerExample = current.examples[0];

  const handleGrade = (value: Grade) => {
    grade(current, value);
    setRevealed(false);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border border-line bg-paper-2 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryTag category={current.category} />
          <span className="mono-label text-muted">{current.number}</span>
          <span className="mono-label text-muted">
            {isNew ? "NEW CARD" : due.length > 0 ? "DUE CARD" : "AHEAD"}
          </span>
        </div>
        <span className="mono-label text-muted">
          QUEUE {due.length.toString().padStart(2, "0")} / NEW {stats.fresh.toString().padStart(2, "0")}
        </span>
      </div>

      <div className="mt-4 border border-line bg-paper">
        <div className={`h-2 ${categoryStyle.field}`} aria-hidden />
        <div className="px-5 py-6 sm:px-7 sm:py-8">
          <p className="mono-label text-muted">QUESTION / 主动回忆</p>
          <h2 className="mt-3 max-w-[34ch] text-xl font-semibold leading-snug sm:text-2xl">
            {current.review.question}
          </h2>
          {current.review.hint ? (
            <p className="mt-3 text-xs text-muted">提示：{current.review.hint}</p>
          ) : null}

          {!revealed ? (
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="inline-flex items-center gap-2 bg-ink px-4 py-2.5 text-sm text-paper hover:bg-cobalt"
              >
                显示答案 <ArrowRight size={15} aria-hidden />
              </button>
              <Link
                to={`/theory/${current.slug}`}
                className="mono-label text-cobalt-ink hover:text-ink"
              >
                打开条目 →
              </Link>
            </div>
          ) : (
            <div className="mt-6 border-t border-line pt-5">
              <p className="mono-label text-muted">ANSWER / 答案</p>
              <p className="reading-column mt-2 text-base leading-relaxed sm:text-lg">
                {current.review.answer}
              </p>

              {answerExample ? (
                <button
                  type="button"
                  onClick={() =>
                    play(answerExample, {
                      conceptSlug: current.slug,
                      conceptTitle: current.title,
                    })
                  }
                  className="mono-label mt-4 inline-flex items-center gap-1.5 border border-ink/45 px-2.5 py-1.5 text-muted transition-colors hover:bg-ink hover:text-paper"
                >
                  <Volume2 size={12} aria-hidden />
                  听相关谱例
                </button>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-2">
                {GRADES.map((item) => (
                  <button
                    key={item.grade}
                    type="button"
                    onClick={() => handleGrade(item.grade)}
                    className={`inline-flex min-w-[92px] items-center justify-between gap-3 border px-3 py-2 text-sm transition-colors ${item.className}`}
                  >
                    {item.label}
                    <span className="mono-label">{item.hint}</span>
                  </button>
                ))}
              </div>
              <p className="mono-label mt-2 text-muted">
                评分同时更新下次到期时间与准确率；快捷键 1–4。
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "DUE / 到期", value: stats.due },
          { label: "NEW / 未学", value: stats.fresh },
          { label: "ACCURACY / 准确率", value: formatPercent(stats.accuracy) },
        ].map((item) => (
          <div key={item.label} className="border border-line px-3 py-2.5">
            <p className="mono-label text-muted">{item.label}</p>
            <p className="mt-1 text-lg font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const EAR_MODES: Array<{ id: EarMode; label: string; body: string }> = [
  { id: "interval", label: "音程", body: "两个音的距离与性质。" },
  { id: "chord", label: "和弦", body: "三和弦、七和弦的质量。" },
  { id: "scale", label: "调式", body: "大调、小调与常用调式。" },
];

function EarStage() {
  const { earStats, recordEar } = useReview();
  const { play } = useTransport();
  const [mode, setMode] = useState<EarMode>("interval");
  const [question, setQuestion] = useState<EarQuestion>(() => generateEarQuestion("interval"));
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const modeStats = earStats.byMode[mode];
  const modeAccuracy = modeStats.attempts === 0 ? 0 : modeStats.correct / modeStats.attempts;

  const switchMode = (nextMode: EarMode) => {
    setMode(nextMode);
    setQuestion(generateEarQuestion(nextMode));
    setSelected(null);
    setRevealed(false);
  };

  const nextQuestion = () => {
    const next = generateEarQuestion(mode, question.answer);
    setQuestion(next);
    setSelected(null);
    setRevealed(false);
    play(next.example, { conceptTitle: "听辨训练" });
  };

  const choose = (option: string) => {
    if (revealed) return;
    setSelected(option);
    setRevealed(true);
    recordEar(mode, option === question.answer);
  };

  const replay = () => play(question.example, { conceptTitle: "听辨训练" });

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {EAR_MODES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => switchMode(item.id)}
            className={`border px-3 py-2 text-left ${
              mode === item.id
                ? "border-ink bg-ink text-paper"
                : "border-line hover:border-ink/40"
            }`}
          >
            <span className="mono-label block opacity-65">{item.id.toUpperCase()}</span>
            <span className="mt-1 block text-sm font-semibold">{item.label}</span>
            <span className="mt-0.5 block text-xs opacity-65">{item.body}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 border border-line bg-paper">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div>
            <p className="mono-label text-muted">EAR LAB / 听辨</p>
            <h2 className="mt-1 text-lg font-semibold">{question.prompt}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={replay}
              className="mono-label inline-flex items-center gap-1.5 border border-ink/40 px-2.5 py-2 transition-colors hover:bg-ink hover:text-paper"
            >
              <Volume2 size={13} aria-hidden />
              再听一次
            </button>
            <button
              type="button"
              onClick={nextQuestion}
              aria-label="下一题并自动播放"
              className="inline-flex h-9 w-9 items-center justify-center bg-cadmium text-ink hover:bg-acid"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        <div className="px-4 py-5">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {question.options.map((option) => {
              const isCorrect = option === question.answer;
              const isSelected = option === selected;
              let stateClass = "border-line hover:border-ink/45 hover:bg-paper-2";
              if (revealed && isCorrect) stateClass = "border-ink bg-acid text-ink";
              else if (revealed && isSelected && !isCorrect) stateClass = "border-cadmium-ink bg-cadmium/15 text-cadmium-ink";
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => choose(option)}
                  disabled={revealed}
                  className={`flex items-center justify-between gap-3 border px-3 py-2.5 text-left text-sm transition-colors disabled:cursor-default ${stateClass}`}
                >
                  <span>{option}</span>
                  {revealed && isCorrect ? <Check size={15} aria-hidden /> : null}
                  {revealed && isSelected && !isCorrect ? <X size={15} aria-hidden /> : null}
                </button>
              );
            })}
          </div>

          {revealed ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
              <p className="text-sm">
                {selected === question.answer ? "正确。" : `答案是：${question.answer}。`}
              </p>
              <button
                type="button"
                onClick={nextQuestion}
                className="mono-label inline-flex items-center gap-1.5 bg-ink px-3 py-2 text-paper hover:bg-cobalt"
              >
                下一题 <ArrowRight size={13} aria-hidden />
              </button>
            </div>
          ) : (
            <p className="mono-label mt-4 text-muted">
              先听，再选择；选择后立即显示正确答案。
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "THIS MODE / 本类", value: `${modeStats.correct}/${modeStats.attempts}` },
          { label: "MODE ACC / 本类准确率", value: formatPercent(modeAccuracy) },
          {
            label: "OVERALL / 总准确率",
            value: earStats.attempts === 0 ? "—" : formatPercent(earStats.correct / earStats.attempts),
          },
        ].map((item) => (
          <div key={item.label} className="border border-line px-3 py-2.5">
            <p className="mono-label text-muted">{item.label}</p>
            <p className="mt-1 text-lg font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Drill() {
  const [tab, setTab] = useState<Tab>("review");
  const { stats, earStats } = useReview();

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-10 pt-6 sm:px-8 sm:pt-8 xl:px-12">
      <div className="border-b border-line pb-5">
        <p className="mono-label text-muted">DRILL / 强化</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="zh-display text-4xl sm:text-5xl">复习与听辨</h1>
            <p className="reading-column mt-3 max-w-[58ch] text-sm leading-relaxed text-muted">
              用主动回忆检查概念，用听辨训练把音程、和弦与调式听成可辨认的形状。复习状态保存在本地，可导出给 Agent。
            </p>
          </div>
          <div className="flex gap-4">
            <div>
              <p className="mono-label text-muted">DUE</p>
              <p className="text-xl font-semibold">{stats.due}</p>
            </div>
            <div>
              <p className="mono-label text-muted">LEARNED</p>
              <p className="text-xl font-semibold">{stats.learned}</p>
            </div>
            <div>
              <p className="mono-label text-muted">EAR</p>
              <p className="text-xl font-semibold">
                {earStats.attempts === 0 ? "—" : formatPercent(earStats.correct / earStats.attempts)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="mt-4 flex border border-line"
        role="tablist"
        aria-label="训练模式"
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          const nextTab: Tab = tab === "review" ? "ear" : "review";
          setTab(nextTab);
          const target = event.currentTarget.querySelector<HTMLElement>(
            `[data-tab="${nextTab}"]`,
          );
          target?.focus();
        }}
      >
        <button
          type="button"
          role="tab"
          data-tab="review"
          aria-selected={tab === "review"}
          tabIndex={tab === "review" ? 0 : -1}
          onClick={() => setTab("review")}
          className={`flex-1 px-4 py-3 text-left ${
            tab === "review" ? "bg-ink text-paper" : "bg-paper hover:bg-paper-2"
          }`}
        >
          <span className="mono-label block opacity-65">REVIEW</span>
          <span className="mt-1 block text-sm font-semibold">间隔复习 {stats.due > 0 ? `· ${stats.due} 到期` : ""}</span>
        </button>
        <button
          type="button"
          role="tab"
          data-tab="ear"
          aria-selected={tab === "ear"}
          tabIndex={tab === "ear" ? 0 : -1}
          onClick={() => setTab("ear")}
          className={`flex-1 border-l border-line px-4 py-3 text-left ${
            tab === "ear" ? "bg-ink text-paper" : "bg-paper hover:bg-paper-2"
          }`}
        >
          <span className="mono-label block opacity-65">EAR LAB</span>
          <span className="mt-1 block text-sm font-semibold">音程 / 和弦 / 调式</span>
        </button>
      </div>

      <div className="mt-5" role="tabpanel">
        {tab === "review" ? <ReviewStage /> : <EarStage />}
      </div>

      <div className="mt-7 border-t border-line pt-4">
        <div className="flex items-center justify-between gap-3">
          <p className="mono-label text-muted">SESSION / 本次进度</p>
          <Link to="/agent" className="mono-label text-cobalt-ink hover:text-ink">
            导出学习状态 →
          </Link>
        </div>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
          <ProgressBar value={stats.learned} max={stats.total} />
          <span className="mono-label text-muted">
            {stats.learned}/{stats.total} CONCEPTS IN QUEUE
          </span>
        </div>
      </div>
    </div>
  );
}
