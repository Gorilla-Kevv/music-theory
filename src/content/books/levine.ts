import { buildOutline, type ChapterSeed, type NoteSeed } from "./types";

const CHAPTERS: ChapterSeed[] = [
  { number: "01", title: "Basic Theory", titleZh: "基本理论", part: "Part I · Theory: Chords and Scales" },
  { number: "02", title: "Major Scale and Progressions", titleZh: "大调音阶与和弦进行", part: "Part I · Theory: Chords and Scales" },
  { number: "03", title: "Chord/Scale Theory", titleZh: "和弦—音阶理论", part: "Part I · Theory: Chords and Scales" },
  { number: "04", title: "How to Practice Scales", titleZh: "如何练习音阶", part: "Part I · Theory: Chords and Scales" },
  { number: "05", title: "Slash Chords", titleZh: "斜线和弦", part: "Part I · Theory: Chords and Scales" },
  { number: "06", title: "From Scales to Music", titleZh: "从音阶到音乐", part: "Part II · Improvisation: Playing the Changes" },
  { number: "07", title: "Bebop Scales", titleZh: "比波普音阶", part: "Part II · Improvisation: Playing the Changes" },
  { number: "08", title: "Playing Outside", titleZh: "演奏“外部”", part: "Part II · Improvisation: Playing the Changes" },
  { number: "09", title: "Pentatonic Scales", titleZh: "五声音阶", part: "Part II · Improvisation: Playing the Changes" },
  { number: "10", title: "Blues", titleZh: "布鲁斯", part: "Part II · Improvisation: Playing the Changes" },
  { number: "11", title: "Rhythm Changes", titleZh: "Rhythm Changes", part: "Part II · Improvisation: Playing the Changes" },
  { number: "12", title: "Practice, Practice, Practice", titleZh: "练习、练习、再练习", part: "Part II · Improvisation: Playing the Changes" },
  { number: "13", title: "Basic Reharmonization", titleZh: "基础重配和声", part: "Part III · Reharmonization" },
  { number: "14", title: "Advanced Reharmonization", titleZh: "高级重配和声", part: "Part III · Reharmonization" },
  { number: "15", title: "Coltrane Changes", titleZh: "Coltrane Changes", part: "Part III · Reharmonization" },
  { number: "16", title: "Three Reharmonizations", titleZh: "三种重配和声", part: "Part III · Reharmonization" },
  { number: "17", title: "Song Forms and Composition", titleZh: "曲式与作曲", part: "Part IV · The Tune" },
  { number: "18", title: "Reading a Lead Sheet", titleZh: "读 Lead Sheet", part: "Part IV · The Tune" },
  { number: "19", title: "Memorizing a Tune", titleZh: "记曲", part: "Part IV · The Tune" },
  { number: "20", title: "Heads", titleZh: "Head 旋律", part: "Part IV · The Tune" },
  { number: "21", title: "The Repertoire", titleZh: "曲目库", part: "Part IV · The Tune" },
  { number: "22", title: "Salsa and Latin Jazz", titleZh: "Salsa 与拉丁爵士", part: "Part V · The Rest of It" },
  { number: "23", title: "Loose Ends", titleZh: "杂项", part: "Part V · The Rest of It" },
  { number: "24", title: "Listening", titleZh: "聆听", part: "Part V · The Rest of It" },
];

const NOTES: Record<string, NoteSeed> = {
  "levine-01": {
    summary:
      "从音程、转位与三和弦重新建立爵士和声的最小单位：音程度数决定距离，三音与七音决定和弦质量，转位改变低音与声部连接。",
    keyPoints: [
      "音程同时看“度数”和“半音数”，三全音是属功能张力的核心。",
      "三和弦的四类质量是后续七和弦、延伸音与替代的构件。",
    ],
    concepts: ["intervals", "triads", "seventh-chords"],
    dimensions: ["function", "color"],
  },
  "levine-02": {
    summary:
      "大调音阶内部七个调式对应不同和弦质量；ii–V–I、声部进行与五度圈把调式、功能和低音方向串成一首曲子的骨架。",
    keyPoints: [
      "Dorian–Mixolydian–Ionian 是 C 大调 ii–V–I 最常用的三块色彩。",
      "低音下行五度、三音七音半音交换，是进行有方向感的两个来源。",
    ],
    concepts: ["modes", "ii-v-i", "guide-tones", "circle-of-fifths", "voice-leading"],
    dimensions: ["function", "direction", "relationship"],
  },
  "levine-03": {
    summary:
      "和弦—音阶理论把每个和弦质量映射到一条音阶；避免音、延伸音、变化属七与旋律小调各调式共同构成爵士即兴的色彩词汇。",
    keyPoints: [
      "音阶负责经过与色彩，和弦三音七音负责落点。",
      "变化属七来自旋律小调第七调式，同时包含 b9、#9、b5、#5。",
    ],
    concepts: ["chord-scale", "extensions-alterations", "harmonic-color"],
    dimensions: ["color", "function", "brightness"],
  },
  "levine-05": {
    summary:
      "斜线和弦把三和弦叠在另一个低音上，改变和弦的稳定性、低音方向与色彩；它既可以是转位，也可以是独立的和声层。",
    keyPoints: [
      "低音决定“站在哪里”，上方三和弦决定“是什么颜色”。",
      "斜线和弦常用来制造级进低音、持续音与调式漂移。",
    ],
    concepts: ["bass-line", "rootless-voicings", "tonal-distance"],
    dimensions: ["color", "direction", "relationship"],
  },
  "levine-07": {
    summary:
      "比波普音阶在自然音阶中加入半音经过音，使和弦音落在强拍；属、大调与旋律小调各有对应的比波普形态。",
    keyPoints: [
      "比波普属音阶 = Mixolydian + 自然 7（作为经过音）。",
      "经过音不是新的和弦音，它服务于线条的节拍落点。",
    ],
    concepts: ["bebop-scale", "chord-scale"],
    dimensions: ["direction", "color"],
  },
  "levine-08": {
    summary:
      "Outside playing 通过叠加与当前和弦无关的音阶或三和弦制造短时张力，再用 guide tones 或目标和弦回到“里面”。",
    keyPoints: [
      "外部音响必须被解决；张力与回归是一对。",
      "半音位移、三和弦叠加与五声替代是常见入口。",
    ],
    concepts: ["pentatonic-outside", "tritone-substitution", "harmonic-color"],
    dimensions: ["color", "relationship"],
  },
  "levine-09": {
    summary:
      "五声音阶省略半音与 tritone，因而稳定、易唱；大调、小调与叠加五声可以在同一和弦上产生不同的“内外”程度。",
    keyPoints: [
      "五声不是简化音阶，而是独立的旋律集合。",
      "叠加五声的根音与当前和弦根音的距离决定外部感。",
    ],
    concepts: ["pentatonic-outside", "chord-scale"],
    dimensions: ["color", "relationship"],
  },
  "levine-10": {
    summary:
      "十二小节布鲁斯以 I7–IV7–V7 的循环构成曲式；蓝调音、布鲁斯音阶与属七色彩让“功能和声”让位于风格语言。",
    keyPoints: [
      "I7 的 b7 是布鲁斯色彩，不是功能错误。",
      "蓝调音 b3、b5、b7 可以与大调三音同时存在。",
    ],
    concepts: ["blues", "harmonic-color", "rhythm-changes"],
    dimensions: ["color", "direction", "rhythm"],
  },
  "levine-11": {
    summary:
      "Rhythm Changes 是建立在 I Got Rhythm 和声上的 32 小节 AABA 曲式；A 段 I–vi–ii–V，B 段常用属和弦链与模进。",
    keyPoints: [
      "AABA 的骨架比具体和弦更重要，替换和弦仍保留曲式。",
      "A 段的 vi–ii–V 是五度圈最常用的切片之一。",
    ],
    concepts: ["rhythm-changes", "circle-of-fifths", "harmonic-rhythm"],
    dimensions: ["rhythm", "direction", "relationship"],
  },
  "levine-13": {
    summary:
      "基础重配和声用三全音替代、副属和弦、经过和弦与斜线和弦改变低音与色彩，但不改变原进行的功能方向。",
    keyPoints: [
      "三全音替代用 bII7 替换 V7，共享同一个 tritone。",
      "重配和声的目标是改变“怎么走”，不是抹掉“去哪里”。",
    ],
    concepts: ["tritone-substitution", "secondary-dominants", "rootless-voicings"],
    dimensions: ["relationship", "color", "direction"],
  },
  "levine-14": {
    summary:
      "高级重配和声把声部配置、持续音、调式交替与多层替代结合起来；色彩变化必须由 voice leading 支撑，否则只是堆叠。",
    keyPoints: [
      "先写 guide tones 与低音，再决定延伸音与替代。",
      "同一功能可以有多种色彩，但目标音与解决方向要保持清楚。",
    ],
    concepts: ["rootless-voicings", "harmonic-color", "modal-mixture-color"],
    dimensions: ["color", "brightness", "function"],
  },
  "levine-15": {
    summary:
      "Coltrane Changes 用大三级循环把八度分成三个调性中心，并在其间插入属和弦或 ii–V，形成快速而对称的调性移动。",
    keyPoints: [
      "C–Ab–E 的大三级循环是 Giant Steps 的骨架。",
      "即兴时用目标和弦的 guide tones 定位，而不是逐和弦背音阶。",
    ],
    concepts: ["coltrane-changes", "tonal-distance", "guide-tones"],
    dimensions: ["relationship", "direction"],
  },
};

export const LEVINE_OUTLINE = buildOutline("levine", CHAPTERS, NOTES);
