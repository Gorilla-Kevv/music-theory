import { useLayoutEffect, useRef, useState } from "react";
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
import type { Example } from "../content/types";
import { buildMeasures, durationToVex, toVexKey } from "../lib/theory";

const ROW_HEIGHT = 150;

function choosePerRow(count: number, maxPerRow: number): number {
  if (count <= maxPerRow) return count;
  for (let candidate = maxPerRow; candidate >= 2; candidate -= 1) {
    if (count % candidate === 0) return candidate;
  }
  return maxPerRow;
}

export function StaffNotation({
  example,
  className = "",
  measuresPerRow,
}: {
  example: Example;
  className?: string;
  measuresPerRow?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

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
      });
    });
  }, [example, width, measuresPerRow]);

  return (
    <div
      ref={containerRef}
      className={`staff w-full ${className}`}
      role="img"
      aria-label={`五线谱：${example.title}`}
    />
  );
}
