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
  isExamplePlaying: (exampleId: string) => boolean;
}

const TransportContext = createContext<TransportContextValue | null>(null);

export function TransportProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlaybackState>(() => audioEngine.getState());

  useEffect(() => audioEngine.subscribe(setState), []);

  const play = useCallback((example: Example, meta?: PlaybackMeta) => {
    audioEngine.play(example, meta);
  }, []);

  const replay = useCallback(() => audioEngine.replay(), []);
  const stop = useCallback(() => audioEngine.stop(), []);
  const setTempo = useCallback((tempo: number) => audioEngine.setTempo(tempo), []);
  const toggleLoop = useCallback(() => audioEngine.toggleLoop(), []);
  const previewNote = useCallback((midi: number) => audioEngine.previewNote(midi), []);
  const previewChord = useCallback((midis: number[]) => audioEngine.previewChord(midis), []);

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
      isExamplePlaying: (exampleId) => state.isPlaying && state.exampleId === exampleId,
    }),
    [state, play, replay, stop, setTempo, toggleLoop, previewNote, previewChord],
  );

  return <TransportContext.Provider value={value}>{children}</TransportContext.Provider>;
}

export function useTransport(): TransportContextValue {
  const context = useContext(TransportContext);
  if (!context) throw new Error("useTransport must be used within TransportProvider");
  return context;
}
