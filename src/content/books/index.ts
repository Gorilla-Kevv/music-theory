import { LEVINE_OUTLINE } from "./levine";
import { LAITZ_OUTLINE } from "./laitz";
import { SPOSOBIN_OUTLINE } from "./sposobin";
import type { BookChapter, BookOutline, HarmonyDimension } from "./types";
import type { SourceId } from "../types";

export * from "./types";
export { LEVINE_OUTLINE, LAITZ_OUTLINE, SPOSOBIN_OUTLINE };

export const BOOK_OUTLINES: BookOutline[] = [
  LEVINE_OUTLINE,
  LAITZ_OUTLINE,
  SPOSOBIN_OUTLINE,
];

export const BOOK_BY_ID = Object.fromEntries(
  BOOK_OUTLINES.map((book) => [book.id, book]),
) as Record<SourceId, BookOutline>;

export const ALL_CHAPTERS: BookChapter[] = BOOK_OUTLINES.flatMap((book) => book.chapters);

export const SOURCE_NOTES: BookChapter[] = ALL_CHAPTERS.filter((chapter) => chapter.expanded);

export const CHAPTER_BY_ID = Object.fromEntries(
  ALL_CHAPTERS.map((chapter) => [chapter.id, chapter]),
) as Record<string, BookChapter>;

export function getBookOutline(book: SourceId): BookOutline | undefined {
  return BOOK_BY_ID[book];
}

export function getSourceNote(chapterId: string): BookChapter | undefined {
  const chapter = CHAPTER_BY_ID[chapterId];
  return chapter?.expanded ? chapter : undefined;
}

export function getChaptersForConcept(slug: string): BookChapter[] {
  return SOURCE_NOTES.filter((chapter) => chapter.concepts?.includes(slug));
}

export interface SourceSearchOptions {
  book?: SourceId;
  dimension?: HarmonyDimension;
  onlyExpanded?: boolean;
}

export function searchSourceNotes(
  query: string,
  options: SourceSearchOptions = {},
): BookChapter[] {
  const target = query.trim().toLowerCase();
  return ALL_CHAPTERS.filter((chapter) => {
    if (options.onlyExpanded && !chapter.expanded) return false;
    if (options.book && chapter.book !== options.book) return false;
    if (options.dimension && !chapter.dimensions?.includes(options.dimension)) return false;
    if (!target) return true;
    const text = [
      chapter.title,
      chapter.titleZh,
      chapter.summary,
      ...(chapter.keyPoints ?? []),
      ...(chapter.concepts ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return text.includes(target);
  });
}

export const BOOK_STATS = {
  chapters: ALL_CHAPTERS.length,
  notes: SOURCE_NOTES.length,
  byBook: Object.fromEntries(
    BOOK_OUTLINES.map((book) => [book.id, { chapters: book.chapters.length, notes: book.noteCount }]),
  ) as Record<SourceId, { chapters: number; notes: number }>,
};
