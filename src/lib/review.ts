import { CONCEPTS } from "../content";
import type { Concept } from "../content/types";
import { readStorage, writeStorage } from "./storage";

export type Grade = "again" | "hard" | "good" | "easy";

export interface ReviewRecord {
  conceptSlug: string;
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
  conceptSlug: string;
  grade: Grade;
}

export interface ReviewState {
  version: 1;
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
}

const STORAGE_KEY = "review.v1";
const DAY = 86_400_000;

export function emptyReviewState(): ReviewState {
  return { version: 1, cards: {}, log: [] };
}

export function loadReviewState(): ReviewState {
  const stored = readStorage<ReviewState | null>(STORAGE_KEY, null);
  if (!stored || stored.version !== 1 || typeof stored.cards !== "object") {
    return emptyReviewState();
  }
  return {
    version: 1,
    cards: stored.cards,
    log: Array.isArray(stored.log) ? stored.log : [],
  };
}

export function saveReviewState(state: ReviewState): void {
  writeStorage(STORAGE_KEY, state);
}

export function createRecord(concept: Concept, now = Date.now()): ReviewRecord {
  return {
    conceptSlug: concept.slug,
    due: now,
    interval: 0,
    ease: 2.5,
    reps: 0,
    lapses: 0,
    addedAt: now,
  };
}

export function addConceptCard(state: ReviewState, concept: Concept): ReviewState {
  if (state.cards[concept.slug]) return state;
  return {
    ...state,
    cards: { ...state.cards, [concept.slug]: createRecord(concept) },
  };
}

export function gradeCard(
  state: ReviewState,
  concept: Concept,
  grade: Grade,
  now = Date.now(),
): ReviewState {
  const current = state.cards[concept.slug] ?? createRecord(concept, now);
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
    cards: { ...state.cards, [concept.slug]: record },
    log: [...state.log, { at: now, conceptSlug: concept.slug, grade }].slice(-400),
  };
}

export function getDueRecords(state: ReviewState, now = Date.now()): ReviewRecord[] {
  return Object.values(state.cards)
    .filter((record) => record.due <= now)
    .sort((a, b) => a.due - b.due);
}

export function getNewConcepts(state: ReviewState): Concept[] {
  return CONCEPTS.filter((concept) => !state.cards[concept.slug]);
}

export function getStats(state: ReviewState, now = Date.now()): ReviewStats {
  const learned = Object.keys(state.cards).length;
  const due = getDueRecords(state, now).length;
  const reviews = state.log.length;
  const successes = state.log.filter((entry) => entry.grade !== "again").length;
  return {
    total: CONCEPTS.length,
    learned,
    due,
    fresh: Math.max(0, CONCEPTS.length - learned),
    accuracy: reviews === 0 ? 0 : successes / reviews,
    reviews,
  };
}

export function isValidReviewState(value: unknown): value is ReviewState {
  if (!value || typeof value !== "object") return false;
  const state = value as ReviewState;
  return state.version === 1 && Boolean(state.cards) && typeof state.cards === "object";
}
