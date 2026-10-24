import {
  CHAPTER_CARD_COUNT,
  CONCEPT_CARD_COUNT,
  REVIEW_CARD_BY_ID,
  REVIEW_CARDS,
  type ReviewCard,
} from "./cards";
import { readStorage, writeStorage } from "./storage";

export type Grade = "again" | "hard" | "good" | "easy";

export interface ReviewRecord {
  cardId: string;
  due: number;
  interval: number;
  ease: number;
  reps: number;
  lapses: number;
  addedAt: number;
  lastReviewed?: number;
}

export interface ReviewLogEntry {
  at: number;
  cardId: string;
  grade: Grade;
}

export interface ReviewState {
  version: 2;
  cards: Record<string, ReviewRecord>;
  log: ReviewLogEntry[];
}

export interface ReviewStats {
  total: number;
  learned: number;
  due: number;
  fresh: number;
  accuracy: number;
  reviews: number;
  conceptTotal: number;
  chapterTotal: number;
  conceptLearned: number;
  chapterLearned: number;
}

const STORAGE_KEY = "review.v2";
const LEGACY_STORAGE_KEY = "review.v1";
const DAY = 86_400_000;
const GRADES: Grade[] = ["again", "hard", "good", "easy"];

export function emptyReviewState(): ReviewState {
  return { version: 2, cards: {}, log: [] };
}

function toNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toRecord(id: string, value: unknown): ReviewRecord | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const cardId =
    typeof raw.cardId === "string"
      ? raw.cardId
      : typeof raw.conceptSlug === "string"
        ? raw.conceptSlug
        : id;
  if (!cardId) return null;
  const lastReviewed = raw.lastReviewed;
  return {
    cardId,
    due: toNumber(raw.due, 0),
    interval: toNumber(raw.interval, 0),
    ease: toNumber(raw.ease, 2.5),
    reps: toNumber(raw.reps, 0),
    lapses: toNumber(raw.lapses, 0),
    addedAt: toNumber(raw.addedAt, Date.now()),
    ...(typeof lastReviewed === "number" ? { lastReviewed } : {}),
  };
}

/** 接受 v1（conceptSlug 字段）与 v2（cardId 字段）两种形态，统一为 v2。 */
export function normalizeReviewState(value: unknown): ReviewState | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as { cards?: unknown; log?: unknown };
  if (!raw.cards || typeof raw.cards !== "object") return null;
  const cards: Record<string, ReviewRecord> = {};
  for (const [key, entry] of Object.entries(raw.cards as Record<string, unknown>)) {
    const record = toRecord(key, entry);
    if (record) cards[record.cardId] = record;
  }
  const log: ReviewLogEntry[] = [];
  if (Array.isArray(raw.log)) {
    for (const entry of raw.log) {
      if (!entry || typeof entry !== "object") continue;
      const item = entry as Record<string, unknown>;
      const cardId =
        typeof item.cardId === "string"
          ? item.cardId
          : typeof item.conceptSlug === "string"
            ? item.conceptSlug
            : "";
      const grade = item.grade as Grade;
      if (!cardId || !GRADES.includes(grade)) continue;
      log.push({ at: toNumber(item.at, 0), cardId, grade });
    }
  }
  return { version: 2, cards, log: log.slice(-400) };
}

export function loadReviewState(): ReviewState {
  const stored = normalizeReviewState(readStorage<unknown>(STORAGE_KEY, null));
  if (stored) return stored;
  const legacy = normalizeReviewState(readStorage<unknown>(LEGACY_STORAGE_KEY, null));
  return legacy ?? emptyReviewState();
}

export function saveReviewState(state: ReviewState): void {
  writeStorage(STORAGE_KEY, state);
}

export function createRecord(cardId: string, now = Date.now()): ReviewRecord {
  return {
    cardId,
    due: now,
    interval: 0,
    ease: 2.5,
    reps: 0,
    lapses: 0,
    addedAt: now,
  };
}

export function addCard(state: ReviewState, cardId: string): ReviewState {
  if (state.cards[cardId]) return state;
  return {
    ...state,
    cards: { ...state.cards, [cardId]: createRecord(cardId) },
  };
}

export function gradeCard(
  state: ReviewState,
  cardId: string,
  grade: Grade,
  now = Date.now(),
): ReviewState {
  const current = state.cards[cardId] ?? createRecord(cardId, now);
  let interval = current.interval;
  let ease = current.ease;
  let reps = current.reps;
  let lapses = current.lapses;
  let due = now;

  if (grade === "again") {
    interval = 0;
    ease = Math.max(1.3, ease - 0.2);
    lapses += 1;
    due = now + 60_000;
  } else {
    if (reps === 0) {
      interval = grade === "hard" ? 1 : grade === "good" ? 1 : 3;
    } else if (grade === "hard") {
      interval = Math.max(1, interval * 1.2);
    } else if (grade === "good") {
      interval = Math.max(1, interval * ease);
    } else {
      interval = Math.max(2, interval * ease * 1.3);
    }
    ease = Math.min(3, Math.max(1.3, ease + (grade === "easy" ? 0.15 : grade === "hard" ? -0.15 : 0)));
    reps += 1;
    due = now + interval * DAY;
  }

  const record: ReviewRecord = {
    ...current,
    due,
    interval,
    ease,
    reps,
    lapses,
    lastReviewed: now,
  };

  return {
    ...state,
    cards: { ...state.cards, [cardId]: record },
    log: [...state.log, { at: now, cardId, grade }].slice(-400),
  };
}

export function getDueRecords(state: ReviewState, now = Date.now()): ReviewRecord[] {
  return Object.values(state.cards)
    .filter((record) => record.due <= now)
    .sort((a, b) => a.due - b.due);
}

export function getNewCards(state: ReviewState): ReviewCard[] {
  return REVIEW_CARDS.filter((card) => !state.cards[card.id]);
}

export function getStats(state: ReviewState, now = Date.now()): ReviewStats {
  const learned = Object.keys(state.cards).length;
  const due = getDueRecords(state, now).length;
  const reviews = state.log.length;
  const successes = state.log.filter((entry) => entry.grade !== "again").length;
  let conceptLearned = 0;
  let chapterLearned = 0;
  for (const cardId of Object.keys(state.cards)) {
    const kind = REVIEW_CARD_BY_ID[cardId]?.kind;
    if (kind === "concept") conceptLearned += 1;
    else if (kind === "chapter") chapterLearned += 1;
  }
  return {
    total: REVIEW_CARDS.length,
    learned,
    due,
    fresh: Math.max(0, REVIEW_CARDS.length - learned),
    accuracy: reviews === 0 ? 0 : successes / reviews,
    reviews,
    conceptTotal: CONCEPT_CARD_COUNT,
    chapterTotal: CHAPTER_CARD_COUNT,
    conceptLearned,
    chapterLearned,
  };
}

export function isValidReviewState(value: unknown): value is ReviewState {
  return normalizeReviewState(value) !== null;
}