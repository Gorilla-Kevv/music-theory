import { collectCitations } from "../src/content";
import type { Example } from "../src/content/types";
import { findFlExample, type RawFlNote } from "./fl-payload";

export type ArrangementRole = "bass" | "comp" | "pad" | "melody" | "arp";
export type CompPattern = "sustain" | "half" | "quarter" | "eighth";
export type BassPattern = "roots" | "root-fifth" | "pulse";

export interface ArrangementPartRequest {
  role: ArrangementRole;
  channel?: string | number;
  range?: [number, number];
  mode?: "append" | "replace";
  startBeat?: number;
  transpose?: number;
  velocity?: number;
  pattern?: CompPattern | BassPattern;
}

export interface ArrangementRequest {
  conceptSlug?: string;
  exampleId?: string;
  startBeat?: number;
  mode?: "append" | "replace";
  parts: ArrangementPartRequest[];
}

export interface ArrangementPart {
  role: ArrangementRole;
  channel?: string | number;
  mode: "append" | "replace";
  notes: RawFlNote[];
  noteCount: number;
  range: [number, number];
  preview: RawFlNote[];
}

export interface ArrangementPlan {
  exampleId: string;
  title: string;
  conceptSlug: string;
  conceptTitle: string;
  tempo: number;
  beats: number;
  timeSignature: [number, number];
  citations: Array<{ source: string; locator: string; note?: string }>;
  parts: ArrangementPart[];
}

const SOURCE_SHORT: Record<string, string> = {
  levine: "Levine",
  laitz: "Laitz",
  sposobin: "Sposobin",
  soundquest: "SoundQuest",
};

const DEFAULT_RANGES: Record<ArrangementRole, [number, number]> = {
  bass: [36, 48],
  comp: [48, 72],
  pad: [48, 76],
  melody: [60, 84],
  arp: [60, 84],
};

const DEFAULT_VELOCITY: Record<ArrangementRole, number> = {
  bass: 80,
  comp: 70,
  pad: 58,
  melody: 84,
  arp: 80,
};

interface Segment {
  beat: number;
  duration: number;
  midis: number[];
  label?: string;
}

interface RhythmHit {
  beat: number;
  duration: number;
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function uniqueSorted(values: number[]): number[] {
  return [...new Set(values)].sort((a, b) => a - b);
}

function fitToRange(midi: number, range: [number, number]): number {
  let value = midi;
  while (value < range[0]) value += 12;
  while (value > range[1]) value -= 12;
  return Math.max(0, Math.min(127, value));
}

function buildSegments(example: Example): Segment[] {
  const events = example.events
    .filter((event) => event.notes.length > 0)
    .slice()
    .sort((a, b) => a.beat - b.beat);
  return events.map((event, index) => {
    const nextBeat = events[index + 1]?.beat ?? example.beats;
    const duration = Math.max(
      0.25,
      Math.min(event.duration, nextBeat > event.beat ? nextBeat - event.beat : event.duration),
    );
    return {
      beat: event.beat,
      duration,
      midis: uniqueSorted(event.notes.map((note) => note.midi)),
      label: event.label,
    };
  });
}

function chooseVoicing(
  source: number[],
  range: [number, number],
  previous: number[] | null,
): number[] {
  const candidates = [-36, -24, -12, 0, 12, 24, 36].map((shift) =>
    source.map((midi) => midi + shift),
  );
  const fitting = candidates.filter((notes) =>
    notes.every((midi) => midi >= range[0] && midi <= range[1]),
  );
  const pool = fitting.length
    ? fitting
    : [source.map((midi) => fitToRange(midi, range))];
  const center = (range[0] + range[1]) / 2;
  let best = pool[0];
  let bestScore = Number.POSITIVE_INFINITY;
  for (const candidate of pool) {
    const centerPenalty = Math.abs(average(candidate) - center) * 0.4;
    const voicePenalty = previous
      ? average(candidate.map((midi) => Math.min(...previous.map((other) => Math.abs(midi - other)))))
      : 0;
    const score = centerPenalty + voicePenalty;
    if (score < bestScore) {
      best = candidate;
      bestScore = score;
    }
  }
  return uniqueSorted(best);
}

function rhythmHits(beat: number, duration: number, pattern: CompPattern): RhythmHit[] {
  if (pattern === "sustain") return [{ beat, duration }];
  const unit = pattern === "half" ? 2 : pattern === "quarter" ? 1 : 0.5;
  const hits: RhythmHit[] = [];
  for (let offset = 0; offset < duration - 1e-6; offset += unit) {
    hits.push({ beat: beat + offset, duration: Math.min(unit, duration - offset) });
  }
  return hits.length ? hits : [{ beat, duration }];
}

function bassNotes(segment: Segment, pattern: BassPattern): RhythmHit[] {
  if (pattern === "roots") return [{ beat: segment.beat, duration: segment.duration }];
  if (pattern === "pulse") return rhythmHits(segment.beat, segment.duration, "quarter");
  if (segment.duration < 2) return [{ beat: segment.beat, duration: segment.duration }];
  return [
    { beat: segment.beat, duration: segment.duration / 2 },
    { beat: segment.beat + segment.duration / 2, duration: segment.duration / 2 },
  ];
}

function guideToneNotes(
  segment: Segment,
  range: [number, number],
  previous: number | null,
  velocity: number,
): { notes: RawFlNote[]; last: number | null } {
  const tones = uniqueSorted(segment.midis.map((midi) => fitToRange(midi, range)));
  const count = Math.max(1, Math.round(segment.duration));
  const step = segment.duration / count;
  const notes: RawFlNote[] = [];
  let last = previous;
  for (let index = 0; index < count; index += 1) {
    let chosen = tones[0];
    if (last !== null) {
      const previousNote = last;
      chosen = tones.reduce((best, midi) =>
        Math.abs(midi - previousNote) < Math.abs(best - previousNote) ? midi : best,
      );
      if (chosen === previousNote && tones.length > 1) {
        const currentIndex = tones.indexOf(chosen);
        chosen = tones[(currentIndex + 1) % tones.length];
      }
    }
    notes.push({
      midi: chosen,
      beat: segment.beat + index * step,
      duration: Math.min(step, 1),
      velocity,
    });
    last = chosen;
  }
  return { notes, last };
}

function arpNotes(
  segment: Segment,
  range: [number, number],
  startIndex: number,
  velocity: number,
): { notes: RawFlNote[]; nextIndex: number } {
  const tones = uniqueSorted(segment.midis.map((midi) => fitToRange(midi, range)));
  const notes: RawFlNote[] = [];
  let index = startIndex;
  for (let offset = 0; offset < segment.duration - 1e-6; offset += 0.5) {
    notes.push({
      midi: tones[index % tones.length],
      beat: segment.beat + offset,
      duration: Math.min(0.5, segment.duration - offset),
      velocity,
    });
    index += 1;
  }
  if (notes.length === 0) {
    notes.push({
      midi: tones[index % tones.length],
      beat: segment.beat,
      duration: Math.min(0.5, segment.duration),
      velocity,
    });
    index += 1;
  }
  return { notes, nextIndex: index };
}

function partNotes(
  role: ArrangementRole,
  segments: Segment[],
  range: [number, number],
  pattern: string | undefined,
  velocity: number,
): RawFlNote[] {
  const notes: RawFlNote[] = [];
  if (role === "bass") {
    const bassPattern: BassPattern =
      pattern === "root-fifth" || pattern === "pulse" ? pattern : "roots";
    for (const segment of segments) {
      const root = fitToRange(Math.min(...segment.midis), range);
      const fifth = fitToRange(root + 7, range);
      const hits = bassNotes(segment, bassPattern);
      for (const [index, hit] of hits.entries()) {
        notes.push({
          midi: bassPattern === "root-fifth" && index === 1 ? fifth : root,
          beat: hit.beat,
          duration: hit.duration,
          velocity,
        });
      }
    }
    return notes;
  }

  if (role === "comp" || role === "pad") {
    const compPattern = (pattern === "half" || pattern === "quarter" || pattern === "eighth"
      ? pattern
      : "sustain") as CompPattern;
    let previous: number[] | null = null;
    for (const segment of segments) {
      const voicing = chooseVoicing(segment.midis, range, previous);
      for (const hit of rhythmHits(segment.beat, segment.duration, compPattern)) {
        for (const midi of voicing) {
          notes.push({ midi, beat: hit.beat, duration: hit.duration, velocity });
        }
      }
      previous = voicing;
    }
    return notes;
  }

  if (role === "melody") {
    let previous: number | null = null;
    for (const segment of segments) {
      const generated = guideToneNotes(segment, range, previous, velocity);
      notes.push(...generated.notes);
      previous = generated.last;
    }
    return notes;
  }

  let arpIndex = 0;
  for (const segment of segments) {
    const generated = arpNotes(segment, range, arpIndex, velocity);
    notes.push(...generated.notes);
    arpIndex = generated.nextIndex;
  }
  return notes;
}

export function buildArrangement(request: ArrangementRequest): ArrangementPlan {
  if (!Array.isArray(request.parts) || request.parts.length === 0) {
    throw new Error("需要 parts 数组，例如 [{ role: 'bass', channel: 6 }]。");
  }
  const found = findFlExample({
    conceptSlug: request.conceptSlug,
    exampleId: request.exampleId,
  });
  if (!found) throw new Error("找不到谱例；请提供有效的 conceptSlug 或 exampleId。");
  const { example, concept } = found;
  const segments = buildSegments(example);
  if (segments.length === 0) throw new Error("谱例没有可用的和弦/音符事件。");
  const globalStart = Number.isFinite(request.startBeat) ? Number(request.startBeat) : 0;
  const globalMode = request.mode === "append" ? "append" : "replace";

  const parts = request.parts.map((part) => {
    if (
      part.role !== "bass" &&
      part.role !== "comp" &&
      part.role !== "pad" &&
      part.role !== "melody" &&
      part.role !== "arp"
    ) {
      throw new Error(`未知声部角色：${String(part.role)}`);
    }
    const range = part.range ?? DEFAULT_RANGES[part.role];
    if (
      range.length !== 2 ||
      !Number.isFinite(range[0]) ||
      !Number.isFinite(range[1]) ||
      range[0] >= range[1]
    ) {
      throw new Error(`range 必须是 [低, 高]：${JSON.stringify(part.range)}`);
    }
    const velocity = Math.max(
      1,
      Math.min(100, Number(part.velocity ?? DEFAULT_VELOCITY[part.role])),
    );
    const transpose = Number(part.transpose ?? 0);
    if (!Number.isFinite(transpose)) throw new Error("transpose 必须是数字。");
    const generated = partNotes(part.role, segments, range, part.pattern, velocity);
    const startBeat = globalStart + (Number.isFinite(part.startBeat) ? Number(part.startBeat) : 0);
    const notes = generated.map((note) => ({
      ...note,
      beat: note.beat + startBeat,
      midi: note.midi + Math.round(transpose),
    }));
    if (notes.some((note) => note.midi < 0 || note.midi > 127)) {
      throw new Error(`${part.role} 移调后超出 MIDI 0–127。`);
    }
    return {
      role: part.role,
      channel: part.channel,
      mode: part.mode === "append" ? "append" : globalMode,
      notes,
      noteCount: notes.length,
      range,
      preview: notes.slice(0, 8),
    } satisfies ArrangementPart;
  });

  return {
    exampleId: example.id,
    title: example.title,
    conceptSlug: concept.slug,
    conceptTitle: concept.title,
    tempo: example.tempo,
    beats: example.beats,
    timeSignature: example.timeSignature ?? [4, 4],
    citations: collectCitations(concept).map(({ ref }) => ({
      source: SOURCE_SHORT[ref.source] ?? ref.source,
      locator: ref.locator,
      ...(ref.note ? { note: ref.note } : {}),
    })),
    parts,
  };
}
