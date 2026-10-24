import { CONCEPTS } from "../content";
import { SOURCE_NOTES } from "../content/books";
import type { BookChapter } from "../content/books/types";
import type { CategoryId, Example, SourceId } from "../content/types";

export type ReviewCardKind = "concept" | "chapter";

export interface ReviewCard {
  id: string;
  kind: ReviewCardKind;
  title: string;
  question: string;
  answer: string;
  hint?: string;
  link: string;
  category?: CategoryId;
  conceptSlug?: string;
  chapterId?: string;
  sourceId?: SourceId;
  chapterNumber?: string;
  example?: Example;
}

export const SOURCE_LABEL: Record<SourceId, string> = {
  levine: "Levine",
  laitz: "Laitz",
  sposobin: "Sposobin",
  soundquest: "SoundQuest",
};

export const SOURCE_FIELD: Record<SourceId, string> = {
  levine: "bg-cadmium text-ink",
  laitz: "bg-cobalt text-paper",
  sposobin: "bg-acid text-ink",
  soundquest: "bg-ink text-acid",
};

export function cardIdForChapter(chapterId: string): string {
  return `chapter:${chapterId}`;
}

function conceptCards(): ReviewCard[] {
  return CONCEPTS.map((concept) => ({
    id: concept.slug,
    kind: "concept",
    title: `${concept.number} ${concept.title}`,
    question: concept.review.question,
    answer: concept.review.answer,
    ...(concept.review.hint ? { hint: concept.review.hint } : {}),
    link: `/theory/${concept.slug}`,
    category: concept.category,
    conceptSlug: concept.slug,
    example: concept.examples[0],
  }));
}

function chapterTitle(chapter: BookChapter): string {
  return `${SOURCE_LABEL[chapter.book]} ${chapter.number} · ${chapter.titleZh ?? chapter.title}`;
}

function chapterCards(): ReviewCard[] {
  return SOURCE_NOTES.flatMap((chapter) => {
    const cards: ReviewCard[] = [];
    const keyPoints = chapter.keyPoints ?? [];
    const answer = [chapter.summary ?? "", ...keyPoints.map((point, index) => `${index + 1}. ${point}`)]
      .filter(Boolean)
      .join("\n\n");
    if (answer) {
      cards.push({
        id: cardIdForChapter(chapter.id),
        kind: "chapter",
        title: chapterTitle(chapter),
        question: `《${SOURCE_LABEL[chapter.book]}》第 ${chapter.number} 章「${chapter.titleZh ?? chapter.title}」的核心笔记是什么？`,
        answer,
        hint: "先回忆摘要与关键点，再打开章节笔记核对。",
        link: `/books?book=${chapter.book}&chapter=${chapter.id}`,
        chapterId: chapter.id,
        sourceId: chapter.book,
        chapterNumber: chapter.number,
      });
    }
    for (const [index, confusion] of (chapter.confusions ?? []).entries()) {
      cards.push({
        id: `${cardIdForChapter(chapter.id)}:q${index}`,
        kind: "chapter",
        title: chapterTitle(chapter),
        question: confusion.question,
        answer: confusion.answer,
        hint: `《${SOURCE_LABEL[chapter.book]}》第 ${chapter.number} 章 · 常见误解`,
        link: `/books?book=${chapter.book}&chapter=${chapter.id}`,
        chapterId: chapter.id,
        sourceId: chapter.book,
        chapterNumber: chapter.number,
      });
    }
    return cards;
  });
}

export const REVIEW_CARDS: ReviewCard[] = [...conceptCards(), ...chapterCards()];

export const REVIEW_CARD_BY_ID: Record<string, ReviewCard> = Object.fromEntries(
  REVIEW_CARDS.map((card) => [card.id, card]),
);

export const CONCEPT_CARD_COUNT = CONCEPTS.length;
export const CHAPTER_CARD_COUNT = REVIEW_CARDS.length - CONCEPT_CARD_COUNT;
export const REVIEW_CARD_COUNT = REVIEW_CARDS.length;