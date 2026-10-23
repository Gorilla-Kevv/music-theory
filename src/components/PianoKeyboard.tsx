import { useLayoutEffect, useMemo, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { noteNameFromMidi } from "../lib/theory";

const START = 48;
const END = 72;
const WHITE_PITCH_CLASSES = new Set([0, 2, 4, 5, 7, 9, 11]);
const WHITE_COUNT = 15;

interface PianoKeyboardProps {
  activeNotes?: number[];
  onNote?: (midi: number) => void;
  onNotePress?: (midi: number, pressed: boolean) => void;
  compact?: boolean;
  className?: string;
}

export function PianoKeyboard({
  activeNotes = [],
  onNote,
  onNotePress,
  compact = false,
  className = "",
}: PianoKeyboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [availableWidth, setAvailableWidth] = useState(0);
  const onNotePressRef = useRef(onNotePress);

  useLayoutEffect(() => {
    onNotePressRef.current = onNotePress;
  }, [onNotePress]);

  const pressHandlers = (midi: number) => ({
    onClick: (event: MouseEvent) => {
      // 键盘激活（Enter/Space）走一次性试听；指针按下由 onPointerDown 长按处理。
      if (event.detail === 0) onNote?.(midi);
    },
    onPointerDown: (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      onNotePressRef.current?.(midi, true);
    },
    onPointerUp: () => onNotePressRef.current?.(midi, false),
    onPointerCancel: () => onNotePressRef.current?.(midi, false),
    onPointerLeave: () => onNotePressRef.current?.(midi, false),
    onContextMenu: (event: MouseEvent) => event.preventDefault(),
  });

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const measure = () => setAvailableWidth(element.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const whiteWidth = availableWidth
    ? Math.max(16, Math.min(40, Math.floor((availableWidth - 4) / WHITE_COUNT)))
    : compact
      ? 21
      : 34;
  const blackWidth = Math.max(10, Math.round(whiteWidth * 0.62));

  const { whiteKeys, blackKeys, width } = useMemo(() => {
    const whites: Array<{ midi: number }> = [];
    const blacks: Array<{ midi: number; left: number }> = [];
    let whiteIndex = 0;
    for (let midi = START; midi <= END; midi += 1) {
      const pitchClass = ((midi % 12) + 12) % 12;
      if (WHITE_PITCH_CLASSES.has(pitchClass)) {
        whites.push({ midi });
        whiteIndex += 1;
      } else {
        blacks.push({ midi, left: whiteIndex * whiteWidth - blackWidth / 2 });
      }
    }
    return {
      whiteKeys: whites,
      blackKeys: blacks,
      width: whiteIndex * whiteWidth,
    };
  }, [whiteWidth, blackWidth]);

  return (
    <div
      ref={containerRef}
      className={`min-w-0 w-full max-w-full overflow-x-auto pb-1 ${className}`}
    >
      <div className="relative mx-auto" style={{ width, minWidth: width }}>
        <div className="flex">
          {whiteKeys.map(({ midi }) => {
            const active = activeNotes.includes(midi);
            const name = noteNameFromMidi(midi);
            const isC = midi % 12 === 0;
            return (
              <button
                key={midi}
                type="button"
                {...pressHandlers(midi)}
                aria-label={`播放 ${name}`}
                aria-pressed={active}
                className={`border-r border-b-2 border-ink/55 text-[10px] transition-colors select-none touch-none ${
                  active
                    ? "bg-cobalt text-paper"
                    : "bg-[#fbfaf3] text-ink/70 hover:bg-paper-2"
                } ${compact ? "h-[74px]" : "h-[92px]"}`}
                style={{ width: whiteWidth }}
              >
                <span className="mono-label pointer-events-none flex h-full items-end justify-center pb-1.5">
                  {isC ? name : ""}
                </span>
              </button>
            );
          })}
        </div>
        {blackKeys.map(({ midi, left }) => {
          const active = activeNotes.includes(midi);
          const name = noteNameFromMidi(midi);
          return (
            <button
              key={midi}
              type="button"
              {...pressHandlers(midi)}
              aria-label={`播放 ${name}`}
              aria-pressed={active}
              className={`absolute top-0 z-10 border border-ink/60 transition-colors select-none touch-none ${
                active ? "bg-cadmium" : "bg-ink hover:bg-ink-3"
              }`}
              style={{
                left,
                width: blackWidth,
                height: compact ? 48 : 58,
              }}
            >
              <span className="sr-only">{name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
