import { cite } from "./bibliography";
import { chord, example, melody } from "./helpers";
import type { Concept } from "./types";

export const HARMONY_ADVANCED: Concept[] = [
  {
    id: "cadential-six-four",
    slug: "cadential-six-four",
    number: "H-09",
    title: "终止四六与属准备",
    titleEn: "THE CADENTIAL SIX-FOUR",
    category: "harmony",
    level: "进阶",
    aliases: ["终止四六", "四六和弦", "I6/4", "cadential 6/4", "double appoggiatura"],
    tags: ["终止", "四六和弦", "声部进行"],
    dimensions: ["function", "direction"],
    summary:
      "终止四六（I6/4）以属音为低音，在强拍上把主和弦的六音与四音压向属和弦的五音与三音；它是属准备，不是普通的主和弦转位。",
    sections: [
      {
        id: "form",
        heading: "形态：低音已经是属音",
        blocks: [
          {
            type: "p",
            text:
              "在 C 大调，C/G（G–C–E）被称为终止四六：低音 G 是属音，上方 C 与 E 是主和弦的四音与六音。它通常出现在强拍或终止前的重拍，紧接着解决到 G7 或 G。",
            cites: [
              cite("laitz", "Chapter 11 Six-Four Chords and Plagal Motions"),
              cite("sposobin", "第九章 终止四六和弦"),
            ],
          },
          {
            type: "p",
            text:
              "把它标成 I6/4 只描述了音高；从功能上看，它是属功能的双倚音准备：六音 E 下行到五音 D，四音 C 下行到三音 B。低音保持 G，上方两声部同时下行，属功能因此获得更强的落地感。",
            cites: [
              cite("sposobin", "第九章 终止四六和弦"),
              cite("sposobin", "第十三章 经过的与辅助的四六和弦"),
            ],
          },
        ],
      },
      {
        id: "function",
        heading: "为什么它听起来像属",
        blocks: [
          {
            type: "p",
            text:
              "四六和弦的功能取决于节拍位置与前后和弦。经过四六夹在两个和弦之间，辅助四六围绕同一低音；终止四六则在终止前占据重拍，承担属准备。三者的音响相同，句法角色不同。",
            cites: [cite("laitz", "Chapter 11 Six-Four Chords and Plagal Motions")],
          },
          {
            type: "callout",
            title: "分析抓手",
            text: "先看低音是不是属音，再看它是否在重拍、后面是否接 V。三个条件同时成立，才是终止四六。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-cadential-64",
        title: "I6/4 → V7 → I",
        caption: "低音 G 保持；E→D、C→B 同时下行，四六和弦成为属的准备。",
        kind: "progression",
        key: "C",
        tempo: 68,
        beats: 6,
        events: [
          chord(0, 2, ["G3", "C4", "E4"], { label: "I6/4" }),
          chord(2, 2, ["G3", "B3", "D4", "F4"], { label: "V7" }),
          chord(4, 2, ["C3", "E3", "G3", "C4"], { label: "I" }),
        ],
      }),
    ],
    related: ["cadences", "voice-leading", "predominant"],
    review: {
      question: "终止四六为什么不能被简单理解为“主和弦的第二转位”？",
      answer:
        "因为它出现在强拍、低音是属音、上方六音与四音下行解决到属和弦；功能上是属准备/双倚音，而不是稳定的主和弦。",
      hint: "看低音、节拍位置与后续和弦。",
    },
  },
  {
    id: "harmonic-sequence",
    slug: "harmonic-sequence",
    title: "和声模进与走向",
    titleEn: "HARMONIC SEQUENCE",
    number: "H-10",
    category: "harmony",
    level: "进阶",
    aliases: ["和声模进", "模进", "sequence", "diatonic sequence", "real sequence"],
    tags: ["模进", "低音", "方向"],
    dimensions: ["direction", "relationship"],
    summary:
      "和声模进把同一和弦模型移到新的音级：自然模进留在调内，真实模进保持音程结构；它让和声获得方向、延长与段落推力。",
    sections: [
      {
        id: "types",
        heading: "自然模进与真实模进",
        blocks: [
          {
            type: "p",
            text:
              "自然模进在新的音级上重复同一功能模型，但按调内音阶调整和弦质量；真实模进则保持原模型的确切音程结构，常带半音变化。前者留在调性里，后者更容易把调性推远。",
            cites: [
              cite("laitz", "Chapter 19 Harmonic Sequences"),
              cite("sposobin", "第二十六章 自然（调内）模进和副七和弦（模进和弦）"),
            ],
          },
          {
            type: "p",
            text:
              "模进不是无限循环，而是“有目标的重复”：它需要终止、转调或节奏变化来收束。低音的五度循环、级进下行或半音模进，决定模进的方向感与紧张度。",
            cites: [
              cite("sposobin", "第三十三章 半音模进、离调"),
              cite("laitz", "Chapter 19 Harmonic Sequences"),
            ],
          },
        ],
      },
      {
        id: "hearing",
        heading: "听感：重复如何变成方向",
        blocks: [
          {
            type: "p",
            text:
              "连续下行五度的根音运动（A–D–G–C）会自然形成“被吸向主音”的方向；连续上行五度则更像离开。模进的方向与终止的位置共同决定它是推进、延长还是悬置。",
            cites: [cite("levine", "Chapter 2 Major Scale and Progressions（五度圈）")],
          },
          {
            type: "callout",
            title: "写作提示",
            text: "先写低音线，再决定每个模型的和弦质量；不要只复制和弦形状而忽略低音方向。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-descending-fifths-sequence",
        title: "下行五度的模进",
        caption: "A–D–G–C 连续下行五度；同一模型被移到新音级，方向指向 C。",
        kind: "progression",
        key: "C",
        tempo: 76,
        beats: 8,
        events: [
          chord(0, 2, ["A3", "C4", "E4", "G4"], { label: "Am7" }),
          chord(2, 2, ["D3", "F3", "A3", "C4"], { label: "Dm7" }),
          chord(4, 2, ["G3", "B3", "D4", "F4"], { label: "G7" }),
          chord(6, 2, ["C3", "E3", "G3", "B3"], { label: "Cmaj7" }),
        ],
      }),
    ],
    related: ["circle-of-fifths", "bass-line", "modulation"],
    review: {
      question: "自然模进与真实模进的核心区别是什么？",
      answer:
        "自然模进留在调内，按音阶调整和弦质量；真实模进保持原模型的音程结构，常带半音变化，更容易离开原调。",
      hint: "一个守调，一个守形状。",
    },
  },
  {
    id: "diminished-seventh",
    slug: "diminished-seventh",
    title: "减七和弦与等音关系",
    titleEn: "DIMINISHED SEVENTH & ENHARMONIC RELATIONS",
    number: "H-11",
    category: "harmony",
    level: "高级",
    aliases: ["减七和弦", "dim7", "导七", "等音转调", "enharmonic modulation"],
    tags: ["减七", "等音", "转调"],
    dimensions: ["color", "relationship"],
    summary:
      "减七和弦由连续小三度叠成，四个音可等音重写；同一音响因此能指向多个调性中心，是等音转调最常用的枢纽之一。",
    sections: [
      {
        id: "symmetry",
        heading: "对称结构：四个等音拼写",
        blocks: [
          {
            type: "p",
            text:
              "B–D–F–Ab 是 C 大调的导七和弦（Bdim7）。由于每个音之间都是小三度，把任一音当作根音都能得到同一个音响；四个等音拼写分别指向不同调性。",
            cites: [
              cite("sposobin", "第二十二章 导七和弦（DⅦ7）"),
              cite("laitz", "Chapter 28 Tonal Ambiguity and Symmetrically Constructed Harmonies"),
            ],
          },
          {
            type: "p",
            text:
              "在传统功能里，导七解决到主和弦，声部倾向强烈；在转调里，同一个减七可以被重解释为目标调的导七或经过和弦，从而滑向远关系调。",
            cites: [
              cite("sposobin", "第五十七章 等音转调、经过减七和弦的转调"),
              cite("sposobin", "第五十八章 经过属七和弦的等音转调"),
            ],
          },
        ],
      },
      {
        id: "resolution",
        heading: "解决与重解释",
        blocks: [
          {
            type: "p",
            text:
              "减七的解决方向由根音与外声部决定：Bdim7 到 C 时，B 上行到 C，D 到 E，F 到 G，Ab 到 G。若把 Ab 重写为 G#，同一音响就可以被解释为 E 大调的导七，指向 E。",
            cites: [cite("sposobin", "第五十七章 等音转调、经过减七和弦的转调")],
          },
          {
            type: "callout",
            title: "听觉提示",
            text: "减七的张力是“均匀”的，没有单一解决方向；听觉上要抓住低音与目标音，而不是只凭和弦颜色判断调性。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-dim7-resolution",
        title: "Bdim7 → C",
        caption: "B–D–F–Ab 解决到 C；把 Ab 重写为 G#，同一音响就能指向 E。",
        kind: "progression",
        key: "C",
        tempo: 64,
        beats: 8,
        events: [
          chord(0, 4, ["B3", "D4", "F4", "Ab4"], { label: "Bdim7" }),
          chord(4, 4, ["C3", "E3", "G3", "C4"], { label: "C" }),
        ],
      }),
    ],
    related: ["seventh-chords", "tonal-distance", "neapolitan-aug6"],
    review: {
      question: "减七和弦为什么能作为等音转调枢纽？",
      answer:
        "因为它由连续小三度叠成，四个音可等音重写为不同根音的减七，从而分别指向不同调性；重解释后的属准备与终止确认新调。",
      hint: "对称结构 + 等音拼写 + 目标调终止。",
    },
  },
  {
    id: "harmonic-rhythm",
    slug: "harmonic-rhythm",
    title: "和声节奏与密度",
    titleEn: "HARMONIC RHYTHM",
    number: "H-12",
    category: "harmony",
    level: "进阶",
    aliases: ["和声节奏", "harmonic rhythm", "和弦密度", "节拍位置"],
    tags: ["节奏", "密度", "终止"],
    dimensions: ["rhythm", "direction"],
    summary:
      "和声节奏是和弦变化的速率；慢速让色彩停留，快速把音乐推向终止。它决定乐句的呼吸、张力累积与高潮位置。",
    sections: [
      {
        id: "rate",
        heading: "变化速率就是句法",
        blocks: [
          {
            type: "p",
            text:
              "同样四个和弦，一小节一个和一小节两个，会形成完全不同的句法。和声节奏加快通常增加推动力；在终止前加速，会把听众的注意力集中到属—主的落点。",
            cites: [
              cite("laitz", "Chapter 15 Periods"),
              cite("sposobin", "第六十章 和声分析的某些问题"),
            ],
          },
          {
            type: "p",
            text:
              "和声节奏也受旋律与织体影响：旋律音密集时，和弦变化不宜同样密集，否则听感会拥挤。分析时要把和弦变化点与拍号、动机长度一起看。",
            cites: [cite("laitz", "Chapter 9 The Pre-Dominant Function and the Phrase Model")],
          },
        ],
      },
      {
        id: "density",
        heading: "密度与配器",
        blocks: [
          {
            type: "p",
            text:
              "快速和声节奏需要更简单的 voicing：省略五音、保留三音七音、把延伸音限制在一个色彩音。慢速和声节奏则可以展开更宽的声部与更多延伸音。",
            cites: [cite("levine", "Chapter 2 Major Scale and Progressions（声部进行）")],
          },
          {
            type: "callout",
            title: "编曲提示",
            text: "先决定每小节几个和弦，再决定 voicing 的密度；不要用复杂和弦去填满快速的和声节奏。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-accelerating-harmony",
        title: "和声节奏加速进入终止",
        caption: "C 与 F 各占四拍，G7 与 C 各占两拍；变化速率在终止前加快。",
        kind: "progression",
        key: "C",
        tempo: 72,
        beats: 12,
        events: [
          chord(0, 4, ["C3", "E3", "G3"], { label: "I" }),
          chord(4, 4, ["F3", "A3", "C4"], { label: "IV" }),
          chord(8, 2, ["G3", "B3", "D4", "F4"], { label: "V7" }),
          chord(10, 2, ["C3", "E3", "G3", "C4"], { label: "I" }),
        ],
      }),
    ],
    related: ["phrase-structure", "cadences", "bass-line"],
    review: {
      question: "和声节奏加快通常会带来什么句法效果？",
      answer:
        "增加推动力与张力累积，常把注意力推向终止；若过早加速，可能让后面的终止失去空间。",
      hint: "加速是为了抵达，而不是一直加速。",
    },
  },
  {
    id: "harmonic-color",
    slug: "harmonic-color",
    title: "和弦色彩与张力光谱",
    titleEn: "HARMONIC COLOR & TENSION",
    number: "H-13",
    category: "harmony",
    level: "进阶",
    aliases: ["和声色彩", "张力", "tension", "consonance", "dissonance", "chord color"],
    tags: ["色彩", "张力", "延伸音"],
    dimensions: ["color", "brightness", "function"],
    visual: "tension-spectrum",
    summary:
      "和弦色彩是音程内容、张力与语境共同作用的结果；协和与不协和不是二元，而是一条从稳定到紧张的光谱。",
    sections: [
      {
        id: "spectrum",
        heading: "张力不是二元",
        blocks: [
          {
            type: "p",
            text:
              "三和弦比七和弦稳定，七和弦比延伸音和弦稳定；同一个属七加上 b9、#9 或 alt 会进一步增加解决压力。色彩不是“好听/难听”，而是张力位置与解决方向。",
            cites: [
              cite("levine", "Chapter 3 Chord/Scale Theory（“避免”音与变化属七）"),
              cite("laitz", "Chapter 1C Musical Distance: Intervals（Consonant and Dissonant Intervals）"),
            ],
          },
          {
            type: "p",
            text:
              "张力还取决于语境：大七度在终止后可能显得悬浮，在持续音上却可以是稳定的色彩；三全音在属七里要求解决，在调式化和声里可以停留。",
            cites: [cite("laitz", "Chapter 1C Musical Distance: Intervals")],
          },
        ],
      },
      {
        id: "context",
        heading: "语境决定颜色",
        blocks: [
          {
            type: "p",
            text:
              "同一个 Cmaj7 在 C 大调是主和弦，在 F 大调是 V 级延伸，在 G 大调是 IV 级；功能不同，听感也不同。色彩分析必须同时说明“音程内容”和“功能位置”。",
            cites: [cite("sposobin", "第四十六章 属和声组的变和弦")],
          },
          {
            type: "callout",
            title: "分析顺序",
            text: "先标功能，再听张力，最后描述颜色。只写“很爵士”不是分析；要指出哪个音程、哪个延伸音在制造张力。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-tension-spectrum",
        title: "从稳定到紧张再收束",
        caption: "Cmaj7 → Fmaj7 → Dm7 → G7(b9) → Cmaj9：功能链不变，张力先升后降。",
        kind: "progression",
        key: "C",
        tempo: 68,
        beats: 10,
        events: [
          chord(0, 2, ["C3", "E3", "G3", "B3"], { label: "Cmaj7" }),
          chord(2, 2, ["F3", "A3", "C4", "E4"], { label: "Fmaj7" }),
          chord(4, 2, ["D3", "F3", "A3", "C4"], { label: "Dm7" }),
          chord(6, 2, ["G3", "B3", "D4", "F4", "Ab4"], { label: "G7(b9)" }),
          chord(8, 2, ["C3", "E3", "G3", "B3", "D4"], { label: "Cmaj9" }),
        ],
      }),
    ],
    related: ["extensions-alterations", "chord-scale", "modal-mixture-color"],
    review: {
      question: "为什么同一个和弦在不同调性/进行中会有不同颜色？",
      answer:
        "因为色彩由音程内容、功能位置、前后和弦与声部进行共同决定；同一音高集合在不同功能中承担不同张力与解决方向。",
      hint: "音程 + 功能 + 语境。",
    },
  },
  {
    id: "modal-mixture-color",
    slug: "modal-mixture-color",
    title: "明暗轴线：同主音交替",
    titleEn: "MODAL MIXTURE & BRIGHTNESS",
    number: "H-14",
    category: "harmony",
    level: "进阶",
    aliases: ["调式交替", "同主音大小调", "借用和弦", "modal mixture", "brightness", "bVI", "iv"],
    tags: ["明暗", "借用", "调式"],
    dimensions: ["brightness", "color", "relationship"],
    summary:
      "同主音大小调交替是调性内部最重要的明暗轴：把平行小调的 iv、bVI、bIII、bVII 借进大调，主音不变而色彩变暗。",
    sections: [
      {
        id: "axis",
        heading: "明暗不是大调/小调的二元",
        blocks: [
          {
            type: "p",
            text:
              "C 大调可以借用 C 小调的 Fm（iv）、Ab（bVI）、Eb（bIII）与 Bb（bVII）。这些和弦不改变主音 C，却把小调的暗色带入大调；借用的程度可以从单个 iv 到整段调式交替。",
            cites: [
              cite("laitz", "Chapter 21 Modal Mixture"),
              cite("sposobin", "第四十九章 交替大小调体系"),
            ],
          },
          {
            type: "p",
            text:
              "iv–I 的变格进行最柔和；bVI–V 制造突然的暗色转折；bVII–I 则像流行/摇滚的“回到主音前的松弛”。同一借用手法在不同功能位置上产生不同明暗强度。",
            cites: [
              cite("sposobin", "第五十章 交替大小调的降Ⅵ级三和弦（tsⅥ）"),
              cite("sposobin", "第十九章 和声大调"),
            ],
          },
        ],
      },
      {
        id: "voice-leading",
        heading: "借用也要解决",
        blocks: [
          {
            type: "p",
            text:
              "借用和弦的变音来自同主音小调，而不是远关系转调。写分析时要标出来源（如 iv from parallel minor），并说明变音如何解决：b6 常下行到 5，b3 常解决到 2 或 1。",
            cites: [cite("laitz", "Chapter 21 Modal Mixture")],
          },
          {
            type: "callout",
            title: "不要和转调混淆",
            text: "借用之后通常回到原调主音；如果新调建立自己的终止，才考虑转调。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-mixture-brightness",
        title: "I → bVI → iv → V7 → I",
        caption: "Ab 与 Fm 来自同主音 C 小调；主音仍是 C，但明暗在四个和弦内完成一次往返。",
        kind: "progression",
        key: "C",
        tempo: 68,
        beats: 10,
        events: [
          chord(0, 2, ["C3", "E3", "G3"], { label: "I" }),
          chord(2, 2, ["Ab3", "C4", "Eb4"], { label: "bVI" }),
          chord(4, 2, ["F3", "Ab3", "C4"], { label: "iv" }),
          chord(6, 2, ["G3", "B3", "D4", "F4"], { label: "V7" }),
          chord(8, 2, ["C3", "E3", "G3", "C4"], { label: "I" }),
        ],
      }),
    ],
    related: ["borrowed-chords", "neapolitan-aug6", "harmonic-color"],
    review: {
      question: "C 大调中的 bVI 与 iv 分别如何改变明暗？",
      answer:
        "bVI（Ab）带来突然的暗色与远距离感，常接 V 或 I；iv（Fm）是下属功能的暗色替换，常用 iv–I 的变格收束。",
      hint: "一个偏色彩转折，一个偏下属功能。",
    },
  },
  {
    id: "tonal-distance",
    slug: "tonal-distance",
    title: "调性距离与和声关系",
    titleEn: "TONAL DISTANCE & KEY RELATIONS",
    number: "H-15",
    category: "harmony",
    level: "进阶",
    aliases: ["调性距离", "调性关系", "tonal distance", "key relations", "近关系调", "远关系调"],
    tags: ["转调", "关系", "调性"],
    dimensions: ["relationship", "direction"],
    summary:
      "调性距离由共同和弦数量、调号差距与主音关系共同决定；近关系调用枢轴和弦，远关系调需要半音中介、等音或模进。",
    sections: [
      {
        id: "scale",
        heading: "距离的刻度",
        blocks: [
          {
            type: "p",
            text:
              "相差一个调号的调（如 C 与 G）共享最多自然音和弦，最容易通过共同和弦转调；相差两个调号开始需要更多半音化准备；相差三至六个调号则依赖等音、模进或直接并置。",
            cites: [
              cite("sposobin", "第三十一章 调性关系的类型"),
              cite("sposobin", "第五十一章 调性关系的等级、相差两个调号的转调"),
              cite("sposobin", "第五十二章 相差三至六个调号的转调"),
            ],
          },
          {
            type: "p",
            text:
              "主音关系也重要：关系大小调共享调号，但主音不同；同主音大小调共享主音，却相差三个调号。两种“近”是不同维度的近。",
            cites: [cite("laitz", "Chapter 18 Modulation")],
          },
        ],
      },
      {
        id: "strategy",
        heading: "距离决定策略",
        blocks: [
          {
            type: "p",
            text:
              "近关系调优先找枢轴和弦；远关系调可以用半音声部、减七/属七等音重解释，或用模进把听众带到新调。距离越远，越需要更多时间来确认新调。",
            cites: [
              cite("sposobin", "第三十四章 转调"),
              cite("sposobin", "第三十五章 到一级关系调的转调"),
            ],
          },
          {
            type: "callout",
            title: "分析提示",
            text: "不要只算调号。共同和弦、主音关系、终止确认与持续时间共同决定“听起来有多远”。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-pivot-distance",
        title: "C 大调 → G 大调",
        caption: "Am7 是枢轴：C 的 vi7，也是 G 的 ii7；D7 随后把 G 变成新主音。",
        kind: "progression",
        key: "C",
        tempo: 72,
        beats: 8,
        events: [
          chord(0, 2, ["C3", "E3", "G3", "B3"], { label: "C: Imaj7" }),
          chord(2, 2, ["A3", "C4", "E4", "G4"], { label: "vi7 = ii7" }),
          chord(4, 2, ["D3", "F#3", "A3", "C4"], { label: "V7 of G" }),
          chord(6, 2, ["G3", "B3", "D4", "G4"], { label: "G: I" }),
        ],
      }),
    ],
    related: ["modulation", "circle-of-fifths", "secondary-dominants"],
    review: {
      question: "一级关系调与二级关系调的核心差别是什么？",
      answer:
        "一级关系调相差一个调号、共同和弦最多，最容易枢轴转调；二级关系调相差两个调号，需要更多半音准备或更长的确认。",
      hint: "调号差距 + 共同和弦数量。",
    },
  },
  {
    id: "bass-line",
    slug: "bass-line",
    title: "低音线与和声走向",
    titleEn: "THE BASS LINE",
    number: "H-16",
    category: "harmony",
    level: "进阶",
    aliases: ["低音线", "bass line", "级进低音", "pedal", "持续音", "line cliché"],
    tags: ["低音", "走向", "转位"],
    dimensions: ["direction", "relationship", "color"],
    summary:
      "低音线是和声的骨架：级进下行、五度循环、持续音与半音线各自讲述不同的方向；和弦选择常由低音决定。",
    sections: [
      {
        id: "narratives",
        heading: "低音的四种叙事",
        blocks: [
          {
            type: "list",
            items: [
              "级进下行：C–B–A–G–F–E–D–G–C，常配转位与经过和弦，形成 line cliché 或 lament 的低音。",
              "五度循环：A–D–G–C，连续下行五度，方向最明确。",
              "持续音：低音不动，上方和弦变化，制造调式化/悬浮感。",
              "半音线：低音半音移动，常用于转调、减七或色彩突变。",
            ],
            cites: [
              cite("laitz", "Chapter 13 The Submediant and the Step-Descent Bass"),
              cite("sposobin", "第四十八章 持续音"),
            ],
          },
          {
            type: "p",
            text:
              "低音不仅决定转位，也决定听者如何理解功能。C/E 与 C 的差别不只是低音，它改变了稳定性与下一个和弦的连接方式。",
            cites: [cite("sposobin", "第三章 原位三和弦的连接")],
          },
        ],
      },
      {
        id: "writing",
        heading: "先写低音，再填和弦",
        blocks: [
          {
            type: "p",
            text:
              "写作时先确定低音的走向，再选择和弦质量与转位；这样声部进行会更自然，也更容易避免为了和弦标签而写出不合理的低音跳进。",
            cites: [cite("laitz", "Chapter 13 The Submediant and the Step-Descent Bass")],
          },
          {
            type: "callout",
            title: "听觉练习",
            text: "用低音单音弹一条级进线，再在每个低音上试三种和弦：原位、第一转位、七和弦。听哪一种最能保持线的连续。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-stepwise-bass",
        title: "级进下行低音",
        caption: "低音 C–B–A–G–F–E–D–G–C；和弦随低音改变，但线条保持连续。",
        kind: "progression",
        key: "C",
        tempo: 68,
        beats: 18,
        events: [
          chord(0, 2, ["C3", "E3", "G3"], { label: "I" }),
          chord(2, 2, ["B2", "D3", "G3"], { label: "V6" }),
          chord(4, 2, ["A2", "C3", "E3"], { label: "vi" }),
          chord(6, 2, ["G2", "B2", "E3"], { label: "I6" }),
          chord(8, 2, ["F2", "A2", "C3"], { label: "IV" }),
          chord(10, 2, ["E2", "G2", "C3"], { label: "I6/4" }),
          chord(12, 2, ["D3", "F3", "A3", "C4"], { label: "ii7" }),
          chord(14, 2, ["G2", "B2", "D3", "F3"], { label: "V7" }),
          chord(16, 2, ["C3", "E3", "G3", "C4"], { label: "I" }),
        ],
      }),
    ],
    related: ["voice-leading", "harmonic-sequence", "tritone-substitution"],
    review: {
      question: "级进下行低音常见的和声效果是什么？",
      answer:
        "它制造连续、叹息式或 line-cliché 的走向，让转位与经过和弦自然连接；低音的级进比根音跳进更能保持声部连贯。",
      hint: "低音是线，和弦是线上的点。",
    },
  },
  {
    id: "phrase-structure",
    slug: "phrase-structure",
    title: "乐段、乐句与和声句法",
    titleEn: "PHRASE STRUCTURE & HARMONIC SYNTAX",
    number: "H-17",
    category: "harmony",
    level: "进阶",
    aliases: ["乐段", "乐句", "period", "sentence", "phrase", "句法"],
    tags: ["曲式", "终止", "句法"],
    dimensions: ["rhythm", "direction", "function"],
    summary:
      "乐段由前句与后句构成，终止式决定两句的呼应关系；和声句法不是四小节分组，而是“出发—偏离—回归”的完整动作。",
    sections: [
      {
        id: "period",
        heading: "前句与后句",
        blocks: [
          {
            type: "p",
            text:
              "最常见的前句停在不完全终止或半终止，后句用完全终止回应。前句提出方向，后句完成收束；两句的终止关系比小节数更能定义乐段。",
            cites: [
              cite("laitz", "Chapter 15 Periods"),
              cite("sposobin", "第八章 终止、乐段、乐句"),
            ],
          },
          {
            type: "p",
            text:
              "乐句可以进一步分为乐节与动机；动机的重复、模进与变奏把和声推向终止。句法分析要同时看动机、低音与终止，而不是只看和弦序列。",
            cites: [cite("laitz", "Chapter 16 Sentences, Double Periods, and Asymmetric Periods")],
          },
        ],
      },
      {
        id: "syntax",
        heading: "终止决定句法",
        blocks: [
          {
            type: "p",
            text:
              "半终止把音乐停在属，制造“未完”；完全终止把低音与最高声部同时落到主音，制造“完成”。阻碍终止用 vi 延迟完成，扩展乐段。",
            cites: [cite("sposobin", "第八章 终止、乐段、乐句")],
          },
          {
            type: "callout",
            title: "分析顺序",
            text: "先找终止，再划分前句/后句；不要从第一小节开始数四小节。终止是句法的标点。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-period-cadences",
        title: "前句半终止 → 后句完全终止",
        caption: "前句 C–F–G7 停在半终止；后句 C–Am–Dm–G7–C 用完全终止回应。",
        kind: "progression",
        key: "C",
        tempo: 72,
        beats: 16,
        events: [
          chord(0, 2, ["C3", "E3", "G3"], { label: "I" }),
          chord(2, 2, ["F3", "A3", "C4"], { label: "IV" }),
          chord(4, 2, ["G3", "B3", "D4", "F4"], { label: "V7 · HC" }),
          chord(6, 2, ["C3", "E3", "G3"], { label: "I" }),
          chord(8, 2, ["A3", "C4", "E4", "G4"], { label: "vi7" }),
          chord(10, 2, ["D3", "F3", "A3", "C4"], { label: "ii7" }),
          chord(12, 2, ["G3", "B3", "D4", "F4"], { label: "V7" }),
          chord(14, 2, ["C3", "E3", "G3", "C4"], { label: "I · PAC" }),
        ],
      }),
    ],
    related: ["cadences", "harmonic-rhythm", "predominant"],
    review: {
      question: "乐段的定义更依赖小节数还是终止关系？",
      answer:
        "更依赖终止关系与前后句的呼应；半终止/完全终止的配对比固定四小节更能定义乐段。",
      hint: "终止是句法标点。",
    },
  },
  {
    id: "modal-characteristics",
    slug: "modal-characteristics",
    number: "H-18",
    title: "中古调式：特征音与调式和弦",
    titleEn: "CHURCH MODES: CHARACTERISTIC TONES & MODAL CHORDS",
    category: "harmony",
    level: "高级",
    aliases: ["中古调式", "教会调式", "church modes", "特征音", "调式和弦", "modal characteristics"],
    tags: ["调式", "特征音", "调式终止"],
    dimensions: ["brightness", "color", "relationship"],
    summary:
      "七种中古调式共用同一组音高，但主音不同；每种调式的特征音与包含特征音的和弦，决定它的色彩与“调式终止”，而不是大小调的 V–I。",
    sections: [
      {
        id: "seven-modes",
        heading: "七种调式与特征音",
        blocks: [
          {
            type: "list",
            items: [
              "Ionian：自然大调；主和弦为大三和弦，特征就是大调本身。",
              "Dorian：降三、大六；特征音是大六，相对自然小调更明亮。",
              "Phrygian：降二；特征音是降二，主和弦为小三和弦。",
              "Lydian：升四；特征音是升四，比自然大调更明亮。",
              "Mixolydian：降七；特征音是降七，主和弦为大三和弦。",
              "Aeolian：降三、降六、降七；特征音是降六，即自然小调。",
              "Locrian：降二、降五、降七；主和弦为减三和弦，常避免单独使用。",
            ],
            cites: [
              cite("laitz", "Chapter 1A Musical Space: Pitches, Scales, and Keys"),
              cite("levine", "Chapter 2 Major Scale and Progressions（调式）"),
            ],
          },
          {
            type: "p",
            text:
              "判断调式不能只把大调音阶从不同音开始弹。先以同一主音比较：三音是大三还是小三，决定大调类或小调类；再找与自然大调/自然小调不同的那个音，它就是特征音。没有出现特征音，听者往往仍会把它听回大调或小调。",
            cites: [cite("laitz", "Chapter 1A Musical Space: Pitches, Scales, and Keys")],
          },
        ],
      },
      {
        id: "modal-chords",
        heading: "调式和弦与调式终止",
        blocks: [
          {
            type: "p",
            text:
              "调式和声没有完整的 T–PD–D–T 功能链，一级是唯一稳定的主功能。包含特征音的大三和弦或小七和弦可以充当“调式终止”和弦：Dorian 的 IV 大、Phrygian 的 bII 大、Lydian 的 II 大或 vii 小、Mixolydian 的 bVII 大。它们靠特征音回到主和弦，而不是靠导音。",
            cites: [
              cite("levine", "Chapter 2 Major Scale and Progressions（调式爵士）"),
              cite("laitz", "Chapter 30 Centricity, Extended and Non-Tertian Sonorities, and Collections"),
            ],
          },
          {
            type: "p",
            text:
              "减三和弦与半减七和弦通常要谨慎：它们含三全音，容易把耳朵拉回大小调的属—主解决。调式音乐更常用持续低音、四度排列与特征音和弦来建立中心，而不是连续 V–I。",
            cites: [
              cite("sposobin", "第二十七章 俄罗斯音乐中的自然调式"),
              cite("laitz", "Chapter 30 Centricity, Extended and Non-Tertian Sonorities, and Collections"),
            ],
          },
          {
            type: "callout",
            title: "判断顺序",
            text: "主音 → 三音（大/小调类）→ 特征音 → 含特征音的和弦 → 是否靠 V–I 收束。五步都清楚，才说得出“这是哪一种调式”。",
          },
          {
            type: "callout",
            title: "同一集合试听",
            text: "本页五条谱例共用 C 大调集合：D Dorian、E Phrygian、F Lydian、G Mixolydian、A Aeolian——只换主音，不换音高；对照听特征音，比孤立背音阶有效。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-dorian-modal",
        title: "D Dorian：i7 – IV – i7",
        caption: "Dm7–G–Dm7；G 大三和弦包含 Dorian 的大六 B，是特征音和弦，不靠导音回主音。",
        kind: "progression",
        key: "C",
        tempo: 70,
        beats: 12,
        events: [
          chord(0, 4, ["D3", "F3", "A3", "C4"], { label: "Dm7" }),
          chord(4, 4, ["G3", "B3", "D4", "G4"], { label: "IV (Dorian)" }),
          chord(8, 4, ["D3", "F3", "A3", "C4"], { label: "Dm7" }),
        ],
      }),
      example({
        id: "ex-phrygian-modal",
        title: "E Phrygian：i – bII – i",
        caption: "Em–F–Em；特征音是与主音相距小二度的 F，bII 大三和弦直接落回 i，不走导音。",
        kind: "progression",
        key: "C",
        tempo: 70,
        beats: 12,
        events: [
          chord(0, 4, ["E3", "G3", "B3"], { label: "i" }),
          chord(4, 4, ["F3", "A3", "C4"], { label: "bII (Phrygian)" }),
          chord(8, 4, ["E3", "G3", "B3"], { label: "i" }),
        ],
      }),
      example({
        id: "ex-lydian-modal",
        title: "F Lydian：I – II – I",
        caption: "F–G–F；G 大三和弦包含升四度 B，II 大是 Lydian 的特征和弦，比自然大调更亮。",
        kind: "progression",
        key: "C",
        tempo: 70,
        beats: 12,
        events: [
          chord(0, 4, ["F3", "A3", "C4"], { label: "I" }),
          chord(4, 4, ["G3", "B3", "D4"], { label: "II (Lydian)" }),
          chord(8, 4, ["F3", "A3", "C4"], { label: "I" }),
        ],
      }),
      example({
        id: "ex-mixolydian-modal",
        title: "G Mixolydian：I – bVII – I",
        caption: "G–F–G；F 大三和弦包含降七度 F，bVII 回到主音时不经过属功能。",
        kind: "progression",
        key: "C",
        tempo: 70,
        beats: 12,
        events: [
          chord(0, 4, ["G3", "B3", "D4"], { label: "I" }),
          chord(4, 4, ["F3", "A3", "C4"], { label: "bVII (Mixolydian)" }),
          chord(8, 4, ["G3", "B3", "D4"], { label: "I" }),
        ],
      }),
      example({
        id: "ex-aeolian-modal",
        title: "A Aeolian：i7 – bVI – i7",
        caption: "Am7–F–Am7；F 大三和弦包含降六度 F，把自然小调的暗色留在主音 A 上。",
        kind: "progression",
        key: "C",
        tempo: 70,
        beats: 12,
        events: [
          chord(0, 4, ["A3", "C4", "E4", "G4"], { label: "i7" }),
          chord(4, 4, ["F3", "A3", "C4"], { label: "bVI (Aeolian)" }),
          chord(8, 4, ["A3", "C4", "E4", "G4"], { label: "i7" }),
        ],
      }),
    ],
    related: ["modes", "modal-harmony", "borrowed-chords", "modal-interchange"],
    review: {
      question: "Dorian 的特征音是什么？它常用的调式终止和弦是哪一个？",
      answer:
        "特征音是大六（相对自然小调）；常用 IV 大三和弦作为含特征音的调式终止和弦，回到 i。",
      hint: "先比较同主音自然小调，再找大六。",
    },
  },
  {
    id: "modal-interchange",
    slug: "modal-interchange",
    number: "H-19",
    title: "调式互换：七种调式的借用",
    titleEn: "MODAL INTERCHANGE",
    category: "harmony",
    level: "高级",
    aliases: ["调式互换", "调式转换", "modal interchange", "modal mixture", "高阶调式转换", "borrowed chords"],
    tags: ["调式", "借用", "色彩"],
    dimensions: ["brightness", "color", "relationship"],
    summary:
      "调式互换不止从平行小调借 bVI/iv；它可以把同主音的 Dorian、Phrygian、Lydian、Mixolydian 的特征和弦借进当前调，用色彩变化替代转调。",
    sections: [
      {
        id: "beyond-minor",
        heading: "从平行小调到七种调式",
        blocks: [
          {
            type: "p",
            text:
              "传统调式交替主要借平行小调：iv、bVI、bIII、bVII。现代和声把借用扩展到所有同主音调式：C Dorian 的 IV 大（F）、C Phrygian 的 bII（Db）、C Lydian 的 II 大（D）与 #IV（F#）、C Mixolydian 的 bVII（Bb）。它们的共同点是主音仍是 C，只换“灯光”。",
            cites: [
              cite("laitz", "Chapter 21 Modal Mixture"),
              cite("levine", "Chapter 3 Chord/Scale Theory（大调音阶和声）"),
            ],
          },
          {
            type: "p",
            text:
              "借用和弦的功能取决于它接到哪里：bII 常作为 Phrygian 色彩或那不勒斯式下属，IV 大可以是 Dorian 色彩，bVII 常作为 Mixolydian/后门回到 I。分析时先标借用来源，再看它是否解决回原主音。",
            cites: [
              cite("sposobin", "第四十九章 交替大小调体系"),
              cite("levine", "Chapter 14 Advanced Reharmonization"),
            ],
          },
        ],
      },
      {
        id: "borrow-or-modulate",
        heading: "借用还是转调",
        blocks: [
          {
            type: "p",
            text:
              "借用不搬主音：听者仍知道家在 C，借用后通常回到 C 或 G7。转调则让新调获得自己的属—主与终止，并持续足够长。区分的关键不是变化音，而是“中心有没有搬”。",
            cites: [
              cite("laitz", "Chapter 22 Chromatic Modulation and Text-Music Relations"),
              cite("sposobin", "第三十四章 转调"),
            ],
          },
          {
            type: "callout",
            title: "三步检查",
            text: "先锁低音/主音是否仍是 C；再找特征音来自哪条同主音调式；最后看后面有没有新调的终止。三步都指向 C，就是互换而不是转调。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-interchange",
        title: "C – Ab – Bb – C",
        caption: "Ab（bVI，来自 C Aeolian）与 Bb（bVII，来自 C Mixolydian）都围绕 C，最后回到主音。",
        kind: "progression",
        key: "C",
        tempo: 74,
        beats: 12,
        events: [
          chord(0, 3, ["C3", "E3", "G3"], { label: "I" }),
          chord(3, 3, ["Ab3", "C4", "Eb4"], { label: "bVI" }),
          chord(6, 3, ["Bb3", "D4", "F4"], { label: "bVII" }),
          chord(9, 3, ["C3", "E3", "G3"], { label: "I" }),
        ],
      }),
    ],
    related: ["borrowed-chords", "modal-characteristics", "modal-mixture-color", "modulation"],
    review: {
      question: "C 大调里的 bII、IV 大、bVII 分别可以来自哪条同主音调式？",
      answer: "bII 来自 C Phrygian，IV 大来自 C Dorian，bVII 来自 C Mixolydian。",
      hint: "先锁主音 C，再找特征音。",
    },
  },
  {
    id: "quartal-harmony",
    slug: "quartal-harmony",
    number: "H-20",
    title: "四度和声与四度排列",
    titleEn: "QUARTAL HARMONY",
    category: "harmony",
    level: "高级",
    aliases: ["四度和声", "四度排列", "quartal harmony", "quartal voicing", "So What voicing"],
    tags: ["排列", "调式", "色彩"],
    dimensions: ["color", "relationship"],
    summary:
      "四度和声用四度叠置代替三度叠置，弱化大小性质，让和弦变成“整体调式颜色”；它常与持续低音、调式化和声结合使用。",
    sections: [
      {
        id: "stacking",
        heading: "四度叠置与性质模糊",
        blocks: [
          {
            type: "p",
            text:
              "四度叠置没有三音，听者很难判断它是大和弦还是小和弦；它听到的是一片音程颜色。调内四度既包含纯四度，也可能包含增四度，后者由音阶自然产生，不需要额外解释成变化音。",
            cites: [
              cite("laitz", "Chapter 30 Centricity, Extended and Non-Tertian Sonorities, and Collections"),
              cite("levine", "Chapter 13 Basic Reharmonization"),
            ],
          },
          {
            type: "p",
            text:
              "四度和声最适合调式化语境：低音保持主音，上方四度结构移动，整体仍属于同一条调式。它也可以作为调性进行中的色彩插入，但插入后要回到功能和声的目标，否则会失去方向。",
            cites: [cite("levine", "Chapter 13 Basic Reharmonization")],
          },
        ],
      },
      {
        id: "so-what",
        heading: "So What 排列与持续低音",
        blocks: [
          {
            type: "p",
            text:
              "《So What》的经典排列以四度为主：D–G–C–F，再在顶部加一个大三度 A，形成 Dm11 的色彩。两个平行小七和弦相差半音移动，低音与和弦一起上移，没有属—主终止。",
            cites: [cite("levine", "Chapter 2 Major Scale and Progressions（调式爵士）")],
          },
          {
            type: "callout",
            title: "写作顺序",
            text: "先定主音与调式，再选四度排列，保持低音，最后用特征音定位。不要把四度和弦当成“没有根音的和弦”；根音在低音里。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-quartal-so-what",
        title: "Dm11 四度排列 → Ebm11 → Dm11",
        caption: "D–G–C–F–A 与 Eb–Ab–Db–Gb–Bb 是同一结构平移半音；低音持续调式中心。",
        kind: "progression",
        key: "C",
        tempo: 62,
        beats: 12,
        events: [
          chord(0, 4, ["D3", "G3", "C4", "F4", "A4"], { label: "Dm11 (quartal)" }),
          chord(4, 4, ["Eb3", "Ab3", "Db4", "Gb4", "Bb4"], { label: "Ebm11 (quartal)" }),
          chord(8, 4, ["D3", "G3", "C4", "F4", "A4"], { label: "Dm11" }),
        ],
      }),
    ],
    related: ["modal-harmony", "modal-characteristics", "hybrid-chords"],
    review: {
      question: "四度和弦为什么听起来性质模糊？它靠什么确定调式中心？",
      answer:
        "因为它通常没有三音，无法直接区分大小；调式中心由持续低音、音阶与特征音确定，而不是由和弦质量确定。",
      hint: "没有三音，根音在低音。",
    },
  },
  {
    id: "hybrid-chords",
    slug: "hybrid-chords",
    number: "H-21",
    title: "混合和弦、复合和弦与斜杠和弦",
    titleEn: "HYBRID, POLY & SLASH CHORDS",
    category: "harmony",
    level: "高级",
    aliases: ["混合和弦", "复合和弦", "斜杠和弦", "hybrid chords", "poly chords", "upper structure", "slash chords"],
    tags: ["排列", "色彩", "低音"],
    dimensions: ["color", "relationship"],
    summary:
      "斜杠和弦不只是转位：低音是弦内音时是转位；上方结构缺三音时是混合和弦；两个完整三和弦叠置时是复合和弦。三类都靠低音与上层结构的分离制造色彩。",
    sections: [
      {
        id: "three-types",
        heading: "三种斜杠结构",
        blocks: [
          {
            type: "list",
            items: [
              "转位：低音是和弦的根、三、五或七音；功能不变，低音线改变。",
              "混合和弦：低音与上方结构分离，上方通常省略根音与三音，性质模糊。",
              "复合和弦：两个完整三和弦/七和弦叠置，上下各有清晰质量，整体形成高叠和弦。",
            ],
            cites: [
              cite("levine", "Chapter 5 Slash Chords"),
              cite("laitz", "Chapter 30 Centricity, Extended and Non-Tertian Sonorities, and Collections"),
            ],
          },
          {
            type: "p",
            text:
              "判断斜杠和弦先问低音是不是弦内音。如果是根/三/五/七，它多半只是转位；如果低音与上方结构无法合并成一个普通和弦，才进入混合或复合的范畴。九、十一、十三音一般不做低音，否则会被听成另一个和弦。",
            cites: [cite("levine", "Chapter 5 Slash Chords")],
          },
        ],
      },
      {
        id: "bass-color",
        heading: "低音决定功能，上层决定颜色",
        blocks: [
          {
            type: "p",
            text:
              "G/C 的低音是 C，上方是 G 三和弦；它没有三音 E，因此既不是普通 C 大三，也不是普通 G。D/C 则把 D 三和弦压在 C 上，得到类似 Cmaj7#11 的色彩。低音提供功能位置，上层结构提供颜色与张力。",
            cites: [
              cite("levine", "Chapter 5 Slash Chords"),
              cite("levine", "Chapter 13 Basic Reharmonization"),
            ],
          },
          {
            type: "callout",
            title: "配器提醒",
            text: "混合和弦最容易在低音区糊掉。把上层结构放在中高音区，低音只留根音或五音；先用钢琴听清两个结构，再分配给乐队。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-hybrid-slash",
        title: "C – G/C – D/C – C",
        caption: "G/C 与 D/C 都保留了 C 低音；上方三和弦改变色彩，但功能位置仍围绕 C。",
        kind: "progression",
        key: "C",
        tempo: 68,
        beats: 12,
        events: [
          chord(0, 3, ["C3", "E3", "G3"], { label: "C" }),
          chord(3, 3, ["C3", "G3", "B3", "D4"], { label: "G/C" }),
          chord(6, 3, ["C3", "D4", "F#4", "A4"], { label: "D/C" }),
          chord(9, 3, ["C3", "E3", "G3", "C4"], { label: "C" }),
        ],
      }),
    ],
    related: ["bass-line", "rootless-voicings", "quartal-harmony"],
    review: {
      question: "斜杠和弦中，转位、混合和弦与复合和弦的区别是什么？",
      answer:
        "转位的低音是和弦内音；混合和弦的上层省略根音/三音、性质模糊；复合和弦由两个完整和弦叠置而成。",
      hint: "先看低音是不是弦内音，再看上层有没有完整三音。",
    },
  },
  {
    id: "non-functional-dominants",
    slug: "non-functional-dominants",
    number: "H-22",
    title: "无功能属和弦与相邻属和弦",
    titleEn: "NON-FUNCTIONAL DOMINANTS",
    category: "harmony",
    level: "高级",
    aliases: ["无功能属和弦", "相邻属和弦", "non-functional dominant", "adjacent dominants", "没有属功能的属和弦"],
    tags: ["属七", "无功能", "模进"],
    dimensions: ["function", "color", "relationship"],
    visual: "dominant-path",
    summary:
      "属七的音响不等于属功能：当属七不向下五度解决，而是平行上行、停留或解决到非主和弦时，它变成色彩和弦/相邻属和弦，功能被悬置。",
    sections: [
      {
        id: "sound-vs-function",
        heading: "属七音响与属功能",
        blocks: [
          {
            type: "p",
            text:
              "属功能由三全音的解决方向定义：三音上行、七音下行，目标通常是主和弦。若一个属七和弦没有这个解决方向，它可能只是借用了属七的音响，例如 bVI7、bIII7、bVII7 或 II7 作为色彩和弦。",
            cites: [
              cite("levine", "Chapter 13 Basic Reharmonization"),
              cite("sposobin", "第五十六章 意外进行"),
            ],
          },
          {
            type: "p",
            text:
              "分析时不要看到属七就标 V/x。先看根音是否下行五度或小二度解决，再看三全音是否按属功能解决；两者都不成立时，按色彩和弦或相邻属和弦处理，而不是硬套副属。",
            cites: [
              cite("laitz", "Chapter 30 Centricity, Extended and Non-Tertian Sonorities, and Collections"),
              cite("levine", "Chapter 14 Advanced Reharmonization"),
            ],
          },
        ],
      },
      {
        id: "adjacent",
        heading: "相邻属和弦与渐进转调",
        blocks: [
          {
            type: "p",
            text:
              "相邻属和弦是连续上行的属七：小二度、大二度或小三度。它们彼此平等，不要求解决，常用来配模进旋律、掩盖功能、延伸终止，或在最后突然解决形成渐进转调。音阶多用 Mixolydian 或 Lydian dominant，而不是解决压力很强的 alt。",
            cites: [
              cite("levine", "Chapter 13 Basic Reharmonization"),
              cite("laitz", "Chapter 29 Symmetry Stretches Tonality: Chromatic Sequences and Equal Divisions of the Octave"),
              cite("sposobin", "第五十五章 转调模进"),
            ],
          },
          {
            type: "callout",
            title: "判断顺序",
            text: "根音是否下行五度/小二度解决？三全音是否按属功能解决？若都没有，先按色彩/相邻属和弦分析；只有目标明确时，才写 V/x。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-adjacent-dominants",
        title: "C7 – D7 – Eb7 – Ab7 – Db",
        caption: "相邻属和弦连续上行；最后 Ab7 才下行五度解决到 Db，形成渐进转调。",
        kind: "progression",
        key: "C",
        tempo: 76,
        beats: 10,
        events: [
          chord(0, 2, ["C3", "E3", "G3", "Bb3"], { label: "C7" }),
          chord(2, 2, ["D3", "F#3", "A3", "C4"], { label: "D7" }),
          chord(4, 2, ["Eb3", "G3", "Bb3", "Db4"], { label: "Eb7" }),
          chord(6, 2, ["Ab3", "C4", "Eb4", "Gb4"], { label: "Ab7" }),
          chord(8, 2, ["Db3", "F3", "Ab3", "Db4"], { label: "Db" }),
        ],
      }),
    ],
    related: ["secondary-dominants", "tritone-substitution", "harmonic-sequence", "constant-structure"],
    review: {
      question: "为什么一个属七和弦不一定该标成 V/x？",
      answer:
        "属功能需要三全音的明确解决方向。若它不向下五度/小二度解决，也没有解决到目标和弦，它可能只是色彩和弦或相邻属和弦。",
      hint: "先听解决方向，再写级数。",
    },
  },
  {
    id: "constant-structure",
    slug: "constant-structure",
    number: "H-23",
    title: "固定结构与平行和弦",
    titleEn: "CONSTANT STRUCTURE & PLANING",
    category: "harmony",
    level: "高级",
    aliases: ["固定结构", "平行和弦", "constant structure", "planing", "平行进行"],
    tags: ["排列", "无功能", "色彩"],
    dimensions: ["color", "relationship"],
    summary:
      "固定结构把同一种和弦质量按固定音程平移，所有和弦“平等”，功能被削弱；它用平行色彩与模进制造方向，而不是属—主解决。",
    sections: [
      {
        id: "parallel",
        heading: "同质量平移",
        blocks: [
          {
            type: "p",
            text:
              "固定结构（constant structure）保持和弦质量不变，只改变根音：连续的大七、连续的小七、连续的属七都可以。每个和弦的内部音程相同，听者听到的是平行色彩带，而不是功能层级。",
            cites: [
              cite("laitz", "Chapter 28 Tonal Ambiguity and Symmetrically Constructed Harmonies"),
              cite("levine", "Chapter 14 Advanced Reharmonization"),
            ],
          },
          {
            type: "p",
            text:
              "平行进行会削弱倾向音的解决：每个声部都按同一方向移动，导音与七音不再各自履行功能。正因如此，固定结构常被用来制造悬浮、梦幻或调式化的段落；若要回到功能，必须在一个明确的目标和弦上停下来。",
            cites: [cite("laitz", "Chapter 29 Symmetry Stretches Tonality: Chromatic Sequences and Equal Divisions of the Octave")],
          },
        ],
      },
      {
        id: "functional-or-not",
        heading: "有功能与无功能之间",
        blocks: [
          {
            type: "p",
            text:
              "固定结构不必然无功能。若平行段落最后接上真正的 V–I，它就被功能收束；若一直平移而没有目标，它更接近无功能和声。判断时要看终点，而不是只看中间是否平行。",
            cites: [
              cite("sposobin", "第五十五章 转调模进"),
              cite("levine", "Chapter 13 Basic Reharmonization"),
            ],
          },
          {
            type: "callout",
            title: "写作抓手",
            text: "先确定平移音程（半音、全音、小三度），再决定终点是否有功能。平行段越长，终点越需要清楚，否则听众会失去方向。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-constant-structure",
        title: "Cmaj7 → Dmaj7 → Emaj7 → Fmaj7 → G7 → C",
        caption: "前四个大七和弦按全音平移，功能被悬置；最后 G7–C 把段落拉回功能收束。",
        kind: "progression",
        key: "C",
        tempo: 72,
        beats: 12,
        events: [
          chord(0, 2, ["C3", "E3", "G3", "B3"], { label: "Cmaj7" }),
          chord(2, 2, ["D3", "F#3", "A3", "C#4"], { label: "Dmaj7" }),
          chord(4, 2, ["E3", "G#3", "B3", "D#4"], { label: "Emaj7" }),
          chord(6, 2, ["F3", "A3", "C4", "E4"], { label: "Fmaj7" }),
          chord(8, 2, ["G3", "B3", "D4", "F4"], { label: "G7" }),
          chord(10, 2, ["C3", "E3", "G3", "C4"], { label: "C" }),
        ],
      }),
    ],
    related: ["harmonic-sequence", "modal-interchange", "non-functional-dominants"],
    review: {
      question: "固定结构为什么会削弱功能和声？",
      answer:
        "因为它保持和弦质量并平行移动，导音与七音不再按各自倾向解决；功能需要目标与解决方向，而平行色彩带只提供连续颜色。",
      hint: "平行移动 = 倾向音不再各自解决。",
    },
  },
  {
    id: "non-chord-tones",
    slug: "non-chord-tones",
    number: "H-24",
    title: "和弦外音与装饰解决",
    titleEn: "NON-CHORD TONES & EMBELLISHING RESOLUTIONS",
    category: "harmony",
    level: "进阶",
    aliases: ["和弦外音", "外音", "经过音", "辅助音", "倚音", "延留音", "先现音", "non-chord tone", "passing tone", "suspension", "appoggiatura"],
    tags: ["旋律", "声部进行", "装饰"],
    dimensions: ["rhythm", "direction", "color"],
    summary:
      "和弦外音是水平方向的装饰：经过、辅助、先现弱位而入，倚音、延留音占据强拍；每种外音都按“来源—不协和—解决”的句法运行，让声部成为旋律。",
    sections: [
      {
        id: "weak",
        heading: "弱位外音：经过、辅助、先现",
        blocks: [
          {
            type: "p",
            text:
              "经过音用级进把两个和弦音连起来（C–D–E 中的 D）；辅助音从和弦音出发、级进后再返回（C–D–C 中的 D）；先现音把下一个和弦的音提前在本和弦的弱位出现。三者都在弱位进入、不占据重音，是让声部歌唱的最基础装饰。",
            cites: [
              cite("laitz", "Chapter 04 The Role of Context: Embellishing Tones and Melodic Shape"),
              cite("sposobin", "第三十八章 一个声部中的自然经过音"),
            ],
          },
        ],
      },
      {
        id: "accented",
        heading: "强拍外音：倚音、延留音与延迟解决",
        blocks: [
          {
            type: "p",
            text:
              "倚音在强拍上直接跳进进入、通常下行级进解决，冲突感最强；延留音则要“准备”——先作为前和弦的和弦音出现，延留到强拍制造不协和，再下行解决，形成准备—延留—解决三段。外音还可以链式延迟解决，让不协和一层层落地。",
            cites: [
              cite("laitz", "Chapter 10 Accented and Chromatic Embellishing Tones"),
              cite("sposobin", "第三十六章 在一个声部中的有准备的延留音"),
            ],
          },
          {
            type: "p",
            text:
              "分析时先问三个问题：从哪来（跳进或级进）、在哪个拍位、解决到哪。终止四六本质是属音上的双倚音，同一个外音逻辑在更高层级重复出现——外音句法是从声部到乐句都通用的语法。",
            cites: [
              cite("laitz", "Chapter 10 Accented and Chromatic Embellishing Tones"),
            ],
          },
          {
            type: "callout",
            title: "判断顺序",
            text: "拍位 → 来源（级进/跳进/重复前一音）→ 解决方向。三步定名，不要看到不协和音就猜。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-nct-melody",
        title: "I–V7–I 上的外音旋律",
        caption: "D、F 是经过音；A 从 G 延留到 V7 上再下行解决 G，最后经 D 回落 C——外音让三个和弦唱成一条旋律。",
        kind: "melody",
        key: "C",
        tempo: 76,
        beats: 8,
        events: [
          melody(0, 2, "C4", { label: "和弦音" }),
          melody(2, 1, "D4", { label: "经过" }),
          melody(3, 1, "E4"),
          melody(4, 1, "F4", { label: "经过" }),
          melody(5, 1, "G4", { label: "延留" }),
          melody(6, 1, "F4", { label: "解决" }),
          melody(7, 1, "E4"),
        ],
      }),
    ],
    related: ["voice-leading", "cadential-six-four", "melody-motives", "meter-syncopation"],
    review: {
      question: "倚音与延留音的核心区别是什么？",
      answer:
        "延留音要准备：先作为前和弦的和弦音出现，延留到强拍再解决；倚音没有准备，直接在强拍跳进进入、通常下行解决。冲突感更强的是倚音。",
      hint: "看有没有“准备”环节。",
    },
  },
  {
    id: "suspended-chords",
    slug: "suspended-chords",
    number: "H-25",
    title: "挂留和弦与 Sus 色彩",
    titleEn: "SUSPENDED CHORDS",
    category: "harmony",
    level: "进阶",
    aliases: ["挂留", "sus4", "sus2", "挂四", "Gsus", "suspended chord", "sus 和弦"],
    tags: ["和弦", "色彩", "爵士"],
    dimensions: ["color", "function", "rhythm"],
    summary:
      "挂留把三音换成二度或四度，和弦的大小性质随之消失，变成“悬而未决”的声音；它可以解决回三音，也可以作为无解决压力的属色彩独立停留。",
    sections: [
      {
        id: "origin",
        heading: "从延留音到和声化挂留",
        blocks: [
          {
            type: "p",
            text:
              "sus4 的原型是 4–3 延留音：四音先作为前和弦的和弦音出现，延留到强拍、再下行解决到三音。当这个四音不再需要准备、直接和根音五音一起站成和弦（G–C–D），延留音就被和声化成了挂留和弦——三音缺席，大三或小三无法判断，声音悬在大小之间。",
            cites: [
              cite("laitz", "Chapter 04 The Role of Context: Embellishing Tones and Melodic Shape"),
            ],
          },
          {
            type: "p",
            text:
              "sus2 是同一结构的镜像（G–A–D），音区不同但同样性质模糊。写终止时，sus4 → 三音的回落是古典与流行通用的“软化属和弦”手法；不回落，则进入爵士的 sus 世界。",
            cites: [
              cite("laitz", "Chapter 04 The Role of Context: Embellishing Tones and Melodic Shape"),
            ],
          },
        ],
      },
      {
        id: "jazz",
        heading: "爵士里的 sus：无压力的属色彩",
        blocks: [
          {
            type: "p",
            text:
              "爵士把属七的三音换掉：Gsus4（或记 G7sus4、G9sus4）没有三全音的三音，解决压力被拆掉，整条 Mixolydian 音阶都可用；它常替代 ii–V 里的 V，或平铺整小节充当“停留的属”。sus 与四度和声亲缘极近——挂留结构本身就是四度叠置的局部。",
            cites: [
              cite("levine", "Chapter 3 Chord/Scale Theory（sus 与 Phrygian 和弦）"),
            ],
          },
          {
            type: "callout",
            title: "听觉抓手",
            text: "sus4 的紧张不是“要解决到主”，而是“三音还没表态”。听到一个又不像大又不像小的属和弦，先猜 sus。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-sus-resolution",
        title: "Gsus4 → G7 → Cmaj7",
        caption: "四音 C 从延留位置回落到三音 B，属和弦才获得三全音与解决方向；sus4 是属功能的软启动。",
        kind: "progression",
        key: "C",
        tempo: 76,
        beats: 12,
        events: [
          chord(0, 4, ["G3", "C4", "D4"], { label: "Gsus4" }),
          chord(4, 4, ["G3", "B3", "D4", "F4"], { label: "G7" }),
          chord(8, 4, ["C3", "E3", "G3", "B3"], { label: "Cmaj7" }),
        ],
      }),
    ],
    related: ["non-chord-tones", "quartal-harmony", "modal-harmony", "extensions-alterations"],
    review: {
      question: "sus4 为什么大小性质不明？爵士怎么用它？",
      answer:
        "因为三音被四音替换，大三/小三无法判断；爵士把 sus4/7sus4 当成没有三全音的属色彩，配 Mixolydian、不做 4–3 回落，用来平铺属和声或软化 ii–V。",
      hint: "三音缺席，性质悬置。",
    },
  },
  {
    id: "connection-system",
    slug: "connection-system",
    number: "H-26",
    title: "连接系统论：根音运动的六种系统",
    titleEn: "THE CONNECTION SYSTEM (ROOT MOTION)",
    category: "harmony",
    level: "高级",
    aliases: ["连接系统论", "根音运动", "连接系统", "connection system", "root motion", "2 度/3 度/5 度进行"],
    tags: ["根音运动", "进行", "流派色彩"],
    dimensions: ["direction", "function", "relationship"],
    summary:
      "连接系统论抛开 TDS 功能标签，只看根音怎么动：上行/下行 × 2/3/5 度共六个系统。共同音数量决定推动力（5 度最强、3 度最平），上下行偏好区分流派的新旧感。",
    sections: [
      {
        id: "systems",
        heading: "六个系统与共同音",
        blocks: [
          {
            type: "p",
            text:
              "忽略八度等价后，任意两个三和弦的根音关系只剩 2、3、5 三种距离（三个最小质数），各分上下行：2▲/2▼、3▲/3▼、5▲/5▼。它们与功能和声互补——功能说“为什么去”，连接系统说“怎么去”。",
            cites: [cite("soundquest", "和弦篇 C15「控制因素」与 C16「系统分类」")],
          },
          {
            type: "list",
            items: [
              "2 度连接：0 个共同音——成员全部更换，根音近但音色变化大，听感温和平稳。",
              "5 度连接：1 个共同音——换两个音、根音跳最远，推动力最强；5▼ 是古典与爵士的主流，5▲ 带反叛色彩（摇滚、EDM 的 6-4-1-5）。",
              "3 度连接：2 个共同音——保留最多、听感平坦，总是伴随大小性质反转；3▲ 的“漂浮感”在现代流行/电子里复兴。",
            ],
            cites: [cite("soundquest", "和弦篇 C16「系统分类」与 C23「王道进行与文化差异」")],
          },
        ],
      },
      {
        id: "style",
        heading: "上下行偏好与流派新旧",
        blocks: [
          {
            type: "p",
            text:
              "口诀是“下降更自然，上升需要力量”：古典与爵士大量使用 5▼（五度瀑布），流行音乐则借 5▲ 与 3▲ 制造新颖。控制根音运动的偏好，就是在控制音乐的“新/旧”感——这是连接系统论最实用的产出。",
            cites: [cite("soundquest", "和弦篇 C16「系统分类」")],
          },
          {
            type: "callout",
            title: "编曲抓手",
            text: "想“土”一点：多走 5▼ 和 3▼；想“飘”一点：3▲ 与 2▼；想“燃”：5▲。同一组级数换个方向，流派气质就变了。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-root-motion-systems",
        title: "三个系统的对比",
        caption: "同一起点 C：5▼ 到 F（古典主流）→ 5▲ 到 G（反叛/燃）→ 3▲ 到 Ab（漂浮）；三个方向三种气质。",
        kind: "progression",
        key: "C",
        tempo: 84,
        beats: 9,
        events: [
          chord(0, 3, ["C3", "E3", "G3"], { label: "I" }),
          chord(3, 3, ["F2", "A2", "C3"], { label: "5▼" }),
          chord(6, 3, ["G2", "B2", "D3"], { label: "5▲" }),
        ],
      }),
      example({
        id: "ex-root-motion-third",
        title: "3▲ 的漂浮感",
        caption: "C–E–G#–C：连续大三度上行，共同音最多、性质反转，悬浮不落地——现代流行的漂浮进行。",
        kind: "progression",
        key: "C",
        tempo: 80,
        beats: 8,
        events: [
          chord(0, 2, ["C3", "E3", "G3"], { label: "C" }),
          chord(2, 2, ["E3", "G#3", "B3"], { label: "3▲ E" }),
          chord(4, 2, ["G#3", "C4", "E4"], { label: "3▲ G#" }),
          chord(6, 2, ["C3", "E3", "G3"], { label: "回 C" }),
        ],
      }),
    ],
    related: ["roman-numerals", "harmonic-sequence", "circle-of-fifths", "non-functional-dominants"],
    review: {
      question: "为什么只有 5 度系统能明确推动和声前进？",
      answer:
        "5 度连接只保留 1 个共同音、根音移动最远，和弦成员换两个——变化最大所以推动力最强；2 度全部换但根音近，3 度保留两个共同音，都偏向平稳或漂浮。",
      hint: "数共同音。",
    },
  },
  {
    id: "axis-system",
    slug: "axis-system",
    number: "H-27",
    title: "轴心体系：功能的三全音十字",
    titleEn: "THE AXIS SYSTEM (LENDVAI)",
    category: "harmony",
    level: "高级",
    aliases: ["轴心体系", "轴心系统", "axis system", "Lendvai", "极性调性", "巴托克伪终止"],
    tags: ["三全音", "功能扩展", "巴托克"],
    dimensions: ["function", "relationship"],
    summary:
      "Lendvai 的轴心体系把 TDS 功能扩展到十二个音：每个功能的四个根音在五度圈上排成十字（互为三全音）；极点与对极点可互换而不改变功能——用于不定调与多调性写作的自由进行。",
    sections: [
      {
        id: "axes",
        heading: "三条功能轴",
        blocks: [
          {
            type: "p",
            text:
              "以 C 为中心：主功能轴是 C–A–E♭–F♯（含同主小调的 E♭ 与平行大调的 F♯m）；属功能轴是 G–E–D♭–B♭（含三全音代理）；下属功能轴是 F–D–A♭–B。每组的四个根音在五度圈上呈十字形，两端互为三全音（极点/对极点）。功能由根音判断，不论和弦性质——C、Cm、C7 都算主功能。",
            cites: [cite("soundquest", "和弦篇 C64「轴心体系」")],
          },
          {
            type: "p",
            text:
              "轴关系的依据之一是三全音的对称解决：G7 的 si/fa 正常向外解决到 do/mi；巴托克伪终止把 fa 当导音、si 当下属，三全音向内闭合解决到 F♯——轴两端可以互相替代而不改变功能角色。",
            cites: [cite("soundquest", "和弦篇 C64「轴心体系」")],
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
              "实用口诀：从主功能出发，“浮起来”用 ♭III、“沉下去”用 VI、“翻转”用 ♯IV。每个功能四个根音、性质自由，天然适合不定调与多调性段落；但正因太自由，必须自设主题性规则（统一小七、固定冠音、根音三度下行），否则与乱选无异。",
            cites: [cite("soundquest", "和弦篇 C64「轴心体系」")],
          },
          {
            type: "callout",
            title: "边界提醒",
            text: "从 C≈Am、Am≈F♯m 推出 C≈F♯ 是逻辑飞跃；Kárpáti 等学者主张这些关系更应解释为“远关系”而非“功能等同”。把它当创作工具，别当声学真理。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-axis-cross",
        title: "主功能轴的四个根音",
        caption: "C–A–E♭–F♯ 轮流作为主和弦：同属主功能轴（五度圈十字），性质自由、中心不倒。",
        kind: "progression",
        key: "C",
        tempo: 76,
        beats: 12,
        events: [
          chord(0, 3, ["C3", "E3", "G3"], { label: "C · 极点" }),
          chord(3, 3, ["A2", "C3", "E3"], { label: "A" }),
          chord(6, 3, ["Eb3", "G3", "Bb3"], { label: "E♭" }),
          chord(9, 3, ["F#3", "A3", "C#4"], { label: "F♯ · 对极点" }),
        ],
      }),
    ],
    related: ["non-functional-dominants", "tritone-substitution", "constant-structure", "neo-riemannian"],
    review: {
      question: "轴心体系里每个功能有几个可选根音？依据是什么？",
      answer:
        "四个：调内两个同功能和弦加上同主/平行调的对应和弦，恰好落在五度圈十字上、两端互为三全音；依据是三全音的对称可替代性（含巴托克伪终止）。它是创作假设，学界有争议。",
      hint: "十字 + 三全音。",
    },
  },
  {
    id: "neo-riemannian",
    slug: "neo-riemannian",
    number: "H-28",
    title: "新里曼理论：PLR 变换网络",
    titleEn: "NEO-RIEMANNIAN THEORY (PLR)",
    category: "harmony",
    level: "高级",
    aliases: ["新里曼理论", "PLR", "Neo-Riemannian", "变换网络", "Tonnetz", "半音中音关系"],
    tags: ["三度进行", "浪漫派", "变换"],
    dimensions: ["relationship", "direction", "color"],
    summary:
      "新里曼理论不给和弦贴功能标签，而是给“变换”命名：P（同主大小）、R（关系大小）、L（导音交换）每次只动一个音；PLR 链条专门分析浪漫派与电影音乐里脱离五度—终止逻辑的三度进行。",
    sections: [
      {
        id: "plr",
        heading: "三种基本变换",
        blocks: [
          {
            type: "list",
            items: [
              "P（Parallel）：C ⇄ Cm，同主大小调切换，只动三音半音。",
              "R（Relative）：C ⇄ Am，关系大小调切换，半音+全音各动一次。",
              "L（Leittonwechsel，导音交换）：C ⇄ Em，长三度关系，最低音下行半音。",
            ],
            cites: [cite("soundquest", "和弦篇「新里曼理论①：PLR」")],
          },
          {
            type: "p",
            text:
              "每次变换只动一个声部（声部节俭），且伴随大小性质反转；两个操作即回到原和弦（对合）。五度进行要用组合表示（大和弦上行五度 = LR），二度进行至少三步——PLR 的母语是三度关系，不是五度。",
            cites: [cite("soundquest", "和弦篇「新里曼理论①：PLR」")],
          },
        ],
      },
      {
        id: "usage",
        heading: "变换网络与分析对象",
        blocks: [
          {
            type: "p",
            text:
              "把进行写成变换串能暴露功能/级数分析看不到的规律：布拉姆斯双协奏曲的三度链是规整的 PLPLPLP，贝多芬第九第二乐章的三度下行是 RLRLRL 的重复。适用对象：19 世纪浪漫派、电影音乐的半音中音关系（chromatic mediants）、摇滚中的非调性三度进行（Radiohead 等被专门研究）。",
            cites: [cite("soundquest", "和弦篇「新里曼理论①：PLR」")],
          },
          {
            type: "callout",
            title: "定位提醒",
            text: "PLR 是补充性理论：对特定段落最优，当全局工具太受限——与轴心体系一样，是工具箱里的一件，不是唯一语法。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-plr-chain",
        title: "P–R–L 变换链",
        caption: "C –P→ Cm –R→ E♭ –P→ E♭m：每步只动一个音、大小性质反转，和声平滑地漂移而不经功能解决。",
        kind: "progression",
        key: "C",
        tempo: 72,
        beats: 8,
        events: [
          chord(0, 2, ["C3", "E3", "G3"], { label: "C" }),
          chord(2, 2, ["C3", "Eb3", "G3"], { label: "P → Cm" }),
          chord(4, 2, ["Eb3", "G3", "Bb3"], { label: "R → E♭" }),
          chord(6, 2, ["Eb3", "Gb3", "Bb3"], { label: "P → E♭m" }),
        ],
      }),
    ],
    related: ["axis-system", "harmonic-sequence", "modal-mixture-color", "constant-structure"],
    review: {
      question: "P、R、L 变换各自移动哪个音？",
      answer:
        "P 只动三音半音（C⇄Cm）；R 做关系大小调切换；L 做导音交换（长三度关系）。三者都只动一个声部且伴随大小性质反转，五度进行需用组合（如 LR）表示。",
      hint: "一次一音，大小反转。",
    },
  },
];
