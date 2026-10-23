import type { HarmonyDimension, SourceId } from "../types";

export type { HarmonyDimension };

export interface DimensionMeta {
  id: HarmonyDimension;
  label: string;
  labelEn: string;
  description: string;
}

export const HARMONY_DIMENSIONS: DimensionMeta[] = [
  {
    id: "function",
    label: "功能",
    labelEn: "FUNCTION",
    description: "和弦在 T–PD–D–T 中承担什么角色，向哪里走。",
  },
  {
    id: "direction",
    label: "走向",
    labelEn: "DIRECTION",
    description: "根音运动、低音线、模进与终止如何制造方向。",
  },
  {
    id: "color",
    label: "色彩",
    labelEn: "COLOR",
    description: "音程内容、张力与延伸音带来的明暗和质感。",
  },
  {
    id: "brightness",
    label: "明暗",
    labelEn: "BRIGHTNESS",
    description: "大调、小调、同主音交替与借用和弦的明暗轴线。",
  },
  {
    id: "relationship",
    label: "关系",
    labelEn: "RELATIONSHIP",
    description: "调性远近、共同和弦、等音关系与替代关系。",
  },
  {
    id: "rhythm",
    label: "和声节奏",
    labelEn: "HARMONIC RHYTHM",
    description: "和弦变化的速率、节拍位置与乐句张力。",
  },
];

export interface ChapterSeed {
  number: string;
  title: string;
  titleZh?: string;
  part?: string;
}

export interface NoteSeed {
  summary: string;
  keyPoints: string[];
  concepts: string[];
  dimensions: HarmonyDimension[];
}

export interface BookChapter extends ChapterSeed {
  id: string;
  book: SourceId;
  expanded: boolean;
  summary?: string;
  keyPoints?: string[];
  concepts?: string[];
  dimensions?: HarmonyDimension[];
}

export interface BookOutline {
  id: SourceId;
  chapters: BookChapter[];
  noteCount: number;
}

export function buildOutline(
  book: SourceId,
  seeds: ChapterSeed[],
  notes: Record<string, NoteSeed>,
): BookOutline {
  const chapters = seeds.map((seed) => {
    const id = `${book}-${seed.number.toLowerCase()}`;
    const note = notes[id];
    return {
      ...seed,
      id,
      book,
      expanded: Boolean(note),
      ...(note ?? {}),
    };
  });
  return {
    id: book,
    chapters,
    noteCount: chapters.filter((chapter) => chapter.expanded).length,
  };
}
