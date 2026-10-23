import { Pause, Play, Square } from "lucide-react";
import type { ReactNode } from "react";
import type { CategoryId } from "../content/types";
import { getCategory } from "../content";
import { CATEGORY_STYLES, LEVEL_STYLES } from "./category";

export function CategoryTag({
  category,
  variant = "solid",
  className = "",
}: {
  category: CategoryId;
  variant?: "solid" | "soft" | "dot";
  className?: string;
}) {
  const categoryMeta = getCategory(category);
  const style = CATEGORY_STYLES[category];
  if (variant === "dot") {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        <span className={`h-2 w-2 ${style.dot}`} aria-hidden />
        <span className="mono-label text-ink/60">{categoryMeta?.nameEn}</span>
      </span>
    );
  }
  return (
    <span
      className={`mono-label inline-flex px-2 py-1 ${
        variant === "solid" ? style.solid : style.soft
      } ${className}`}
    >
      {categoryMeta?.name ?? category}
    </span>
  );
}

export function LevelTag({ level, className = "" }: { level: string; className?: string }) {
  return (
    <span
      className={`mono-label inline-flex border px-2 py-1 ${LEVEL_STYLES[level] ?? "border-ink/25 text-ink/70"} ${className}`}
    >
      {level}
    </span>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="mono-label inline-flex min-w-6 items-center justify-center border border-current/25 px-1.5 py-0.5 text-[0.625rem]">
      {children}
    </kbd>
  );
}

export function PlayControl({
  playing,
  onClick,
  label,
  tone = "cadmium",
  size = "md",
}: {
  playing: boolean;
  onClick: () => void;
  label: string;
  tone?: "cadmium" | "cobalt" | "paper";
  size?: "sm" | "md" | "lg";
}) {
  const tones = {
    cadmium: "bg-cadmium text-ink hover:bg-ink hover:text-paper",
    cobalt: "bg-cobalt text-paper hover:bg-cobalt-ink",
    paper: "bg-paper text-ink hover:bg-ink hover:text-paper",
  };
  const sizes = {
    sm: "h-9 w-9",
    md: "h-11 w-11",
    lg: "h-14 w-14",
  };
  const Icon = playing ? Square : Play;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`inline-flex shrink-0 items-center justify-center transition-colors ${tones[tone]} ${sizes[size]}`}
    >
      <Icon size={size === "lg" ? 22 : size === "md" ? 18 : 15} strokeWidth={2.2} />
    </button>
  );
}

export function ProgressBar({
  value,
  max,
  dark = false,
  className = "",
}: {
  value: number;
  max: number;
  dark?: boolean;
  className?: string;
}) {
  const percent = max <= 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      className={`h-[3px] w-full ${dark ? "bg-paper/20" : "bg-ink/15"} ${className}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={Math.round(max)}
      aria-valuenow={Math.round(value)}
    >
      <div
        className={`h-full ${dark ? "bg-acid" : "bg-cobalt"}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="border border-line bg-paper px-6 py-10">
      <p className="mono-label text-muted">EMPTY / 0</p>
      <h3 className="mt-3 text-xl font-semibold">{title}</h3>
      <p className="mt-2 max-w-[46ch] text-sm text-muted">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function AuditionHint({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${dark ? "text-paper/60" : "text-muted"}`}>
      <Pause size={12} aria-hidden />
      <span className="mono-label">AUDIO ON DEMAND</span>
    </span>
  );
}
