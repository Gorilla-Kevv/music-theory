import { Activity, Play, Repeat2, Square } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTransport } from "../context/TransportContext";
import { ProgressBar } from "./ui";

function formatClock(beats: number, tempo: number): string {
  const seconds = Math.max(0, beats) * (60 / tempo);
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60);
  return `${minutes}:${rest.toString().padStart(2, "0")}`;
}

export function TransportDock() {
  const { state, replay, stop, setTempo, toggleLoop } = useTransport();
  const location = useLocation();
  const hasCurrent = Boolean(state.title);
  const tempo = state.tempo || 84;

  // 体系图整页是地图画布；没有正在试听的内容时不占用底部空间。
  if (location.pathname === "/atlas" && !hasCurrent) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line-dark bg-ink text-paper">
      <div className="mx-auto flex h-[68px] max-w-[1600px] items-center gap-3 px-3 sm:h-[72px] sm:gap-4 sm:px-5">
        <button
          type="button"
          onClick={state.isPlaying ? stop : replay}
          disabled={!hasCurrent}
          aria-label={state.isPlaying ? "停止试听" : "重新播放当前谱例"}
          className={`inline-flex h-11 w-11 shrink-0 items-center justify-center transition-colors ${
            state.isPlaying
              ? "bg-cadmium text-ink hover:bg-acid"
              : "border border-paper/50 text-paper hover:border-acid hover:text-acid disabled:cursor-not-allowed disabled:opacity-35"
          }`}
        >
          {state.isPlaying ? <Square size={17} /> : <Play size={17} />}
        </button>

        <div className="min-w-0 flex-1">
          {hasCurrent ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="mono-label shrink-0 text-acid">AUDITION</span>
                {state.conceptSlug ? (
                  <Link
                    to={`/theory/${state.conceptSlug}`}
                    className="truncate text-xs font-semibold hover:text-acid sm:text-sm"
                  >
                    {state.title}
                  </Link>
                ) : (
                  <span className="truncate text-xs font-semibold sm:text-sm">{state.title}</span>
                )}
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <ProgressBar value={state.position} max={state.duration} dark className="max-w-xl" />
                <span className="mono-label hidden shrink-0 text-paper/65 sm:inline">
                  {formatClock(state.position, tempo)} / {formatClock(state.duration, tempo)}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-acid" aria-hidden />
                <span className="mono-label text-paper/65">AUDITION DOCK</span>
              </div>
              <p className="mt-1 truncate text-xs text-paper/65 sm:text-sm">
                播放任意谱例后，可在这里持续试听。
                <span className="hidden sm:inline"> ⌘K 检索概念。</span>
              </p>
            </>
          )}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <span className="mono-label text-paper/65">TEMPO</span>
          <input
            type="range"
            min={40}
            max={220}
            step={1}
            value={tempo}
            onChange={(event) => setTempo(Number(event.target.value))}
            aria-label="播放速度 BPM"
            className="h-1 w-24 cursor-pointer accent-[var(--color-acid)]"
          />
          <span className="mono-label w-9 text-right text-paper/80">{tempo}</span>
        </div>

        <button
          type="button"
          onClick={toggleLoop}
          aria-pressed={state.loop}
          aria-label="循环播放"
          className={`mono-label inline-flex h-9 items-center gap-1.5 px-2 transition-colors ${
            state.loop
              ? "border border-acid text-acid"
              : "border border-paper/40 text-paper/65 hover:border-paper/65 hover:text-paper"
          }`}
        >
          <Repeat2 size={13} aria-hidden />
          <span className="hidden sm:inline">LOOP</span>
        </button>

        <span className="mono-label hidden shrink-0 text-paper/65 lg:inline">
          {state.isPlaying ? "PLAYING" : hasCurrent ? "READY" : "LOCAL"}
        </span>
      </div>
    </div>
  );
}
