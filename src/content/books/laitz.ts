import { buildOutline, type ChapterSeed, type NoteSeed } from "./types";

// 章节严格对应 The Complete Musician, 4th ed. (OUP, © 2016)，PDF 共 957 页。
// pdfPage 为 PDF 第几页（1 起始，供 /books/complete-musician-4e.pdf#page=N 深链）。
const CHAPTERS: ChapterSeed[] = [
  { number: "1A", title: "Musical Space", titleZh: "音乐空间", part: "Part 1 · The Foundations of Tonal Music", pdfPage: 40 },
  { number: "1B", title: "Musical Time: Pulse, Rhythm, and Meter", titleZh: "音乐时间：拍、节奏与拍号", part: "Part 1 · The Foundations of Tonal Music", pdfPage: 81 },
  { number: "02", title: "Harnessing Space and Time: Introduction to Melody and Two-Voice Counterpoint", titleZh: "驾驭空间与时间：旋律与二声部对位导论", part: "Part 1 · The Foundations of Tonal Music", pdfPage: 115 },
  { number: "03", title: "Musical Density: Triads, Seventh Chords, and Texture", titleZh: "音乐密度：三和弦、七和弦与织体", part: "Part 1 · The Foundations of Tonal Music", pdfPage: 143 },
  { number: "04", title: "When Harmony, Melody, and Rhythm Converge", titleZh: "当和声、旋律与节奏交汇", part: "Part 2 · Merging Melody and Harmony", pdfPage: 180 },
  { number: "05", title: "Tonic and Dominant as Tonal Pillars and Introduction to Voice Leading", titleZh: "调性支柱：主音与属音，声部进行导论", part: "Part 2 · Merging Melody and Harmony", pdfPage: 203 },
  { number: "06", title: "The Impact of Melody, Rhythm, and Meter on Harmony; Introduction to V7; and Harmonizing Florid Melodies", titleZh: "旋律、节奏与拍号对和声的影响；V7 导论与花奏旋律配和声", part: "Part 2 · Merging Melody and Harmony", pdfPage: 223 },
  { number: "07", title: "Contrapuntal Expansions of Tonic and Dominant: Six-Three Chords", titleZh: "主与属的对位性扩展：六三和弦", part: "Part 2 · Merging Melody and Harmony", pdfPage: 248 },
  { number: "08", title: "More Contrapuntal Expansions: Inversions of V7, Introduction to Leading-Tone Seventh Chords, and Reduction and Elaboration", titleZh: "更多对位性扩展：V7 转位、导七和弦导论、简化与装饰", part: "Part 2 · Merging Melody and Harmony", pdfPage: 268 },
  { number: "09", title: "The Pre-Dominant Function and the Phrase Model", titleZh: "下属功能与乐句模型", part: "Part 3 · A New Harmonic Function, the Phrase Model, and Additional Embellishments", pdfPage: 300 },
  { number: "10", title: "Accented and Chromatic Embellishing Tones", titleZh: "强拍与半音装饰音", part: "Part 3 · A New Harmonic Function, the Phrase Model, and Additional Embellishments", pdfPage: 317 },
  { number: "11", title: "Six-Four Chords, Revisiting the Subdominant, and Summary of Contrapuntal Expansions", titleZh: "四六和弦、再探下属与对位扩展总结", part: "Part 3 · A New Harmonic Function, the Phrase Model, and Additional Embellishments", pdfPage: 340 },
  { number: "12", title: "The Pre-Dominant Refines the Phrase Model", titleZh: "下属功能精炼乐句模型", part: "Part 3 · A New Harmonic Function, the Phrase Model, and Additional Embellishments", pdfPage: 361 },
  { number: "13", title: "The Submediant: A New Diatonic Harmony, and Further Extensions of the Phrase Model", titleZh: "下中音：新的自然音和声与乐句模型扩展", part: "Part 4 · New Chords and New Forms", pdfPage: 384 },
  { number: "14", title: "The Mediant, the Back-Relating Dominant, and a Synthesis of Diatonic Harmonic Relationships", titleZh: "中音、回指属与自然音和声关系综合", part: "Part 4 · New Chords and New Forms", pdfPage: 403 },
  { number: "15", title: "The Period", titleZh: "乐段", part: "Part 4 · New Chords and New Forms", pdfPage: 415 },
  { number: "16", title: "Other Small Musical Structures: Sentences, Double Periods, and Modified Periods", titleZh: "其他小型结构：乐句、双乐段与变化乐段", part: "Part 4 · New Chords and New Forms", pdfPage: 430 },
  { number: "17", title: "Harmonic Sequences", titleZh: "和声模进", part: "Part 4 · New Chords and New Forms", pdfPage: 446 },
  { number: "18", title: "Applied Chords", titleZh: "副属和弦", part: "Part 5 · Functional Chromaticism", pdfPage: 472 },
  { number: "19", title: "Tonicization and Modulation", titleZh: "临时主化与转调", part: "Part 5 · Functional Chromaticism", pdfPage: 498 },
  { number: "20", title: "Binary Form and Variations", titleZh: "二部曲式与变奏", part: "Part 5 · Functional Chromaticism", pdfPage: 519 },
  { number: "21", title: "Modal Mixture", titleZh: "调式交替", part: "Part 6 · Expressive Chromaticism", pdfPage: 546 },
  { number: "22", title: "Expansion of Modal Mixture Harmonies: Chromatic Modulation and the German Lied", titleZh: "调式交替和声的扩展：半音转调与德奥艺术歌曲", part: "Part 6 · Expressive Chromaticism", pdfPage: 568 },
  { number: "23", title: "The Neapolitan Chord (♭II)", titleZh: "那不勒斯和弦（♭II）", part: "Part 6 · Expressive Chromaticism", pdfPage: 591 },
  { number: "24", title: "The Augmented Sixth Chord", titleZh: "增六和弦", part: "Part 6 · Expressive Chromaticism", pdfPage: 605 },
  { number: "25", title: "Ternary Form", titleZh: "三部曲式", part: "Part 7 · Large Forms: Ternary, Rondo, Sonata", pdfPage: 632 },
  { number: "26", title: "Rondo", titleZh: "回旋曲式", part: "Part 7 · Large Forms: Ternary, Rondo, Sonata", pdfPage: 653 },
  { number: "27", title: "Sonata Form", titleZh: "奏鸣曲式", part: "Part 7 · Large Forms: Ternary, Rondo, Sonata", pdfPage: 667 },
  { number: "28", title: "New Harmonic Tendencies", titleZh: "新的和声倾向", part: "Part 8 · Introduction to Nineteenth-Century Harmony", pdfPage: 700 },
  { number: "29", title: "Melodic and Harmonic Symmetry Combine: Chromatic Sequences", titleZh: "旋律与和声对称结合：半音模进", part: "Part 8 · Introduction to Nineteenth-Century Harmony", pdfPage: 731 },
  { number: "30", title: "Vestiges of Common Practice and the Rise of a New Sound World", titleZh: "共同实践的余晖与新声音世界的兴起", part: "Part 9 · Twentieth- and Twenty-First-Century Music", pdfPage: 766 },
  { number: "31", title: "Noncentric Music: Atonal Concepts and Analytical Methodology", titleZh: "无中心音乐：无调性概念与分析方法", part: "Part 9 · Twentieth- and Twenty-First-Century Music", pdfPage: 827 },
  { number: "32", title: "New Rhythmic and Metric Possibilities, Ordered PC Relations, and Twelve-Tone Techniques", titleZh: "新的节奏与拍号可能、有序音级关系与十二音技术", part: "Part 9 · Twentieth- and Twenty-First-Century Music", pdfPage: 865 },
];

// 笔记键与第 4 版章节一一对应；旧版第 1C 章（音程）内容并入 1A（4e 中音程在 1A
// "Specifics of the Pitch Realm" 讲授），旧 17/18/19 按第 4 版实际章号重排。
const NOTES: Record<string, NoteSeed> = {
  "laitz-1a": {
    summary:
      "调性空间由音高、音程、音阶与调号共同定义；大调、小调与关系调不是三套孤立音阶，而是同一调号下的功能与主音选择。音程作为“调性距离”的度量也在本章（Specifics of the Pitch Realm）展开。",
    keyPoints: [
      "音阶结构决定半音位置，调号把结构固定到十二个调。",
      "关系大小调共享调号，但主音、导音与功能和弦不同。",
      "音程：度数与半音数共同定性质，转位后度数相加为九、大小与增减互换。",
    ],
    concepts: ["major-scale", "minor-scales", "circle-of-fifths", "intervals"],
    dimensions: ["brightness", "relationship"],
  },
  "laitz-03": {
    summary:
      "三和弦与七和弦是调性和声的基本词汇；三音、五音、七音与低音共同决定质量、转位与织体。",
    keyPoints: [
      "和弦质量由三音与五音决定，七音进一步区分七和弦类型。",
      "转位由低音决定，不改变和弦根音身份。",
    ],
    concepts: ["triads", "seventh-chords", "voice-leading"],
    dimensions: ["function", "color"],
  },
  "laitz-04": {
    summary:
      "调性层级、装饰音与旋律流畅性在同一章汇合：和弦音与装饰音的区分依赖和声语境，跳进要填、线条有骨架，单旋律本身就暗示和声。",
    keyPoints: [
      "强拍外音比弱拍外音更需要解决。",
      "外音的形状决定旋律轮廓，也影响和声节奏。",
      "旋律流畅性：表面之下恒有级进骨架（格式塔：gap-fill、good continuation）。",
    ],
    concepts: ["non-chord-tones", "melody-motives", "harmonic-rhythm"],
    dimensions: ["color", "rhythm", "direction"],
  },
  "laitz-05": {
    summary:
      "主—属关系是调性的第一根轴；声部进行通过导音、七音与外声部把两个功能和弦连成有方向的运动。",
    keyPoints: [
      "导音上行、和弦七音下行是属功能解决的基本方向。",
      "平行五八度削弱声部独立，反向进行增强独立性。",
    ],
    concepts: ["voice-leading", "roman-numerals", "cadences"],
    dimensions: ["function", "direction"],
  },
  "laitz-06": {
    summary:
      "属七和弦把属功能压缩为一个不协和单位；两层分析区分表面和弦与深层功能，解释装饰、转位与替代。",
    keyPoints: [
      "V7 的三全音是属功能张力的物理核心。",
      "二层分析把局部和弦归入更长的功能和声层。",
    ],
    concepts: ["seventh-chords", "roman-numerals", "guide-tones"],
    dimensions: ["function", "color"],
  },
  "laitz-09": {
    summary:
      "乐句模型把调性和声组织为 T–PD–D–T；下属功能（ii、IV）扩展主音，属功能制造回归压力，终止完成收束。",
    keyPoints: [
      "ii 与 IV 都能当下属，但声部连接与色彩不同。",
      "终止不是停止，而是乐句句法的标点。",
    ],
    concepts: ["predominant", "cadences", "phrase-structure"],
    dimensions: ["function", "direction", "rhythm"],
  },
  "laitz-11": {
    summary:
      "四六和弦有经过、辅助与终止三类；终止四六（I6/4）在强拍上作为属准备，而不是普通的主和弦转位。",
    keyPoints: [
      "终止四六的低音是属音，六音与四音下行解决到五音与三音。",
      "四六和弦的功能取决于节拍位置与前后和弦。",
    ],
    concepts: ["cadential-six-four", "voice-leading", "cadences"],
    dimensions: ["function", "direction"],
  },
  "laitz-13": {
    summary:
      "下中音（vi）与级进下行低音是扩展主音的常见方式；低音线从主音逐级下行，和弦选择随之改变。",
    keyPoints: [
      "vi 既像主功能延伸，也能承担下属替代。",
      "级进下行低音让转位与声部连接变得自然。",
    ],
    concepts: ["bass-line", "roman-numerals", "predominant"],
    dimensions: ["direction", "function", "color"],
  },
  "laitz-14": {
    summary:
      "中音（iii）与回指属和弦处理调性中心的边缘地带：它们可以延长主音，也可以把属功能向后拉。",
    keyPoints: [
      "iii 的功能介于主与属之间，取决于上下文。",
      "回指属和弦制造“已经到达又退回”的句法效果。",
    ],
    concepts: ["roman-numerals", "harmonic-color", "phrase-structure"],
    dimensions: ["function", "direction", "color"],
  },
  "laitz-15": {
    summary:
      "乐段由前句与后句构成，终止式决定两句的关系：半终止→完全终止是最常见的呼应。",
    keyPoints: [
      "前句常停在半终止，后句用完全终止收束。",
      "乐段是曲式的最小完整单位，不等于任意四小节。",
    ],
    concepts: ["phrase-structure", "cadences", "harmonic-rhythm"],
    dimensions: ["rhythm", "direction", "function"],
  },
  "laitz-18": {
    summary:
      "副属和弦（applied chords）把目标和弦临时变成主音；V/x 与 V7/x 制造局部离调，但不一定构成转调。",
    keyPoints: [
      "副属和弦的临时升降号属于目标调的属功能。",
      "解决后若原调继续，仍是离调；新调建立终止才是转调。",
    ],
    concepts: ["secondary-dominants", "tonal-distance", "modulation"],
    dimensions: ["relationship", "direction", "function"],
  },
  "laitz-19": {
    summary:
      "转调通过共同和弦、半音中介或直接并置建立新调；新调必须获得自己的属—主与终止，才算真正转调。",
    keyPoints: [
      "枢轴和弦在两调中有不同功能解释。",
      "转调分析要指出新调的属、主与终止，而不只是变化音。",
    ],
    concepts: ["modulation", "tonal-distance", "circle-of-fifths"],
    dimensions: ["relationship", "direction"],
  },
  "laitz-17": {
    summary:
      "和声模进把同一模型移到新音级；自然模进保持调内，真实模进保持音程结构，二者都制造方向与延长。",
    keyPoints: [
      "模进是“有目标的重复”，不是无限循环。",
      "低音线与模进常共同决定段落的方向。",
    ],
    concepts: ["harmonic-sequence", "bass-line"],
    dimensions: ["direction", "relationship"],
  },
  "laitz-21": {
    summary:
      "调式交替从同主音小调借用 iv、bVI、bIII、bVII 等和弦，形成大调内部的明暗轴；主音不变，调号被临时染色。",
    keyPoints: [
      "iv–I 与 bVI–V 是最常见的借用路径。",
      "借用和弦之后通常回到原调主音；新调终止才是转调。",
    ],
    concepts: ["modal-mixture-color", "borrowed-chords"],
    dimensions: ["brightness", "color", "relationship"],
  },
  "laitz-22": {
    summary:
      "半音转调通过半音化声部、等音和弦或突然的调性并置进入远关系调；它强调色彩突变而非平滑枢轴。",
    keyPoints: [
      "半音转调的关键是声部半音移动与目标和弦的属准备。",
      "远关系转调常需要等音重解释或模进支撑。",
    ],
    concepts: ["modulation", "tonal-distance", "modal-mixture-color"],
    dimensions: ["relationship", "color", "direction"],
  },
  "laitz-23": {
    summary:
      "那不勒斯六和弦是降 II 级大三和弦的第一转位，通常作下属接到 V；降二音下行到导音，形成强烈半音解决。",
    keyPoints: [
      "N6 是下属功能，不是属功能。",
      "bII6 的根音与外声部半音解决决定它的方向感。",
    ],
    concepts: ["neapolitan-aug6", "predominant"],
    dimensions: ["brightness", "color", "function"],
  },
  "laitz-24": {
    summary:
      "增六和弦用 b6 与 #4 的外向扩张强化属；意、法、德三种形态共享增六度，但在声部与解决上不同。",
    keyPoints: [
      "b6 下行到属音，b4 上行到属音，形成八度扩张。",
      "德国增六与属七等音，但功能与解决方向不同。",
    ],
    concepts: ["neapolitan-aug6", "voice-leading", "harmonic-color"],
    dimensions: ["color", "brightness", "function"],
  },
  "laitz-28": {
    summary:
      "对称和声（减七、增三、全音阶）削弱传统调性中心；八度被等分，和弦可被多种方式解释。",
    keyPoints: [
      "对称结构让同一个音响指向多个调性中心。",
      "调性模糊不是无调性，而是中心被延迟或多重化。",
    ],
    concepts: ["diminished-seventh", "tonal-distance", "harmonic-color"],
    dimensions: ["relationship", "color"],
  },
  "laitz-29": {
    summary:
      "半音模进与八度等分把调性拉伸到边缘；Coltrane Changes 与增三循环都用对称根音运动制造快速转调。",
    keyPoints: [
      "大三级循环把八度分成三个调性中心。",
      "半音模进让和声方向变得可预测又不断偏移。",
    ],
    concepts: ["coltrane-changes", "harmonic-sequence", "tonal-distance"],
    dimensions: ["relationship", "direction"],
  },
};

const EXTRA_NOTES: Record<string, NoteSeed> = {
  "laitz-1b": {
    summary:
      "拍号把强弱组织成时间框架；单拍、复拍与混合拍决定乐句的呼吸，切分与跨小节重音改变和声节奏的落点。",
    keyPoints: [
      "先判断拍号是单拍还是复拍，再判断重音层级。",
      "和声变化点要与节拍重音对齐或有意错位。",
    ],
    concepts: ["harmonic-rhythm"],
    dimensions: ["rhythm"],
    deepSummary:
      "Laitz 把节拍视为和声的容器：同样的 I–IV–V–I，落在不同的拍号与重音层级，会产生完全不同的句法。复拍（如 6/8）中“每三音一组”的重音会改变和弦变化的自然位置。",
    analysis: [
      "用 2/4、3/4、4/4、6/8 分别弹同一进行，比较落点。",
      "标出小节重音、次级重音与切分位置。",
      "检查旋律重音与和声变化是否互相支持。",
    ],
    crossBook: ["Levine 11：Rhythm Changes", "Levine 22：Salsa 与拉丁爵士"],
    visualHint: "和声节奏/节拍网格",
    confusions: [
      {
        question: "6/8 和 3/4 都是三拍吗？",
        answer: "3/4 是单三拍，每拍分两半；6/8 是复二拍，每拍分三份，重音层级不同。",
      },
    ],
  },
  "laitz-02": {
    summary:
      "旋律由音高、节奏与轮廓共同组织；动机的重复、模进与对位让旋律与和声互相解释，而不是各走各的。",
    keyPoints: [
      "旋律轮廓与目标音决定和声选择。",
      "对位关注声部独立与倾向音解决，不只看纵向和弦。",
    ],
    concepts: ["phrase-structure", "voice-leading"],
    dimensions: ["direction", "rhythm"],
    deepSummary:
      "Laitz 把旋律与对位放在和声之前，是为了先建立“线条”意识：旋律的顶点、落音与呼吸决定和声节奏；对位则保证各声部有独立方向。只标和弦而不看线条，分析会失去音乐性。",
    analysis: [
      "先画旋律轮廓：上行/下行、顶点、落音。",
      "把落音与和弦三音七音对齐，检查冲突。",
      "用反向/斜向进行修正平行五八度。",
    ],
    crossBook: ["Levine 02：声部进行", "Levine 06：从音阶到音乐"],
    visualHint: "旋律轮廓 + 声部线",
    confusions: [
      {
        question: "旋律只是和弦的装饰吗？",
        answer: "不是。旋律的目标音与轮廓会反过来决定和声选择与和声节奏。",
      },
    ],
  },
  "laitz-07": {
    summary:
      "第一转位三和弦让主与属的扩展更平滑：低音级进、六和弦减轻低音跳进，并让内声部获得更自然的连接。",
    keyPoints: [
      "六和弦的低音是三音，常用于级进低音。",
      "转位改变稳定性与连接，不改变功能身份。",
    ],
    concepts: ["voice-leading", "roman-numerals", "bass-line"],
    dimensions: ["function", "direction"],
    deepSummary:
      "第 4 版第 7 章的核心命题是“转位让低音变成旋律”：勃拉姆斯配同一首民歌，全用原位时半终止“不像到达更像又一个属”，换成六三和弦后立刻轻盈、有方向——低音下行六度再上跳八度，同时兼任和声功能与旋律趣味。本章给出贯穿后续的结构性和声 vs 装饰性和声对照表：结构性=进行性、有和声功能、强拍、原位；装饰性=延长性、有旋律功能（N/CL）、弱拍、转位。V6 是低音邻音的和声化（常配 5 在高声部保共同音，贝多芬七交用它开场；i6–V6–i 还能造不完全邻音，小调 ♭3–♯7 的减四度跳进因其极端表情被允许）；vii°6 是低音经过音（连接 I 与 I6）。I6/V6 的重复规则：根音优先、导音绝不重复、低音不重复时用同度重复或中性位置。",
    analysis: [
      "拿一首民歌各配一版：全原位 vs 加六三和弦，听半终止的区别（勃拉姆斯实验）。",
      "二级分析给装饰性和声标 N/CL/P，不给罗马数字——罗马数字只留给进行性和声。",
      "六三和弦放乐句中段（不稳定推动乐句），句首句尾留给原位。",
      "检查 I6/V6 重复：根音优先、导音禁重复，低音不重复时选同度或八度。",
    ],
    crossBook: ["Levine 02：斜线和弦/转位", "Sposobin 10：正三和弦的六和弦"],
    visualHint: "低音线 + 声部连接",
    confusions: [
      {
        question: "C/E 是 E 和弦吗？",
        answer: "不是。它是 C 大三和弦第一转位，根音仍是 C，低音是 E。",
      },
    ],
  },
  "laitz-08": {
    summary:
      "属七转位与导七和弦扩展属功能：转位改变低音与解决路径，导七的减七结构增加张力与等音可能。",
    keyPoints: [
      "V7 转位改变七音与三音的声部位置。",
      "导七解决到主，减七可作等音枢纽。",
    ],
    concepts: ["seventh-chords", "diminished-seventh", "voice-leading"],
    dimensions: ["function", "color"],
    deepSummary:
      "第 4 版第 8 章的定位判断句是“原位 V7 是进行性和弦、常宣告终止、要省着用；转位属七是理想的装饰性和弦”。三种转位各有旋律身份：V6/5 = V6 的邻音身份 + 七音（七音常作为经过或邻音出现在高声部，与低音导音反向）；V4/3 最常作 I 与 I6 之间的经过和弦（低音 2 与 vii°6 同低音），Schubert《磨工的花》外声部平行十度时七音可不上行解决——平行十度的强度压过七音常规解决；V4/2 最不稳定（七音在低音），常参与带声部交换的主音扩展，把经过七音放进低音会造出“躲开的终止”（evaded cadence）。组合规则：多个转位连用时从低活动音走向高活动音（V4/3→V6/5 而非反向），S–A–G♯ 的级进线把它们串成双邻音。写作四要点：进出转位尽量级进/共同音、转位用完整和弦、转位放弱位、倾向音规则照旧（导音外声部上行、内声部可降到 5；七音下行，唯一例外 I–V4/3–I6 配 3–4–5）。",
    analysis: [
      "比较 V7 原位与 V6/5、V4/3、V4/2 的低音与七音位置。",
      "标出导七的根音与外声部解决方向。",
      "检查减七的等音重解释可能。",
    ],
    crossBook: ["Levine 02：属七与声部进行", "Sposobin 14/15/22"],
    visualHint: "减七等音网络",
    confusions: [
      {
        question: "属七转位还是属功能吗？",
        answer: "是。转位改变低音与解决路径，不改变属功能身份。",
      },
    ],
  },
  "laitz-10": {
    summary:
      "强拍与半音和弦外音把张力放在句法关键位置；APT/CPT/AN/CN/倚音/延留音构成完整分类网，延留音的 P–S–R 三段式与写作规则在此定型。",
    keyPoints: [
      "强拍外音比弱拍外音更需要解决。",
      "半音外音常制造色彩转折或导向副属和弦。",
      "延留音三段式不可更改；解决音不得与其他声部同时出现（9–8 例外）。",
    ],
    concepts: ["non-chord-tones", "harmonic-color", "harmonic-rhythm"],
    dimensions: ["color", "rhythm"],
    deepSummary:
      "外音的“位置”决定它的重量：弱拍经过音可以只是流动，强拍倚音则会被听成临时和弦音。Laitz 关注外音与和声节奏的互动，而不是把外音当作孤立装饰。",
    analysis: [
      "标出外音在强拍还是弱拍、上行还是下行。",
      "检查外音是否与和弦三音形成小九度冲突。",
      "判断它是否需要准备/延迟解决。",
    ],
    crossBook: ["Levine 02：声部进行", "Sposobin 36–45：外音"],
    visualHint: "张力光谱 + 节拍网格",
    confusions: [
      {
        question: "外音都要立即解决吗？",
        answer: "不一定。弱拍经过/辅助音可以自由流动；强拍倚音与延留音通常需要明确解决。",
      },
    ],
  },
  "laitz-12": {
    summary:
      "下属七和弦把下属功能扩展为四音和弦；ii7/IV7 通过三音七音连接属和弦，形成更平滑的 ii–V–I 与内嵌乐句。",
    keyPoints: [
      "下属七和弦的七音通常下行解决。",
      "ii7–V7–I 是最典型的嵌入模型。",
    ],
    concepts: ["predominant", "seventh-chords", "ii-v-i"],
    dimensions: ["function", "color"],
    deepSummary:
      "第 4 版第 12 章用五种手段给乐句模型“加深”：① 非属七和弦——PD 加七度（ii65 是最常用的非属七），七音必须同音或上方级进预备、下行解决，转位要完整、原位可省五音；“耳与眼”一节专门处理延留音伪装成 iv7 的情况（听感定身份）。② 嵌入乐句模型（EPM）——主音延长段里放进一个迷你的、非终止的 T–PD–D–T（用转位弱化它的终止感），二级分析只承认一次真正的 T–PD–D–T。③ 对位终止——用转位的属或主收束，把原位 V 留给更有分量的最终终止（Schubert《乌鸦》的 vii°6–i 收束甚至可争论它是不是乐句）。④ PD 自身的扩展——ii/ii6 间插 I6 作经过、IV 与 IV6 间插 i64、IV65→ii65 的声部交换、把主音材料移高二级重述（注意：弱 I6 可扩展 ii，反向不成立）。⑤ 子乐段叠加——乐句以分段方式完成戏剧轨迹，长度到 8/12/14 小节。",
    analysis: [
      "非属七：先找七音的准备（同音/上方级进）与下行解决；原位省五音避平行。",
      "EPM 判定：二级分析只承认一次 T–PD–D–T；转位弱化的“迷你模型”归入主音延长。",
      "对位终止：属或主任一转位即算；要争论“是不是乐句”时看根位 T→D 是否成立。",
      "PD 扩展四式：ii↔ii6 间插 I6、IV↔IV6 间插 i64、IV65→ii65 声部交换、主音材料移位重述。",
    ],
    crossBook: ["Levine 02：ii–V–I", "Sposobin 21：下属七和弦"],
    visualHint: "张力光谱 + 体系图功能链",
    confusions: [
      {
        question: "ii7 和 IV 都是下属，可以互换吗？",
        answer: "功能相近但声部与色彩不同；ii7 有七音张力，IV 更稳定，选择取决于旋律与低音。",
      },
    ],
  },
  "laitz-16": {
    summary:
      "乐句（sentence）由基本乐思、重复与延续构成；双乐段与非对称乐段扩展了乐段的平衡与比例。",
    keyPoints: [
      "sentence 的核心是“陈述—重复—延续—终止”。",
      "非对称乐段仍靠终止关系维持完整性。",
    ],
    concepts: ["phrase-structure", "cadences"],
    dimensions: ["rhythm", "direction"],
    deepSummary:
      "第 4 版第 16 章用“家长喊孩子回家”的比喻讲乐句（sentence）结构：短—短—长（1:1:2）——一个短陈述、近似重复、然后加倍的展开。贝多芬 Op.2 No.1 的例子更进一步：前四小节 A(2)–A′(2)–B(4) 的乐句里，B 段还藏着一个 1:1:2 的迷你乐句（嵌套句，大写标大层、小写标小层），同时和声节奏在 B 段加速——材料合而为一、和声却碎化，是乐句结构的悖论。乐句可以组成乐段（两种方式：整段重复加装饰成两句；或一句当 A+A′、另一句当 B 贯穿整个乐段），双乐段（four phrases 组合）与变化乐段也在此展开。",
    analysis: [
      "标乐句：找陈述（A）、重复（A′）、展开（B）的比例——通常 2+2+4 或 1+1+2。",
      "检查嵌套：B 段内部是否还有更小层的陈述-重复-展开（大写/小写分层记）。",
      "和声节奏对照：B 段加速是乐句的常见戏剧手法。",
      "乐段层面：判断是“重复的乐句”还是“贯穿的单乐句”。",
    ],
    crossBook: ["Levine 17：曲式", "Sposobin 8：终止、乐段、乐句"],
    visualHint: "句法树/乐段结构",
    confusions: [
      {
        question: "四小节就一定是乐句吗？",
        answer: "不一定。乐句由终止与句法功能定义，长度可以不对称。",
      },
    ],
  },
  "laitz-20": {
    summary:
      "二部曲式与变奏用重复、对比与调性关系组织更大结构；变奏可以改旋律、和声、节奏或织体。",
    keyPoints: [
      "二部曲式常用调性对比与回归建立整体感。",
      "变奏不是装饰，而是对同一结构的多次重新解释。",
    ],
    concepts: ["phrase-structure", "harmonic-sequence", "tonal-distance"],
    dimensions: ["rhythm", "relationship"],
    deepSummary:
      "第 4 版第 20 章给出二部曲式的完整 2×2 分类：主题设计（simple a b / rounded a–digression–a′）× 和声结构（sectional 两段都收在主 / continuous 首段离开主调且第二段继续在外）。rounded continuous 是最常见的两段体模型：主题—离题（digression，碎化+不稳定材料推向 HC）—中断（interruption，双斜线 //）—主题再现，大调走向 V、小调走向 III 再回 i。balanced 是附加特征：第一段结尾材料在结尾处以主调再现（不打破其他标签）。变奏曲式同章：连续变奏靠 ostinato 串联——ground bass（重复低音）/ chaconne（重复和声）/ passacaglia（两者兼有），变奏之间首尾叠置（dovetailing）；分段变奏各段闭合。写作风险与解法：字面重复造成停滞、全程新材料造成混乱——变奏正是统一与多样的实验室。",
    analysis: [
      "判二部曲式三步：终止定和声结构（sectional/continuous）→ 材料回归定主题设计（simple/rounded）→ 查结尾材料是否“平衡”。",
      "rounded 模型记谱：a — digression — // — a′；离题段碎化推向 HC 是标准战术。",
      "比例失衡时用 balanced 修补：再现第一段的收尾材料并移回主调。",
      "连续变奏认 ostinato 类型；分段变奏看段间闭合强度。",
    ],
    crossBook: ["Levine 17：曲式与作曲", "Sposobin 59：调性布局"],
    visualHint: "曲式森林",
    confusions: [
      {
        question: "变奏就是加装饰音吗？",
        answer: "不只是。变奏可以改变和声、节奏、织体、调式甚至曲式比例。",
      },
    ],
  },
  "laitz-25": {
    summary:
      "三部曲式用 A–B–A 的回归建立大尺度平衡；B 段常提供调性/主题对比，A 回归带来完成感。",
    keyPoints: [
      "A 段的回归需要有可识别的主题/调性标志。",
      "B 段的对比越强，回归越有结构重量。",
    ],
    concepts: ["phrase-structure", "tonal-distance"],
    dimensions: ["rhythm", "relationship"],
    deepSummary:
      "第 4 版第 25 章把三部曲式定义为**复合曲式**（composite form：各自和声闭合的独立段落），与二部曲式的“各段调性互相依赖、有机生长”形成根本对照。细分三型：full sectional（A‖B‖A′，三段都收在各自主调）、sectional（AB‖A，一段离开）、continuous（ABA′）。与 rounded binary 的判据不在小节数而在 **B 段对 A 段的依赖度**：少关联→三部曲式；有主题/动机关联且几乎不换调→二部曲式。transition（引新调的桥）与 retransition（回原调的桥，出现频率高得多）是可选配件。复合三部（compound ternary）常见于 da capo 曲式（「回到头」记号省墨，真正回归即最后的 A）、da capo 咏叹调（ritornello 间奏穿插）与小步舞曲-三声中部（minuet–trio：两部多为嵌套 rounded binary，用**可逆对位与音区交换**让 a′ 与 a 不重复）。19 世纪 character piece 时代，独立段落之间靠动机变形暗线连接（“皇帝”四重奏三声中部的第一小提琴藏着小步舞曲大提琴的 C–F–B–C 动机）。",
    analysis: [
      "判型三步：各段是否和声闭合 → full sectional/sectional/continuous → B 与 A 的依赖度（对动机关联与换调程度打分）。",
      "找桥：transition 在 A→B 之间、retransition 在 B→A 之间；段落收束后另起模进材料即过渡段。",
      "复合结构画双层图：大三层 ABA + 每段内部的嵌套 binary。",
      "表演提示：找出段间的动机变形暗线（如三声中部里的小步舞曲动机），让演奏更有机。",
    ],
    crossBook: ["Levine 17：曲式", "Sposobin 59：调性布局"],
    visualHint: "曲式森林",
    confusions: [
      {
        question: "A–B–A 的 A 必须完全相同吗？",
        answer: "不必。回归常带变奏、缩短或调性调整，但仍需可识别。",
      },
    ],
  },
  "laitz-26": {
    summary:
      "回旋曲式用 A 的多次回归与插部对比组织长段落；每次回归都可变奏，插部常带来调性/材料对比。",
    keyPoints: [
      "A 的回归是结构锚点，插部负责对比。",
      "调性布局与回归频率决定整体张力。",
    ],
    concepts: ["phrase-structure", "tonal-distance"],
    dimensions: ["rhythm", "relationship"],
    deepSummary:
      "第 4 版第 26 章的立意句：回旋曲是“变化是生活的调味料”与“没有地方比家好”两条人性的平衡——叠部（refrain，回归材料 A）与插部（episode，对比材料 B/C）交替。谱系即规模递增：三部曲式 ABA′ = 三部回旋；五部回旋 A¹BA²CA³（+Coda）是古典时期最常见型；七部回旋 A¹B¹A²CA³B²A⁴。起源于法国巴洛克 rondeau（Couperin/Rameau，叠部极短、插部可任意多）。分析细节：过渡与回过渡可选（回过渡更常见，常以碎片化材料引回原调）；终止后超出“本可结束”点的材料叫 coda；复合回旋的每个大部内嵌 rounded binary。七部回旋与三部曲式的区分要点在插部的独立性与调性布局。",
    analysis: [
      "画回旋图：叠部 A¹A²A³… + 插部 B/C…，每段标注小节与罗马数字调性。",
      "查桥接：段后有 PAC 且续以碎片化引回材料 = retransition；无模进无新主题 = 无过渡。",
      "终止后仍继续的材料 → coda；它只确认主调、不引入回归。",
      "复合回旋：每个叠部/插部内部再画嵌套的 a–dig.–a′ 二部图。",
    ],
    crossBook: ["Levine 17：曲式", "Laitz 19：临时主化与转调"],
    visualHint: "曲式森林",
    confusions: [
      {
        question: "回旋曲式就是 ABACA 吗？",
        answer: "ABACA 是常见形式，但回归次数与插部数量可以变化。",
      },
    ],
  },
  "laitz-27": {
    summary:
      "奏鸣曲式把呈示、展开与再现组织成调性叙事：呈示建立主/属对比，展开制造不稳定，再现解决调性冲突。",
    keyPoints: [
      "呈示部的调性对比是后续结构的动力。",
      "再现部常把副题拉回主调，完成调性闭环。",
    ],
    concepts: ["tonal-distance", "modulation", "phrase-structure"],
    dimensions: ["relationship", "direction"],
    deepSummary:
      "第 4 版第 27 章的推导路线最精彩：奏鸣曲式 = **balanced + rounded continuous binary 的结合体**。FTA（第一调性域）走 rounded 特征——呈示主题在展开（=digression）与中断（HC//）后于再现部回归；STA（第二调性域）走 balanced 特征——呈示部结尾在副调（大调 V、小调 III）的材料在再现部回到主调，这就是**奏鸣曲原则**（sonata principle：原本不在主调的材料回到主调）。完整部件清单：呈示部 FTA–Tr（依赖 DTr 复呈 FTA 主题 / 独立 ITr 新材料，终于副调主音或属音，常以 medial caesura 中间歇息收尾）–STA–CL（收束段，多组终止、常比 STA 还长，后接 codetta）；展开部（最自由、可引入新主题 X、碎片化+模进、无规律乐句）；RTr（回过渡，属准备+中断）；再现部（FTA 与 STA 全回主调，过渡被改写以留在主调）；Coda（可选，常带持续音、强调下属做大型变格扩展）。全图：I→V‖: 开发 ://…i。变体：monothematic（Haydn 同主题双调性域——FTA/STA 标签系统照样适用）、慢引子（=巨大延长的上拍，贝一开头 V7/IV→F 的假主音游戏）、**假再现**（FTA 主题在错调重现，仍属展开部）、三调呈示部、sonata-rondo。比例法则：贝多芬 op.49 只反复呈示部，因为展开+再现已是呈示的两倍长。",
    analysis: [
      "先立骨架：呈示（FTA/Tr/STA/CL）—展开（+RTr）—再现（全主调）—Coda，标调性。",
      "过渡定型：开头复呈 FTA 主题 = DTr，新材料 = ITr；找 medial caesura 的间歇。",
      "再现部三查：STA 是否回主调（奏鸣曲原则）、过渡如何被改写、有无压缩/换序。",
      "警惕假再现：主题在错调出现时先归入展开部，数到真正主调回归才写再现。",
    ],
    crossBook: ["Levine 17：曲式", "Sposobin 59：调性布局"],
    visualHint: "调性距离网络",
    confusions: [
      {
        question: "奏鸣曲式只是 A–B–A 吗？",
        answer: "不是。它的核心是调性对比与解决，呈示/展开/再现各自承担不同功能。",
      },
    ],
  },
  "laitz-30": {
    summary:
      "中心性、非三度叠置与音高集合把调性扩展到三和弦之外；中心仍可能存在，但不再由功能和声独占地定义。",
    keyPoints: [
      "中心性可以由持续音、重复、音程细胞或集合建立。",
      "非三度叠置和弦的“功能”需要重新定义。",
    ],
    concepts: ["harmonic-color", "tonal-distance"],
    dimensions: ["color", "relationship"],
    deepSummary:
      "第 4 版第 30 章开篇用 36 个月内写成的八首作品展示新声音世界的多样性，然后立起本章坐标：post-tonal 分 **centric**（有引力音/音响）与 **atonal** 两类，金句是「所有调性音乐都是 centric，但并非所有 centric 音乐都是调性」。术语全面切换：pitch class / collection（作曲家取材的音库）取代「和弦」，pitch center 取代 tonic。集合清单：七音（教会调式复兴——按三音分组大小类，附辨式步骤：先找中心音、再排音阶读模式）；五声；六音两条线——全音集合（与四度世界相交的 Schoenberg 例子）与 **hexatonic**（两个半音相隔的增三交错，1–3–1–3–1–3，仅 4 个移位；内含大三度根关系的 6 个大小三和弦共 24 个=全部协和三和弦；**parsimonious voice leading** 每次只动一音绕行六和弦；**hexatonic poles** 异性级大三度配对且三声部全半音移动）；八音 octatonic（Messiaen「有限移位模式」的宠儿，1–2 或 2–1 循环；与 hexatonic 的大三度根关系相对，octatonic 的三和弦按小三度/三全音排布）。另有四度五度叠置（quartal/quintal）、split-third ninths（同根大小三并存）与「形式即过程」（process-based form）。",
    analysis: [
      "辨式四步：找中心音（时值/拍位/出发点）→ 排音阶 → 读 1–3–1–3 型循环定 hexatonic / 1–2 型定 octatonic / 全音定全音集合。",
      "hexatonic 内用 parsimonious 连接走六个三和弦；找 poles 配对（大三度异性级、三声部半音）。",
      "octatonic 例先列 PC 清单再看 2–1 循环；三和弦根音呈小三度/三全音排布即它的指纹。",
      "分析从「中心如何建立」出发（重复/持续/细胞），不问「这是几级」。",
    ],
    crossBook: ["Levine 08：Outside", "Levine 15：对称和声"],
    visualHint: "音高集合/关系网络",
    confusions: [
      {
        question: "没有三和弦就没有中心吗？",
        answer: "不一定。中心可以由持续音、重复、音程细胞或集合关系建立。",
      },
    ],
  },
  "laitz-31": {
    summary:
      "集合分析用音高集合、标准型与音程向量描述非调性音乐；它补充功能和声无法覆盖的结构关系。",
    keyPoints: [
      "集合分析关注音高关系，不依赖和弦功能。",
      "音程向量描述集合的张力与对称性。",
    ],
    concepts: ["intervals", "harmonic-color"],
    dimensions: ["color"],
    deepSummary:
      "第 4 版第 31 章是集合分析的方法论章。开篇的 Webern op.5 七步观察是全章灵魂：先做朴素观察（织体分层、模仿、静默），发现「休止与织体改变如今可以承担终止的职能」；两个音响的音程读数 1–4–1 与 1–5–1 是回文——对称是 Webern 的指纹。方法论阶梯：pitch space（无限）→ pitch-class space（12 个，八度等价）；四种等价类（octave/order/temporal/enharmonic）把海量音响压缩成少量等价组；整数记法（C=0…B=11）与 mod-12 时钟；有序/无序、pitch/PC 两轴共四类音程，interval class（ic 1–6）与 mod-12 逆数；三音以上 P set / PC set 的系统分析四步——① segmentation 分段取 PC 集 → ② normal order 最紧凑排布 → ③ best normal order（左轮比右轮）→ ④ prime form 与 set class 命名；index number 做倒影轴运算；symmetrical sets 与 invariance（移位/倒影下保持不变的音）；ic vector 六位数描述集合的音程含量（张力与对称的量化）。",
    analysis: [
      "先做 Webern 式观察再上工具：织体、重复（原样/变形）、静默与断句是否升格为结构事件。",
      "求 prime form 四步走：分段 → normal order → BNO（左轮<右轮）→ PF；用时钟图辅助。",
      "倒影用 index number：两个音的 index 和恒等于轴的 2 倍。",
      "ic vector 读法：六位从 ic1 到 ic6；对称集合的 vector 两侧常对称，Z 关系集合同 vector 不同 PF。",
    ],
    crossBook: ["Levine 15：Coltrane 对称", "Laitz 28：新的和声倾向"],
    visualHint: "音高集合圆环",
    confusions: [
      {
        question: "集合分析能解释调性音乐吗？",
        answer: "可以补充局部色彩与对称关系，但不能取代功能/声部分析。",
      },
    ],
  },
  "laitz-32": {
    summary:
      "节拍与序列技术把音乐组织从和声转向时间、音高序列与过程；分析要关注重复、变形与结构位置。",
    keyPoints: [
      "序列技术关注音高/节奏的变形与排列。",
      "节拍结构可以独立于和声制造张力。",
    ],
    concepts: ["harmonic-rhythm", "intervals"],
    dimensions: ["rhythm"],
    deepSummary:
      "第 4 版第 32 章两大块。节奏块：asymmetrical meters（5/8=2+3 或 3+2、7/8 的三种分组——Bartók 保加利亚节奏是入门），「削弱小节线暴政」的摇曳感；Messiaen added rhythmic values（给音符加附点/双附点打破均分）；nonretrogradable rhythm（正反读相同的回文节奏）；changing meters（Bartók《换拍子》19 次换拍但四小节一循环=高层不对称拍号）；metric modulation（用比例关系换算新旧速度）；polyrhythm（2:3、3:4，Scriabin 同拍混 2:3 与 3:4）与 polymeter（overt 明写两个拍号 / embedded 各声部各走各的拍号，N 小节后才对齐）。十二音块：row=含全部 12 音的有序序列，首次陈述为 prime；**TTO 四算子** T/I/R/RI 共 48 个基本形；标记用 fixed-do（P7=从 G 开始）；分析用 global approach——找单旋律线、和声标记（反复出现的音响）、给每个 PC 标序号；Webern op.24 的音列 = 四个 [014] 三和弦拼成 aggregate，六和弦互补；十二音矩阵（48 格速查）；**combinatoriality**——两个六和弦互补可同时陈述，Schoenberg 的招牌是 inversional combinatoriality（P 与某 I 的前六音互补），Berg《抒情组曲》、小提琴协奏曲的 P9/I2 涌现；variance vs invariance（不变性来自对称）。",
    analysis: [
      "不对称拍号先拆 2+3/3+2 分组再指挥；changing meters 找高层循环单位。",
      "十二音分析三招：纯旋律段定序号 → 和声标记（反复三和弦/六和弦）→ 配平 48 形矩阵。",
      "Webern 型音列认 [014]×n 拼 aggregate；六和弦互补核对 ic vector 相同。",
      "找 combinatorial 配对：P 的前六音与哪个 I 的前六音互补；不变音来自对称结构。",
    ],
    crossBook: ["Levine 15：对称/序列思维"],
    visualHint: "序列矩阵/节拍网格",
    confusions: [
      {
        question: "序列音乐没有结构吗？",
        answer: "有，只是结构由序列变形、节拍与过程而非功能和声建立。",
      },
    ],
  },
};

const DEEPEN: Record<string, Partial<NoteSeed>> = {
  "laitz-03": {
    deepSummary:
      "三和弦与七和弦的分析不止是“认质量”：根音、低音、三音七音与织体共同决定稳定性、功能与色彩。转位改变低音与声部连接，不改变根音身份。",
    analysis: [
      "先认根音与质量，再看低音判断转位。",
      "把三音七音标出来，作为后续声部进行的骨架。",
    ],
    crossBook: ["Levine 01：基本理论"],
    visualHint: "和弦构建器/钢琴键盘",
  },
  "laitz-05": {
    deepSummary:
      "第 4 版第 5 章把主—属写成“稳定 vs 期待”的戏剧：属的倾向音（7 上行、2 到 1 或 3、五音作为属根音想回 1）制造必须兑现的期待——瓦格纳《莱茵的黄金》前奏证明纯主和弦可以靠节奏而不靠和声前进，《英雄》末乐章则展示属七加入小七度后压力爆表。终止式的完整分类在此给出：PAC 要求低音 5–1 且高声部 2–1 或 7–8；高声部落 5 或 3 是 IAC；低音不走 5–1 的 IAC 叫对位终止；半终止停在原位属（高声部常见 2）；小调要升 7，收束可用皮卡迪三度。声部进行部分给出贯穿全书的 4 条规则 + 10 条指南：倾向音必须级进解决（内声部导音例外）、禁止平行同度/八度/五度、倾向音不可重复、上方相邻声部在一个八度内；指南包括保持共同音、先写外声部、上方声部与低音反向、尽量密集位置（平行五度在密集位置会变成无害的纯四度，更容易检查）、省略音只能省五音等。",
    analysis: [
      "终止先分类（PAC/IAC/对位终止/HC），再看高声部落点与低音是否 5–1。",
      "四声部写作三技巧：平滑（保共同音）、声部域独立（各守 tessitura）、对位独立（防交叉与越位）。",
      "密集位置起步、可转开放，但尽量回密集——便于检查平行五度。",
      "查规则：倾向音解决、平行五八度、倾向音重复、上方声部八度限制，四条规则不可违反。",
    ],
    crossBook: ["Levine 02：声部进行", "Sposobin 8/9：终止与四六"],
    visualHint: "终止式分类表 + SATB 音域图",
  },
  "laitz-09": {
    deepSummary:
      "第 4 版第 9 章给出下属功能的完整论证：为什么 ii 常比 IV 好——① ii–V 是下行五度（最强根音运动）；② 引入调式对比（大调的 ii 是小三、小调的 ii° 是减三）；③ ii6–V–I 常配高声部 2–7–1，把即将到来的 1 包夹起来，比 IV 的 1–7–1 更有动力。小调里几乎只用 ii°6（根位减三在低音上方露出三全音太刺耳）。iv6–V 的弗里吉亚半终止（低音 ♭6–5）是巴洛克慢乐章的标准收束。IV–ii 复合体是关键概念：IV 到 ii6 常不是换和弦，而是高声部 5–6 的对位移动（帮 IV 绕开到 V 的平行五度），二级分析里同归 PD。乐句模型给出四种图式（PAC 收束两种 + HC 收束两种），并强调主功能常占据最长时值——T–PD–D–T 顺序不可逆。写作清单：外声部反向、小调 6 必须下行到 5、7 从上方接近。",
    analysis: [
      "判 PD：ii 还是 IV？看高声部是否要包夹 1、低音是否要 4–5。",
      "小调写 ii°6、大调 ii 原位/转位皆可；弗里吉亚半终止记低音 ♭6–5。",
      "把 IV–ii6 标成 PD 下的一次 5–6 移动，而不是两个独立和弦。",
      "写乐句先选模型（PAC 或 HC），再看主功能占了多长时值。",
    ],
    crossBook: ["Levine 02：ii–V–I", "Sposobin 18/21：SⅡ 与下属七"],
    visualHint: "功能链 + 乐句模型四图式",
  },
  "laitz-18": {
    deepSummary:
      "第 4 版第 18 章给出造副属和弦的两条路：① 给任何大/小三和弦前加它的属（V/x、V7/x）；② 把调内和弦作半音变化改造成副属——注意大调的 V/IV、小调的 V/VI 与 V/III 本来就是调内大三和弦，通常要加小七度才能听出“副属”身份。核心认知：副属与其目标同属一个功能层（V/ii–ii 同归 PD），临时主化再长也只是乐句模型里的“中转站”（ii 被扩半天仍是下属）。声部进行沿用 V7 规则：临时导音与临时七音不重复、导音在外声部必须上行、七音下行；半音要同声部预备（G–G♯–A 的半音线），跨声部会造成 cross relation——万不得已要放在内声部之间。副属巩固半终止（tonicized HC 用 V6/5 of V 稳住属音）与副属模进（D2、D3、A2 三种序列）是两大应用场景。",
    analysis: [
      "造 V/x：目标是大/小三和弦 → 找它的五度上方；目标是减三和弦 → 造不出来。",
      "辨认：升高的半音多为临时导音（和弦三音），降低的半音多为临时七音。",
      "写作三查：不重复导音/七音、导音外声部上行、七音下行；同声部预备半音线避免 cross relation。",
      "二级分析把 V/x 和 x 括在同一功能下；箭头记号只标正常解决，意外进行要写全罗马数字。",
    ],
    crossBook: ["Levine 13：重配和声", "Sposobin 28/29/32"],
    visualHint: "调性距离网络 + 临时导音/七音标法",
  },
  "laitz-19": {
    deepSummary:
      "第 4 版第 19 章区分临时主化的两个量级：扩展临时主化（一串副属和弦，用括号分析法——括号下标临时主音的级数、括号上按临时调分析，如 iv/ii–V/ii 写成 ii 调的 iv–V）与转调（新调出现强终止、且终止后音乐继续留在新调；临时主化则在乐句内、不打断原调感）。近关系调给了两个等价定义：主调各音级上协和三和弦对应的调，或调号相差不超过一个升降号的调；大调常转向 V/vi/iii，小调常转向 III/v/VI。枢轴和弦是两调共同拥有的最后一个和弦（排除 64 与新调属和弦），最好的枢轴在新调里当 PD；写作时枢轴放在转调乐句的中点、两调时长要平衡。分析步骤：先找两调互斥的音（新调升高的导音从哪拍开始，新调就从哪拍生效）。",
    analysis: [
      "临时主化还是转调？找新调的强终止 + 终止后是否继续。",
      "分析转调：列互斥音 → 定最后一个两调皆准的和弦 → 检查它能否当枢轴（排除 64 与新调 V）。",
      "写转调：枢轴选新调 PD、置于乐句中段，两调时长平衡，最后用终止坐实。",
      "扩展临时主化用括号记法，避免罗马数字堆叠。",
    ],
    crossBook: ["Levine 15：Coltrane Changes", "Sposobin 34/35"],
    visualHint: "五度圈/调性距离 + 括号分析法",
  },
  "laitz-21": {
    deepSummary:
      "第 4 版第 21 章把调式交替拆成两类：旋律性交替（♭6 作和弦成员：ii°、iiø7、iv）与和声性交替（♭6 作根音：♭VI；♭3 作根音：♭III）。♭6 是最常被交替的音级，书中给了四个理由：最不伤调性、给属一个半音进行、给所有 PD 上色、且是主音低音上唯一能被协和支撑的非主三和弦音（5–6 对位的常客）。♭VI 的五个语境：下行琶音、下行五度、作 PD 进属、阻碍终止替代主、半音距离 motivic 化作延长属的上邻音。i 与 ♭III 在 18 世纪只敢“暗示”，到舒伯特手中 saturation 到“二十四个调融合成十二个大小调”的程度。写作三戒：变音除非是根音否则不重复；♭6 走 5–♭6–5 或 6–♭6–5 且保持同声部；一旦进入交替色，直到属功能之前不许再出现还原 6（否则 cross relation 且泄掉到属的冲力）。判别要点（章末明确）：交替和弦独立参与和声进行、多为 PD；应用和弦只是指向更重要和弦的属——同是变化音，身份完全不同。",
    analysis: [
      "判交替还是副属：变化音是和弦的根音/成员（独立参与进行）还是临时导音/七音（指向别处）。",
      "♭6 写作两式：5–♭6–5（邻音）或 6–♭6–5（经过），同声部完成。",
      "进入 ♭VI/iv/ii° 后保持交替色直到属，不再出现还原 6。",
      "♭VI 的功能再判：琶音/五度/前属/阻碍/属的上邻音，看前后文。",
    ],
    crossBook: ["Levine 14：高级重配", "Sposobin 49/50"],
    visualHint: "明暗轴/张力光谱",
  },
  "laitz-23": {
    deepSummary:
      "第 4 版第 23 章把那不勒斯和弦定位为“ii°6 的半音变体”：C–E♭–A♭ 替换了 C–E♭–A——♭2 取代 2，功能仍是前属（低音 4 与 6 都拉向 5）。书里的关键判断：它更像应用和弦还是交替？——它是大三和弦却指向 ♭V，两者都不是，所以是独立的半音前属。写作要点：小调最常见；几乎总用第一转位 N6（♭2 原位会造成到 5 的三全音跳进）；重复低音 4，必要时重复 6；♭II6–V 的高声部走 ♭2–7；两个 ♭2→7 的路径都用 1 作经过音填充；大调中 ♭2 与 3 之间的增二度要避免。扩展：♭II 可以被自己的前属、六四、模进与枢轴身份扩展，甚至作为转调枢轴。",
    analysis: [
      "识别：大三和弦、低音 4、含 ♭2 → 那不勒斯（不是某调的 V）。",
      "写作：N6 → V，高声部 ♭2–7，低音 4–5；重复低音。",
      "填充 ♭2→7 的间隙：用 1 作经过音（两种和声化）。",
      "大调写 N6 时同时降 2 与 6，避免增二度旋律。",
    ],
    crossBook: ["Levine 13：重配和声", "Sposobin 47/53"],
    visualHint: "半音尺/调性距离",
  },
  "laitz-24": {
    deepSummary:
      "第 4 版第 24 章称增六和弦为“ arguably 最重要的半音和声”：前属身份推动乐句冲向属，且能变色龙般转为属功能。推导从弗里吉亚半终止开始：iv6–V 的低音 ♭6–5 保持、高声部 4 升高半音到 ♯4，形成特征性的增六度（外向扩张到八度）。成分三条：低音 = 5 上方半音（小调天然 6，大调需降 6）；一声部 = 5 下方半音（♯4）；另一声部 = 主音 1。三形态按最后一音分类：It6（重复 1）、Fr43（加 2）、Ger65（小调加 3、大调加 ♭3）。Ger65→V 有平行五度问题，标准解法是先进 Cad64 再到 V。大调 Ger65 到大六度 Cad64 时 ♭3 常等音记作 ♯2（“瑞士增六/倍增六度”）。变体：省略解决（elided resolution）、作为 PD 扩展的一部分、半音化低音下行、声部交换、German 减三和弦（Ger65 上加减三度）；也可转调强化或作转调枢轴。",
    analysis: [
      "识别三成分：低音 ♭6、♯4、1——再看第四音定意/法/德。",
      "解决：低音下行半音到 5、♯4 上行半音到 5、其余就近；Ger65 先过 Cad64 避平行五度。",
      "判来源：混合（低音 ♭6）+ 临时主化（♯4）的合体——两股力量的交汇。",
      "大调 Ger65 后接含大六度的 Cad64 时，用 ♯2 记谱代替 ♭3。",
    ],
    crossBook: ["Levine 13：重配和声", "Sposobin 47"],
    visualHint: "半音扩张/张力光谱",
  },
  "laitz-1a": {
    deepSummary:
      "第 4 版的 1A 从巴赫《E 大调小提琴帕蒂塔》前奏曲进入，先立“调性/共同实践”的框架，再进入音高世界：音高、音程、音阶与调号共同定义调性空间。音程是“度数 + 半音数 + 语境”的三重判断；大调与小调是同一坐标上的不同主音与功能选择，关系调共享调号但导音与属和弦不同。",
    analysis: [
      "写出音阶的七个音级，标出半音位置与导音。",
      "先数度数、再数半音，最后判断音程性质；转位后度数相加为九。",
      "比较关系大小调：哪些和弦共享，哪些因导音改变而不同。",
      "把调号、主音与功能三件事分开记，避免只背调号。",
    ],
    crossBook: ["Levine 02：大调音阶与进行", "Levine 01：基本理论"],
    visualHint: "五度圈 + 调式轮 + 半音尺",
  },
  "laitz-04": {
    deepSummary:
      "第 4 版第 4 章是“从音符到音乐”的桥：先建立调性层级——协和与不协和要放在低音语境里判断（同一个 m6，下面是 F/♭A 就协和，下面是 C 就要解决；纯四度在低音上方才是刺耳的）。Laitz 特意弃用“非和声音”这个词：和弦跳进与琶音是协和的装饰音、本身就是和弦音，所以统称 embellishing tones（装饰音），再按协和/不协和加前缀。舒伯特《菩提树》是全书的方法论示范：只看旋律会把 ♯4 听成经过音、把 6 听成邻音，配上和声才发现前者是 V 的和弦音、后者是属七的七音——脱离和声语境的旋律分析会整体判错。章末用《Clementine》与《God Save the King》演示结构记谱（符干 = 结构音、符头 = 装饰音）：两首的第一句都琶音主三和弦到 5，第二句都以长级进下行 5→1 收束；并引入格式塔三原则——gap-fill（跳进后反向级进填坑）、good continuation（既定模式延续）、expectation/fulfillment（期待与兑现）。",
    analysis: [
      "先找支撑和声，再判旋律音身份：是和弦音、经过音还是邻音（Vivaldi 双簧管奏鸣曲的判读顺序）。",
      "结构记谱：符干/符头分层，邻音用连线挂回结构音，琶音用连线串起和弦成员。",
      "听长线条：按“时值 + 拍位 + 和弦倾向”标出被强调的音，它们连成的级进线就是 melodic fluency（如 Donizetti 的 5→1 下行）。",
      "检查跳进后的 gap-fill 与 nesting（小三度模仿大线条）。",
    ],
    crossBook: ["Levine 06：从音阶到音乐", "Sposobin 38–44：和弦外音"],
    visualHint: "旋律轮廓 + 节奏格 + 结构分层记谱",
  },
  "laitz-06": {
    deepSummary:
      "第 4 版第 6 章把二次分析（second-level analysis）立为全书的方法论核心：每个和弦都标罗马数字只是“描述”，分析要区分**结构性和声与装饰性和声**——前者是进行性的（保住罗马数字），后者是延长性的（在二级分析里按旋律功能标 N/P/CL）。装饰与简化是同一过程的两端：给一个主和弦加外音再配和声、再加节奏音型，四步就能“长出”维瓦尔第《春》；反过来从《暴风雨》奏鸣曲里削掉装饰，露出贝多芬的外声部骨架。节拍化（占满一个节拍单位、必须被配和声）与次节拍化（不足一拍、常不配和声）装饰音的区分由此引入。第 6 小节两种读法（2A 主控制/2B 属控制）示范“分析是解释”——强拍规则与模式延续的权衡各有演奏含义。属七作为“和弦不协和”在此引入：七音让属和弦必须解决。章末的分析三角——节奏节拍、和声、旋律互为约束——是全书分析的宣言。",
    analysis: [
      "二次分析三层走：一级全标 → 2A 分结构/装饰 → 2B 只留结构和声。",
      "装饰音配了和声也能认出：看轮廓（是否邻音/经过形状）+ 拍位（弱位）+ 模式延续。",
      "换和弦尽量从弱拍到强拍，避免切分和声节奏（3/4 终止处属占 2–3 拍是例外）。",
      "配旋律四步：先定终止 → 定和声节奏 → 每个低音配一个主旋律音 → 填外音。",
    ],
    crossBook: ["Levine 06：从音阶到音乐", "Sposobin 60：和声分析"],
    visualHint: "结构分层记谱 + 分析三角",
  },
  "laitz-11": {
    deepSummary:
      "第 4 版第 11 章的出发点是“四六和弦常常只是表面和声”：低音上方的四度是刺耳的，所以 64 很少独立运作，多是多声部经过/邻音运动的副产品。弱位三类——持续音式（Ped64，《平安夜》两个 IV64 是低音保持上双邻音的产物，可延长主也可延长属）、经过式（P64 连接 53 与 63，与 vii°6 等价）、琶音式（圆舞曲 64，分析时画一条横线即可不必逐个标注）。强位的终止四六被推导为延留音与强拍经过音的副产品：I–I6–V–I 逐步加 4–3 延留、再加 6–5 双延留，就得到 Cad64——这正是它“属准备”身份的来源。章末重访下属（IV 的对位扩展、变格终止）并汇总全部对位扩展范式。写作要点：弱位 64 不必标功能；终止四六在强拍、预备用 IV、后接 V 或 V7；躲开的终止（evaded cadence）可用低音经过七音制造。",
    analysis: [
      "判 64 先问：低音保持（pedal）？低音经过（P）？琶音 filler？还是强拍终止（Cad64）？",
      "Ped64 与 P64 标 Ped/P 二级标记，不占罗马数字；Arp64 画横线并入前一和弦。",
      "终止四六理解成“双重延留 6–5 + 4–3”，预备用 IV（1 作为延留的准备音）。",
      "Cad64 也可用于半终止内部或乐句中部加固属，不只出现在终止。",
    ],
    crossBook: ["Sposobin 9/13：终止与经过四六", "Levine 05：斜线和弦"],
    visualHint: "功能链 + 低音线",
  },
  "laitz-13": {
    deepSummary:
      "第 4 版第 13 章给 vi 一个双重身份的分析工具：它既像主功能的延伸（与 I 有两个共同音，源自 5–6 对位），又是“前-前属”（pre-pre-dominant，为 PD 做准备）；二级分析通常归 T 但加一个箭头标注它的桥接功能。三种根音运动对应三种用法：下行三度（I–vi–IV 的“和声琶音”，1950 年代摇滚进行；书里特意展示了原味平行五度的摇滚声部如何改写成共同实践声部）、下行五度（I–vi–ii6–V–I，Schubert《春之梦》的 1–6–4 低音琶音）、上行二度（V–vi 阻碍进行/evaded cadence——听者期待 V–I 却听到 V–vi）。章末引入低音级进下行（step descent）——被称为调性音乐里“最古老、最受推崇且至今通行的旋律模式”，分下行五度与下行八度两类。分析警告：vi 有时会盖过 V（vi 变成临时主音）或盖过 I，此时要按“表面下中音”处理。",
    analysis: [
      "vi 的功能三判：看它连接谁——I 侧（延长主）、IV/ii 侧（桥接 PD）、V 之后（阻碍）。",
      "I–vi–IV 认成“和声琶音”1–6–4，vi 是中转桥。",
      "V–vi 之后检查：音乐是否继续朝 vi 的方向走（vi 盖过 V），还是迅速回正。",
      "低音级进下行（1–7–6–5）配和声时优先转位与经过，别让低音线断掉。",
    ],
    crossBook: ["Levine 05：斜线和弦", "Sposobin 20：VI级与阻碍终止"],
    visualHint: "低音线 + 五线谱",
  },
  "laitz-14": {
    deepSummary:
      "第 4 版第 14 章的主旨：中音在大调里是“出现最少的自然音和声”，但在小调里 III 的结构地位仅次于主与属。iii 的两个语境：上行低音琶音 1–2–3–4–5（I–vii°6–I6–[iii 或 V4/3 或 ii6]–IV–V，iii 替代 I6 延长主音）与下行五度（iii 再下行到 vi，把五度链再往回多接一环）。小调特例是“VII”和弦的真实身份：它是 V/III（副属，第 18 章预告）——比“VII”的标签准确得多。回指属（BRD）一节把“第一个 V 不一定是结构属”讲透：I–V–vi–ii–V–I 里第一个 V 只是连接 T 与 vi 的声部和弦。章末综合：全部根音运动归为下行五度、上行二度、下行三度三类，并逐步示范写成完整乐段。",
    analysis: [
      "iii 出场三查：是不是在 1–3–5 上行琶音里替代 I6？是不是在五度链里接 vi？高声部是否走 1–7–6？",
      "小调 III 前常放 V/III（或 V6/III、V7/III）预备——把它当副属分析，不标 VII。",
      "BRD 判定：第一个 V 之后若接 vi/ii 等 PD 材料，它就是回指属，服务于第一个 T。",
      "写作时上方声部与低音反向接近/离开中音。",
    ],
    crossBook: ["Sposobin 20：VI级与阻碍终止", "Levine 02：声部进行"],
    visualHint: "功能链",
  },
  "laitz-15": {
    deepSummary:
      "第 4 版第 15 章把乐段定义为“两个以上乐句的组合”，核心是“不完整 → 完整”的过程设计：前句（antecedent）留下悬而未决的张力，后句（consequent）兑现。乐段的黏合剂是旋律与和声的互动，由此得出完整的分类：**平行乐段**（两句同头，aa）vs **对比乐段**（ab）；**中断式乐段**（interrupted，双斜线记号——半终止没有解决到后句开头的主，HC 是回指属）vs **连续式乐段**（continuous，一句话扫完 T–PD–D–T，包括 HC 后第二句直接进 PD、或第一句以非主和弦上的 PAC 结束两种变体）vs **分段式乐段**（sectional，IAC + PAC 两句各自闭合，靠旋律落音 1 与否分强弱）。曲式图（formal diagram）用字母加终止类型记录。分析程序：先比两句旋律（相似？）→ 对终止（HC+PAC？）→ 画二级和声（中断还是连续？）。",
    analysis: [
      "判乐段：第二句是否有更强的终止（PAC）？两句是否音乐相关？",
      "分类三问：同头吗（平行/对比）？HC 有没有解决到后句主音（中断/连续/分段）？",
      "中断式标双斜线（//），HC 是回指属；连续式画一条贯通的 T–PD–D–T。",
      "曲式图记录：字母 + 每句终止类型（HC/PAC/IAC）。",
    ],
    crossBook: ["Sposobin 8：终止、乐段、乐句", "Levine 17：曲式与作曲"],
    visualHint: "曲式地图",
  },
  "laitz-17": {
    deepSummary:
      "第 4 版第 17 章把模进定义为“两和弦模型在不同音级上的复制粘贴”，并用 M.C. Escher 的《上升与下降》点出它的悖论：和声节奏飞快、动感十足，但重复与可预测性其实拖慢了和声进程。命名系统极精确：D2(−5/+4) 表示模型整体下行二度、内部靠下五上四完成——D2 就是下行五度圈（I–IV–vii°–iii–vi–ii–V–I），D3(−4/+2) 是帕赫贝尔卡农的进行，A2(−5/+4 的上行版) 少见（V 上五度到 ii 是逆行）。三条关键规则：只有模型首尾和弦拿到罗马数字（只有它们参与和声进行）；模型第二和弦是声部和弦（helper chord），专拆下行的平行五八度；根位减三和弦（vii°、ii°）在模进内部被允许——它们是大图案的成员而非独立实体。大调 D2 的低音三全音跳进在开头、小调在结尾，为防跑出调这是必要之恶。反转常用：D2 反转外声部全成 10–6；D3 反转即“下行 5–6 模进”（一声部保持，五度变六度）。",
    analysis: [
      "命名三步：定模型 → 量根音距（负=下行）→ 写标签 D2(−5/+4) 等。",
      "罗马数字只给首尾和弦；中间标声部和弦与外音。",
      "低音跳三全音、根位减三和弦 = 模进内部合法，不要当错误改掉。",
      "写反转：第二和弦转位，外声部走平行十度/六度。",
    ],
    crossBook: ["Sposobin 26：自然模进", "Levine 02：五度圈"],
    visualHint: "五度圈 + 模进楼梯",
  },
  "laitz-22": {
    deepSummary:
      "第 4 版第 22 章给出半音转调的核心规则：**到 ♭III/♭VI 这类交替调转调时，枢轴和弦必须是原调里的交替和弦**（C 大调与 A♭ 之间没有共同三和弦，但允许 C 大/小调混合后就有四个候选）。其原理是：主和弦一旦交替就失去了锚定力，开始扮演“通往 ♭VI/♭III 的前属”。写作三条：新调加调号而非满页临时记号；枢轴必须来自交替（常用小 i 扮演新调的 vi/iii）；在新调里扩展 PD（转位或短暂临时主化）推迟终止，让耳朵适应新环境。无准备/共同音半音转调（direct modulation）不用枢轴直接并置。德国 Lied 一节把交替与诗歌意象相连；♭VI 在整体和声计划中常参与大型调性琶音（I–♭III–V7–I）。",
    analysis: [
      "找半音枢轴：先允许原调交替（C→Cm），再列两调共同三和弦。",
      "判据：主和弦交替出现常预示即将临时主化 ♭VI/♭III。",
      "写作：新调调号化 → 枢轴后扩展新调 PD 推迟终止 → PAC 坐实。",
      "无准备转调（直接并置）与共同音转调是另两条路，不需枢轴。",
    ],
    crossBook: ["Sposobin 57：等音转调", "Levine 15：Coltrane Changes"],
    visualHint: "调性距离 + 半音尺",
  },
  "laitz-28": {
    deepSummary:
      "第 4 版第 28 章的叙事线：交替深化 → 调性模糊 → 对称登场。要点：① plagal relation 与 reciprocal process——iv/iiø65 直接到主的变格收束让属功能弱化，但属反而因「指示主音位置」更重要；reciprocal process 即三个功能（T/PD/D）的归属被故意混淆（Schumann《城堡中》把 E 大调听成 a 小调的 V，还用动机暗线连向下一首）。② semitonal voice leading——两个以上声部半音移动 + 一声部共同音，连接远关系和弦；莫扎特「不协和」四重奏开头是教科书。③ off-tonic beginning（Sweet Georgia Brown 副歌从三个副属后才到主）与 double tonality（通常仍按结束调分析）。④ 对称和声：减七把八度四等分、增三四等分（只有 3/4 个移位），转位不产生新音程故等音多解——时钟模型；增三转位听觉不可辨。⑤ 变化属七（♯5/b5/b9/#9）；共同音减七与共同音增六。⑥ 全章点题悖论：「平衡的」调性体系其实建立在不对称之上——正是不对称给出引力；对称结构（全音阶等）恰好取消引力。",
    analysis: [
      "判 reciprocal：结尾和弦能否双向解释（I 还是 V/iv）？听后调还是前调？",
      "减七等音转调四步：写出原调 vii°7 → 把四个音轮流当导音 → 各指四调 → 标枢轴（注意作曲家记谱可能按旧调或新调拼）。",
      "半音声部进行：找共同音声部 + 半音移动的声部对（Mozart K.465 开头式）。",
      "对称即失重：用时钟模型检查一个和弦/音阶等分八度的方式与移位数。",
    ],
    crossBook: ["Levine 03：变化属七", "Sposobin 22/57：导七与等音"],
    visualHint: "对称轮 + 张力光谱",
  },
  "laitz-29": {
    deepSummary:
      "第 4 版第 29 章的核心区分：半音模进的主和弦（定标签的那些）落在**变化音级**上，且复制品严格保持和弦质量与音程距离（自然模进按调内调整、大小三混用）——标签里写出具体音程如 D2(−P4/+m3)。三大家族：① D2(−P4/+m3)——D3「帕赫贝尔」的半音化，纯大三和弦按全音下行，把八度六等分、跳过属音，几乎无调性（要回收调性须提前断开导向 PD）；Liszt 在小调里保持全音路径的写法是名例。② D2(−P5/+P4)——纯五度圈版，12 步才回原点（解法：只作部分陈述、或用三和弦模型减少复制次数）；其下行小二度版 D2(−P5/+A4) 用三全音上行压缩回路（Chopin 玛祖卡）。③ A2(−M3/+P4)——5–6 对位的半音化上行（「棒球场上也听得到」的原位副属版）。单和弦半音下行流：六三和弦（配 7–6 延留，不协和配半音、协和配自然音的对位排列）、减七流（转位听觉不可辨）、增六流（Ger 与 V7 的歧义彼此转换）。反向半音运动把 V7 扩展成 **omnibus**（1800 年维也纳理论家命名，低音小三度爬升整八度、每个大三度点上换声部重新开始）；最后总表把八度等分归纳为 1/2/3/4/6 个半音与大小三度，并引向 intervallic cell。",
    analysis: [
      "判半音模进：主和弦含变化音级？复制严格保持质量与距离？→ 标签写具体音程。",
      "全音版 D2(−P4/+m3) 记得提前断开导向 PD，否则无家可归；纯五版用三和弦模型省次数。",
      "增六流/减七流先认歧义（Ger↔V7、转位不可辨），再看真实的深层进行（往往只是 T→D）。",
      "omnibus 练习：低音小三度上行，每个属七点上换一对声部做反向十度。",
    ],
    crossBook: ["Levine 15：Coltrane Changes", "Sposobin 55：转调模进"],
    visualHint: "五度圈/对称轮",
  },
};

const ALL_NOTES = Object.fromEntries(
  Object.entries(NOTES).map(([id, note]) => [id, { ...note, ...(DEEPEN[id] ?? {}) }]),
) as Record<string, NoteSeed>;

export const LAITZ_OUTLINE = buildOutline("laitz", CHAPTERS, {
  ...ALL_NOTES,
  ...EXTRA_NOTES,
}, {
  file: "complete-musician-4e.pdf",
  kind: "pdf",
  label: "The Complete Musician, 4th ed.（英文原版 PDF，957 页，内嵌于 /books/）",
});
