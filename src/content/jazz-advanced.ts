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
              cite("laitz", "Chapter 29 Melodic and Harmonic Symmetry Combine: Chromatic Sequences"),
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
  {
    id: "melodic-minor-modes",
    slug: "melodic-minor-modes",
    number: "J-13",
    title: "旋律小调调式与调式和弦",
    titleEn: "MELODIC MINOR MODES & MODAL CHORDS",
    category: "jazz",
    level: "高级",
    aliases: [
      "旋律小调调式",
      "旋律小调和声",
      "melodic minor modes",
      "Lydian dominant",
      "Lydian augmented",
      "altered scale",
      "locrian #2",
      "小大七和弦",
    ],
    tags: ["旋律小调", "调式", "变化属"],
    dimensions: ["color", "function", "relationship"],
    summary:
      "旋律小调不只是小调的第三种写法：它的七个调式各自对应一组爵士和声最常用的色彩和弦——小大七作主、半减七作二级、Lydian 属七与变化属七作属色彩。",
    sections: [
      {
        id: "modes",
        heading: "七个调式与代表和弦",
        blocks: [
          {
            type: "list",
            items: [
              "调式 1（旋律小调本身）：小大七 CmMaj7 作主，也可为 m7 和声加花。",
              "调式 2（Phrygian ♮6）：Dsus b9 与 Dm7♭5 作二级；sus b9 的紧张最贴近这个调式。",
              "调式 3（Lydian augmented）：maj7♯5，增利底亚，可作主或属色彩。",
              "调式 4（Lydian dominant）：7♯11，属色彩，常与 blues、backdoor 进行配合。",
              "调式 5：少用，常被重写成 7♭13 或上层结构。",
              "调式 6（Locrian ♮2）：半减七作二级，比 Locrian 多一个还原 2 音。",
              "调式 7（altered）：7alt，把属和弦能变的音全变，来自旋律小调第七调式。",
            ],
            cites: [
              cite("levine", "Chapter 3 Chord/Scale Theory（旋律小调和声）"),
              cite("laitz", "Chapter 1A Musical Space"),
            ],
          },
          {
            type: "p",
            text:
              "按功能分组：小大七是唯一稳定的主功能；半减七（调式 2 或 6）承担二级；sus b9、增利底亚、Lydian 属七与 7alt 都可以充当属色彩。同一条旋律小调能在不换音的前提下提供主、二级、属三种角色，这正是它比大调和声更“经济”的原因。",
            cites: [cite("levine", "Chapter 3 Chord/Scale Theory（旋律小调和声）")],
          },
        ],
      },
      {
        id: "usage",
        heading: "使用边界与快速反应",
        blocks: [
          {
            type: "p",
            text:
              "小大七替代小七有边界：它只在自身作主和弦、或为 m7 和声加花时成立；若 m7 是 ii–V 进行的二级，换成 mMaj7 会让属准备失去方向。半减七调式与 Phrygian 的区别在 2 音与 6 音：同一个 sus b9 和弦配 Phrygian 更暗，配旋律小调第二调式更亮。",
            cites: [
              cite("levine", "Chapter 3 Chord/Scale Theory（旋律小调和声）"),
              cite("laitz", "Chapter 1A Musical Space"),
            ],
          },
          {
            type: "callout",
            title: "判断顺序",
            text: "先认来源调（这个和弦来自哪条旋律小调）→ 再认调式级数 → 用代表和弦快速反应 → 最后检查需不需要属解决。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-melodic-minor-modes",
        title: "C 旋律小调：三个调式的色彩",
        caption:
          "CmMaj7 作主 → Dsus b9 二级/属色彩 → F9#11 Lydian 属七 → 回主；四个和弦同出 C 旋律小调，共同音 Eb–G–B 保持连接。",
        kind: "progression",
        key: "C",
        tempo: 66,
        beats: 16,
        events: [
          chord(0, 4, ["C3", "Eb3", "G3", "B3"], { label: "CmMaj7" }),
          chord(4, 4, ["D3", "Eb3", "G3", "B3"], { label: "Dsus b9" }),
          chord(8, 4, ["F3", "G3", "B3", "Eb4"], { label: "F9#11" }),
          chord(12, 4, ["C3", "Eb3", "G3", "B3"], { label: "CmMaj7" }),
        ],
      }),
    ],
    related: ["chord-scale", "extensions-alterations", "hybrid-chords", "minor-scales"],
    review: {
      question: "旋律小调的七个调式分别常用什么代表和弦？",
      answer:
        "调式 1 小大七作主；调式 2 sus b9/半减七作二级；调式 3 增利底亚（maj7♯5）；调式 4 Lydian 属七（7♯11）；调式 5 少用；调式 6 半减七（Locrian ♮2）作二级；调式 7 变化属七（7alt）。",
      hint: "先分调式，再按主/二级/属分组。",
    },
  },
  {
    id: "symmetric-scales",
    slug: "symmetric-scales",
    number: "J-14",
    title: "对称音阶：全音、八音与增",
    titleEn: "SYMMETRIC SCALES: WHOLE TONE, OCTATONIC & AUGMENTED",
    category: "jazz",
    level: "高级",
    aliases: ["对称音阶", "全音音阶", "八音音阶", "减音阶", "增音阶", "whole tone", "octatonic", "diminished scale", "augmented scale"],
    tags: ["音阶", "对称", "属和弦"],
    dimensions: ["color", "relationship"],
    summary:
      "全音、八音（减）、增三条音阶由等距音程生成，旋转对称、缺少单一引力中心；它们分别喂饱 7♯5、7♭9/dim7 与 maj7♯5，是对称色彩与属和弦变化的标准语汇。",
    sections: [
      {
        id: "three-scales",
        heading: "三条音阶与各自的和弦",
        blocks: [
          {
            type: "list",
            items: [
              "全音音阶（6 个全音）：C–D–E–F♯–G♯–A♯，配 7♯5（Lydian 属七的近亲），没有 4、没有 9 与 ♯9 之分。",
              "八音音阶／减音阶（半全交替）：C–D♭–E♭–E–F♯–G–A–B♭，配 7♭9 与 dim7；半全与全半两种旋转各管一类和弦。",
              "增音阶（小三度与小二度交替）：C–D♯–E–G–A♭，配 maj7♯5 与增三和弦，颜色最“失重”。",
            ],
            cites: [
              cite("laitz", "Chapter 28 New Harmonic Tendencies"),
              cite("levine", "Chapter 3 Chord/Scale Theory（全音与减音阶）"),
            ],
          },
          {
            type: "p",
            text:
              "对称意味着旋转有限：全音音阶只有两种旋转，八音音阶只有三种（减七和弦只有四个拼写）。旋转越少，独立音阶越少；同一个音集可以被重解释到多个主音上——等音与对称让“这是哪条音阶”变成视角问题。",
            cites: [
              cite("laitz", "Chapter 28 New Harmonic Tendencies"),
            ],
          },
        ],
      },
      {
        id: "usage",
        heading: "对称没有方向，终点要自己给",
        blocks: [
          {
            type: "p",
            text:
              "等分八度消解了引力中心：任何音听起来都像“临时主音”，旋律在上面转圈不会有自然的回归感。所以对称音阶的服务对象是有明确目标的和弦——在 7♯5、7♭9 上短暂施加对称色彩，再用功能和声收束；整段全音转来转去而没有目标和弦，听感会失焦。",
            cites: [
              cite("laitz", "Chapter 29 Melodic and Harmonic Symmetry Combine: Chromatic Sequences"),
              cite("levine", "Chapter 3 Chord/Scale Theory（全音与减音阶）"),
            ],
          },
          {
            type: "callout",
            title: "练习提示",
            text: "先弹 C7♯5 上跑全音、C7♭9 上跑半全八音，听两条音阶的不同“失重感”；再各解决回 F，体会对称色彩如何被功能落地。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-symmetric-dominants",
        title: "C7♯5（全音）→ C7♭9（八音）→ C7 → F",
        caption: "同一条 C7 换两种对称色彩：全音给 ♯5，八音给 ♭9；最后落回功能和声收束。",
        kind: "progression",
        key: "F",
        tempo: 92,
        beats: 16,
        events: [
          chord(0, 4, ["C3", "E3", "Bb3", "F#4"], { label: "C7♯5 · 全音" }),
          chord(4, 4, ["C3", "E3", "Bb3", "Db4"], { label: "C7♭9 · 八音" }),
          chord(8, 4, ["C3", "E3", "G3", "Bb3"], { label: "C7" }),
          chord(12, 4, ["F3", "A3", "C4", "E4"], { label: "Fmaj7" }),
        ],
      }),
    ],
    related: ["diminished-seventh", "chord-scale", "constant-structure", "melodic-minor-modes"],
    review: {
      question: "对称音阶为什么“没有引力中心”？使用时要注意什么？",
      answer:
        "因为音程结构等分、旋转对称，任何音都可能被听成临时主音；缺少倾向与回归感。所以它常作为 7♯5/7♭9/dim7 上的短暂色彩，需要目标和弦用功能和声收束。",
      hint: "等分 = 失重；色彩要有落点。",
    },
  },
  {
    id: "lydian-chromatic-concept",
    slug: "lydian-chromatic-concept",
    number: "J-15",
    title: "Lydian Chromatic Concept",
    titleEn: "THE LYDIAN CHROMATIC CONCEPT",
    category: "jazz",
    level: "高级",
    aliases: ["LCC", "Lydian Chromatic Concept", "George Russell", "Lydian 音阶统一论", "音调顺序"],
    tags: ["Lydian", "音阶体系", "即兴"],
    dimensions: ["brightness", "color", "relationship"],
    summary:
      "Russell 1953 年的体系：以完全五度串联为据，把 Lydian（而非大调）当作最“统一”的母音阶；七条主要音阶按“音调顺序”派生，一切选音以 Lydian Tonic 为轴——它早于并启发了和弦—音阶理论。",
    sections: [
      {
        id: "tonal-order",
        heading: "五度串联与音调顺序",
        blocks: [
          {
            type: "p",
            text:
              "从 C 沿 V–I 反向串联（C–G–D–A–E–B–F♯），F♯ 先于 F 出现——所以含 ♯4 的 Lydian 被视为与中心音连接最紧的音阶。大调被贬为“水平的”（Fa 带着朝主音的目标压力），Lydian 则有“垂直的重力”。把七音延伸到十二音即 Lydian Chromatic Scale，其内部顺序 I–V–II–VI–III…… 表示各音与中心的亲疏，即“音调顺序”。",
            cites: [cite("soundquest", "和弦篇 C65「Lydian-Chromatic-Concept」")],
          },
          {
            type: "p",
            text:
              "七条主要音阶按加入音符的顺序生成：Lydian → Lydian Augmented → Lydian Diminished → Lydian ♭7 → 辅助增（全音）→ 辅助减（减音阶）→ 辅助减布鲁斯。CST 里的“特殊音阶”在 LCC 里是系统的一等公民。",
            cites: [cite("soundquest", "和弦篇 C65「Lydian-Chromatic-Concept」")],
          },
        ],
      },
      {
        id: "usage",
        heading: "用法与批评",
        blocks: [
          {
            type: "p",
            text:
              "实践核心是“以 Lydian Tonic 为轴做调式交换”：给任何和弦配音阶时不看调性也不看根音，而看一个独立的 Lydian 中心（如 G7 用 F Lydian）。这能产生 CST 想不到的声音，并与 Coltrane changes 结合，让频繁转调保持色彩统一。",
            cites: [cite("soundquest", "和弦篇 C65「Lydian-Chromatic-Concept」")],
          },
          {
            type: "callout",
            title: "边界提醒",
            text: "Lydian 优越性的“证明”很薄弱，应把它当一套精心设计的公理/创作方法，而非声学真理——就像大调中心论本身也只是未被证实的传统。价值在于打开非常规声音，不在逻辑必然。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-lcc-parent",
        title: "F Lydian 作为 G7 的母音阶",
        caption: "G7sus4 → G7(♯11) → Cmaj7：♯11（C）来自 F Lydian；Lydian Tonic 中心的色彩贯穿属到主。",
        kind: "progression",
        key: "C",
        tempo: 72,
        beats: 12,
        events: [
          chord(0, 4, ["G3", "C4", "D4", "F4"], { label: "G7sus4" }),
          chord(4, 4, ["G3", "B3", "D4", "C5"], { label: "G7♯11" }),
          chord(8, 4, ["C3", "E3", "G3", "B3"], { label: "Cmaj7" }),
        ],
      }),
    ],
    related: ["modal-characteristics", "chord-scale", "melodic-minor-modes", "symmetric-scales"],
    review: {
      question: "LCC 为什么选 Lydian 而不是大调当母音阶？",
      answer:
        "按完全五度串联，中心音先遇到 ♯4 再遇到 ♯4 的对立面 4；含 ♯4 的 Lydian 与中心连接最紧。大调的 Fa 带目标压力，被归为“水平”，Lydian 是“垂直统一”。该论证是公设而非证明。",
      hint: "五度串联，♯4 先出现。",
    },
  },
];
