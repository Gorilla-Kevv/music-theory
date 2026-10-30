import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Example } from "../content/types";
import { audioEngine, type PlaybackMeta, type PlaybackState } from "../lib/audio";

interface TransportContextValue {
  state: PlaybackState;
  play: (example: Example, meta?: PlaybackMeta) => void;
  replay: () => void;
  stop: () => void;
  setTempo: (tempo: number) => void;
  toggleLoop: () => void;
  previewNote: (midi: number) => void;
  previewChord: (midis: number[]) => void;
  previewSequence: (midis: number[], stepSeconds?: number) => void;
  holdStart: (midis: number[]) => number;
  holdEnd: (id: number) => void;
  isExamplePlaying: (exampleId: string) => boolean;
}

const TransportContext = createContext<TransportContextValue | null>(null);

export function TransportProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlaybackState>(() => audioEngine.getState());

  useEffect(() => audioEngine.subscribe(setState), []);

  useEffect(() => {
    // 提前解码采样，避免第一次点击琴键/谱例还在等 mp3 decode。
    void audioEngine.warm();
    const preload = () => {
      void audioEngine.preloadSamples();
    };
    window.addEventListener("pointerdown", preload, { once: true });
    return () => window.removeEventListener("pointerdown", preload);
  }, []);

  const play = useCallback((example: Example, meta?: PlaybackMeta) => {
    audioEngine.play(example, meta);
  }, []);

  const replay = useCallback(() => audioEngine.replay(), []);
  const stop = useCallback(() => audioEngine.stop(), []);
  const setTempo = useCallback((tempo: number) => audioEngine.setTempo(tempo), []);
  const toggleLoop = useCallback(() => audioEngine.toggleLoop(), []);
  const previewNote = useCallback((midi: number) => audioEngine.previewNote(midi), []);
  const previewChord = useCallback((midis: number[]) => audioEngine.previewChord(midis), []);
  const previewSequence = useCallback(
    (midis: number[], stepSeconds?: number) => audioEngine.previewSequence(midis, stepSeconds),
    [],
  );
  const holdStart = useCallback((midis: number[]) => audioEngine.holdStart(midis), []);
  const holdEnd = useCallback((id: number) => audioEngine.holdEnd(id), []);

  const value = useMemo<TransportContextValue>(
    () => ({
      state,
      play,
      replay,
      stop,
      setTempo,
      toggleLoop,
      previewNote,
      previewChord,
      previewSequence,
      holdStart,
      holdEnd,
      isExamplePlaying: (exampleId) => state.isPlaying && state.exampleId === exampleId,
    }),
    [state, play, replay, stop, setTempo, toggleLoop, previewNote, previewChord, previewSequence, holdStart, holdEnd],
  );

  return <TransportContext.Provider value={value}>{children}</TransportContext.Provider>;
}

export function useTransport(): TransportContextValue {
  const context = useContext(TransportContext);
  if (!context) throw new Error("useTransport must be used within TransportProvider");
  return context;
}
