export type CategoryId = "foundations" | "harmony" | "jazz";

export type Level = "基础" | "进阶" | "高级";

export type SourceId = "levine" | "laitz" | "sposobin";

export interface BibliographyEntry {
  id: SourceId;
  authors: string;
  title: string;
  originalTitle?: string;
  publisher: string;
  year: string;
  edition: string;
  isbn?: string;
  language: string;
  role: string;
  locatorNote: string;
  verifiedVia: string;
}

export interface CitationRef {
  source: SourceId;
  locator: string;
  note?: string;
}

export interface NoteSpec {
  midi: number;
  spelling: string;
}

export interface ExampleEvent {
  beat: number;
  duration: number;
  notes: NoteSpec[];
  label?: string;
}

export interface Example {
  id: string;
  title: string;
  caption: string;
  kind: "melody" | "chord" | "progression" | "scale";
  key?: string;
  clef?: "treble" | "bass";
  timeSignature?: [number, number];
  tempo: number;
  beats: number;
  events: ExampleEvent[];
}

export interface ContentBlock {
  type: "p" | "list" | "callout" | "quote";
  text?: string;
  items?: string[];
  title?: string;
  cites?: CitationRef[];
}

export interface Section {
  id: string;
  heading: string;
  blocks: ContentBlock[];
}

export interface ReviewCard {
  question: string;
  answer: string;
  hint?: string;
}

export interface Concept {
  id: string;
  slug: string;
  number: string;
  title: string;
  titleEn: string;
  category: CategoryId;
  level: Level;
  aliases: string[];
  tags: string[];
  summary: string;
  sections: Section[];
  examples: Example[];
  related: string[];
  review: ReviewCard;
}

export interface Category {
  id: CategoryId;
  name: string;
  nameEn: string;
  token: string;
  description: string;
}
