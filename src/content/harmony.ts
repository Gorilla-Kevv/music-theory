import { cite } from "./bibliography";
import { chord, example } from "./helpers";
import type { Concept } from "./types";

export const HARMONY: Concept[] = [
  {
    id: "roman-numerals",
    slug: "roman-numerals",
    number: "H-01",
    title: "级数、功能与和弦标记",
    titleEn: "ROMAN NUMERALS & FUNCTION",
    category: "harmony",
    level: "基础",
    aliases: ["级数", "罗马数字", "功能和声", "roman numerals", "functional harmony", "T-S-D-T"],
    tags: ["分析", "功能", "级数"],
    summary:
      "罗马数字把和弦放回调性：大写表示大三和弦，小写表示小三和弦，符号标记减/增；功能组则说明它推进到哪一步。",
    sections: [
      {
        id: "notation",
        heading: "大小写与符号",
        blocks: [
          {
            type: "p",
            text:
              "大写罗马数字表示大三和弦（I、IV、V），小写表示小三和弦（ii、iii、vi）。减三和弦加 °，半减七和弦加 ø，增三和弦加 +。七和弦在数字右侧写 7，转位再用数字低音或斜线低音表示。",
            cites: [
              cite("laitz", "Chapter 5 Tonic, Dominant, and Voice Leading"),
              cite("sposobin", "第二章 正三和弦的功能体系"),
            ],
          },
          {
            type: "p",
            text:
              "同一组和弦在爵士里常直接写和弦符号（Dm7–G7–Cmaj7），在古典分析里写 ii7–V7–Imaj7。两套标记不是对立：前者面向演奏，后者面向调性功能。",
            cites: [cite("levine", "Chapter 2 Major Scale and Progressions（Ⅱ-Ⅴ-Ⅰ进行）")],
          },
        ],
      },
      {
        id: "functions",
        heading: "T–S–D–T 功能链",
        blocks: [
          {
            type: "p",
            text:
              "俄罗斯功能和声把调内和弦分为主功能（T）、下属功能（S）与属功能（D）。在 C 大调，I、vi、iii 偏主功能；ii、IV 偏下属；V、vii° 属属功能。典型推进是 T–S–D–T。",
            cites: [
              cite("sposobin", "第十七章 大调与和声小调的完全功能体系、自然音体系"),
              cite("laitz", "Chapter 9 The Pre-Dominant Function and the Phrase Model"),
            ],
          },
          {
            type: "callout",
            title: "一个和弦可以有两副面孔",
            text: "vi 既像主功能的延伸，也能作为下属的替代；iii 常介于主与属之间。功能不是固定标签，而是它在进行中承担的方向。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-i-iv-v-i",
        title: "I–IV–V–I",
        caption: "最基础的功能闭环：主—下属—属—主。",
        kind: "progression",
        key: "C",
        tempo: 76,
        beats: 8,
        events: [
          chord(0, 2, ["C3", "E3", "G3"], { label: "I" }),
          chord(2, 2, ["F3", "A3", "C4"], { label: "IV" }),
          chord(4, 2, ["G3", "B3", "D4"], { label: "V" }),
          chord(6, 2, ["C3", "E3", "G3"], { label: "I" }),
        ],
      }),
    ],
    related: ["voice-leading", "predominant", "cadences"],
    review: {
      question: "C 大调中 Dm7 的级数标记是什么？属于哪个功能组？",
      answer: "ii7；下属功能组。",
      hint: "D 是第二级，七和弦写作 ii7。",
    },
  },
  {
    id: "voice-leading",
    slug: "voice-leading",
    number: "H-02",
    title: "声部进行",
    titleEn: "VOICE LEADING",
    category: "harmony",
    level: "进阶",
    aliases: ["声部进行", "平行五度", "倾向音", "voice leading", "导音", "解决"],
    tags: ["四部和声", "解决", "禁则"],
    summary:
      "声部进行研究相邻和弦之间各声部如何移动；目标是让倾向音正确解决、避免平行五八度，并保持声部独立。",
    sections: [
      {
        id: "tendency",
        heading: "倾向音与解决",
        blocks: [
          {
            type: "p",
            text:
              "导音（7 级）通常上行到主音，和弦七音通常下行级进。属七到主和弦时，三音 B 上行到 C，七音 F 下行到 E；这两条线同时成立，属功能才有说服力。",
            cites: [
              cite("laitz", "Chapter 5 Tonic, Dominant, and Voice Leading"),
              cite("sposobin", "第三章 原位三和弦的连接"),
            ],
          },
          {
            type: "p",
            text:
              "声部进行分同类、平行、相似、斜向与反向。反向进行能增强独立性；同类进行最平稳，但连续同类五度/八度会削弱声部独立，因此在传统四部和声中受限。",
            cites: [
              cite("sposobin", "第三章 原位三和弦的连接"),
              cite("laitz", "Chapter 5 Tonic, Dominant, and Voice Leading"),
            ],
          },
        ],
      },
      {
        id: "jazz",
        heading: "爵士的声部经济",
        blocks: [
          {
            type: "p",
            text:
              "爵士钢琴与吉他常用省略根音的声部配置：三音与七音负责定义和弦，根音交给贝斯。ii–V–I 中，Dm7 的 C 下行到 G7 的 B，G7 的 F 下行到 Cmaj7 的 E；共同的音尽量保持。",
            cites: [cite("levine", "Chapter 2 Major Scale and Progressions（声部进行）")],
          },
          {
            type: "callout",
            title: "写作顺序",
            text: "先定低音与外声部，再填内声部；能保持的共同音保持，倾向音按方向解决。不要先堆满和弦再找连接。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-ii-v-i-voicing",
        title: "ii–V–I 的平滑声部",
        caption: "F 保持再落到 E，C 落到 B 再保持；三音与七音的交换构成骨架。",
        kind: "progression",
        key: "C",
        tempo: 70,
        beats: 12,
        events: [
          chord(0, 4, ["D3", "F3", "A3", "C4"], { label: "Dm7" }),
          chord(4, 4, ["D3", "F3", "G3", "B3"], { label: "G7" }),
          chord(8, 4, ["C3", "E3", "G3", "B3"], { label: "Cmaj7" }),
        ],
      }),
    ],
    related: ["roman-numerals", "seventh-chords", "ii-v-i"],
    review: {
      question: "在 V7–I 中，属七的三音与七音通常分别向哪里解决？",
      answer: "三音（导音）上行到主音；七音下行级进到主和弦的三音。",
      hint: "导音向上，七音向下。",
    },
  },
  {
    id: "cadences",
    slug: "cadences",
    number: "H-03",
    title: "终止式",
    titleEn: "CADENCES",
    category: "harmony",
    level: "基础",
    aliases: ["终止式", "完全终止", "半终止", "阻碍终止", "变格终止", "cadence", "PAC", "IAC"],
    tags: ["乐句", "终止", "分析"],
    summary:
      "终止式是乐句的标点：完全终止给出最强收束，半终止停在属，阻碍终止把预期的 I 换成 vi，变格终止用 IV–I 提供另一种收束。",
    sections: [
      {
        id: "types",
        heading: "四种常用终止",
        blocks: [
          {
            type: "list",
            items: [
              "完全终止（PAC）：V–I，两个和弦都在原位，最高声部结束在主音。",
              "不完全终止（IAC）：V–I，但转位或最高声部不在主音，收束较弱。",
              "半终止（HC）：乐句停在 V，常见于乐段前半。",
              "阻碍终止（DC）：V–vi，预期的主和弦被替换，常用于扩展乐段。",
              "变格终止：IV–I，收束柔和，常见于圣咏与流行结尾。",
            ],
            cites: [
              cite("laitz", "Chapter 9 The Pre-Dominant Function and the Phrase Model"),
              cite("sposobin", "第八章 终止、乐段、乐句"),
            ],
          },
          {
            type: "p",
            text:
              "终止的强度不仅取决于和弦，也取决于节拍位置与最高声部。同样的 V–I，如果主和弦在弱拍或最高声部停在三级，就只是不完全终止。",
            cites: [cite("laitz", "Chapter 15 Periods")],
          },
        ],
      },
      {
        id: "hearing",
        heading: "如何听终止",
        blocks: [
          {
            type: "p",
            text:
              "先听低音是否 V–I，再听最高声部是否 7–1。低音与最高声部同时到位，才是完全终止；只听到 V 停住，是半终止。",
            cites: [cite("sposobin", "第八章 终止、乐段、乐句")],
          },
          {
            type: "callout",
            title: "常见误区",
            text: "看到 V–I 就判完全终止，会漏掉转位与旋律位置。终止是“低音 + 外声部 + 节拍”的联合判断。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-four-cadences",
        title: "四种终止并置",
        caption: "完全、半、阻碍、变格；每个终止两拍，听低音与外声部的差别。",
        kind: "progression",
        key: "C",
        tempo: 72,
        beats: 16,
        events: [
          chord(0, 2, ["G3", "B3", "D4", "F4"], { label: "PAC: V7" }),
          chord(2, 2, ["C3", "E3", "G3", "C4"], { label: "I" }),
          chord(4, 2, ["C3", "E3", "G3"], { label: "HC: I" }),
          chord(6, 2, ["G3", "B3", "D4", "F4"], { label: "V7" }),
          chord(8, 2, ["G3", "B3", "D4", "F4"], { label: "DC: V7" }),
          chord(10, 2, ["A3", "C4", "E4"], { label: "vi" }),
          chord(12, 2, ["F3", "A3", "C4"], { label: "Plagal: IV" }),
          chord(14, 2, ["C3", "E3", "G3"], { label: "I" }),
        ],
      }),
    ],
    related: ["roman-numerals", "predominant", "voice-leading"],
    review: {
      question: "完全终止（PAC）的三个条件是什么？",
      answer: "V–I；两个和弦都在原位；最高声部结束在主音。",
      hint: "和弦、转位、外声部。",
    },
  },
  {
    id: "predominant",
    slug: "predominant",
    number: "H-04",
    title: "下属功能与乐句模型",
    titleEn: "PRE-DOMINANT & THE PHRASE MODEL",
    category: "harmony",
    level: "进阶",
    aliases: ["下属功能", "前属", "ii-V", "IV", "predominant", "phrase model", "乐句模型"],
    tags: ["功能", "ii-V", "乐句"],
    summary:
      "下属功能把主音推向属：ii 与 IV 扩展主和弦，构成 T–PD–D–T 的乐句模型；在爵士里，这条链最常压缩成 ii–V–I。",
    sections: [
      {
        id: "phrase-model",
        heading: "T–PD–D–T",
        blocks: [
          {
            type: "p",
            text:
              "乐句模型把调性和声组织成四个阶段：主（T）确立调性，下属（PD）离开主音，属（D）制造回归压力，主（T）完成收束。ii 和 IV 都能承担下属，ii6 与 IV 的声部连接略有不同。",
            cites: [
              cite("laitz", "Chapter 9 The Pre-Dominant Function and the Phrase Model"),
              cite("sposobin", "第十八章 Ⅱ级六和弦与三和弦（SⅡ6与SⅡ）"),
            ],
          },
          {
            type: "p",
            text:
              "ii–V 不是两个孤立和弦，而是一口气的两个阶段：ii 准备属，属准备主。爵士把这条链延伸到 ii–V–I，并常用七和弦与延伸音加厚。",
            cites: [
              cite("sposobin", "第二十一章 下属七和弦（SⅡ7）"),
              cite("levine", "Chapter 2 Major Scale and Progressions（Ⅱ-Ⅴ-Ⅰ进行）"),
            ],
          },
        ],
      },
      {
        id: "substitutes",
        heading: "下属的替代",
        blocks: [
          {
            type: "p",
            text:
              "IV 与 ii 都是下属，但 iv（小下属）来自同主音小调，色彩更暗；在 C 大调，Fm 常接到 C，形成变格色彩。下属功能也可以由 vi 或 iiø7 承担，取决于声部与调式语境。",
            cites: [cite("laitz", "Chapter 21 Modal Mixture")],
          },
          {
            type: "callout",
            title: "分析提示",
            text: "看到 ii–V–I 时，不要只标和弦，要问：ii 是否真的在准备 V？如果 ii 后面接的是 IV 或 bVII，它可能在做别的事。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-i-vi-ii-v-i",
        title: "I–vi–ii–V–I",
        caption: "vi 作为主功能延伸，ii–V 完成下属到属的推进。",
        kind: "progression",
        key: "C",
        tempo: 76,
        beats: 10,
        events: [
          chord(0, 2, ["C3", "E3", "G3"], { label: "I" }),
          chord(2, 2, ["A3", "C4", "E4", "G4"], { label: "vi7" }),
          chord(4, 2, ["D3", "F3", "A3", "C4"], { label: "ii7" }),
          chord(6, 2, ["G3", "B3", "D4", "F4"], { label: "V7" }),
          chord(8, 2, ["C3", "E3", "G3"], { label: "I" }),
        ],
      }),
    ],
    related: ["roman-numerals", "cadences", "borrowed-chords"],
    review: {
      question: "在 C 大调，ii7 与 V7 分别是什么和弦？它们在乐句模型里承担什么功能？",
      answer: "Dm7（下属）与 G7（属）；ii 准备 V，V 准备 I。",
      hint: "功能链 T–PD–D–T。",
    },
  },
  {
    id: "secondary-dominants",
    slug: "secondary-dominants",
    number: "H-05",
    title: "副属和弦与离调",
    titleEn: "SECONDARY DOMINANTS & TONICIZATION",
    category: "harmony",
    level: "进阶",
    aliases: ["副属和弦", "重属", "离调", "secondary dominant", "applied chord", "V/V", "tonicization"],
    tags: ["半音体系", "离调", "分析"],
    summary:
      "副属和弦是“某个和弦的属”：V/V 解决到 V，V/ii 解决到 ii；它短暂地把目标和弦变成临时主音，但不一定构成转调。",
    sections: [
      {
        id: "applied",
        heading: "V/x 的写法与解决",
        blocks: [
          {
            type: "p",
            text:
              "在 C 大调，D7 是 V/V，解决到 G；A7 是 V/ii，解决到 Dm；E7 是 V/vi，解决到 Am。副属和弦常带临时升降号，这些变音属于“临时主音”的属功能，而不是新调的调号。",
            cites: [
              cite("laitz", "Chapter 17 Applied Chords"),
              cite("sposobin", "第二十八章 终止中的重属和弦"),
              cite("sposobin", "第二十九章 结构内的重属和弦"),
            ],
          },
          {
            type: "p",
            text:
              "副属和弦也可以以七和弦形式出现（V7/x），此时三音与七音按属七的方式解决。若目标本身是七和弦，副属七的七音可能下行到目标的三音。",
            cites: [cite("sposobin", "第三十章 重属和弦中的变音")],
          },
        ],
      },
      {
        id: "tonicization",
        heading: "离调还是转调",
        blocks: [
          {
            type: "p",
            text:
              "离调是局部的：副属和弦解决到目标和弦后，音乐仍回到原调。转调需要新调获得自己的主和弦、属和弦与终止，持续时间更长。一个 A7 到 Dm 不一定转调到 D 小调；若随后出现 G–C 的强终止，原调仍占主导。",
            cites: [
              cite("sposobin", "第三十二章 离调、半音体系"),
              cite("laitz", "Chapter 18 Modulation"),
            ],
          },
          {
            type: "callout",
            title: "识别顺序",
            text: "先看变化音解决到哪里；再看解决后的和弦是否成为新调的临时主音；最后看后面有没有新调的终止。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-secondary-chain",
        title: "I–V/ii–ii–V–I",
        caption: "A7 把 Dm 临时变成主音；随后 Dm–G7–C 回到 C 大调。",
        kind: "progression",
        key: "C",
        tempo: 74,
        beats: 10,
        events: [
          chord(0, 2, ["C3", "E3", "G3"], { label: "I" }),
          chord(2, 2, ["A3", "C#4", "E4", "G4"], { label: "V/ii" }),
          chord(4, 2, ["D3", "F3", "A3", "C4"], { label: "ii7" }),
          chord(6, 2, ["G3", "B3", "D4", "F4"], { label: "V7" }),
          chord(8, 2, ["C3", "E3", "G3"], { label: "I" }),
        ],
      }),
    ],
    related: ["modulation", "roman-numerals", "voice-leading"],
    review: {
      question: "C 大调中 D7 的级数标记是什么？它解决到哪个和弦？",
      answer: "V/V；解决到 G（V）。",
      hint: "D 是 G 的属。",
    },
  },
  {
    id: "modulation",
    slug: "modulation",
    number: "H-06",
    title: "转调：枢轴和弦与调性中心",
    titleEn: "MODULATION & PIVOT CHORDS",
    category: "harmony",
    level: "进阶",
    aliases: ["转调", "枢轴和弦", "共同和弦", "modulation", "pivot chord", "调性中心"],
    tags: ["转调", "调性", "分析"],
    summary:
      "转调让新调获得自己的属—主与终止；枢轴和弦是两调共有的和弦，它在旧调里的功能与新调里的功能不同。",
    sections: [
      {
        id: "pivot",
        heading: "枢轴和弦如何工作",
        blocks: [
          {
            type: "p",
            text:
              "从 C 大调转到 G 大调，Am7 可以充当枢轴：在 C 是 vi7，在 G 是 ii7。随后 D7（G 的 V7）与 G 的终止确认新调。枢轴和弦本身不“转调”，它只是两套功能解释的交汇点。",
            cites: [
              cite("laitz", "Chapter 18 Modulation"),
              cite("sposobin", "第三十四章 转调"),
            ],
          },
          {
            type: "p",
            text:
              "一级关系调（相差一个调号）最容易通过共同和弦转调；相差更远的调需要半音化中介、等音和弦或模进。斯波索宾体系把调性关系按调号差距分级，并讨论经过减七和弦、属七和弦的等音转调。",
            cites: [
              cite("sposobin", "第三十五章 到一级关系调的转调"),
              cite("sposobin", "第五十一章 调性关系的等级、相差两个调号的转调"),
              cite("sposobin", "第五十七章 等音转调、经过减七和弦的转调"),
            ],
          },
        ],
      },
      {
        id: "confirm",
        heading: "确认新调",
        blocks: [
          {
            type: "p",
            text:
              "新调的确认靠它自己的属—主与终止，而不是单个变化音。转调分析要指出：枢轴和弦、新调的属和弦、新调的终止，以及旧调是否还能解释后续和弦。",
            cites: [cite("laitz", "Chapter 18 Modulation")],
          },
          {
            type: "callout",
            title: "离调与转调的分界",
            text: "短暂的 V/x 解决只是离调；当新调拥有自己的主、属与终止，并且持续时间足够长，才构成转调。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-pivot-c-to-g",
        title: "C 大调 → G 大调",
        caption: "Am7 是枢轴：C 的 vi7，也是 G 的 ii7；D7 随后确认 G。",
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
    related: ["secondary-dominants", "circle-of-fifths", "modal-harmony"],
    review: {
      question: "从 C 大调转到 G 大调，Am7 可以怎样解释？为什么它能当枢轴？",
      answer: "在 C 是 vi7，在 G 是 ii7；同一和弦在两调都有自然音功能，因此可作枢轴。",
      hint: "同一和弦，两套功能解释。",
    },
  },
  {
    id: "borrowed-chords",
    slug: "borrowed-chords",
    number: "H-07",
    title: "调式交替与借用和弦",
    titleEn: "MODAL MIXTURE & BORROWED CHORDS",
    category: "harmony",
    level: "进阶",
    aliases: ["借用和弦", "调式交替", "同主音小调", "modal mixture", "borrowed chord", "bVI", "iv"],
    tags: ["半音体系", "色彩", "调式"],
    summary:
      "借用和弦从同主音小调借到同主音大调（或反向）：iv、bVI、bVII、bIII 最常见；主音不变，调号被临时染色。",
    sections: [
      {
        id: "parallel",
        heading: "同主音大小调之间",
        blocks: [
          {
            type: "p",
            text:
              "C 大调可以借用 C 小调的下属和弦 Fm（iv）、降 VI 级 Ab（bVI）、降 VII 级 Bb（bVII）与降 III 级 Eb（bIII）。这些和弦不改变主音 C，却把小调的色彩带进大调。",
            cites: [
              cite("laitz", "Chapter 21 Modal Mixture"),
              cite("sposobin", "第四十九章 交替大小调体系"),
              cite("sposobin", "第五十章 交替大小调的降Ⅵ级三和弦（tsⅥ）"),
            ],
          },
          {
            type: "p",
            text:
              "iv–I 的变格进行是最常见的借用之一；bVI 常接到 V 或 I，制造突然的暗色；bVII 在流行与摇滚里常作为“回到 I 前的松弛”。",
            cites: [cite("laitz", "Chapter 21 Modal Mixture")],
          },
        ],
      },
      {
        id: "hearing",
        heading: "听觉与写法",
        blocks: [
          {
            type: "p",
            text:
              "借用和弦的变音来自同主音小调的音阶，而不是远关系转调。写分析时标出借用来源（如 iv from parallel minor），比只写 Fm 更能说明色彩。",
            cites: [cite("sposobin", "第四十九章 交替大小调体系")],
          },
          {
            type: "callout",
            title: "不要和转调混淆",
            text: "借用和弦之后通常仍回到原调主音；如果新调建立自己的终止，才考虑转调。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-borrowed-iv-bvi",
        title: "I–bVI–iv–I",
        caption: "Ab 与 Fm 来自同主音 C 小调；主音仍是 C，但颜色明显变暗。",
        kind: "progression",
        key: "C",
        tempo: 70,
        beats: 8,
        events: [
          chord(0, 2, ["C3", "E3", "G3"], { label: "I" }),
          chord(2, 2, ["Ab3", "C4", "Eb4"], { label: "bVI" }),
          chord(4, 2, ["F3", "Ab3", "C4"], { label: "iv" }),
          chord(6, 2, ["C3", "E3", "G3"], { label: "I" }),
        ],
      }),
    ],
    related: ["predominant", "neapolitan-aug6", "modes"],
    review: {
      question: "C 大调中的 Fm 和弦来自哪里？它属于什么手法？",
      answer: "来自同主音 C 小调的下属（iv）；属于调式交替/借用和弦。",
      hint: "主音不变，三音降了。",
    },
  },
  {
    id: "neapolitan-aug6",
    slug: "neapolitan-aug6",
    number: "H-08",
    title: "那不勒斯与增六和弦",
    titleEn: "NEAPOLITAN & AUGMENTED SIXTH CHORDS",
    category: "harmony",
    level: "高级",
    aliases: ["那不勒斯六和弦", "增六和弦", "N6", "German sixth", "Italian sixth", "French sixth", "bII6"],
    tags: ["半音体系", "下属变和弦", "解决"],
    summary:
      "那不勒斯六和弦是降 II 级大三和弦的第一转位；增六和弦用 b6 与 #4 的外向扩张强化属。两者都是下属功能的半音化变体。",
    sections: [
      {
        id: "neapolitan",
        heading: "那不勒斯六和弦（N6）",
        blocks: [
          {
            type: "p",
            text:
              "在 C 大调，N6 是 Db 大三和弦的第一转位：F–Ab–Db。它通常作下属，接到 V 或 I6/4–V。降 II 级的根音（Db）常下行到导音 B，低音 F 上行到 G 或下行到 D，形成强烈的半音解决。",
            cites: [
              cite("laitz", "Chapter 23 Neapolitan Chords"),
              cite("sposobin", "第四十七章 下属和声组的变和弦"),
              cite("sposobin", "第五十三章 经过交替大小调的降Ⅵ级三和弦（tsⅥ）以及经过那不勒斯和弦的转调"),
            ],
          },
          {
            type: "p",
            text:
              "那不勒斯和弦也可以出现在小调，尤其是 bII6 接到 V 的终止前。它的色彩比 iv 更暗，但功能仍是下属，不是属。",
            cites: [cite("laitz", "Chapter 23 Neapolitan Chords")],
          },
        ],
      },
      {
        id: "aug6",
        heading: "增六和弦：三种外观",
        blocks: [
          {
            type: "p",
            text:
              "增六和弦的核心是 b6 与 #4 构成的增六度，两者向外扩张到属音八度。意大利增六（It+6）只有三个音：Ab–C–F#；法国增六（Fr+6）加一个 D：Ab–C–D–F#；德国增六（Ger+6）加一个 Eb：Ab–C–Eb–F#。",
            cites: [cite("laitz", "Chapter 24 Augmented-Sixth Chords")],
          },
          {
            type: "p",
            text:
              "德国增六音响上等同属七（Ab–C–Eb–F# 与 Ab7 的等音关系），但功能与解决不同：增六的 F# 上行到 G，Ab 下行到 G，形成外向扩张；属七则按属功能解决。",
            cites: [
              cite("laitz", "Chapter 24 Augmented-Sixth Chords"),
              cite("sposobin", "第四十七章 下属和声组的变和弦"),
            ],
          },
          {
            type: "callout",
            title: "辨认抓手",
            text: "N6 是“降 II 级的第一转位”；增六是“b6 与 #4 的外向扩张”。两者都常接到 V，但变音方向相反。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-neapolitan",
        title: "N6–V7–I",
        caption: "F–Ab–Db 接到 G7；Db 下行到 B，Ab 下行到 G。",
        kind: "progression",
        key: "C",
        tempo: 68,
        beats: 6,
        events: [
          chord(0, 2, ["F3", "Ab3", "Db4"], { label: "N6" }),
          chord(2, 2, ["G3", "B3", "D4", "F4"], { label: "V7" }),
          chord(4, 2, ["C3", "E3", "G3", "C4"], { label: "I" }),
        ],
      }),
      example({
        id: "ex-german-sixth",
        title: "德国增六 → 属",
        caption: "Ab–C–Eb–F# 向外扩张到 G 八度；注意 F# 上行、Ab 下行。",
        kind: "progression",
        key: "C",
        tempo: 68,
        beats: 8,
        events: [
          chord(0, 4, ["Ab3", "C4", "Eb4", "F#4"], { label: "Ger+6" }),
          chord(4, 4, ["G3", "B3", "D4", "G4"], { label: "V" }),
        ],
      }),
    ],
    related: ["predominant", "borrowed-chords", "voice-leading"],
    review: {
      question: "C 大调的那不勒斯六和弦是什么？低音是什么？",
      answer: "Db 大三和弦的第一转位，低音 F（F–Ab–Db）。",
      hint: "降 II 级，第一转位。",
    },
  },
];
