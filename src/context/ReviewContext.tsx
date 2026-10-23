import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Concept } from "../content/types";
import {
  addConceptCard,
  gradeCard,
  getDueRecords,
  getNewConcepts,
  getStats,
  isValidReviewState,
  loadReviewState,
  saveReviewState,
  type Grade,
  type ReviewState,
} from "../lib/review";
import { loadEarStats, recordEarAnswer, saveEarStats, type EarMode, type EarStats } from "../lib/ear";
import { downloadJson } from "../lib/storage";

interface ReviewContextValue {
  state: ReviewState;
  due: ReturnType<typeof getDueRecords>;
  fresh: Concept[];
  stats: ReturnType<typeof getStats>;
  earStats: EarStats;
  isAdded: (concept: Concept) => boolean;
  addConcept: (concept: Concept) => void;
  grade: (concept: Concept, grade: Grade) => void;
  recordEar: (mode: EarMode, correct: boolean) => void;
  exportState: () => void;
  importState: (raw: unknown) => boolean;
}

const ReviewContext = createContext<ReviewContextValue | null>(null);

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ReviewState>(() => loadReviewState());
  const [earStats, setEarStats] = useState<EarStats>(() => loadEarStats());

  useEffect(() => {
    saveReviewState(state);
  }, [state]);

  useEffect(() => {
    saveEarStats(earStats);
  }, [earStats]);

  const addConcept = useCallback((concept: Concept) => {
    setState((current) => addConceptCard(current, concept));
  }, []);

  const grade = useCallback((concept: Concept, gradeValue: Grade) => {
    setState((current) => gradeCard(current, concept, gradeValue));
  }, []);

  const recordEar = useCallback((mode: EarMode, correct: boolean) => {
    setEarStats((current) => recordEarAnswer(current, mode, correct));
  }, []);

  const exportState = useCallback(() => {
    downloadJson("tonic-review-state.json", {
      app: "TONIC · 主音",
      exportedAt: new Date().toISOString(),
      review: state,
      ear: earStats,
    });
  }, [state, earStats]);

  const importState = useCallback((raw: unknown) => {
    if (!raw || typeof raw !== "object") return false;
    const candidate = (raw as { review?: unknown }).review ?? raw;
    if (!isValidReviewState(candidate)) return false;
    setState(candidate);
    const ear = (raw as { ear?: EarStats }).ear;
    if (ear && typeof ear.attempts === "number") setEarStats(ear);
    return true;
  }, []);

  const value = useMemo<ReviewContextValue>(
    () => ({
      state,
      due: getDueRecords(state),
      fresh: getNewConcepts(state),
      stats: getStats(state),
      earStats,
      isAdded: (concept) => Boolean(state.cards[concept.slug]),
      addConcept,
      grade,
      recordEar,
      exportState,
      importState,
    }),
    [state, earStats, addConcept, grade, recordEar, exportState, importState],
  );

  return <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>;
}

export function useReview(): ReviewContextValue {
  const context = useContext(ReviewContext);
  if (!context) throw new Error("useReview must be used within ReviewProvider");
  return context;
}
