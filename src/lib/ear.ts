import { note } from "../content/helpers";
import type { Example } from "../content/types";
import { noteNameFromMidi } from "./theory";
import { readStorage, writeStorage } from "./storage";

export type EarMode = "interval" | "chord" | "scale";

export interface EarQuestion {
  id: string;
  mode: EarMode;
  prompt: string;
  answer: string;
  options: string[];
  example: Example;
}

export interface EarStats {
  attempts: number;
  correct: number;
  byMode: Record<EarMode, { attempts: number; correct: number }>;
}

const STORAGE_KEY = "ear.v1";

export function loadEarStats(): EarStats {
  return readStorage<EarStats>(STORAGE_KEY, {
    attempts: 0,
    correct: 0,
    byMode: {
      interval: { attempts: 0, correct: 0 },
      chord: { attempts: 0, correct: 0 },
      scale: { attempts: 0, correct: 0 },
    },
  });
}

export function saveEarStats(stats: EarStats): void {
  writeStorage(STORAGE_KEY, stats);
}

export function recordEarAnswer(
  stats: EarStats,
  mode: EarMode,
  correct: boolean,
): EarStats {
  return {
    attempts: stats.attempts + 1,
    correct: stats.correct + (correct ? 1 : 0),
    byMode: {
      ...stats.byMode,
      [mode]: {
        attempts: stats.byMode[mode].attempts + 1,
        correct: stats.byMode[mode].correct + (correct ? 1 : 0),
      },
    },
  };
}

const INTERVALS: Array<{ label: string; semitones: number }> = [
  { label: "小二度 (m2)", semitones: 1 },
  { label: "大二度 (M2)", semitones: 2 },
  { label: "小三度 (m3)", semitones: 3 },
  { label: "大三度 (M3)", semitones: 4 },
  { label: "纯四度 (P4)", semitones: 5 },
  { label: "三全音 (TT)", semitones: 6 },
  { label: "纯五度 (P5)", semitones: 7 },
  { label: "小六度 (m6)", semitones: 8 },
  { label: "大六度 (M6)", semitones: 9 },
  { label: "小七度 (m7)", semitones: 10 },
  { label: "大七度 (M7)", semitones: 11 },
  { label: "纯八度 (P8)", semitones: 12 },
];

const CHORDS: Array<{ label: string; intervals: number[]; quality: string }> = [
  { label: "大三和弦 (maj)", intervals: [0, 4, 7], quality: "maj" },
  { label: "小三和弦 (min)", intervals: [0, 3, 7], quality: "min" },
  { label: "减三和弦 (dim)", intervals: [0, 3, 6], quality: "dim" },
  { label: "增三和弦 (aug)", intervals: [0, 4, 8], quality: "aug" },
  { label: "大七和弦 (maj7)", intervals: [0, 4, 7, 11], quality: "maj7" },
  { label: "小七和弦 (m7)", intervals: [0, 3, 7, 10], quality: "m7" },
  { label: "属七和弦 (7)", intervals: [0, 4, 7, 10], quality: "7" },
  { label: "半减七和弦 (m7b5)", intervals: [0, 3, 6, 10], quality: "m7b5" },
  { label: "减七和弦 (dim7)", intervals: [0, 3, 6, 9], quality: "dim7" },
];

const SCALES: Array<{ label: string; pattern: number[] }> = [
  { label: "大调 (Major)", pattern: [0, 2, 4, 5, 7, 9, 11, 12] },
  { label: "自然小调 (Natural minor)", pattern: [0, 2, 3, 5, 7, 8, 10, 12] },
  { label: "多利亚 (Dorian)", pattern: [0, 2, 3, 5, 7, 9, 10, 12] },
  { label: "混合利底亚 (Mixolydian)", pattern: [0, 2, 4, 5, 7, 9, 10, 12] },
  { label: "利底亚 (Lydian)", pattern: [0, 2, 4, 6, 7, 9, 11, 12] },
  { label: "弗里几亚 (Phrygian)", pattern: [0, 1, 3, 5, 7, 8, 10, 12] },
];

function pick<T>(items: T[], avoid?: T): T {
  const pool = avoid && items.length > 1 ? items.filter((item) => item !== avoid) : items;
  return pool[Math.floor(Math.random() * pool.length)];
}

function optionsFor(correct: string, all: string[]): string[] {
  const wrong = all.filter((answer) => answer !== correct).sort(() => Math.random() - 0.5);
  return [correct, ...wrong.slice(0, 3)].sort(() => Math.random() - 0.5);
}

function midiNote(midi: number) {
  return note(noteNameFromMidi(midi));
}

export function generateEarQuestion(
  mode: EarMode,
  previousAnswer?: string,
): EarQuestion {
  const id = `${mode}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  if (mode === "interval") {
    const interval = pick(INTERVALS, previousAnswer ? INTERVALS.find((item) => item.label === previousAnswer) : undefined);
    const root = 50 + Math.floor(Math.random() * 12);
    const top = root + interval.semitones;
    const example: Example = {
      id,
      title: "音程听辨",
      caption: "",
      kind: "melody",
      tempo: 80,
      beats: 3,
      events: [
        { beat: 0, duration: 1.1, notes: [midiNote(root)] },
        { beat: 1.2, duration: 1.8, notes: [midiNote(top)] },
      ],
    };
    return {
      id,
      mode,
      prompt: "听两个音，判断音程性质。",
      answer: interval.label,
      options: optionsFor(interval.label, INTERVALS.map((item) => item.label)),
      example,
    };
  }

  if (mode === "chord") {
    const chord = pick(CHORDS, previousAnswer ? CHORDS.find((item) => item.label === previousAnswer) : undefined);
    const root = 48 + Math.floor(Math.random() * 8);
    const example: Example = {
      id,
      title: "和弦性质听辨",
      caption: "",
      kind: "chord",
      tempo: 72,
      beats: 3,
      events: [
        {
          beat: 0,
          duration: 3,
          notes: chord.intervals.map((interval) => midiNote(root + interval)),
        },
      ],
    };
    return {
      id,
      mode,
      prompt: "听和弦，判断它的性质。",
      answer: chord.label,
      options: optionsFor(chord.label, CHORDS.map((item) => item.label)),
      example,
    };
  }

  const scale = pick(SCALES, previousAnswer ? SCALES.find((item) => item.label === previousAnswer) : undefined);
  const root = 48 + Math.floor(Math.random() * 7);
  const example: Example = {
    id,
    title: "调式听辨",
    caption: "",
    kind: "scale",
    tempo: 88,
    beats: 4,
    events: scale.pattern.map((interval, index) => ({
      beat: index * 0.5,
      duration: 0.5,
      notes: [midiNote(root + interval)],
    })),
  };
  return {
    id,
    mode,
    prompt: "听音阶，判断调式。",
    answer: scale.label,
    options: optionsFor(scale.label, SCALES.map((item) => item.label)),
    example,
  };
}
