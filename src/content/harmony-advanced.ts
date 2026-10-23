import { cite } from "./bibliography";
import { chord, example } from "./helpers";
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
];
