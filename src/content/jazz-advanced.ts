import { cite } from "./bibliography";
import { chord, example, line } from "./helpers";
import type { Concept } from "./types";

export const JAZZ_ADVANCED: Concept[] = [
  {
    id: "bebop-scale",
    slug: "bebop-scale",
    number: "J-09",
    title: "比波普音阶",
    titleEn: "BEBOP SCALES",
    category: "jazz",
    level: "进阶",
    aliases: ["比波普音阶", "bebop scale", "bebop dominant", "bebop major", "bebop melodic minor"],
    tags: ["音阶", "即兴", "经过音"],
    dimensions: ["direction", "color"],
    summary:
      "比波普音阶在自然音阶中加入一个半音经过音，使和弦音落在强拍；属、大调与旋律小调各有对应的比波普形态。",
    sections: [
      {
        id: "structure",
        heading: "多出来的半音",
        blocks: [
          {
            type: "p",
            text:
              "比波普属音阶是 Mixolydian 加上自然 7：G–A–B–C–D–E–F–F#–G。F# 不是新的和弦音，而是连接 b7 与主音的半音经过音，让 G 落在强拍。",
            cites: [cite("levine", "Chapter 7 Bebop Scales")],
          },
          {
            type: "p",
            text:
              "比波普大调音阶在大调音阶中加入 #5，比波普旋律小调在旋律小调中加入还原 7。三种形态的共同逻辑是：用半音经过音调整音阶的节拍落点。",
            cites: [cite("levine", "Chapter 7 Bebop Scales")],
          },
        ],
      },
      {
        id: "usage",
        heading: "用法：让和弦音落在强拍",
        blocks: [
          {
            type: "p",
            text:
              "比波普音阶常用于下行线条：从和弦音开始，用经过音把下一个和弦音推到强拍。它不是“必须弹的音阶”，而是一种让线条更有方向的节奏工具。",
            cites: [cite("levine", "Chapter 7 Bebop Scales")],
          },
          {
            type: "callout",
            title: "练习提示",
            text: "先在半音经过音上标记重音，再把它藏进八分音符线里；听觉目标是强拍上的和弦音，不是那个经过音。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-bebop-dominant",
        title: "G 比波普属音阶",
        caption: "G–A–B–C–D–E–F–F#–G；F# 只是经过音，G 才是目标和弦音。",
        kind: "scale",
        key: "C",
        tempo: 88,
        beats: 5,
        events: line(0, 0.5, 0.5, ["G3", "A3", "B3", "C4", "D4", "E4", "F4", "F#4", "G4"]),
      }),
    ],
    related: ["chord-scale", "ii-v-i", "blues"],
    review: {
      question: "比波普属音阶相对 Mixolydian 多出哪一个音？它为什么存在？",
      answer:
        "多出自然 7（F#），作为 b7 与主音之间的半音经过音，使目标和弦音落在强拍。",
      hint: "经过音服务于节拍落点。",
    },
  },
  {
    id: "coltrane-changes",
    slug: "coltrane-changes",
    number: "J-10",
    title: "Coltrane Changes",
    titleEn: "COLTRANE CHANGES",
    category: "jazz",
    level: "高级",
    aliases: ["Coltrane Changes", "Giant Steps", "大三级循环", "coltrane changes", "三度循环"],
    tags: ["重配和声", "调性关系", "即兴"],
    dimensions: ["relationship", "direction"],
    summary:
      "Coltrane Changes 用大三级循环把八度分成三个调性中心，并在其间插入属和弦或 ii–V，形成快速、对称的调性移动。",
    sections: [
      {
        id: "cycle",
        heading: "大三级循环",
        blocks: [
          {
            type: "p",
            text:
              "C–Ab–E 是相隔大三度的三个调性中心；在每个中心前插入属和弦，就得到 Cmaj7–Eb7–Abmaj7–B7–Emaj7–G7–Cmaj7。根音运动在三个调之间快速切换，而不是沿五度圈平滑前进。",
            cites: [
              cite("levine", "Chapter 15 Coltrane Changes"),
              cite("laitz", "Chapter 29 Symmetry Stretches Tonality: Chromatic Sequences and Equal Divisions of the Octave"),
            ],
          },
          {
            type: "p",
            text:
              "这种进行把调性距离压缩成对称的三等分：每个目标调都相隔大三度，属和弦则用半音或三全音关系连接。即兴时要用目标和弦的 guide tones 定位，而不是逐和弦背音阶。",
            cites: [cite("levine", "Chapter 15 Coltrane Changes")],
          },
        ],
      },
      {
        id: "improvise",
        heading: "即兴策略",
        blocks: [
          {
            type: "p",
            text:
              "先听每个目标和弦的三音七音，再把经过的属和弦当作导向目标的张力。速度很快时，减少音阶思考，抓住目标和弦的 guide tones 与包围音。",
            cites: [cite("levine", "Chapter 15 Coltrane Changes")],
          },
          {
            type: "callout",
            title: "练习顺序",
            text: "先只弹目标和弦的根音与 guide tones，再加属和弦；最后才用完整音阶。不要在慢速还没稳定时追求速度。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-coltrane-cycle",
        title: "C–Ab–E 的大三级骨架",
        caption: "Cmaj7–Eb7–Abmaj7–B7；目标调相隔大三度，属和弦负责连接。",
        kind: "progression",
        key: "C",
        tempo: 96,
        beats: 8,
        events: [
          chord(0, 2, ["C3", "E3", "G3", "B3"], { label: "Cmaj7" }),
          chord(2, 2, ["Eb3", "G3", "Bb3", "Db4"], { label: "Eb7" }),
          chord(4, 2, ["Ab3", "C4", "Eb4", "G4"], { label: "Abmaj7" }),
          chord(6, 2, ["B3", "D#4", "F#4", "A4"], { label: "B7" }),
        ],
      }),
    ],
    related: ["tonal-distance", "harmonic-sequence", "guide-tones"],
    review: {
      question: "Coltrane Changes 的调性骨架是什么？",
      answer:
        "相隔大三度的三个调性中心（如 C–Ab–E）循环，并在其间插入属和弦或 ii–V；根音运动对称而快速。",
      hint: "八度三等分。",
    },
  },
  {
    id: "rootless-voicings",
    slug: "rootless-voicings",
    number: "J-11",
    title: "根音省略与声部配置",
    titleEn: "ROOTLESS VOICINGS",
    category: "jazz",
    level: "进阶",
    aliases: ["根音省略", "rootless voicing", "shell voicing", "三音七音", "voicing"],
    tags: ["声部配置", "和弦", "钢琴"],
    dimensions: ["color", "function"],
    summary:
      "根音省略把低音交给贝斯，钢琴/吉他只保留三音、七音与延伸音；三音七音定义质量，九音与十三音提供色彩。",
    sections: [
      {
        id: "shell",
        heading: "从 shell 到 rootless",
        blocks: [
          {
            type: "p",
            text:
              "Shell voicing 通常只弹根音、三音、七音，信息最少但功能清楚。根音省略进一步去掉根音，留下 3–7–9–13 或 7–9–3–13；低音由贝斯提供，和声仍然成立。",
            cites: [cite("levine", "Chapter 2 Major Scale and Progressions（声部进行）")],
          },
          {
            type: "p",
            text:
              "Dm9 的根音省略可以是 F–A–C–E（3–5–7–9），G13 可以是 F–A–B–E（7–9–3–13），Cmaj9 可以是 E–G–B–D（3–5–7–9）。关键是三音与七音保持，延伸音只加一个色彩。",
            cites: [cite("levine", "Chapter 13 Basic Reharmonization")],
          },
        ],
      },
      {
        id: "register",
        heading: "声部与音区",
        blocks: [
          {
            type: "p",
            text:
              "根音省略不是把所有音堆在一起。左手与右手要分工：左手给低音/导音，右手给三音七音与色彩；中低音区堆太多延伸音会浑浊。",
            cites: [cite("levine", "Chapter 2 Major Scale and Progressions（声部进行）")],
          },
          {
            type: "callout",
            title: "配器提示",
            text: "如果贝斯已经明确根音，钢琴不必重复低音；把根音留给贝斯，把三音七音留给和声。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-rootless-ii-v-i",
        title: "根音省略的 ii–V–I",
        caption: "Dm9 → G13 → Cmaj9；三音七音保持，延伸音只负责色彩。",
        kind: "progression",
        key: "C",
        tempo: 72,
        beats: 12,
        events: [
          chord(0, 4, ["F3", "A3", "C4", "E4"], { label: "Dm9 (rootless)" }),
          chord(4, 4, ["F3", "A3", "B3", "E4"], { label: "G13 (rootless)" }),
          chord(8, 4, ["E3", "G3", "B3", "D4"], { label: "Cmaj9 (rootless)" }),
        ],
      }),
    ],
    related: ["guide-tones", "extensions-alterations", "ii-v-i"],
    review: {
      question: "根音省略和弦为什么仍能定义和声？",
      answer:
        "三音与七音已经定义和弦质量，延伸音提供色彩；根音由贝斯或低音层提供，因此和声身份仍然清楚。",
      hint: "3/7 定义质量，bass 定义根音。",
    },
  },
  {
    id: "pentatonic-outside",
    slug: "pentatonic-outside",
    number: "J-12",
    title: "五声音阶与 Outside",
    titleEn: "PENTATONICS & PLAYING OUTSIDE",
    category: "jazz",
    level: "高级",
    aliases: ["五声音阶", "pentatonic", "outside", "side-slip", "叠加五声"],
    tags: ["五声", "外部", "即兴"],
    dimensions: ["color", "relationship"],
    summary:
      "五声音阶省略半音与三全音，稳定而易唱；把另一个根音的五声叠加到当前和弦上，会制造短时“外部”张力，再用 guide tones 回到内部。",
    sections: [
      {
        id: "structure",
        heading: "五声的稳定性",
        blocks: [
          {
            type: "p",
            text:
              "大调五声是 1–2–3–5–6，小调五声是 1–b3–4–5–b7；两者都没有半音与三全音，因此听感开放、稳定，适合长句与持续音。",
            cites: [cite("levine", "Chapter 9 Pentatonic Scales")],
          },
          {
            type: "p",
            text:
              "叠加五声是 Outside playing 的入口：在 C7 上弹 Eb 五声，会得到 #9、4、5、b7、1 等色彩；它不属于 C7 的自然音阶，但可以与目标和弦的 guide tones 形成张力。",
            cites: [
              cite("levine", "Chapter 8 Playing Outside"),
              cite("levine", "Chapter 9 Pentatonic Scales"),
            ],
          },
        ],
      },
      {
        id: "resolve",
        heading: "外部必须回到内部",
        blocks: [
          {
            type: "p",
            text:
              "Outside 不是永久离开调性，而是短时张力：先在外部五声上停留，再用半音/级进或目标音回到和弦音。没有回归的外部音响，听感会变成随机。",
            cites: [cite("levine", "Chapter 8 Playing Outside")],
          },
          {
            type: "callout",
            title: "练习提示",
            text: "先练 2 拍外部 + 2 拍内部，再缩小到 1 拍；每次都在目标和弦的三音或七音上回归。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-pentatonic-side-slip",
        title: "C 五声 → Eb 五声",
        caption: "前半是 C 大调五声，后半滑到 Eb 五声；外部色彩需要用目标和弦音收束。",
        kind: "melody",
        key: "C",
        tempo: 84,
        beats: 5,
        events: line(0, 0.5, 0.5, ["C4", "D4", "E4", "G4", "A4", "Eb4", "F4", "G4", "Bb4", "C5"]),
      }),
    ],
    related: ["chord-scale", "tritone-substitution", "harmonic-color"],
    review: {
      question: "在 C7 上使用 Eb 五声音阶会产生什么效果？",
      answer:
        "它把 #9、4、5、b7、1 等音带到 C7 上，形成短时外部色彩；需要用 guide tones 或目标和弦音回到内部。",
      hint: "外部是张力，不是新调。",
    },
  },
];
