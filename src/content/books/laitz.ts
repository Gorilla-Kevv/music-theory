import { buildOutline, type ChapterSeed, type NoteSeed } from "./types";

const CHAPTERS: ChapterSeed[] = [
  { number: "1A", title: "Musical Space: Pitches, Scales, and Keys", titleZh: "音乐空间：音高、音阶与调", part: "Part 1 · Foundations" },
  { number: "1B", title: "Musical Time: Meter and Rhythm", titleZh: "音乐时间：拍号与节奏", part: "Part 1 · Foundations" },
  { number: "1C", title: "Musical Distance: Intervals", titleZh: "音乐距离：音程", part: "Part 1 · Foundations" },
  { number: "02", title: "Pitch and Meter Combine: Melody and Counterpoint", titleZh: "音高与节拍：旋律与对位", part: "Part 1 · Foundations" },
  { number: "03", title: "Triads, Seventh Chords, and Texture", titleZh: "三和弦、七和弦与织体", part: "Part 1 · Foundations" },
  { number: "04", title: "The Role of Context: Embellishing Tones and Melodic Shape", titleZh: "语境中的和弦外音与旋律轮廓", part: "Part 2 · Fusing Melody, Harmony, and Counterpoint" },
  { number: "05", title: "Tonic, Dominant, and Voice Leading", titleZh: "主音、属音与声部进行", part: "Part 2 · Fusing Melody, Harmony, and Counterpoint" },
  { number: "06", title: "V7 and Two-Level Analysis", titleZh: "属七与两层分析", part: "Part 2 · Fusing Melody, Harmony, and Counterpoint" },
  { number: "07", title: "Expanding Tonic and Dominant with First-Inversion Triads", titleZh: "用第一转位扩展主与属", part: "Part 2 · Fusing Melody, Harmony, and Counterpoint" },
  { number: "08", title: "Inversions of V7 and Leading-Tone Sevenths", titleZh: "属七转位与导七和弦", part: "Part 2 · Fusing Melody, Harmony, and Counterpoint" },
  { number: "09", title: "The Pre-Dominant Function and the Phrase Model", titleZh: "下属功能与乐句模型", part: "Part 3 · Establishing, Expanding, and Embellishing the Phrase Model" },
  { number: "10", title: "Accented and Chromatic Embellishing Tones", titleZh: "强拍与半音和弦外音", part: "Part 3 · Establishing, Expanding, and Embellishing the Phrase Model" },
  { number: "11", title: "Six-Four Chords and Plagal Motions", titleZh: "四六和弦与变格进行", part: "Part 3 · Establishing, Expanding, and Embellishing the Phrase Model" },
  { number: "12", title: "Pre-Dominant Seventh Chords and Embedded Phrase Models", titleZh: "下属七和弦与内嵌乐句模型", part: "Part 3 · Establishing, Expanding, and Embellishing the Phrase Model" },
  { number: "13", title: "The Submediant and the Step-Descent Bass", titleZh: "下中音与级进下行低音", part: "Part 3 · Establishing, Expanding, and Embellishing the Phrase Model" },
  { number: "14", title: "The Mediant and the Back-Relating Dominant", titleZh: "中音与回指属和弦", part: "Part 3 · Establishing, Expanding, and Embellishing the Phrase Model" },
  { number: "15", title: "Periods", titleZh: "乐段", part: "Part 4 · Small Forms" },
  { number: "16", title: "Sentences, Double Periods, and Asymmetric Periods", titleZh: "乐句、双乐段与非对称乐段", part: "Part 4 · Small Forms" },
  { number: "17", title: "Applied Chords", titleZh: "副属和弦", part: "Part 5 · Expressive Color through Chromaticism" },
  { number: "18", title: "Modulation", titleZh: "转调", part: "Part 5 · Expressive Color through Chromaticism" },
  { number: "19", title: "Harmonic Sequences", titleZh: "和声模进", part: "Part 5 · Expressive Color through Chromaticism" },
  { number: "20", title: "Binary Form and Variations", titleZh: "二部曲式与变奏", part: "Part 5 · Expressive Color through Chromaticism" },
  { number: "21", title: "Modal Mixture", titleZh: "调式交替", part: "Part 5 · Expressive Color through Chromaticism" },
  { number: "22", title: "Chromatic Modulation and Text-Music Relations", titleZh: "半音转调与音乐—文本关系", part: "Part 5 · Expressive Color through Chromaticism" },
  { number: "23", title: "Neapolitan Chords", titleZh: "那不勒斯和弦", part: "Part 5 · Expressive Color through Chromaticism" },
  { number: "24", title: "Augmented-Sixth Chords", titleZh: "增六和弦", part: "Part 5 · Expressive Color through Chromaticism" },
  { number: "25", title: "Ternary Form", titleZh: "三部曲式", part: "Part 6 · Large Forms" },
  { number: "26", title: "Rondo Form", titleZh: "回旋曲式", part: "Part 6 · Large Forms" },
  { number: "27", title: "Sonata Form", titleZh: "奏鸣曲式", part: "Part 6 · Large Forms" },
  { number: "28", title: "Tonal Ambiguity and Symmetrically Constructed Harmonies", titleZh: "调性模糊与对称和声", part: "Part 7 · Near, At, and Past the Edges of Tonality" },
  { number: "29", title: "Symmetry Stretches Tonality: Chromatic Sequences and Equal Divisions of the Octave", titleZh: "对称拉伸调性：半音模进与八等分", part: "Part 7 · Near, At, and Past the Edges of Tonality" },
  { number: "30", title: "Centricity, Extended and Non-Tertian Sonorities, and Collections", titleZh: "中心性、非三度叠置与音高集合", part: "Part 7 · Near, At, and Past the Edges of Tonality" },
  { number: "31", title: "Analysis with Sets", titleZh: "集合分析", part: "Part 7 · Near, At, and Past the Edges of Tonality" },
  { number: "32", title: "Metrical and Serial Techniques", titleZh: "节拍与序列技术", part: "Part 7 · Near, At, and Past the Edges of Tonality" },
];

const NOTES: Record<string, NoteSeed> = {
  "laitz-1a": {
    summary:
      "调性空间由音高、音阶与调号共同定义；大调、小调与关系调不是三套孤立音阶，而是同一调号下的功能与主音选择。",
    keyPoints: [
      "音阶结构决定半音位置，调号把结构固定到十二个调。",
      "关系大小调共享调号，但主音、导音与功能和弦不同。",
    ],
    concepts: ["major-scale", "minor-scales", "circle-of-fifths"],
    dimensions: ["brightness", "relationship"],
  },
  "laitz-1c": {
    summary:
      "音程是调性距离的度量：度数与半音数共同决定性质，转位与协和/不协和判断依赖语境和解决方向。",
    keyPoints: [
      "转位后度数相加为九，大小与增减互换。",
      "协和不是固定标签，三全音在不同语境可紧张也可作为色彩。",
    ],
    concepts: ["intervals", "harmonic-color"],
    dimensions: ["color", "relationship"],
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
      "和弦外音不是“错音”，而是旋律与和声之间的张力层；经过音、辅助音、倚音与延留音按节拍位置和解决方向分类。",
    keyPoints: [
      "强拍外音比弱拍外音更需要解决。",
      "外音的形状决定旋律轮廓，也影响和声节奏。",
    ],
    concepts: ["harmonic-rhythm"],
    dimensions: ["color", "rhythm"],
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
  "laitz-17": {
    summary:
      "副属和弦（applied chords）把目标和弦临时变成主音；V/x 与 V7/x 制造局部离调，但不一定构成转调。",
    keyPoints: [
      "副属和弦的临时升降号属于目标调的属功能。",
      "解决后若原调继续，仍是离调；新调建立终止才是转调。",
    ],
    concepts: ["secondary-dominants", "tonal-distance", "modulation"],
    dimensions: ["relationship", "direction", "function"],
  },
  "laitz-18": {
    summary:
      "转调通过共同和弦、半音中介或直接并置建立新调；新调必须获得自己的属—主与终止，才算真正转调。",
    keyPoints: [
      "枢轴和弦在两调中有不同功能解释。",
      "转调分析要指出新调的属、主与终止，而不只是变化音。",
    ],
    concepts: ["modulation", "tonal-distance", "circle-of-fifths"],
    dimensions: ["relationship", "direction"],
  },
  "laitz-19": {
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
    concepts: ["modulation", "tonal-distance"],
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

export const LAITZ_OUTLINE = buildOutline("laitz", CHAPTERS, NOTES);
