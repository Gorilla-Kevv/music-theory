import type { Example, ExampleEvent, NoteSpec } from "./types";

const PITCH_CLASS: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

/** Parse a spelled note such as C4, Eb3, F#5, Bbb4 into MIDI + spelling. */
export function note(spelling: string): NoteSpec {
  const match = /^([A-Ga-g])(#{1,2}|b{1,2})?(-?\d)$/.exec(spelling.trim());
  if (!match) throw new Error(`Invalid note spelling: ${spelling}`);
  const [, letter, accidental = "", octaveText] = match;
  const octave = Number(octaveText);
  const accidentalOffset = [...accidental].reduce(
    (sum, char) => sum + (char === "#" ? 1 : -1),
    0,
  );
  const midi = (octave + 1) * 12 + PITCH_CLASS[letter.toUpperCase()] + accidentalOffset;
  return { midi, spelling };
}

type EventOptions = { label?: string };

export function chord(
  beat: number,
  duration: number,
  notes: string[],
  options: EventOptions = {},
): ExampleEvent {
  return { beat, duration, notes: notes.map(note), ...options };
}

export function melody(
  beat: number,
  duration: number,
  spelling: string,
  options: EventOptions = {},
): ExampleEvent {
  return { beat, duration, notes: [note(spelling)], ...options };
}

export function line(
  startBeat: number,
  step: number,
  duration: number,
  spellings: string[],
): ExampleEvent[] {
  return spellings.map((spelling, index) =>
    melody(startBeat + index * step, duration, spelling),
  );
}

export function example(
  data: Omit<Example, "events"> & { events: ExampleEvent[] },
): Example {
  const beats = data.beats ?? Math.max(...data.events.map((e) => e.beat + e.duration));
  return { ...data, beats };
}

export const CATEGORY_TOKEN: Record<string, string> = {
  foundations: "cobalt",
  harmony: "cadmium",
  jazz: "acid",
};
