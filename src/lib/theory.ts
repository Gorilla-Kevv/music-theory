import type { Example, ExampleEvent } from "../content/types";

export interface VexKeyInfo {
  key: string;
  accidental?: "#" | "b" | "##" | "bb";
}

export function toVexKey(spelling: string): VexKeyInfo {
  const match = /^([A-Ga-g])(#{1,2}|b{1,2})?(-?\d)$/.exec(spelling.trim());
  if (!match) throw new Error(`Invalid spelling: ${spelling}`);
  const [, letter, accidental, octave] = match;
  return {
    key: `${letter.toLowerCase()}/${octave}`,
    ...(accidental ? { accidental: accidental as VexKeyInfo["accidental"] } : {}),
  };
}

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export interface VexDuration {
  code: string;
  dots: number;
}

const DURATION_MAP: Array<[number, string, number]> = [
  [4, "w", 0],
  [3, "h", 1],
  [2, "h", 0],
  [1.5, "q", 1],
  [1, "q", 0],
  [0.75, "8", 1],
  [0.5, "8", 0],
  [0.25, "16", 0],
];

export function durationToVex(beats: number): VexDuration {
  const match = DURATION_MAP.find(([value]) => Math.abs(value - beats) < 0.001);
  if (!match) {
    return { code: "q", dots: 0 };
  }
  return { code: match[1], dots: match[2] };
}

export type MeasureItem =
  | { kind: "event"; event: ExampleEvent }
  | { kind: "rest"; beats: number };

export function buildMeasures(example: Example): MeasureItem[][] {
  const [numerator, denominator] = example.timeSignature ?? [4, 4];
  const beatsPerMeasure = numerator * (4 / denominator);
  const totalBeats = Math.max(example.beats, ...example.events.map((e) => e.beat + e.duration));
  const measureCount = Math.max(1, Math.ceil(totalBeats / beatsPerMeasure));
  const events = [...example.events].sort((a, b) => a.beat - b.beat);

  return Array.from({ length: measureCount }, (_, index) => {
    const start = index * beatsPerMeasure;
    const end = start + beatsPerMeasure;
    const items: MeasureItem[] = [];
    let cursor = start;
    for (const event of events) {
      if (event.beat < start || event.beat >= end) continue;
      if (event.beat > cursor + 0.001) {
        items.push({ kind: "rest", beats: event.beat - cursor });
      }
      items.push({ kind: "event", event });
      cursor = Math.max(cursor, event.beat + event.duration);
    }
    if (cursor < end - 0.001) {
      items.push({ kind: "rest", beats: end - cursor });
    }
    return items;
  });
}

export function activeNotesAt(example: Example, beat: number): number[] {
  return example.events
    .filter((event) => beat >= event.beat - 0.001 && beat < event.beat + event.duration - 0.001)
    .flatMap((event) => event.notes.map((note) => note.midi));
}

export function noteNameFromMidi(midi: number): string {
  const names = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
  const octave = Math.floor(midi / 12) - 1;
  return `${names[((midi % 12) + 12) % 12]}${octave}`;
}

export function uniqueSorted(values: number[]): number[] {
  return [...new Set(values)].sort((a, b) => a - b);
}
