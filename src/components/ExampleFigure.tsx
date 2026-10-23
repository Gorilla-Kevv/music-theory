import { RotateCcw } from "lucide-react";
import type { Example, ExampleEvent } from "../content/types";
import { useTransport } from "../context/TransportContext";
import { useHeldPreview } from "../hooks/useHeldPreview";
import { PianoKeyboard } from "./PianoKeyboard";
import { StaffNotation } from "./StaffNotation";
import { PlayControl } from "./ui";

export function ExampleFigure({
  example,
  figureNumber,
  conceptSlug,
  conceptTitle,
}: {
  example: Example;
  figureNumber: string;
  conceptSlug: string;
  conceptTitle: string;
}) {
  const { play, stop, previewNote, previewChord, state, isExamplePlaying } = useTransport();
  const playing = isExamplePlaying(example.id);
  const { previewNotes, flash, press, release } = useHeldPreview();
  const active = playing
    ? [...new Set([...state.activeNotes, ...previewNotes])]
    : previewNotes;

  const toggle = () => {
    if (playing) stop();
    else play(example, { conceptSlug, conceptTitle });
  };

  const handleEventPlay = (event: ExampleEvent) => {
    const midis = event.notes.map((note) => note.midi);
    if (midis.length === 1) previewNote(midis[0]);
    else previewChord(midis);
    flash(midis);
  };

  const handleEventPress = (event: ExampleEvent, pressed: boolean) => {
    const key = `e${event.beat}-${event.notes.map((note) => note.midi).join(",")}`;
    const midis = event.notes.map((note) => note.midi);
    if (pressed) press(key, midis);
    else release(key);
  };

  const handlePianoNote = (midi: number) => {
    previewNote(midi);
    flash([midi]);
  };

  const handlePianoPress = (midi: number, pressed: boolean) => {
    if (pressed) press(`p${midi}`, [midi]);
    else release(`p${midi}`);
  };

  return (
    <figure className="min-w-0 border border-line bg-paper">
      <div className="flex items-start justify-between gap-4 border-b border-line px-4 py-3 sm:px-5">
        <div>
          <p className="mono-label text-muted">
            {figureNumber} / {example.kind.toUpperCase()} / {example.tempo} BPM
          </p>
          <h3 className="mt-1.5 text-base font-semibold leading-snug sm:text-lg">
            {example.title}
          </h3>
        </div>
        <PlayControl
          playing={playing}
          onClick={toggle}
          label={playing ? `停止 ${example.title}` : `播放 ${example.title}`}
          tone="cadmium"
          size="md"
        />
      </div>

      <div className="px-2 pt-3 sm:px-4">
        <StaffNotation example={example} onEventPlay={handleEventPlay} onEventPress={handleEventPress} />
      </div>

      <div className="border-t border-line px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="mono-label text-muted">
            STAFF + KEYS / 点击试听 · 按住持续发声 · 播放时高亮当前音符
          </p>
          <button
            type="button"
            onClick={toggle}
            className="mono-label inline-flex items-center gap-1.5 text-cobalt-ink hover:text-ink"
          >
            <RotateCcw size={12} aria-hidden />
            {playing ? "STOP" : "PLAY"}
          </button>
        </div>
        <PianoKeyboard
          activeNotes={active}
          onNote={handlePianoNote}
          onNotePress={handlePianoPress}
          compact
          className="mt-3"
        />
        <figcaption className="reading-column mt-4 text-sm leading-relaxed text-muted">
          {example.caption}
        </figcaption>
      </div>
    </figure>
  );
}
