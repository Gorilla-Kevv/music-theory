import { useEffect, useRef, useState } from "react";
import { useTransport } from "../context/TransportContext";

/**
 * 谱面命中区与琴键共用的预听状态：
 * - flash：一次性点击的高亮（默认 900ms 后熄灭）；
 * - press/release：按住发声（音频 hold），松手后高亮短暂停留再熄灭。
 * 键为调用方定义的唯一 id（如 `e{beat}-{midis}` 或 `p{midi}`），同键重复按下会先释放旧的。
 */
export function useHeldPreview() {
  const { holdStart, holdEnd } = useTransport();
  const [previewNotes, setPreviewNotes] = useState<number[]>([]);
  const holdMap = useRef(new Map<string, number>());
  const timer = useRef<number | null>(null);

  const clearTimer = () => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const flash = (midis: number[], lingerMs = 900) => {
    clearTimer();
    setPreviewNotes(midis);
    timer.current = window.setTimeout(() => setPreviewNotes([]), lingerMs);
  };

  const press = (key: string, midis: number[]) => {
    clearTimer();
    if (!holdMap.current.has(key)) holdMap.current.set(key, holdStart(midis));
    setPreviewNotes(midis);
  };

  const release = (key: string, lingerMs = 600) => {
    const id = holdMap.current.get(key);
    if (id === undefined) return;
    holdEnd(id);
    holdMap.current.delete(key);
    clearTimer();
    timer.current = window.setTimeout(() => setPreviewNotes([]), lingerMs);
  };

  const releaseAll = () => {
    clearTimer();
    for (const id of holdMap.current.values()) holdEnd(id);
    holdMap.current.clear();
    setPreviewNotes([]);
  };

  useEffect(() => {
    return () => {
      clearTimer();
      for (const id of holdMap.current.values()) holdEnd(id);
      holdMap.current.clear();
    };
  }, [holdEnd]);

  return { previewNotes, setPreviewNotes, flash, press, release, releaseAll };
}
