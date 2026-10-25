import {
  ALL_EXAMPLES,
  CONCEPT_BY_SLUG,
  collectCitations,
  getConcept,
} from "../src/content";
import type { Concept, Example, SourceId } from "../src/content/types";

const SOURCE_SHORT: Record<SourceId, string> = {
  levine: "Levine",
  laitz: "Laitz",
  sposobin: "Sposobin",
  soundquest: "SoundQuest",
};

export interface FlNote {
  midi: number;
  beat: number;
  duration: number;
  velocity: number;
}

export interface FlPayload {
  exampleId: string;
  title: string;
  conceptSlug: string;
  conceptTitle: string;
  tempo: number;
  timeSignature: [number, number];
  notes: FlNote[];
  citations: Array<{ source: string; locator: string; note?: string }>;
}

export interface PayloadOptions {
  exampleId?: string;
  conceptSlug?: string;
  startBeat?: number;
  velocity?: number;
}

export type ApplyMode = "append" | "replace";

function findExample(options: PayloadOptions): { example: Example; concept: Concept } | null {
  if (options.exampleId) {
    const example = ALL_EXAMPLES.find((item) => item.id === options.exampleId);
    if (!example) return null;
    const concept = CONCEPT_BY_SLUG[example.conceptSlug];
    return concept ? { example, concept } : null;
  }
  if (options.conceptSlug) {
    const concept = getConcept(options.conceptSlug);
    if (!concept || concept.examples.length === 0) return null;
    return { example: concept.examples[0], concept };
  }
  return null;
}

export function getFlPayload(options: PayloadOptions): FlPayload | null {
  const found = findExample(options);
  if (!found) return null;
  const { example, concept } = found;
  const startBeat = Number.isFinite(options.startBeat) ? Number(options.startBeat) : 0;
  const velocity = Math.max(
    1,
    Math.min(100, Number.isFinite(options.velocity) ? Number(options.velocity) : 85),
  );
  const notes: FlNote[] = example.events.flatMap((event) =>
    event.notes.map((note) => ({
      midi: note.midi,
      beat: startBeat + event.beat,
      duration: Math.max(0.0625, event.duration),
      velocity,
    })),
  );
  const citations = collectCitations(concept).map(({ ref }) => ({
    source: SOURCE_SHORT[ref.source],
    locator: ref.locator,
    ...(ref.note ? { note: ref.note } : {}),
  }));
  return {
    exampleId: example.id,
    title: example.title,
    conceptSlug: concept.slug,
    conceptTitle: concept.title,
    tempo: example.tempo,
    timeSignature: example.timeSignature ?? [4, 4],
    notes,
    citations,
  };
}

export function listFlExamples(conceptSlug?: string) {
  const examples = conceptSlug
    ? (getConcept(conceptSlug)?.examples ?? []).map((example) => ({
        example,
        conceptSlug,
      }))
    : ALL_EXAMPLES.map((example) => ({
        example,
        conceptSlug: example.conceptSlug,
      }));
  return examples.map(({ example, conceptSlug: slug }) => ({
    id: example.id,
    title: example.title,
    conceptSlug: slug,
    conceptTitle: CONCEPT_BY_SLUG[slug]?.title ?? slug,
    tempo: example.tempo,
    beats: example.beats,
    noteCount: example.events.reduce((sum, event) => sum + event.notes.length, 0),
  }));
}

function escapePythonString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n");
}

/**
 * FL Studio 2026 的 run_piano_roll_script 接受完整 Python 源码；
 * 只使用内置 flpianoroll 模块，不依赖外部包。
 */
export function makePianoRollScript(payload: FlPayload, mode: ApplyMode = "append"): string {
  const notes = payload.notes
    .map(
      (note) =>
        `    (${note.midi}, ${note.beat.toFixed(4)}, ${note.duration.toFixed(4)}, ${note.velocity}),`,
    )
    .join("\n");
  const header = `# TONIC · ${escapePythonString(payload.conceptTitle)} / ${escapePythonString(payload.title)}`;
  const clear = mode === "replace" ? "score.clearNotes()\n" : "";
  return `${header}
import flpianoroll as fp

score = fp.score
ppq = score.PPQ
${clear}notes = [
${notes}
]

for midi, beat, duration, velocity in notes:
    n = fp.Note()
    n.number = int(midi)
    n.velocity = int(velocity)
    n.time = int(round(beat * ppq))
    n.length = max(1, int(round(duration * ppq)))
    score.addNote(n)
`;
}

export function payloadSummary(payload: FlPayload): string {
  const citations = payload.citations.length
    ? payload.citations.map((item) => `${item.source}: ${item.locator}`).join("；")
    : "无章节引用";
  return `${payload.conceptTitle} · ${payload.title}：${payload.notes.length} 个音符，${payload.tempo} BPM。来源：${citations}`;
}
