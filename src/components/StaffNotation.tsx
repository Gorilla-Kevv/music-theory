import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Accidental,
  Annotation,
  Dot,
  Formatter,
  Renderer,
  Stave,
  StaveNote,
  Voice,
} from "vexflow";
import type { Example, ExampleEvent } from "../content/types";
import { buildMeasures, durationToVex, toVexKey } from "../lib/theory";

const ROW_HEIGHT = 150;

function choosePerRow(count: number, maxPerRow: number): number {
  if (count <= maxPerRow) return count;
  for (let candidate = maxPerRow; candidate >= 2; candidate -= 1) {
    if (count % candidate === 0) return candidate;
  }
  return maxPerRow;
}

interface HitArea {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  event: ExampleEvent;
}

export function StaffNotation({
  example,
  className = "",
  measuresPerRow,
  onEventPlay,
  onEventPress,
}: {
  example: Example;
  className?: string;
  measuresPerRow?: number;
  onEventPlay?: (event: ExampleEvent) => void;
  onEventPress?: (event: ExampleEvent, pressed: boolean) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hitAreas, setHitAreas] = useState<HitArea[]>([]);
  const [pressedId, setPressedId] = useState<string | null>(null);
  const onEventPlayRef = useRef(onEventPlay);
  const onEventPressRef = useRef(onEventPress);

  useEffect(() => {
    onEventPlayRef.current = onEventPlay;
  }, [onEventPlay]);

  useEffect(() => {
    onEventPressRef.current = onEventPress;
  }, [onEventPress]);

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const measure = () => setWidth(element.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || width < 240) return;
    container.innerHTML = "";

    const measures = buildMeasures(example);
    const maxPerRow = width >= 860 ? 4 : width >= 520 ? 3 : width >= 300 ? 2 : 1;
    const perRow = measuresPerRow
      ? Math.max(1, Math.min(width < 300 ? 2 : measuresPerRow, measures.length))
      : choosePerRow(measures.length, maxPerRow);
    const rows: typeof measures[] = [];
    for (let index = 0; index < measures.length; index += perRow) {
      rows.push(measures.slice(index, index + perRow));
    }
    const nextHitAreas: HitArea[] = [];
    let eventIndex = 0;

    const clef = example.clef ?? "treble";
    const key = example.key ?? "C";
    const [numerator, denominator] = example.timeSignature ?? [4, 4];

    rows.forEach((row, rowIndex) => {
      const renderer = new Renderer(container, Renderer.Backends.SVG);
      renderer.resize(width, ROW_HEIGHT);
      const context = renderer.getContext();
      const measureWidth = width / row.length;

      row.forEach((items, measureIndex) => {
        const stave = new Stave(measureIndex * measureWidth, 18, measureWidth);
        if (measureIndex === 0) {
          stave.addClef(clef);
          stave.addKeySignature(key);
          if (rowIndex === 0) stave.addTimeSignature(`${numerator}/${denominator}`);
        }
        stave.setContext(context).draw();

        const notes: StaveNote[] = [];
        const rendered: Array<{ note: StaveNote; event?: ExampleEvent }> = [];
        for (const item of items) {
          if (item.kind === "rest") {
            const { code, dots } = durationToVex(item.beats);
            const rest = new StaveNote({
              keys: [clef === "bass" ? "d/3" : "b/4"],
              duration: `${code}r`,
              clef,
            });
            if (dots > 0) Dot.buildAndAttach([rest], { all: true });
            notes.push(rest);
            rendered.push({ note: rest });
            continue;
          }

          const { event } = item;
          const { code, dots } = durationToVex(event.duration);
          const keyInfos = event.notes.map((note) => toVexKey(note.spelling));
          const note = new StaveNote({
            keys: keyInfos.map((info) => info.key),
            duration: code,
            clef,
            auto_stem: true,
          });

          keyInfos.forEach((info, index) => {
            if (info.accidental) {
              note.addModifier(new Accidental(info.accidental), index);
            }
          });
          if (dots > 0) Dot.buildAndAttach([note], { all: true });
          if (event.label) {
            const annotation = new Annotation(event.label)
              .setFont("Segoe UI", 10, "normal")
              .setVerticalJustification(Annotation.VerticalJustify.TOP);
            note.addModifier(annotation, 0);
          }
          notes.push(note);
          rendered.push({ note, event });
        }

        const voice = new Voice({ num_beats: numerator, beat_value: denominator });
        voice.setStrict(false);
        voice.addTickables(notes);
        const formatterWidth = Math.max(
          36,
          measureWidth - (measureIndex === 0 ? 56 : 24),
        );
        new Formatter()
          .joinVoices([voice])
          .format([voice], formatterWidth);
        voice.draw(context, stave);

        for (const item of rendered) {
          if (!item.event) continue;
          const box = item.note.getBoundingBox();
          if (!box) continue;
          const label =
            item.event.label ??
            item.event.notes.map((note) => note.spelling.replace(/(-?\d)$/, "")).join(" / ");
          nextHitAreas.push({
            id: `${item.event.beat}-${eventIndex}`,
            x: Math.max(0, box.getX() - 5),
            y: Math.max(0, box.getY() + rowIndex * ROW_HEIGHT - 5),
            w: Math.max(26, box.getW() + 10),
            h: Math.max(38, box.getH() + 10),
            label,
            event: item.event,
          });
          eventIndex += 1;
        }
      });
    });
    setHitAreas(nextHitAreas);
  }, [example, width, measuresPerRow]);

  return (
    <div className={`relative min-w-0 ${className}`} role="group" aria-label={`五线谱：${example.title}`}>
      <div ref={containerRef} className="staff w-full" aria-hidden="true" />
      {onEventPlay || onEventPress
        ? hitAreas.map((area) => (
            <button
              key={area.id}
              type="button"
              onClick={(event) => {
                // 键盘激活（Enter/Space）的 click 没有 detail，走一次性试听；
                // 指针按下已由 onPointerDown 处理为长按，这里跳过避免重复发声。
                if (event.detail === 0) onEventPlayRef.current?.(area.event);
              }}
              onPointerDown={(event) => {
                if (event.pointerType === "mouse" && event.button !== 0) return;
                setPressedId(area.id);
                onEventPressRef.current?.(area.event, true);
              }}
              onPointerUp={() => {
                setPressedId(null);
                onEventPressRef.current?.(area.event, false);
              }}
              onPointerCancel={() => {
                setPressedId(null);
                onEventPressRef.current?.(area.event, false);
              }}
              onPointerLeave={() => {
                setPressedId(null);
                onEventPressRef.current?.(area.event, false);
              }}
              onContextMenu={(event) => event.preventDefault()}
              aria-label={`播放 ${area.label}`}
              title={`点击试听，按住可持续发声：${area.label}`}
              className={`absolute z-10 cursor-pointer select-none touch-none border border-transparent transition-colors focus-visible:border-cobalt focus-visible:bg-cobalt/10 ${
                pressedId === area.id
                  ? "border-cobalt bg-cobalt/10"
                  : "hover:border-cobalt hover:bg-cobalt/10"
              }`}
              style={{ left: area.x, top: area.y, width: area.w, height: area.h }}
            />
          ))
        : null}
    </div>
  );
}
