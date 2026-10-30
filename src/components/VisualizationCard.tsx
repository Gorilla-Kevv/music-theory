import { useEffect, useMemo, useState } from "react";
import type { Concept, ExampleEvent } from "../content/types";
import { chord, example } from "../content/helpers";
import { useTransport } from "../context/TransportContext";
import { useHeldPreview } from "../hooks/useHeldPreview";
import { audioEngine } from "../lib/audio";
import { PianoKeyboard } from "./PianoKeyboard";
import { StaffNotation } from "./StaffNotation";
import { PlayControl } from "./ui";

const CX = 260;

function polar(cx: number, cy: number, radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) };
}

function wedgePath(
  cx: number,
  cy: number,
  inner: number,
  outer: number,
  startAngle: number,
  endAngle: number,
) {
  const a = polar(cx, cy, outer, startAngle);
  const b = polar(cx, cy, outer, endAngle);
  const c = polar(cx, cy, inner, endAngle);
  const d = polar(cx, cy, inner, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${a.x} ${a.y}`,
    `A ${outer} ${outer} 0 ${largeArc} 1 ${b.x} ${b.y}`,
    `L ${c.x} ${c.y}`,
    `A ${inner} ${inner} 0 ${largeArc} 0 ${d.x} ${d.y}`,
    "Z",
  ].join(" ");
}

const CIRCLE_KEYS = [
  { major: "C", minor: "Am", sig: "0", midi: 48 },
  { major: "G", minor: "Em", sig: "1♯", midi: 55 },
  { major: "D", minor: "Bm", sig: "2♯", midi: 50 },
  { major: "A", minor: "F♯m", sig: "3♯", midi: 57 },
  { major: "E", minor: "C♯m", sig: "4♯", midi: 52 },
  { major: "B", minor: "G♯m", sig: "5♯", midi: 59 },
  { major: "F♯", minor: "D♯m", sig: "6♯", midi: 54 },
  { major: "C♯", minor: "A♯m", sig: "7♯", midi: 49 },
  { major: "A♭", minor: "Fm", sig: "4♭", midi: 56 },
  { major: "E♭", minor: "Cm", sig: "3♭", midi: 51 },
  { major: "B♭", minor: "Gm", sig: "2♭", midi: 58 },
  { major: "F", minor: "Dm", sig: "1♭", midi: 53 },
];

const ROOT_NAMES = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];
const spellingOf = (midi: number) =>
  `${ROOT_NAMES[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`;

function CircleOfFifths() {
  const { previewChord, play } = useTransport();
  const [selected, setSelected] = useState(0);
  const [quality, setQuality] = useState<"major" | "minor">("major");
  const item = CIRCLE_KEYS[selected];
  const isMajor = quality === "major";
  const root = isMajor ? item.midi : item.midi - 3;

  // 近关系调：大调 = V（顺时针邻位）/ IV（逆时针邻位）；小调 = v / VI（对应大调楔位）。
  const related = isMajor
    ? [
        { label: "V", idx: (selected + 1) % 12 },
        { label: "IV", idx: (selected + 11) % 12 },
      ]
    : [
        { label: "v", idx: (selected + 1) % 12 },
        { label: "VI", idx: (selected + 11) % 12 },
      ];
  const relatedIdx = related.map((r) => r.idx);

  const select = (index: number) => {
    setSelected(index);
    const next = CIRCLE_KEYS[index];
    const nextRoot = quality === "major" ? next.midi : next.midi - 3;
    previewChord(
      quality === "major"
        ? [nextRoot, nextRoot + 4, nextRoot + 7]
        : [nextRoot, nextRoot + 3, nextRoot + 7],
    );
  };

  // 进行播放：真实 I–IV–V–I / V7–I / ii7–V7–I，接入全局试听坞。
  const playProgression = (kind: "full" | "v-i" | "two-five") => {
    const t = isMajor ? item.midi : item.midi - 3;
    const T = isMajor ? [t, t + 4, t + 7] : [t, t + 3, t + 7];
    const PD = isMajor ? [t + 5, t + 9, t + 12] : [t + 5, t + 8, t + 12];
    const V7 = [t + 7, t + 11, t + 14, t + 17];
    const ii7 = isMajor ? [t + 2, t + 5, t + 9, t + 12] : [t + 2, t + 5, t + 8, t + 12];
    const funcLabels = isMajor
      ? { t: "I", pd: "IV", d: "V7", ii: "ii7" }
      : { t: "i", pd: "iv", d: "V7", ii: "iiø7" };
    const seq =
      kind === "full"
        ? [
            { midis: T, label: funcLabels.t },
            { midis: PD, label: funcLabels.pd },
            { midis: V7, label: funcLabels.d },
            { midis: T, label: funcLabels.t },
          ]
        : kind === "v-i"
          ? [
              { midis: V7, label: funcLabels.d },
              { midis: T, label: funcLabels.t },
            ]
          : [
              { midis: ii7, label: funcLabels.ii },
              { midis: V7, label: funcLabels.d },
              { midis: T, label: funcLabels.t },
            ];
    play(
      example({
        id: `cof-${quality}-${selected}-${kind}`,
        title: `${item.major} ${isMajor ? "大调" : "关系小调"} · ${seq.map((s) => s.label).join("–")}`,
        caption: `五度圈进行试听：${seq.map((s) => s.label).join("–")}（${item.major} ${quality}）`,
        kind: "progression",
        key: item.major,
        tempo: 84,
        beats: seq.length * 2,
        events: seq.map((s, i) =>
          chord(i * 2, 2, s.midis.map(spellingOf), { label: s.label }),
        ),
      }),
      { conceptSlug: "circle-of-fifths", conceptTitle: "五度圈" },
    );
  };

  const wedgeCenter = (index: number) => polar(CX, CX, 190, index * 30 + 15);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="mono-label text-muted">CIRCLE OF FIFTHS / 五度圈</p>
          <p className="mt-1 text-sm text-muted">
            点击调性试听主三和弦；{isMajor ? "V / IV" : "v / VI"} 近关系调高亮并可听进行。
          </p>
        </div>
        <div className="flex gap-1">
          {(["major", "minor"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setQuality(value)}
              className={`mono-label border px-2 py-1 ${
                quality === value
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/40 text-muted hover:bg-ink hover:text-paper"
              }`}
            >
              {value === "major" ? "MAJOR" : "MINOR"}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-2 max-w-[520px]">
        <svg viewBox="0 0 520 520" className="w-full" role="group" aria-label="五度圈">
          <circle
            cx={CX}
            cy={CX}
            r={244}
            fill="none"
            stroke="var(--color-ink)"
            strokeOpacity={0.25}
            strokeDasharray="2 8"
            className="visual-spin"
          />

          {related.map((r) => {
            const from = wedgeCenter(selected);
            const to = wedgeCenter(r.idx);
            return (
              <line
                key={`rel-line-${r.label}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="var(--color-cobalt)"
                strokeOpacity={0.55}
                strokeWidth={2}
                strokeDasharray="5 4"
              />
            );
          })}

          {CIRCLE_KEYS.map((key, index) => {
            const start = index * 30 + 1.2;
            const end = start + 27.6;
            const mid = start + 13.8;
            const label = polar(CX, CX, 190, mid);
            const minorLabel = polar(CX, CX, 118, mid);
            const active = index === selected;
            const relatedTag = related.find((r) => r.idx === index);
            const relatedActive = Boolean(relatedTag) && !active;
            return (
              <g
                key={key.major}
                role="button"
                tabIndex={0}
                aria-label={`${key.major} 大调 / ${key.minor}，${key.sig}，点击试听`}
                onClick={() => select(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    select(index);
                  }
                }}
                className="visual-key cursor-pointer focus:outline-none"
              >
                <title>
                  {key.major} 大调 / {key.minor}
                  {relatedTag ? `（${selected ? "" : ""}${relatedTag.label} 近关系调）` : ""}
                </title>
                <path
                  d={wedgePath(CX, CX, 145, 235, start, end)}
                  fill={
                    active
                      ? "var(--color-cobalt)"
                      : relatedActive
                        ? "var(--color-cobalt)"
                        : "var(--color-paper-2)"
                  }
                  fillOpacity={active ? 1 : relatedActive ? 0.16 : 1}
                  stroke="var(--color-ink)"
                  strokeWidth={1}
                  className="transition-colors duration-200"
                />
                <text
                  x={label.x}
                  y={label.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={active ? "var(--color-paper)" : "var(--color-ink)"}
                  fontSize="16"
                  fontWeight="700"
                >
                  {key.major}
                </text>
                {relatedTag ? (
                  <text
                    x={polar(CX, CX, 222, mid).x}
                    y={polar(CX, CX, 222, mid).y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="var(--color-cobalt-ink)"
                    fontSize="11"
                    fontWeight="700"
                  >
                    {relatedTag.label}
                  </text>
                ) : null}
                {active ? (
                  <circle cx={minorLabel.x} cy={minorLabel.y} r={13} fill="var(--color-ink)" />
                ) : null}
                <text
                  x={minorLabel.x}
                  y={minorLabel.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={active ? "var(--color-paper)" : "var(--color-muted)"}
                  fontSize="11"
                  fontWeight={active ? 700 : 400}
                >
                  {key.minor}
                </text>
              </g>
            );
          })}

          <circle cx={CX} cy={CX} r={92} fill="var(--color-paper)" stroke="var(--color-ink)" />
          <text x={CX} y={CX - 24} textAnchor="middle" fill="var(--color-muted)" fontSize="10" letterSpacing="1.2">
            SELECTED
          </text>
          <text x={CX} y={CX + 2} textAnchor="middle" fill="var(--color-ink)" fontSize="28" fontWeight="700">
            {isMajor ? item.major : item.minor}
          </text>
          <text x={CX} y={CX + 24} textAnchor="middle" fill="var(--color-muted)" fontSize="11">
            {item.sig} · {isMajor ? "major" : "minor"}
          </text>
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="mono-label text-muted">进行试听：</span>
        {(isMajor
          ? [
              { kind: "full" as const, label: "I–IV–V7–I" },
              { kind: "v-i" as const, label: "V7–I" },
              { kind: "two-five" as const, label: "ii7–V7–I" },
            ]
          : [
              { kind: "full" as const, label: "i–iv–V7–i" },
              { kind: "v-i" as const, label: "V7–i" },
              { kind: "two-five" as const, label: "iiø7–V7–i" },
            ]
        ).map((btn) => (
          <button
            key={btn.kind}
            type="button"
            onClick={() => playProgression(btn.kind)}
            className="mono-label border border-ink/40 px-2.5 py-1.5 text-muted transition-colors hover:bg-ink hover:text-paper"
          >
            {btn.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => previewChord(isMajor ? [root, root + 4, root + 7] : [root, root + 3, root + 7])}
          className="mono-label ml-auto border border-ink px-3 py-2 hover:bg-ink hover:text-paper"
        >
          播放 {isMajor ? item.major : item.minor}
        </button>
      </div>
      <p className="mt-2 text-xs text-muted">
        近关系调：{item.major} 大调的 V = {CIRCLE_KEYS[(selected + 1) % 12].major}、IV ={" "}
        {CIRCLE_KEYS[(selected + 11) % 12].major}、关系小调 = {item.minor}；蓝色连线即五度/四度关系，楔上 V/IV 标签可定位。
      </p>
    </div>
  );
}

const MODES = [
  { name: "Ionian", zh: "伊奥尼亚", character: "大 7", pattern: [0, 2, 4, 5, 7, 9, 11, 12] },
  { name: "Dorian", zh: "多利亚", character: "自然 6", pattern: [0, 2, 3, 5, 7, 9, 10, 12] },
  { name: "Phrygian", zh: "弗里几亚", character: "b2", pattern: [0, 1, 3, 5, 7, 8, 10, 12] },
  { name: "Lydian", zh: "利底亚", character: "#4", pattern: [0, 2, 4, 6, 7, 9, 11, 12] },
  { name: "Mixolydian", zh: "混合利底亚", character: "b7", pattern: [0, 2, 4, 5, 7, 9, 10, 12] },
  { name: "Aeolian", zh: "伊奥利亚", character: "b6", pattern: [0, 2, 3, 5, 7, 8, 10, 12] },
  { name: "Locrian", zh: "洛克里亚", character: "b2 + b5", pattern: [0, 1, 3, 5, 6, 8, 10, 12] },
];

function ModeWheel() {
  const { previewSequence } = useTransport();
  const [selected, setSelected] = useState(1);
  const mode = MODES[selected];

  const play = () => previewSequence(mode.pattern.map((semitones) => 60 + semitones));

  const select = (index: number) => {
    setSelected(index);
    previewSequence(MODES[index].pattern.map((semitones) => 60 + semitones));
  };

  return (
    <div>
      <div>
        <p className="mono-label text-muted">MODE WHEEL / 调式轮</p>
        <p className="mt-1 text-sm text-muted">点击调式试听 C 主音上的音阶；中心显示特征音。</p>
      </div>

      <div className="mx-auto mt-2 max-w-[520px]">
        <svg viewBox="0 0 520 520" className="w-full" role="group" aria-label="七调式轮">
          {MODES.map((item, index) => {
            const step = 360 / MODES.length;
            const start = index * step + 1.4;
            const end = start + step - 2.8;
            const mid = start + (step - 2.8) / 2;
            const label = polar(CX, CX, 184, mid);
            const active = index === selected;
            return (
              <g
                key={item.name}
                role="button"
                tabIndex={0}
                aria-label={`${item.zh} ${item.name}，特征音 ${item.character}，点击试听`}
                onClick={() => select(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    select(index);
                  }
                }}
                className="visual-key cursor-pointer focus:outline-none"
              >
                <path
                  d={wedgePath(CX, CX, 132, 235, start, end)}
                  fill={active ? "var(--color-cadmium)" : "var(--color-paper-2)"}
                  stroke="var(--color-ink)"
                  strokeWidth={1}
                  className="transition-colors duration-200"
                />
                <text
                  x={label.x}
                  y={label.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={active ? "var(--color-ink)" : "var(--color-ink)"}
                  fontSize="13"
                  fontWeight="600"
                >
                  {item.zh}
                </text>
                <text
                  x={label.x}
                  y={label.y + 16}
                  textAnchor="middle"
                  fill={active ? "var(--color-ink)" : "var(--color-muted)"}
                  fontSize="9"
                >
                  {item.character}
                </text>
              </g>
            );
          })}
          <circle cx={CX} cy={CX} r={96} fill="var(--color-paper)" stroke="var(--color-ink)" />
          <text x={CX} y={CX - 26} textAnchor="middle" fill="var(--color-muted)" fontSize="10" letterSpacing="1">
            C ROOT
          </text>
          <text x={CX} y={CX + 2} textAnchor="middle" fill="var(--color-ink)" fontSize="24" fontWeight="700">
            {mode.name}
          </text>
          <text x={CX} y={CX + 24} textAnchor="middle" fill="var(--color-cadmium-ink)" fontSize="11">
            {mode.character}
          </text>
        </svg>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted">
          {mode.zh} · {mode.name} · 特征音 {mode.character}
        </p>
        <button
          type="button"
          onClick={play}
          className="mono-label border border-ink px-3 py-2 hover:bg-ink hover:text-paper"
        >
          播放音阶
        </button>
      </div>
    </div>
  );
}

const INTERVALS = [
  "纯一度",
  "小二度",
  "大二度",
  "小三度",
  "大三度",
  "纯四度",
  "三全音",
  "纯五度",
  "小六度",
  "大六度",
  "小七度",
  "大七度",
  "纯八度",
];

function IntervalRuler() {
  const { previewChord } = useTransport();
  const [semitones, setSemitones] = useState(7);

  const select = (value: number) => {
    setSemitones(value);
    previewChord([60, 60 + value]);
  };

  return (
    <div>
      <div>
        <p className="mono-label text-muted">SEMITONE RULER / 半音尺</p>
        <p className="mt-1 text-sm text-muted">从 C4 出发，点击半音数试听音程；同度与八度会重合。</p>
      </div>

      <div>
        <svg viewBox="0 0 560 170" className="mt-3 w-full" role="group" aria-label="音程半音尺">
        <line x1="40" y1="96" x2="520" y2="96" stroke="var(--color-ink)" strokeWidth="1" />
        {INTERVALS.map((interval, index) => {
          const x = 40 + index * 40;
          const active = index === semitones;
          return (
            <g
              key={interval}
              role="button"
              tabIndex={0}
              aria-label={`${interval}，${index} 个半音，点击试听`}
              aria-pressed={active}
              onClick={() => select(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  select(index);
                }
              }}
              className="cursor-pointer focus:outline-none"
            >
              <rect
                x={x - 18}
                y={40}
                width={36}
                height={122}
                fill="transparent"
                pointerEvents="all"
                aria-hidden
              />
              <line
                x1={x}
                y1={active ? 48 : 78}
                x2={x}
                y2={112}
                stroke={active ? "var(--color-cobalt)" : "var(--color-ink)"}
                strokeWidth={active ? 3 : 1}
                className="transition-all duration-200"
              />
              <circle
                cx={x}
                cy={96}
                r={active ? 9 : 5}
                fill={active ? "var(--color-cobalt)" : "var(--color-paper)"}
                stroke="var(--color-ink)"
                strokeWidth="1"
                className="transition-all duration-200"
              />
              <text x={x} y={132} textAnchor="middle" fill="var(--color-muted)" fontSize="9">
                {index}
              </text>
              {index % 2 === 0 || index === 6 ? (
                <text x={x} y={150} textAnchor="middle" fill="var(--color-muted)" fontSize="8">
                  {interval}
                </text>
              ) : null}
            </g>
          );
        })}
        <text x="40" y="32" fill="var(--color-ink)" fontSize="13" fontWeight="600">
          C4 → {INTERVALS[semitones]}（{semitones} 半音）
        </text>
        </svg>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted">当前：C4 → {INTERVALS[semitones]}</p>
        <button
          type="button"
          onClick={() => previewChord([60, 60 + semitones])}
          className="mono-label border border-ink px-3 py-2 hover:bg-ink hover:text-paper"
        >
          播放音程
        </button>
      </div>
    </div>
  );
}

const TENSION_CHORDS: Array<{
  label: string;
  notes: number[];
  spellings: string[];
  tension: number;
  style: string;
}> = [
  { label: "Cmaj7", notes: [60, 64, 67, 71], spellings: ["C4", "E4", "G4", "B4"], tension: 1, style: "bg-acid text-ink" },
  { label: "Fmaj7", notes: [65, 69, 72, 76], spellings: ["F4", "A4", "C5", "E5"], tension: 2, style: "bg-paper-2 text-ink" },
  { label: "Dm7", notes: [62, 65, 69, 72], spellings: ["D4", "F4", "A4", "C5"], tension: 2, style: "bg-cobalt text-paper" },
  { label: "G7", notes: [67, 71, 74, 77], spellings: ["G4", "B4", "D5", "F5"], tension: 4, style: "bg-cadmium text-ink" },
  { label: "G7alt", notes: [67, 71, 74, 77, 80], spellings: ["G4", "B4", "D5", "F5", "Ab5"], tension: 5, style: "bg-ink text-paper" },
  { label: "Bdim7", notes: [59, 62, 65, 68], spellings: ["B3", "D4", "F4", "Ab4"], tension: 5, style: "bg-ink-3 text-paper" },
];

function TensionSpectrum({ concept }: { concept: Concept }) {
  const { play, stop, previewChord, previewNote, state, isExamplePlaying } = useTransport();
  const { previewNotes, flash, press, release } = useHeldPreview();
  const [selected, setSelected] = useState(0);
  const selectedChord = TENSION_CHORDS[selected];

  // 先取回采样，避免第一次点击还要等 9 个 mp3 下载。
  useEffect(() => {
    void audioEngine.preloadSamples();
  }, []);

  const selectedExample = useMemo(
    () =>
      example({
        id: `tension-${selectedChord.label}`,
        title: `${selectedChord.label} · 张力试听`,
        caption: `张力等级 ${selectedChord.tension}：点击色块或下方琴键试听；PLAY 走全局试听坞。`,
        kind: "chord",
        tempo: 72,
        beats: 4,
        events: [chord(0, 4, selectedChord.spellings, { label: selectedChord.label })],
      }),
    [selectedChord],
  );

  const playing = isExamplePlaying(selectedExample.id);
  const activeNotes = playing
    ? [...new Set([...state.activeNotes, ...previewNotes])]
    : previewNotes;

  const select = (index: number) => {
    setSelected(index);
    const next = TENSION_CHORDS[index];
    previewChord(next.notes);
    flash(next.notes);
  };

  const toggle = () => {
    if (playing) stop();
    else play(selectedExample, { conceptSlug: concept.slug, conceptTitle: concept.title });
  };

  const handleStaffPlay = (event: ExampleEvent) => {
    const midis = event.notes.map((note) => note.midi);
    if (midis.length === 1) previewNote(midis[0]);
    else previewChord(midis);
    flash(midis);
  };
  const handleStaffPress = (event: ExampleEvent, pressed: boolean) => {
    const key = `tension-s${event.beat}-${event.notes.map((note) => note.midi).join(",")}`;
    const midis = event.notes.map((note) => note.midi);
    if (pressed) press(key, midis);
    else release(key);
  };
  const handlePianoNote = (midi: number) => {
    previewNote(midi);
    flash([midi]);
  };
  const handlePianoPress = (midi: number, pressed: boolean) => {
    if (pressed) press(`tension-p${midi}`, [midi]);
    else release(`tension-p${midi}`);
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="mono-label text-muted">TENSION SPECTRUM / 张力光谱</p>
          <p className="mt-1 text-sm text-muted">
            相对听觉刻度，不是物理测量；点击和弦试听，下方五线谱与琴键同步。功能位置与语境仍会改变实际张力。
          </p>
        </div>
        <PlayControl
          playing={playing}
          onClick={toggle}
          label={playing ? `停止 ${selectedChord.label}` : `播放 ${selectedChord.label}`}
          tone="cadmium"
          size="md"
        />
      </div>

      <div className="mt-4 flex items-end gap-1.5 sm:gap-2.5">
        {TENSION_CHORDS.map((item, index) => {
          const active = index === selected;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => select(index)}
              aria-pressed={active}
              className={`flex flex-1 flex-col items-center justify-end border px-1 pb-2 pt-2 transition-all ${item.style} ${
                active ? "border-ink" : "border-ink/20 hover:border-ink/60"
              }`}
              style={{ height: `${48 + item.tension * 22}px` }}
            >
              <span className="mono-label text-[0.55rem]">LEVEL {item.tension}</span>
              <span className="mt-1 text-[0.68rem] font-semibold leading-none sm:text-xs">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-line pt-2">
        <span className="mono-label text-muted">稳定 / STABLE</span>
        <span className="text-xs text-muted">当前：{selectedChord.label}</span>
        <span className="mono-label text-muted">紧张 / TENSE</span>
      </div>

      <div className="mt-4 border-t border-line pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="mono-label text-muted">STAFF + KEYS / 点击试听 · 按住持续发声</p>
          <span className="mono-label text-muted">
            {selectedChord.label} · LEVEL {selectedChord.tension}
          </span>
        </div>
        <div className="mt-3">
          <StaffNotation
            example={selectedExample}
            onEventPlay={handleStaffPlay}
            onEventPress={handleStaffPress}
          />
        </div>
        <PianoKeyboard
          activeNotes={activeNotes}
          onNote={handlePianoNote}
          onNotePress={handlePianoPress}
          compact
          className="mt-3"
        />
      </div>
    </div>
  );
}

const DOMINANT_CHORDS: Record<
  number,
  { label: string; midis: number[]; note: string }
> = {
  0: { label: "C7", midis: [48, 52, 55, 58], note: "起点属七；不解决，功能悬置" },
  2: { label: "D7", midis: [50, 54, 57, 60], note: "相邻上行，绕开 G" },
  9: { label: "Eb7", midis: [51, 55, 58, 61], note: "下行五度：Ab 的属七" },
  8: { label: "Ab7", midis: [56, 60, 63, 66], note: "下行五度，指向 Db" },
  7: { label: "Db", midis: [49, 53, 56], note: "目标调主和弦落地" },
};

const DOMINANT_STEPS = [
  { from: 0, to: 2, kind: "adjacent" as const },
  { from: 2, to: 9, kind: "adjacent" as const },
  { from: 9, to: 8, kind: "resolution" as const },
  { from: 8, to: 7, kind: "resolution" as const },
];

function DominantPath({ concept }: { concept: Concept }) {
  const { play, previewChord } = useTransport();
  const [selected, setSelected] = useState(0);
  const pathExample = concept.examples.find((item) => item.id === "ex-adjacent-dominants");
  const node = DOMINANT_CHORDS[selected];
  const step = DOMINANT_STEPS.find((item) => item.from === selected);
  const nodePos = (index: number) => polar(CX, CX, 180, index * 30 + 15);

  const shorten = (
    a: { x: number; y: number },
    b: { x: number; y: number },
    d: number,
  ) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    return { x: b.x - (dx / len) * d, y: b.y - (dy / len) * d };
  };

  const select = (index: number) => {
    setSelected(index);
    previewChord(DOMINANT_CHORDS[index].midis);
  };

  const playPath = () => {
    if (pathExample) play(pathExample, { conceptSlug: concept.slug, conceptTitle: concept.title });
    else previewChord(DOMINANT_CHORDS[selected].midis);
  };

  return (
    <div>
      <div>
        <p className="mono-label text-muted">ADJACENT DOMINANT PATH / 相邻属和弦路径</p>
        <p className="mt-1 text-sm text-muted">
          同一张五度圈上的两种走法：相邻属和弦跨圈上行，功能悬置；只有下行五度的两步才沿圈落进新调。点击节点试听。
        </p>
      </div>

      <div className="mx-auto mt-2 max-w-[520px]">
        <svg viewBox="0 0 520 520" className="w-full" role="group" aria-label="相邻属和弦路径">
          <defs>
            <marker id="dp-arrow-cadmium" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-cadmium)" />
            </marker>
            <marker id="dp-arrow-cobalt" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-cobalt)" />
            </marker>
          </defs>
          <circle
            cx={CX}
            cy={CX}
            r={244}
            fill="none"
            stroke="var(--color-ink)"
            strokeOpacity={0.25}
            strokeDasharray="2 8"
            className="visual-spin"
          />
          {CIRCLE_KEYS.map((key, index) => {
            if (index in DOMINANT_CHORDS) return null;
            const label = polar(CX, CX, 206, index * 30 + 15);
            return (
              <text
                key={key.major}
                x={label.x}
                y={label.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="var(--color-muted)"
                fontSize="10"
                opacity={0.55}
              >
                {key.major}
              </text>
            );
          })}
          {DOMINANT_STEPS.map((item, stepIndex) => {
            const from = nodePos(item.from);
            const to = nodePos(item.to);
            const start = shorten(from, to, 22);
            const end = shorten(to, from, 26);
            const adjacent = item.kind === "adjacent";
            const active = step === item;
            return (
              <line
                key={stepIndex}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={adjacent ? "var(--color-cadmium)" : "var(--color-cobalt)"}
                strokeWidth={active ? 5 : 3}
                markerEnd={adjacent ? "url(#dp-arrow-cadmium)" : "url(#dp-arrow-cobalt)"}
                className="transition-all duration-200"
              />
            );
          })}
          {Object.keys(DOMINANT_CHORDS).map((key) => {
            const index = Number(key);
            const info = DOMINANT_CHORDS[index];
            const pos = nodePos(index);
            const active = index === selected;
            return (
              <g
                key={key}
                role="button"
                tabIndex={0}
                aria-label={`${info.label}，${info.note}，点击试听`}
                onClick={() => select(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    select(index);
                  }
                }}
                className="visual-key cursor-pointer focus:outline-none"
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={17}
                  fill={active ? "var(--color-cobalt)" : "var(--color-paper)"}
                  stroke="var(--color-ink)"
                  strokeWidth={active ? 2 : 1}
                  className="transition-colors duration-200"
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={active ? "var(--color-paper)" : "var(--color-ink)"}
                  fontSize="12"
                  fontWeight="700"
                >
                  {info.label}
                </text>
              </g>
            );
          })}
          <circle cx={CX} cy={CX} r={96} fill="var(--color-paper)" stroke="var(--color-ink)" />
          <text x={CX} y={CX - 34} textAnchor="middle" fill="var(--color-muted)" fontSize="10" letterSpacing="1.2">
            {step ? (step.kind === "adjacent" ? "ADJACENT · 无功能" : "RESOLUTION · 五度解决") : "GOAL · 目标调"}
          </text>
          <text x={CX} y={CX - 2} textAnchor="middle" fill="var(--color-ink)" fontSize="28" fontWeight="700">
            {node.label}
          </text>
          <text x={CX} y={CX + 26} textAnchor="middle" fill="var(--color-muted)" fontSize="11">
            {node.note}
          </text>
        </svg>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="inline-block h-1.5 w-5 bg-cadmium" />
          相邻上行 · 无功能
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="inline-block h-1.5 w-5 bg-cobalt" />
          下行五度 · 功能解决
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted">
          当前：{node.label} · {node.note}
        </p>
        <button
          type="button"
          onClick={playPath}
          className="mono-label border border-ink px-3 py-2 hover:bg-ink hover:text-paper"
        >
          播放整条进行
        </button>
      </div>
    </div>
  );
}

const VISUAL_META: Record<
  NonNullable<Concept["visual"]>,
  { title: string; caption: string }
> = {
  "circle-of-fifths": {
    title: "五度圈 / Circle of Fifths",
    caption: "调号、关系大小调与根音方向在同一张图上；点击扇区即可试听。",
  },
  "mode-wheel": {
    title: "调式轮 / Mode Wheel",
    caption: "七个调式共享 C 主音；中心显示特征音，点击扇区试听整条音阶。",
  },
  "interval-ruler": {
    title: "半音尺 / Semitone Ruler",
    caption: "把音程听成距离：从 C4 出发，半音数决定性质。",
  },
  "tension-spectrum": {
    title: "张力光谱 / Tension Spectrum",
    caption: "从稳定到紧张的和弦色彩序列；刻度是分析用的相对标记。",
  },
  "dominant-path": {
    title: "相邻属和弦路径 / Adjacent Dominant Path",
    caption: "在五度圈上对比相邻上行与下行五度：橙线跨圈悬置功能，钴蓝线沿圈落进 Db。点击节点试听单个和弦。",
  },
};

export function VisualizationCard({ concept }: { concept: Concept }) {
  const meta = concept.visual ? VISUAL_META[concept.visual] : null;
  if (!concept.visual || !meta) return null;

  const content = useMemo(() => {
    switch (concept.visual) {
      case "circle-of-fifths":
        return <CircleOfFifths />;
      case "mode-wheel":
        return <ModeWheel />;
      case "interval-ruler":
        return <IntervalRuler />;
      case "tension-spectrum":
        return <TensionSpectrum concept={concept} />;
      case "dominant-path":
        return <DominantPath concept={concept} />;
      default:
        return null;
    }
  }, [concept]);

  return (
    <section id="visual" className="scroll-mt-24 border-t border-line pt-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="mono-label text-muted">VISUAL / 可视化</p>
          <h2 className="zh-display mt-1.5 text-xl sm:text-2xl">{meta.title}</h2>
        </div>
        <span className="mono-label text-muted">INTERACTIVE SVG</span>
      </div>
      <div className="mt-4 border border-line bg-paper p-4 sm:p-5">{content}</div>
      <p className="mt-3 text-xs leading-relaxed text-muted">{meta.caption}</p>
    </section>
  );
}
