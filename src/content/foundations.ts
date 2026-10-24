import { cite } from "./bibliography";
import { chord, example, line, melody } from "./helpers";
import type { Concept } from "./types";

export const FOUNDATIONS: Concept[] = [
  {
    id: "pitch-staff",
    slug: "pitch-staff",
    number: "F-01",
    title: "音高与五线谱",
    titleEn: "PITCH, CLEFS & THE STAFF",
    category: "foundations",
    level: "基础",
    aliases: ["五线谱", "谱号", "音高", "staff", "clef", "pitch", "加线"],
    tags: ["读谱", "谱号", "音区"],
    summary:
      "五线谱把音高编码为线与间的位置；谱号决定这些位置对应哪一组音高。",
    sections: [
      {
        id: "position",
        heading: "位置不是音高，谱号才是",
        blocks: [
          {
            type: "p",
            text:
              "五线谱由五条线与四个间组成，线间距离对应音高的级进。单看位置并不能确定绝对音高：同样位于第二线的音，在高音谱号下是 G，在低音谱号下是 B。谱号先建立一套参照，线与间才获得音名含义。",
            cites: [cite("laitz", "Chapter 1A Musical Space: Pitches, Scales, and Keys")],
          },
          {
            type: "p",
            text:
              "高音谱号（G 谱号）的螺旋围绕 G4，低音谱号（F 谱号）的两个点夹住 F3。越出五线的音用加线延伸；中央 C 位于高音谱号下方一条加线，也在低音谱号上方一条加线。",
            cites: [cite("laitz", "Chapter 1A Musical Space: Pitches, Scales, and Keys")],
          },
          {
            type: "callout",
            title: "读谱顺序",
            text: "先确认谱号，再数线与间，最后用加线校正越界音。不要从“第几线等于哪个音”开始背，先建立谱号的参照系。",
          },
        ],
      },
      {
        id: "octave",
        heading: "八度等价与音名拼写",
        blocks: [
          {
            type: "p",
            text:
              "十二平均律把八度分成十二个半音。八度之间频率成 2:1，音名相同而音区不同；科学音高记号用 C4 表示中央 C，往下一个八度是 C3。等音拼写（如 C# 与 Db）在十二平均律中发同一个音，但在五线谱与和声功能里承担不同角色。",
            cites: [cite("laitz", "Chapter 1A Musical Space: Pitches, Scales, and Keys")],
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-pitch-register",
        title: "从中央 C 到高音 C",
        caption: "同一音名跨八度重复；听辨时先锁定八度框架，再判断内部音级。",
        kind: "melody",
        key: "C",
        clef: "treble",
        tempo: 72,
        beats: 4,
        events: [
          melody(0, 1, "C4", { label: "C4" }),
          melody(1, 1, "E4"),
          melody(2, 1, "G4"),
          melody(3, 1, "C5", { label: "C5" }),
        ],
      }),
    ],
    related: ["intervals", "major-scale"],
    review: {
      question: "高音谱号的螺旋围绕哪一个音？中央 C 在高音谱号中位于哪里？",
      answer: "螺旋围绕 G4；中央 C 位于高音谱号下方第一条加线。",
      hint: "先记谱号的参照音，再数加线。",
    },
  },
  {
    id: "intervals",
    slug: "intervals",
    number: "F-02",
    title: "音程",
    titleEn: "INTERVALS",
    category: "foundations",
    level: "基础",
    aliases: ["音程", "度数", "全音", "半音", "interval", "tritone", "三全音"],
    tags: ["音程", "转位", "听辨"],
    visual: "interval-ruler",
    summary:
      "音程同时有“度数”和“性质”两个维度：度数数线与间，性质由半音数决定。",
    sections: [
      {
        id: "size-quality",
        heading: "度数与性质",
        blocks: [
          {
            type: "p",
            text:
              "度数按音名字母计数，并包含起止两端：C 到 E 是三度，不是二度。性质由半音数决定：大三度是四个半音，小三度是三个半音；纯五度是七个半音，减五度是六个半音。纯音程（一、四、五、八度）用“纯”描述，二、三、六、七度用“大/小”描述，再往上叠加“增/减”。",
            cites: [
              cite("levine", "Chapter 1 Basic Theory（音程）"),
              cite("laitz", "Chapter 1C Musical Distance: Intervals"),
            ],
          },
          {
            type: "p",
            text:
              "三全音是六个半音，既可视作增四度，也可视作减五度。它的拼写取决于调性与声部进行：在 C 大调里 F–B 是增四度，B–F 是减五度，两者音响相同但功能不同。",
            cites: [
              cite("laitz", "Chapter 1C Musical Distance: Intervals"),
              cite("levine", "Chapter 1 Basic Theory（音程转位）"),
            ],
          },
        ],
      },
      {
        id: "inversion",
        heading: "转位与协和度",
        blocks: [
          {
            type: "p",
            text:
              "转位把下方音移高八度：度数相加为九（9 − 原度数 = 转位度数）。性质随之互换：大↔小、增↔减，纯音程保持为纯。因此大六度转位为小三度，增四度转位为减五度。",
            cites: [cite("levine", "Chapter 1 Basic Theory（音程转位）")],
          },
          {
            type: "p",
            text:
              "协和与不协和不是固定的情绪标签，而是依赖语境与解决方向。纯五度、大三度在多数调性语境中稳定；大七度、小二度张力更强，但在爵士和声里可以作为色彩而无需立即解决。",
            cites: [cite("laitz", "Chapter 1C Musical Distance: Intervals（Consonant and Dissonant Intervals）")],
          },
          {
            type: "callout",
            title: "听辨策略",
            text: "先听框架：是否八度、五度；再听颜色：三度/六度是大是小；最后听张力：二度/七度是否要求解决。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-interval-cells",
        title: "四个音程细胞",
        caption: "依次为三全音、纯五度、大三度、小七度；同样的根音，不同的距离与张力。",
        kind: "melody",
        key: "C",
        tempo: 76,
        beats: 4,
        events: [
          melody(0, 1, "C4", { label: "TT" }),
          melody(1, 1, "F#4"),
          melody(2, 1, "C4", { label: "P5" }),
          melody(3, 1, "G4"),
        ],
      }),
      example({
        id: "ex-interval-colors",
        title: "大三度与小七度",
        caption: "大三度明亮、稳定；小七度宽松但带一点悬置感。",
        kind: "melody",
        key: "C",
        tempo: 76,
        beats: 4,
        events: [
          melody(0, 2, "C4", { label: "M3" }),
          melody(2, 2, "E4"),
          melody(4, 2, "C4", { label: "m7" }),
          melody(6, 2, "Bb4"),
        ],
      }),
    ],
    related: ["triads", "modes", "guide-tones"],
    review: {
      question: "大六度转位后是什么音程？为什么？",
      answer: "小三度。度数相加为九（9 − 6 = 3），大转小。",
      hint: "先算度数，再翻转性质。",
    },
  },
  {
    id: "major-scale",
    slug: "major-scale",
    number: "F-03",
    title: "大调音阶与调号",
    titleEn: "MAJOR SCALE & KEY SIGNATURE",
    category: "foundations",
    level: "基础",
    aliases: ["大调", "音阶", "调号", "major scale", "key signature", "关系小调"],
    tags: ["音阶", "调号", "全音半音"],
    summary:
      "大调音阶是全音—全音—半音—全音—全音—全音—半音的结构；调号把这套结构固定到十二个调上。",
    sections: [
      {
        id: "structure",
        heading: "全音与半音的固定模板",
        blocks: [
          {
            type: "p",
            text:
              "大调音阶的音程结构是 W–W–H–W–W–W–H（全—全—半—全—全—全—半）。第 7 级与主音相距一个半音，称为导音；第 4 级到第 3 级的下行半音关系，则是属音回到主音的声部引力之一。",
            cites: [cite("laitz", "Chapter 1A Musical Space: Pitches, Scales, and Keys")],
          },
          {
            type: "p",
            text:
              "音级用数字标记：1 主音、2 上主音、3 中音、4 下属音、5 属音、6 下中音、7 导音。级数不只是编号，它决定和弦功能与旋律倾向。",
            cites: [cite("laitz", "Chapter 1A Musical Space: Pitches, Scales, and Keys")],
          },
        ],
      },
      {
        id: "key-signature",
        heading: "调号与关系小调",
        blocks: [
          {
            type: "p",
            text:
              "调号按五度圈增加升号或降号：C 大调无升降，G 大调一个升号，D 大调两个升号；反向则是 F 大调一个降号，Bb 大调两个降号。每个调号同时对应一个大调和它的关系小调，关系小调从第 6 级开始。",
            cites: [
              cite("laitz", "Chapter 1A Musical Space: Pitches, Scales, and Keys"),
              cite("levine", "Chapter 2 Major Scale and Progressions（五度圈）"),
            ],
          },
          {
            type: "callout",
            title: "快速判调",
            text: "升号调：最后一个升号的上方半音是大调主音。降号调：最后一个降号是下属音，主音在其下方纯四度；也可看倒数第二个降号。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-c-major",
        title: "C 大调上下行",
        caption: "结构与听觉要同时记：半音只出现在 3–4 与 7–1 之间。",
        kind: "scale",
        key: "C",
        tempo: 84,
        beats: 8,
        events: line(0, 0.5, 0.5, [
          "C4",
          "D4",
          "E4",
          "F4",
          "G4",
          "A4",
          "B4",
          "C5",
          "B4",
          "A4",
          "G4",
          "F4",
          "E4",
          "D4",
          "C4",
        ]),
      }),
    ],
    related: ["circle-of-fifths", "minor-scales", "modes"],
    review: {
      question: "三个降号的调号是什么大调？它的关系小调是什么？",
      answer: "Eb 大调；C 小调。三个降号是 Bb、Eb、Ab。",
      hint: "最后一个降号是下属音。",
    },
  },
  {
    id: "minor-scales",
    slug: "minor-scales",
    number: "F-04",
    title: "小调音阶：自然、和声、旋律",
    titleEn: "NATURAL, HARMONIC & MELODIC MINOR",
    category: "foundations",
    level: "基础",
    aliases: ["小调", "自然小调", "和声小调", "旋律小调", "minor", "melodic minor"],
    tags: ["小调", "导音", "变音"],
    summary:
      "小调不是一条音阶，而是三种常用形态：自然小调降 3/6/7，和声小调升 7，旋律小调上行升 6/7。",
    sections: [
      {
        id: "three-forms",
        heading: "三种形态的变音位置",
        blocks: [
          {
            type: "list",
            items: [
              "自然小调：b3、b6、b7，音阶与关系大调共用调号。",
              "和声小调：b3、b6，第 7 级升高半音形成导音；b6 与 7 之间出现增二度。",
              "旋律小调：上行时 6、7 级都升高，下行时通常还原；古典写法强调方向性。",
            ],
            cites: [cite("laitz", "Chapter 1A Musical Space: Pitches, Scales, and Keys")],
          },
          {
            type: "p",
            text:
              "和声小调的升 7 级让属功能和弦获得真正的导音，V7–i 的解决更有方向；代价是 b6 到 7 的增二度在旋律上较难处理。旋律小调升高 6、7 级，既保留导音又避免增二度，但下行时常回到自然小调。",
            cites: [cite("laitz", "Chapter 1A Musical Space: Pitches, Scales, and Keys")],
          },
        ],
      },
      {
        id: "jazz-minor",
        heading: "爵士语境里的旋律小调",
        blocks: [
          {
            type: "p",
            text:
              "爵士理论通常把旋律小调当作一个固定的上行音阶集合来使用，不强调古典的下行还原。它向上提供 6、7 级的大调色彩，向下则成为变化属和弦与半减七和弦的来源。",
            cites: [cite("levine", "Chapter 3 Chord/Scale Theory（旋律小调音阶和声）")],
          },
          {
            type: "callout",
            title: "听觉抓手",
            text: "自然小调像“没有导音的暗色”；和声小调多了导音的拉力与增二度异域感；旋律小调更接近爵士里带升 6/7 的明亮小调。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-natural-minor",
        title: "A 自然小调",
        caption: "b3、b6、b7 都在；第 7 级是 b7，不是导音。",
        kind: "scale",
        key: "C",
        tempo: 80,
        beats: 4,
        events: line(0, 0.5, 0.5, ["A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4"]),
      }),
      example({
        id: "ex-harmonic-minor",
        title: "A 和声小调",
        caption: "G 升高为 G#，第 7 级成为导音。",
        kind: "scale",
        key: "C",
        tempo: 80,
        beats: 4,
        events: line(0, 0.5, 0.5, ["A3", "B3", "C4", "D4", "E4", "F4", "G#4", "A4"]),
      }),
      example({
        id: "ex-melodic-minor",
        title: "A 旋律小调（上行）",
        caption: "F 与 G 同时升高；爵士常把这套上行形态作为固定音阶使用。",
        kind: "scale",
        key: "C",
        tempo: 80,
        beats: 4,
        events: line(0, 0.5, 0.5, ["A3", "B3", "C4", "D4", "E4", "F#4", "G#4", "A4"]),
      }),
    ],
    related: ["modes", "chord-scale", "modal-harmony"],
    review: {
      question: "和声小调相对自然小调改变了哪一个音？这带来什么和声后果？",
      answer: "第 7 级升高半音，形成导音，使 V7–i 的解决更有方向；同时 b6 与 7 之间出现增二度。",
      hint: "导音与增二度是一体两面。",
    },
  },
  {
    id: "modes",
    slug: "modes",
    number: "F-05",
    title: "调式：从大调音阶内部取景",
    titleEn: "MODES & CHARACTERISTIC NOTES",
    category: "foundations",
    level: "进阶",
    aliases: ["调式", "多利亚", "混合利底亚", "利底亚", "弗里几亚", "dorian", "mixolydian", "lydian", "phrygian"],
    tags: ["调式", "色彩音", "爵士"],
    visual: "mode-wheel",
    summary:
      "七个教会调式共享大调音阶的音，但以不同音级为主音；每个调式的“特征音”决定它的颜色。",
    sections: [
      {
        id: "seven-modes",
        heading: "七个调式与特征音",
        blocks: [
          {
            type: "list",
            items: [
              "Ionian：大调本身；特征是大 3、大 7。",
              "Dorian：b3、b7，但保留自然 6；自然 6 是它的标志。",
              "Phrygian：b2 最醒目，b3、b6、b7 随之。",
              "Lydian：大 3、大 7，升 4 带来漂浮感。",
              "Mixolydian：大 3、b7；属七和弦的天然音阶。",
              "Aeolian：b3、b6、b7；自然小调。",
              "Locrian：b2、b5，主音本身不稳定，常作半减七和弦的对应音阶。",
            ],
            cites: [
              cite("levine", "Chapter 2 Major Scale and Progressions（大调音阶的调式）"),
              cite("laitz", "Chapter 1A Musical Space: Pitches, Scales, and Keys"),
            ],
          },
          {
            type: "p",
            text:
              "判断调式不能只看音集合，还要看主音与低音。同一组白键，以 C 为主音是 Ionian，以 D 为主音是 Dorian；主音改变了各音的倾向与“家”的位置。",
            cites: [cite("levine", "Chapter 2 Major Scale and Progressions（调式爵士）")],
          },
        ],
      },
      {
        id: "modal-harmony",
        heading: "调式化和声不是功能进行",
        blocks: [
          {
            type: "p",
            text:
              "调式爵士更依赖静态低音、持续音与色彩和弦，而不是连续的 V–I 解决。和声的“方向”被削弱，听者关注的是主音上的音程颜色。",
            cites: [cite("levine", "Chapter 2 Major Scale and Progressions（调式爵士）")],
          },
          {
            type: "callout",
            title: "识别口诀",
            text: "先找主音与低音踏板，再看 3、6、7 级：Dorian 的自然 6、Mixolydian 的 b7、Lydian 的 #4 各自负责颜色。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-d-dorian",
        title: "D Dorian",
        caption: "D 小调色彩，但第 6 级是自然 B；这个 B 就是 Dorian 的签名。",
        kind: "scale",
        key: "C",
        tempo: 84,
        beats: 4,
        events: line(0, 0.5, 0.5, ["D3", "E3", "F3", "G3", "A3", "B3", "C4", "D4"]),
      }),
      example({
        id: "ex-d-aeolian",
        title: "D Aeolian",
        caption: "同样的 D 主音，第 6 级降为 Bb，颜色转向自然小调。",
        kind: "scale",
        key: "C",
        tempo: 84,
        beats: 4,
        events: line(0, 0.5, 0.5, ["D3", "E3", "F3", "G3", "A3", "Bb3", "C4", "D4"]),
      }),
    ],
    related: ["modal-harmony", "chord-scale", "minor-scales"],
    review: {
      question: "D Dorian 与 D Aeolian 的关键差别在哪一个音？",
      answer: "第 6 级：Dorian 是自然 B，Aeolian 是降 Bb。",
      hint: "两者的 3、7 级都是降的。",
    },
  },
  {
    id: "circle-of-fifths",
    slug: "circle-of-fifths",
    number: "F-06",
    title: "五度圈与调性关系",
    titleEn: "THE CIRCLE OF FIFTHS",
    category: "foundations",
    level: "基础",
    aliases: ["五度圈", "五度循环", "circle of fifths", "调性关系", "四度"],
    tags: ["调号", "和声进行", "转调"],
    visual: "circle-of-fifths",
    summary:
      "五度圈既是调号的排序表，也是和声根音运动的地图：根音下行五度时，功能常按主—下属—属—主的方向推进。",
    sections: [
      {
        id: "key-map",
        heading: "作为调号表",
        blocks: [
          {
            type: "p",
            text:
              "升号方向是 C–G–D–A–E–B–F#，降号方向反向。相邻调只差一个临时记号，因此五度圈也是判断调性远近与转调难度的刻度。",
            cites: [cite("laitz", "Chapter 1A Musical Space: Pitches, Scales, and Keys")],
          },
          {
            type: "p",
            text:
              "关系小调与关系大调共享调号，在圈上位于同一位置。比如 A 小调与 C 大调都无升降；它们的差别在主音、导音与和弦功能上，而不在调号。",
            cites: [cite("laitz", "Chapter 1A Musical Space: Pitches, Scales, and Keys")],
          },
        ],
      },
      {
        id: "harmonic-map",
        heading: "作为和声地图",
        blocks: [
          {
            type: "p",
            text:
              "根音下行五度（或上行四度）是最强的和声引力之一：Dm7–G7–Cmaj7 的根音 D–G–C 连续下行五度，正好对应 ii–V–I。把 vi 接在前面，就得到常见的 vi–ii–V–I。",
            cites: [
              cite("levine", "Chapter 2 Major Scale and Progressions（五度圈）"),
              cite("laitz", "Chapter 5 Tonic, Dominant, and Voice Leading"),
            ],
          },
          {
            type: "callout",
            title: "听觉练习",
            text: "不要只背图形。用低音把 C–F–Bb–Eb–Ab–Db–Gb–B–E–A–D–G–C 弹一圈，听每一次下行五度的“落地感”。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-vi-ii-v-i",
        title: "vi–ii–V–I 的五度根音",
        caption: "A–D–G–C 连续下行五度；这是五度圈最常用的和声切片。",
        kind: "progression",
        key: "C",
        tempo: 78,
        beats: 8,
        events: [
          chord(0, 2, ["A3", "C4", "E4", "G4"], { label: "vi7" }),
          chord(2, 2, ["D3", "F3", "A3", "C4"], { label: "ii7" }),
          chord(4, 2, ["G3", "B3", "D4", "F4"], { label: "V7" }),
          chord(6, 2, ["C3", "E3", "G3", "B3"], { label: "Imaj7" }),
        ],
      }),
    ],
    related: ["major-scale", "ii-v-i", "modulation"],
    review: {
      question: "C 大调中 vi–ii–V–I 的根音分别是什么？它们如何对应五度圈？",
      answer: "A–D–G–C，连续下行五度（或上行四度）。",
      hint: "从 A 开始，每次向下五度。",
    },
  },
  {
    id: "triads",
    slug: "triads",
    number: "F-07",
    title: "三和弦与转位",
    titleEn: "TRIADS & INVERSIONS",
    category: "foundations",
    level: "基础",
    aliases: ["三和弦", "大三和弦", "小三和弦", "增三", "减三", "triad", "转位", "六和弦"],
    tags: ["和弦", "转位", "四部和声"],
    summary:
      "三和弦由根音、三音、五音叠置；三度与五度的性质决定四种质量，低音的选择决定转位。",
    sections: [
      {
        id: "qualities",
        heading: "四种质量",
        blocks: [
          {
            type: "list",
            items: [
              "大三和弦：大三度 + 纯五度（C–E–G）。",
              "小三和弦：小三度 + 纯五度（C–Eb–G）。",
              "减三和弦：小三度 + 减五度（C–Eb–Gb）。",
              "增三和弦：大三度 + 增五度（C–E–G#）。",
            ],
            cites: [
              cite("levine", "Chapter 1 Basic Theory（三和弦）"),
              cite("laitz", "Chapter 3 Triads, Seventh Chords, and Texture"),
              cite("sposobin", "第一章 大三和弦与小三和弦、四部和声"),
            ],
          },
          {
            type: "p",
            text:
              "和弦质量由三音与五音相对于根音的音程决定；根音本身不参与“明亮/暗淡”的判断，但它决定和弦在调性中的功能。同一个 C 大三和弦，在 C 大调是 I，在 F 大调是 V，在 G 大调是 IV。",
            cites: [cite("sposobin", "第二章 正三和弦的功能体系")],
          },
        ],
      },
      {
        id: "inversions",
        heading: "转位由低音决定",
        blocks: [
          {
            type: "p",
            text:
              "原位低音是根音；第一转位低音是三音，数字低音写 6；第二转位低音是五音，写 6/4。转位改变低音的稳定性与声部连接，不改变和弦的根音身份。",
            cites: [
              cite("laitz", "Chapter 3 Triads, Seventh Chords, and Texture"),
              cite("sposobin", "第十章 正三和弦的六和弦"),
              cite("sposobin", "第十三章 经过的与辅助的四六和弦"),
            ],
          },
          {
            type: "callout",
            title: "读和弦的顺序",
            text: "先认根音与质量，再看低音判断转位，最后看它在调性中的功能。C/E 不是“E 和弦”，而是 C 大三和弦的第一转位。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-four-triads",
        title: "同一根音的四种三和弦",
        caption: "根音保持 C，改变三音与五音；先听五度的稳定/紧张，再听三度的大小。",
        kind: "chord",
        key: "C",
        tempo: 72,
        beats: 8,
        events: [
          chord(0, 2, ["C4", "E4", "G4"], { label: "C" }),
          chord(2, 2, ["C4", "Eb4", "G4"], { label: "Cm" }),
          chord(4, 2, ["C4", "Eb4", "Gb4"], { label: "Cdim" }),
          chord(6, 2, ["C4", "E4", "G#4"], { label: "Caug" }),
        ],
      }),
    ],
    related: ["seventh-chords", "voice-leading", "roman-numerals"],
    review: {
      question: "C 大三和弦的第一转位低音是什么？数字低音写作什么？",
      answer: "低音是 E；写作 C/E 或 6（E–G–C）。",
      hint: "第一转位把三音放到低音。",
    },
  },
  {
    id: "seventh-chords",
    slug: "seventh-chords",
    number: "F-08",
    title: "七和弦",
    titleEn: "SEVENTH CHORDS",
    category: "foundations",
    level: "基础",
    aliases: ["七和弦", "大七", "小七", "属七", "半减七", "减七", "seventh chord", "maj7", "m7b5"],
    tags: ["和弦", "爵士", "和声色彩"],
    summary:
      "在三和弦上再叠一个七度，得到五种常用七和弦；三音与七音共同决定质量，也是爵士声部进行的骨架。",
    sections: [
      {
        id: "five-types",
        heading: "五种常用类型",
        blocks: [
          {
            type: "list",
            items: [
              "大七和弦（maj7）：大三和弦 + 大七度；C–E–G–B。",
              "属七和弦（7）：大三和弦 + 小七度；C–E–G–Bb。",
              "小七和弦（m7）：小三和弦 + 小七度；C–Eb–G–Bb。",
              "半减七和弦（m7b5）：减三和弦 + 小七度；C–Eb–Gb–Bb。",
              "减七和弦（dim7）：减三和弦 + 减七度；C–Eb–Gb–Bbb（等音 A）。",
            ],
            cites: [
              cite("laitz", "Chapter 3 Triads, Seventh Chords, and Texture"),
              cite("levine", "Chapter 2 Major Scale and Progressions（大七、小七、属七）"),
            ],
          },
          {
            type: "p",
            text:
              "七和弦的稳定性低于三和弦，因为七度引入了不协和。属七的七音通常下行解决，三音上行解决；两个音构成三全音，是属功能张力的核心。",
            cites: [
              cite("laitz", "Chapter 6 V7 and Two-Level Analysis"),
              cite("levine", "Chapter 2 Major Scale and Progressions（声部进行）"),
            ],
          },
        ],
      },
      {
        id: "guide-tones",
        heading: "三音与七音是骨架",
        blocks: [
          {
            type: "p",
            text:
              "在爵士里，钢琴或吉他经常只弹三音与七音（guide tones），省略根音与五音，因为三音决定大小、七音决定属/大七的质量，而根音可以交给贝斯。",
            cites: [cite("levine", "Chapter 2 Major Scale and Progressions（声部进行）")],
          },
          {
            type: "callout",
            title: "快速识别",
            text: "maj7 的七音是大七度（离根音一个半音）；属七的七音是小七度（离根音两个半音）；m7 的七音也是小七度，但三音是小三度。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-seventh-family",
        title: "ii–V–I 的七和弦家族",
        caption: "Dm7、G7、Cmaj7 连续出现；注意 G7 的三音 B 与七音 F 形成的三全音。",
        kind: "progression",
        key: "C",
        tempo: 76,
        beats: 12,
        events: [
          chord(0, 4, ["D3", "F3", "A3", "C4"], { label: "Dm7" }),
          chord(4, 4, ["G3", "B3", "D4", "F4"], { label: "G7" }),
          chord(8, 4, ["C3", "E3", "G3", "B3"], { label: "Cmaj7" }),
        ],
      }),
    ],
    related: ["guide-tones", "tritone-substitution", "ii-v-i"],
    review: {
      question: "Cmaj7 与 C7 的区别是什么？",
      answer: "七音不同：Cmaj7 是 B（大七度），C7 是 Bb（小七度）；C7 是属七和弦。",
      hint: "三音相同，七音决定大七/属七。",
    },
  },
  {
    id: "meter-syncopation",
    slug: "meter-syncopation",
    number: "F-09",
    title: "节拍与切分",
    titleEn: "METER & SYNCOPATION",
    category: "foundations",
    level: "基础",
    aliases: ["节拍", "拍号", "切分", "重音", "meter", "syncopation", "backbeat", "律动"],
    tags: ["节奏", "律动", "重音"],
    dimensions: ["rhythm", "direction"],
    summary:
      "拍号给出强弱循环的骨架，律动把它细分成可感的脉搏；切分把重音挪到弱位，制造推进与意外，是律动风格化最重要的手段。",
    sections: [
      {
        id: "meter",
        heading: "拍号与强弱层级",
        blocks: [
          {
            type: "p",
            text:
              "拍号由两个数字写成：上方的数告诉你一小节有几拍，下方的数告诉你以什么音符为一拍。2/4 是强—弱，3/4 是强—弱—弱，4/4 是强—弱—次强—弱；6/8 这类复拍子则以“一大拍含三小拍”计数，强弱落在每大拍上。强弱层级不是抽象规则，而是听者预期重音出现的位置。",
            cites: [
              cite("laitz", "Chapter 1B Musical Time: Meter and Rhythm"),
            ],
          },
          {
            type: "p",
            text:
              "旋律与伴奏都活在“拍点—拍点之间”的细分里：把一拍再分成两个八分或三个三连，决定音乐是直是摇。音高与节拍同时运作——同一个音组放在不同的拍位上，听起来完全不同，所以分析旋律要同时说“什么音”和“在哪个拍位”。",
            cites: [
              cite("laitz", "Chapter 02 Pitch and Meter Combine: Melody and Counterpoint"),
            ],
          },
        ],
      },
      {
        id: "syncopation",
        heading: "切分与推动力",
        blocks: [
          {
            type: "p",
            text:
              "切分是把重音移出拍点的总称：音从小节或拍点的弱位起、跨拍延音把强拍“吃掉”、或在反拍上加重音。听者预期强拍出现重音，切分先让位再补拍，制造“被推迟的落点”——这正是放克、爵士与拉丁律动的发动机。",
            cites: [
              cite("laitz", "Chapter 1B Musical Time: Meter and Rhythm"),
            ],
          },
          {
            type: "callout",
            title: "编曲提示",
            text: "先定单位拍与律动层级（哪个乐器管四分、哪个管八分、哪个管反拍），再决定哪个声部切分；所有声部同时切分会让律动失去参照。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-syncopation-compare",
        title: "正拍陈述 vs 切分变体",
        caption: "同一组音 C–D–E–G：上面一行落在拍点，下面一行从反拍起并跨拍延音，重音被推迟，律动立刻不同。",
        kind: "melody",
        key: "C",
        tempo: 96,
        beats: 8,
        events: [
          melody(0, 1, "C4", { label: "正拍" }),
          melody(1, 1, "D4"),
          melody(2, 1, "E4"),
          melody(3, 1, "G4"),
          melody(4, 0.5, "C4", { label: "切分" }),
          melody(4.5, 1, "D4"),
          melody(5.5, 1, "E4"),
          melody(6.5, 1.5, "G4"),
        ],
      }),
    ],
    related: ["harmonic-rhythm", "phrase-structure", "melody-motives"],
    review: {
      question: "切分为什么能制造推动力？",
      answer:
        "因为它把重音从拍点挪到弱位或用跨拍延音推迟落点，让听者的强拍预期落空再补齐；预期与现实的错位就是律动的推进感。",
      hint: "先说强拍预期，再说落点被推迟。",
    },
  },
  {
    id: "melody-motives",
    slug: "melody-motives",
    number: "F-10",
    title: "旋律与动机发展",
    titleEn: "MELODY & MOTIVIC DEVELOPMENT",
    category: "foundations",
    level: "基础",
    aliases: ["旋律", "动机", "模进", "轮廓", "melody", "motive", "motivic development", "旋律轮廓"],
    tags: ["旋律", "动机", "发展"],
    dimensions: ["direction", "rhythm", "color"],
    summary:
      "旋律靠一个可识别的动机反复生长：重复、移位、模进、增减时值都是发展手段；级进保持连贯，跳进之后要反向回收，高点只留一个。",
    sections: [
      {
        id: "motive",
        heading: "动机与它的展开",
        blocks: [
          {
            type: "p",
            text:
              "动机是一个可辨认的最小音型——几个音加一种节奏特征。旋律写作不是从头到尾各想各的，而是先立动机，再用重复、移位、模进、扩大或缩小、倒影等手段让它在新位置重现；听者靠“认出”动机来组织旋律。",
            cites: [
              cite("laitz", "Chapter 02 Pitch and Meter Combine: Melody and Counterpoint"),
            ],
          },
          {
            type: "p",
            text:
              "发展的节奏也要设计：动机陈述后紧接变化重复最容易辨认，间隔太远或每次都变会散掉。旋律与伴奏的时间关系同样重要——旋律长音落在伴奏切分上，是流行与爵士常见的呼吸设计。",
            cites: [
              cite("laitz", "Chapter 02 Pitch and Meter Combine: Melody and Counterpoint"),
            ],
          },
        ],
      },
      {
        id: "contour",
        heading: "级进、跳进与高点",
        blocks: [
          {
            type: "p",
            text:
              "旋律轮廓以级进为主，跳进负责表情；大跳之后习惯向反方向级进“回收”，否则线条会散。整段旋律通常只保留一个最高点，把它与和声高点、歌词或乐句顶点对齐，表达才有落点。",
            cites: [
              cite("laitz", "Chapter 04 The Role of Context: Embellishing Tones and Melodic Shape"),
            ],
          },
          {
            type: "callout",
            title: "写作自查",
            text: "唱一遍：动机认得出吗？跳进回收了吗？高点只有一个吗？三问都过，再谈装饰。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-motive-development",
        title: "动机 → 移位 → 回收",
        caption: "C–D–E–G 上行动机移高一级变成 D–E–F–A，随后级进下行收回 C；高点只有一个 A。",
        kind: "melody",
        key: "C",
        tempo: 84,
        beats: 8,
        events: [
          melody(0, 1, "C4", { label: "动机" }),
          melody(1, 1, "D4"),
          melody(2, 1, "E4"),
          melody(3, 1, "G4"),
          melody(4, 1, "D4", { label: "移位" }),
          melody(5, 1, "E4"),
          melody(6, 1, "F4"),
          melody(7, 1, "A4", { label: "高点" }),
        ],
      }),
    ],
    related: ["phrase-structure", "meter-syncopation", "non-chord-tones", "bass-line"],
    review: {
      question: "大跳之后为什么通常要反向级进？",
      answer:
        "跳进是表情与张力，级进是连贯与解决；跳进后反向级进把线条收回自然音域，也让听者重新定位音高中心。",
      hint: "跳进负责表情，级进负责回收。",
    },
  },
  {
    id: "pentatonic-scales",
    slug: "pentatonic-scales",
    number: "F-11",
    title: "五声音阶",
    titleEn: "PENTATONIC SCALES",
    category: "foundations",
    level: "基础",
    aliases: ["五声", "五声音阶", "大调五声", "小调五声", "pentatonic", "五音音阶"],
    tags: ["音阶", "旋律", "即兴"],
    dimensions: ["color", "direction"],
    summary:
      "五声音阶从大调里去掉两个半音倾向音（4 与 7），没有强导音，所以怎么放都稳；大调五声与小调五声互为旋转，是旋律写作与跨和弦即兴的公共语汇。",
    sections: [
      {
        id: "structure",
        heading: "结构与旋转",
        blocks: [
          {
            type: "p",
            text:
              "C 大调五声是 C–D–E–G–A：去掉 4（F）与 7（B）这两个制造倾向的音，剩下大二度与小三度堆叠，音阶内部没有半音。同一组音从 A 开始排列就是 A 小调五声——大调五声与小调五声不是两条音阶，而是同一条集合的两个视角。",
            cites: [
              cite("laitz", "Chapter 30 Centricity, Extended and Non-Tertian Sonorities, and Collections"),
              cite("levine", "Chapter 09 Pentatonic Scales"),
            ],
          },
        ],
      },
      {
        id: "usage",
        heading: "为什么它不容易错",
        blocks: [
          {
            type: "p",
            text:
              "没有半音就没有强倾向音，任何两个五声相邻音都不会打架，所以它既可以当旋律骨架，也可以整条压在慢变的和声上——同一条 C 大调五声可以覆盖 Cmaj7、Am7、Fmaj7 等一组相关和弦。把小调五声加一个 b5（蓝调音）就是布鲁斯音阶；爵士即兴再把它平移到“外部”和弦上制造离调色彩。",
            cites: [
              cite("levine", "Chapter 09 Pentatonic Scales"),
              cite("laitz", "Chapter 30 Centricity, Extended and Non-Tertian Sonorities, and Collections"),
            ],
          },
          {
            type: "callout",
            title: "听觉练习",
            text: "先只弹黑键五声（Gb 大调五声即黑键）听它的悬浮感，再回到 C 大调五声对比：少了哪两个音，倾向就消失了。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-pentatonic-line",
        title: "C 大调五声旋律线",
        caption: "只用 C–D–E–G–A 五个音构成的旋律线；没有半音倾向，落点都稳。",
        kind: "melody",
        key: "C",
        tempo: 88,
        beats: 8,
        events: line(0, 1, 1, ["C4", "D4", "E4", "G4", "A4", "C5", "A4", "G4"]),
      }),
    ],
    related: ["major-scale", "blues", "pentatonic-outside", "symmetric-scales"],
    review: {
      question: "大调五声去掉了哪两个音？为什么它跨和弦更安全？",
      answer:
        "去掉 4 与 7（C 大调的 F 与 B），音阶内部没有半音与导音；没有强倾向音意味着音与和弦冲突的压力小，同一条五声可以覆盖一组相关和弦。",
      hint: "去倾向，留骨架。",
    },
  },
  {
    id: "harmonic-series",
    slug: "harmonic-series",
    number: "F-12",
    title: "泛音列：音程协和的物理底座",
    titleEn: "THE HARMONIC SERIES",
    category: "foundations",
    level: "基础",
    aliases: ["泛音列", "泛音", "倍音", "分音", "overtone series", "harmonic series", "基音"],
    tags: ["音程", "声学", "协和"],
    dimensions: ["color", "function"],
    summary:
      "把一个音的频率按整数倍展开就是泛音列：八度最先出现，五度次之，大三再次——音程的协和度与频率比的简单程度对应；它是“为什么大三和弦听起来自然”的物理解释。",
    sections: [
      {
        id: "structure",
        heading: "基音与分音",
        blocks: [
          {
            type: "p",
            text:
              "以 A3（220Hz）为基音，频率乘整数倍得到一系列分音：×2 是 A4（八度）、×3 接近 E4（五度）、×4 又是八度、×5 接近 C♯5（大三度）。八度最简单（2:1），所以听感如同“同一个音”；五度（3:2）与大三（5:4）紧随其后——频率比越简单，音程越协和。",
            cites: [cite("soundquest", "和弦篇 C4「度数和泛音列」")],
          },
          {
            type: "p",
            text:
              "把 1、3、5 号分音同时发声，就得到“基音+五度+大三度”的骨架——大三和弦的物理原型。更高的分音产生七度、九度等更浑浊的音程；这解释了为什么三和弦稳定、七和弦有张力、更密的叠置越来越紧。",
            cites: [cite("soundquest", "和弦篇 C4「度数和泛音列」")],
          },
        ],
      },
      {
        id: "use-limits",
        heading: "用处与边界",
        blocks: [
          {
            type: "p",
            text:
              "泛音列还给音程分组提供依据：三/六度决定大小色彩（软），四/五度加固基体（硬），二/七度制造冲突；转位互换（3↔6、4↔5、2↔7）时属性随转位颠倒。配器上，泛音分配就是音色本身——叠加到高位分音声音变亮，混入非整数倍频率则趋向噪声。",
            cites: [cite("soundquest", "和弦篇 C4「度数和泛音列」")],
          },
          {
            type: "callout",
            title: "边界提醒",
            text: "第 5、7 分音与十二平均律并不精确吻合（纯律大三比平均律略低）；泛音列是理解协和的有效模型，不是精确的平均律证明。把它当底座，别当教条。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-harmonic-series",
        title: "A3 的前五号分音",
        caption: "A3→A4→E4→A4→C♯4（移低八度示意）：八度、五度、大三依次浮现，末端三音即大三和弦骨架。",
        kind: "melody",
        key: "C",
        tempo: 72,
        beats: 8,
        events: [
          melody(0, 1, "A2", { label: "基音" }),
          melody(1, 1, "A3", { label: "×2" }),
          melody(2, 1, "E4", { label: "×3" }),
          melody(3, 1, "A3", { label: "×4" }),
          melody(4, 2, "C#4", { label: "×5" }),
          chord(6, 2, ["A2", "E3", "C#4"], { label: "A 大三和弦" }),
        ],
      }),
    ],
    related: ["intervals", "triads", "harmonic-color"],
    review: {
      question: "为什么八度、五度、大三度的协和度依次递减？",
      answer:
        "它们分别对应频率比 2:1、3:2、5:4——在泛音列中出现的次序就是频率比的复杂度次序；比越简单，两音的分音重合越多，听感越融合。",
      hint: "看分音出现的先后。",
    },
  },
];
