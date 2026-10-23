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
      "第一转位不是“弱化和弦”，而是声部连接的工具。I6 与 V6 可以让低音级进、避免根音跳进，并让外声部更独立；分析时仍按原功能标记。",
    analysis: [
      "比较 I–V 与 I–V6 的低音线。",
      "观察六和弦如何减少平行五八度与声部跳进。",
      "检查转位后最高声部是否仍支持旋律。",
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
      "属七的转位不只是低音变化：它改变七音与三音在哪个声部、如何解决，也会影响终止的强度。导七把属功能压缩成减七/半减七，张力更集中。",
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
      "强拍与半音和弦外音把张力放在句法关键位置；倚音、延留音与半音经过音需要更明确的准备与解决。",
    keyPoints: [
      "强拍外音比弱拍外音更需要解决。",
      "半音外音常制造色彩转折或导向副属和弦。",
    ],
    concepts: ["harmonic-color", "harmonic-rhythm"],
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
      "下属七和弦让下属功能拥有自己的七音张力，而不只是三和弦色彩。它把 T–PD–D–T 的中间阶段加厚，并让 ii–V 的声部连接更自然。",
    analysis: [
      "比较 IV 与 ii7 接到 V7 时的声部。",
      "标出下属七音的解决方向。",
      "检查 ii7–V7–I 是否形成完整 T–PD–D–T。",
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
      "Laitz 区分 period 与 sentence：period 是前句/后句的呼应，sentence 是基本乐思的重复与延续。两者都靠终止与比例建立“完整感”，但句法路径不同。",
    analysis: [
      "标出基本乐思、重复与延续段。",
      "找终止位置，判断前后句比例。",
      "比较 period 与 sentence 的终止安排。",
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
      "二部曲式把两个段落组织成“出发—回归”的宏观句法；变奏则在同一和声/旋律骨架上改变表面。分析时要区分“结构音”和“装饰层”。",
    analysis: [
      "标出二部曲式的段落与调性关系。",
      "在变奏中找出保持不变的结构音。",
      "比较每段变奏改变了旋律、和声还是织体。",
    ],
    crossBook: ["Levine 17：曲式", "Levine 21：曲目库"],
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
      "三部曲式的核心不是“三个段落”，而是“离开—对比—回归”的心理过程。B 段可以转调、改调式或改织体；A 回归时常用变奏而非原样重复。",
    analysis: [
      "标出 A/B/A 边界与调性。",
      "找出 B 段的对比维度（调性、主题、织体）。",
      "观察 A 回归是否原样、变奏或缩短。",
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
      "回旋曲式把“回归”变成结构原则：听众每次听到 A，都在确认主调与主题；插部则提供偏离。分析重点是 A 的回归方式与插部的调性对比。",
    analysis: [
      "标出 A 的每次回归与插部。",
      "比较插部的调性距离与材料。",
      "观察 A 回归是否变奏/缩短。",
    ],
    crossBook: ["Levine 17：曲式", "Laitz 18：转调"],
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
      "奏鸣曲式是调性距离的宏观戏剧：呈示部确立主调与副调，展开部把距离拉远，再现部把副调收回主调。分析和声时要把局部和弦放进这个调性叙事。",
    analysis: [
      "标出主部/副部主题与调性。",
      "追踪展开部的调性路径与不稳定和弦。",
      "观察再现部如何解决呈示部的调性冲突。",
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
      "当和弦不再按三度叠置，传统功能标签会失效；但音乐仍可以通过持续音、动机回归或音高中心建立“家”。分析要从“中心如何被建立”而不是“这是几级和弦”出发。",
    analysis: [
      "找出持续音、重复音型或音高中心。",
      "标出非三度叠置的和弦结构。",
      "判断功能是来自传统和声还是细胞/集合关系。",
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
      "集合分析不是替代功能和声，而是处理功能失效后的结构。它把音高组织成集合，比较移位/倒影关系，并用音程向量描述色彩；对爵士的对称音阶/和弦也有解释力。",
    analysis: [
      "把音高转成整数音级，找标准型。",
      "比较集合之间的移位/倒影关系。",
      "用音程向量解释张力与对称性。",
    ],
    crossBook: ["Levine 15：Coltrane 对称", "Laitz 28：对称和声"],
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
      "当和声不再承担主要结构功能，节拍与序列成为组织手段。分析要追踪材料如何移位、倒影、逆行与节奏变形，以及这些过程如何替代传统终止。",
    analysis: [
      "标出序列原型与变形（移位/倒影/逆行）。",
      "观察节拍重音与分组如何组织段落。",
      "判断结构边界由什么替代传统终止。",
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
      "主—属关系是调性的第一根轴，但真正让它有方向的是声部：导音上行、七音下行、外声部反向。功能和声的“力量”来自倾向音的解决，而不是和弦名字。",
    analysis: [
      "先听低音与最高声部，再填内声部。",
      "标出导音、七音与共同音。",
      "检查平行五八度与声部超越。",
    ],
    crossBook: ["Levine 02：声部进行"],
    visualHint: "声部线/五线谱",
  },
  "laitz-09": {
    deepSummary:
      "乐句模型 T–PD–D–T 不是四个和弦的公式，而是“离开主音—制造压力—回归”的句法。下属可以扩展、属可以延迟，终止决定句法是否完成。",
    analysis: [
      "标出 T/PD/D/T 的功能层，而不是逐和弦贴标签。",
      "找终止，判断乐句是否完整。",
      "比较 ii 与 IV 的声部与色彩差异。",
    ],
    crossBook: ["Levine 02：ii–V–I", "Sposobin 2：功能体系"],
    visualHint: "功能链/体系图",
  },
  "laitz-17": {
    deepSummary:
      "副属和弦把目标和弦临时变成主音，制造局部离调。判断它是离调还是转调，要看解决后原调是否继续、新调是否建立终止。",
    analysis: [
      "标出 V/x 的目标和弦与临时主音。",
      "检查变化音的解决方向。",
      "看后续是否有新调终止。",
    ],
    crossBook: ["Levine 13：重配和声", "Sposobin 28/29/32"],
    visualHint: "调性距离网络",
  },
  "laitz-18": {
    deepSummary:
      "转调是调性中心的迁移，不只是出现变化音。枢轴和弦、半音中介与终止确认共同决定新调是否成立；距离越远，确认所需时间越长。",
    analysis: [
      "找枢轴和弦及其两调功能解释。",
      "标出新调属—主与终止。",
      "判断旧调是否还能解释后续和弦。",
    ],
    crossBook: ["Levine 15：Coltrane Changes", "Sposobin 34/35"],
    visualHint: "五度圈/调性距离",
  },
  "laitz-21": {
    deepSummary:
      "调式交替是调性内部的明暗轴：主音不变，借用平行小调的 iv、bVI、bIII、bVII，改变色彩与功能细节。它常被误当成转调，关键在终止是否建立新主音。",
    analysis: [
      "标出借用来源（parallel minor）。",
      "检查变音如何解决、是否回到原主音。",
      "比较借用前后的功能与明暗。",
    ],
    crossBook: ["Levine 14：高级重配", "Sposobin 49/50"],
    visualHint: "明暗轴/张力光谱",
  },
  "laitz-23": {
    deepSummary:
      "那不勒斯六和弦是降 II 级大三和弦的第一转位，功能是下属而非属。它的 b2 下行到导音、低音级进到属音，形成强烈的半音方向。",
    analysis: [
      "标出 N6 的低音与 bII 根音。",
      "追踪 b2 与外声部的半音解决。",
      "确认它接 V 而不是 I。",
    ],
    crossBook: ["Levine 13：重配和声", "Sposobin 47/53"],
    visualHint: "半音尺/调性距离",
  },
  "laitz-24": {
    deepSummary:
      "增六和弦用 b6 与 #4 的外向扩张强化属；意/法/德三种形态共享增六度，但内部音与解决不同。德国增六与属七等音，却不是属功能。",
    analysis: [
      "标出 b6–#4 的增六度。",
      "检查外向扩张到属音八度。",
      "区分意/法/德三式的内部音。",
    ],
    crossBook: ["Levine 13：重配和声", "Sposobin 47"],
    visualHint: "半音扩张/张力光谱",
  },
  "laitz-1a": {
    deepSummary:
      "调性空间不是十二个孤立音阶，而是由音高、音阶结构与调号共同定义的坐标。大调与小调是同一坐标上的不同主音与功能选择；关系调共享调号，但导音、属和弦与主音位置不同。",
    analysis: [
      "写出音阶的七个音级，标出半音位置与导音。",
      "比较关系大小调：哪些和弦共享，哪些因导音改变而不同。",
      "把调号、主音与功能三件事分开记，避免只背调号。",
    ],
    crossBook: ["Levine 02：大调音阶与进行", "Levine 01：基本理论"],
    visualHint: "五度圈 + 调式轮",
  },
  "laitz-1c": {
    deepSummary:
      "音程是“度数 + 半音数 + 语境”的三重判断：度数给名称，半音数给性质，语境决定协和/不协和与解决方向。转位不是换名字，而是改变低音与张力位置。",
    analysis: [
      "先数度数，再数半音，最后判断性质。",
      "转位后检查度数相加为九、大小增减互换。",
      "把同一个音程放进不同和弦，比较协和感是否改变。",
    ],
    crossBook: ["Levine 01：基本理论", "Sposobin 01：四部和声"],
    visualHint: "半音尺 + 钢琴键盘",
  },
  "laitz-04": {
    deepSummary:
      "和弦外音是旋律与和声之间的张力层，不是“错音”。分类取决于它出现在强拍还是弱拍、是否被准备、如何解决；外音的形状同时塑造旋律轮廓与和声节奏。",
    analysis: [
      "标出外音的类型、节拍位置与解决方向。",
      "强拍外音需要更明确的准备与解决。",
      "把外音删掉，比较旋律是否失去轮廓。",
    ],
    crossBook: ["Levine 06：从音阶到音乐", "Sposobin 38–44：和弦外音"],
    visualHint: "旋律轮廓 + 节奏格",
  },
  "laitz-06": {
    deepSummary:
      "属七把属功能压缩成一个不协和单位：三全音提供张力，导音与七音提供解决方向。两层分析让我们把表面的经过和弦、转位与装饰，归入更长的功能和声层。",
    analysis: [
      "标出 V7 的三音、七音与三全音。",
      "把表面和弦还原到深层功能，再解释装饰。",
      "检查解决：导音上行、七音下行是否被保留或延迟。",
    ],
    crossBook: ["Levine 03：和弦—音阶", "Sposobin 14：原位属七"],
    visualHint: "张力光谱 + 功能链",
  },
  "laitz-11": {
    deepSummary:
      "四六和弦的功能由节拍位置与前后和弦决定：经过四六夹在两个和弦之间，辅助四六围绕一个持续和弦，终止四六则在强拍上充当属准备。把终止四六当成普通主和弦转位，会误读它的句法角色。",
    analysis: [
      "先看低音是不是属音，再看是否在强拍。",
      "区分经过、辅助与终止三类，不按和弦符号硬判。",
      "追踪六音与四音的下行解决。",
    ],
    crossBook: ["Sposobin 9/13：终止与经过四六", "Levine 05：斜线和弦"],
    visualHint: "功能链 + 低音线",
  },
  "laitz-13": {
    deepSummary:
      "下中音 vi 与级进下行低音是扩展主音的常用方式：低音从主音逐级下行，和弦选择随之改变，转位与声部连接变得自然。vi 既像主功能延伸，也能承担下属替代，取决于低音与后续走向。",
    analysis: [
      "先写低音线（如 1–7–6–5），再为每个低音选和弦。",
      "判断 vi 是主功能延伸还是下属替代：看它往哪里走。",
      "检查转位后外声部是否仍然平滑。",
    ],
    crossBook: ["Levine 05：斜线和弦", "Sposobin 20：VI级与阻碍终止"],
    visualHint: "低音线 + 五线谱",
  },
  "laitz-14": {
    deepSummary:
      "中音 iii 与回指属和弦处理调性中心的边缘：iii 的功能介于主与属之间，既可延长主音，也可作为弱的属准备；回指属和弦则制造“已经到达又退回”的句法效果。它们的意义来自上下文，而不是固定标签。",
    analysis: [
      "先判断 iii 前后是否围绕主音，还是已经走向属。",
      "回指属和弦后面通常需要再次解决，检查它是否延长了句法。",
      "不要把 iii 一律当作主功能或属功能，先看低音与终止。",
    ],
    crossBook: ["Sposobin 20：VI级与阻碍终止", "Levine 02：声部进行"],
    visualHint: "功能链",
  },
  "laitz-15": {
    deepSummary:
      "乐段是曲式的最小完整单位：前句提出、后句回应，终止式决定两句的关系。最常见的是前句半终止、后句完全终止；但平行乐段、对比乐段与非对称乐段会在动机与长度上变化。",
    analysis: [
      "先找两个终止，再判断前后句关系。",
      "比较前后句的动机：重复、变化还是对比。",
      "不要用固定小节数切分乐段，终止才是标点。",
    ],
    crossBook: ["Sposobin 8：终止、乐段、乐句", "Levine 17：曲式与作曲"],
    visualHint: "曲式地图",
  },
  "laitz-19": {
    deepSummary:
      "和声模进把同一模型移到新音级：自然模进留在调内，音程结构会随音阶调整；真实模进保持原结构，可能离开原调。模进的方向由低音线与目标终止决定，不是无限循环。",
    analysis: [
      "标出模型与每一次复制，比较音程结构是否改变。",
      "先听低音方向，再判断模进要走向哪个终止。",
      "检查模进结束后是否回到原调或进入新调。",
    ],
    crossBook: ["Sposobin 26：自然模进", "Levine 02：五度圈"],
    visualHint: "五度圈 + 模进楼梯",
  },
  "laitz-22": {
    deepSummary:
      "半音转调靠半音化声部、等音重解释或突然并置进入远关系调；它强调色彩突变，而不是平滑枢轴。判断是否真正转调，仍要看新调是否建立属—主与终止。",
    analysis: [
      "标出半音移动的声部与它要解决的目标音。",
      "检查等音重解释：同一音响在另一个调里叫什么。",
      "确认新调的属、主与终止是否出现。",
    ],
    crossBook: ["Sposobin 57：等音转调", "Levine 15：Coltrane Changes"],
    visualHint: "调性距离 + 半音尺",
  },
  "laitz-28": {
    deepSummary:
      "对称和声（减七、增三、全音阶）削弱传统调性中心，因为同一个音响可以被多种方式解释。减七的等音多解、增三的对称循环与全音阶的均匀间距，让“家”被延迟或多重化。",
    analysis: [
      "把减七写成四种等音拼法，分别指向四个调。",
      "检查增三循环如何把八度分成三等分。",
      "区分“调性模糊”与“无调性”：中心是否仍被暗示。",
    ],
    crossBook: ["Levine 03：变化属七", "Sposobin 22/57：导七与等音"],
    visualHint: "对称轮 + 张力光谱",
  },
  "laitz-29": {
    deepSummary:
      "对称拉伸调性把八度等分：大三级循环、半音模进与增三循环让和声在多个调性中心之间快速移动。Coltrane Changes 是典型例子；分析时先标目标调，再看属和弦如何指向它们。",
    analysis: [
      "先标出三个大三级目标调，再填每组的 ii–V。",
      "检查半音模进是把调性拉远，还是仍围绕原中心。",
      "用 guide tones 追踪每个目标调，而不是只背和弦。",
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
});
