import { buildOutline, type ChapterSeed, type NoteSeed } from "./types";

const CHAPTERS: ChapterSeed[] = [
  { number: "01", title: "大三和弦与小三和弦、四部和声", part: "上册" },
  { number: "02", title: "正三和弦的功能体系", part: "上册" },
  { number: "03", title: "原位三和弦的连接", part: "上册" },
  { number: "04", title: "用正三和弦为旋律配和声", part: "上册" },
  { number: "05", title: "和弦的转换", part: "上册" },
  { number: "06", title: "为低音配和声", part: "上册" },
  { number: "07", title: "三音跳进", part: "上册" },
  { number: "08", title: "终止、乐段、乐句", part: "上册" },
  { number: "09", title: "终止四六和弦", part: "上册" },
  { number: "10", title: "正三和弦的六和弦", part: "上册" },
  { number: "11", title: "三和弦与六和弦连接时的跳进", part: "上册" },
  { number: "12", title: "两个六和弦的连接", part: "上册" },
  { number: "13", title: "经过的与辅助的四六和弦", part: "上册" },
  { number: "14", title: "原位属七和弦（D7）", part: "上册" },
  { number: "15", title: "属七和弦的转位", part: "上册" },
  { number: "16", title: "属七和弦解决到主和弦时的跳进", part: "上册" },
  { number: "17", title: "大调与和声小调的完全功能体系、自然音体系", part: "上册" },
  { number: "18", title: "Ⅱ级六和弦与三和弦（SⅡ6与SⅡ）", part: "上册" },
  { number: "19", title: "和声大调", part: "上册" },
  { number: "20", title: "Ⅵ级三和弦（TsⅥ）、阻碍终止、扩展乐段的方法", part: "上册" },
  { number: "21", title: "下属七和弦（SⅡ7）", part: "上册" },
  { number: "22", title: "导七和弦（DⅦ7）", part: "上册" },
  { number: "23", title: "属九和弦（D9）", part: "上册" },
  { number: "24", title: "属功能组中较少使用的和弦", part: "上册" },
  { number: "25", title: "弗里吉亚进行中的自然小调", part: "上册" },
  { number: "26", title: "自然（调内）模进和副七和弦（模进和弦）", part: "上册" },
  { number: "27", title: "俄罗斯音乐中的自然调式", part: "上册" },
  { number: "28", title: "终止中的重属和弦", part: "下册" },
  { number: "29", title: "结构内的重属和弦", part: "下册" },
  { number: "30", title: "重属和弦中的变音", part: "下册" },
  { number: "31", title: "调性关系的类型", part: "下册" },
  { number: "32", title: "离调、半音体系", part: "下册" },
  { number: "33", title: "半音模进、离调", part: "下册" },
  { number: "34", title: "转调", part: "下册" },
  { number: "35", title: "到一级关系调的转调", part: "下册" },
  { number: "36", title: "在一个声部中的有准备的延留音", part: "下册" },
  { number: "37", title: "两个和三个声部中有准备的延留音", part: "下册" },
  { number: "38", title: "一个声部中的自然经过音", part: "下册" },
  { number: "39", title: "在所有声部中的自然经过音", part: "下册" },
  { number: "40", title: "自然的与半音的辅助音", part: "下册" },
  { number: "41", title: "半音经过音", part: "下册" },
  { number: "42", title: "先现音", part: "下册" },
  { number: "43", title: "跳进的辅助音（没有准备的和没有解决的）", part: "下册" },
  { number: "44", title: "延留音的各种形式", part: "下册" },
  { number: "45", title: "和弦外音的延迟解决", part: "下册" },
  { number: "46", title: "属和声组的变和弦", part: "下册" },
  { number: "47", title: "下属和声组的变和弦", part: "下册" },
  { number: "48", title: "持续音", part: "下册" },
  { number: "49", title: "交替大小调体系", part: "下册" },
  { number: "50", title: "交替大小调的降Ⅵ级三和弦（tsⅥ）", part: "下册" },
  { number: "51", title: "调性关系的等级、相差两个调号的转调", part: "下册" },
  { number: "52", title: "相差三至六个调号的转调", part: "下册" },
  { number: "53", title: "经过交替大小调的降Ⅵ级三和弦（tsⅥ）以及经过那不勒斯和弦的转调", part: "下册" },
  { number: "54", title: "经过同主音主和弦转调", part: "下册" },
  { number: "55", title: "转调模进", part: "下册" },
  { number: "56", title: "意外进行", part: "下册" },
  { number: "57", title: "等音转调、经过减七和弦的转调", part: "下册" },
  { number: "58", title: "经过属七和弦的等音转调", part: "下册" },
  { number: "59", title: "作品调性布局的基本原则", part: "下册" },
  { number: "60", title: "和声分析的某些问题", part: "下册" },
];

const NOTES: Record<string, NoteSeed> = {
  "sposobin-01": {
    summary:
      "四部和声以三和弦的四类质量与声部距离为起点；重复音、密集/开放排列与声部独立决定和弦的稳定度与色彩。",
    keyPoints: [
      "三和弦质量是后续所有功能与变和弦的构件。",
      "四声部写作先保证外声部与低音，再填内声部。",
    ],
    concepts: ["triads", "voice-leading"],
    dimensions: ["function", "color"],
  },
  "sposobin-02": {
    summary:
      "正三和弦构成 T–S–D 的功能轴：主和弦确立调性，下属把音乐推离主音，属和弦制造回归压力。",
    keyPoints: [
      "功能不是和弦标签，而是它在进行中承担的方向。",
      "T–S–D–T 是俄罗斯功能和声最基础的句法。",
    ],
    concepts: ["roman-numerals", "predominant", "cadences"],
    dimensions: ["function", "direction"],
  },
  "sposobin-03": {
    summary:
      "原位三和弦的连接依赖共同音、级进与跳进的合理分配；平行五八度、声部超越与隐伏五八度是主要禁则。",
    keyPoints: [
      "能保持的共同音尽量保持，倾向音按方向解决。",
      "反向进行比同类进行更能保持声部独立。",
    ],
    concepts: ["voice-leading", "triads"],
    dimensions: ["direction", "function"],
  },
  "sposobin-08": {
    summary:
      "终止式是乐句的句法标点：完全终止、不完全终止、半终止与阻碍终止共同决定乐段的收束强度。",
    keyPoints: [
      "完全终止要求 V–I 原位且最高声部落在主音。",
      "半终止停在 V，阻碍终止用 vi 替换预期的 I。",
    ],
    concepts: ["cadences", "phrase-structure"],
    dimensions: ["function", "direction", "rhythm"],
  },
  "sposobin-09": {
    summary:
      "终止四六和弦在强拍上以属音为低音，作为属功能的双倚音准备；它不是普通的主和弦第二转位。",
    keyPoints: [
      "六音与四音下行解决到属和弦的五音与三音。",
      "节拍位置决定它是终止四六还是经过/辅助四六。",
    ],
    concepts: ["cadential-six-four", "voice-leading", "cadences"],
    dimensions: ["function", "direction"],
  },
  "sposobin-14": {
    summary:
      "原位属七把属功能压缩为不协和单位；三音与七音构成三全音，七音下行解决是功能和声的核心倾向。",
    keyPoints: [
      "D7 的三全音决定属功能的张力。",
      "七音下行、三音上行是解决的基本方向。",
    ],
    concepts: ["seventh-chords", "voice-leading", "guide-tones"],
    dimensions: ["function", "color"],
  },
  "sposobin-17": {
    summary:
      "大调与和声小调的完全功能体系把自然音和弦纳入 T/S/D 三组；副三和弦可以替代正三和弦，但功能方向不变。",
    keyPoints: [
      "vi 可作主功能延伸或下属替代。",
      "和声小调的升七级让属功能获得导音。",
    ],
    concepts: ["roman-numerals", "minor-scales", "predominant"],
    dimensions: ["function", "brightness"],
  },
  "sposobin-18": {
    summary:
      "II 级六和弦与三和弦是下属功能的核心替代；它们比 IV 更柔和，常用于 ii–V–I 的前半。",
    keyPoints: [
      "SII6 的低音是三音，声部连接更平滑。",
      "ii–V–I 是 T–S–D–T 的爵士压缩形态。",
    ],
    concepts: ["predominant", "ii-v-i", "voice-leading"],
    dimensions: ["function", "direction"],
  },
  "sposobin-19": {
    summary:
      "和声大调降低第六级，产生 bVI、iv 与 bII 等色彩；它把同主音小调的暗色带入大调。",
    keyPoints: [
      "b6 是和声大调最醒目的色彩音。",
      "借用和弦不改变主音，却改变调式明暗。",
    ],
    concepts: ["borrowed-chords", "modal-mixture-color", "minor-scales"],
    dimensions: ["brightness", "color"],
  },
  "sposobin-20": {
    summary:
      "VI 级三和弦与阻碍终止把预期的 I 替换为 vi，延长乐段；它是 deceptive motion 的古典核心。",
    keyPoints: [
      "V–vi 的阻碍终止保留属功能张力，却延迟主音。",
      "vi 也可作主功能延伸，功能取决于上下文。",
    ],
    concepts: ["cadences", "roman-numerals", "phrase-structure"],
    dimensions: ["function", "brightness", "direction"],
  },
  "sposobin-21": {
    summary:
      "下属七和弦（SII7）把下属功能扩展为四音和弦；三音与七音的解决让 ii–V 的连接更平滑，也更有色彩。",
    keyPoints: [
      "SII7 常接 D7 或 D9，形成 ii–V 的古典形态。",
      "七音下行解决是下属七和弦的关键声部。",
    ],
    concepts: ["predominant", "seventh-chords", "ii-v-i"],
    dimensions: ["function", "color", "direction"],
  },
  "sposobin-22": {
    summary:
      "导七和弦（DVII7）以导音为根音，是属功能组的减和弦；减七的对称结构使它可作等音转调枢纽。",
    keyPoints: [
      "DVII7 解决到主和弦，声部倾向强烈。",
      "减七的四个等音拼写指向不同调性。",
    ],
    concepts: ["diminished-seventh", "seventh-chords", "tonal-distance"],
    dimensions: ["function", "color", "relationship"],
  },
  "sposobin-26": {
    summary:
      "自然模进在调内移动同一和弦模型，副七和弦模进则保持七和弦结构；模进制造方向、延长与段落推力。",
    keyPoints: [
      "模进是“有目标的重复”，需要终止或转调收束。",
      "低音线的五度/级进运动决定模进的方向感。",
    ],
    concepts: ["harmonic-sequence", "bass-line"],
    dimensions: ["direction", "relationship"],
  },
  "sposobin-28": {
    summary:
      "终止中的重属和弦（V/V）把属和弦临时变成主音，强化终止前的张力；它是最常见的副属和弦。",
    keyPoints: [
      "D7 在 C 大调是 V/V，解决到 G。",
      "临时升降号属于目标调的属功能，不是新调号。",
    ],
    concepts: ["secondary-dominants", "cadences", "tonal-distance"],
    dimensions: ["function", "relationship", "direction"],
  },
  "sposobin-31": {
    summary:
      "调性关系按调号差距、共同和弦数量与主音距离分级；一级关系调最容易通过枢轴和弦转调。",
    keyPoints: [
      "相差一个调号的调共享更多自然音和弦。",
      "远关系调需要半音中介、等音或模进。",
    ],
    concepts: ["tonal-distance", "modulation", "circle-of-fifths"],
    dimensions: ["relationship", "direction"],
  },
  "sposobin-32": {
    summary:
      "离调是局部的副属解决，半音体系则扩大变化音的范围；离调不建立新调中心，转调才建立新调终止。",
    keyPoints: [
      "副属和弦解决后回到原调，是离调。",
      "新调拥有自己的属—主与终止，才是转调。",
    ],
    concepts: ["secondary-dominants", "modulation", "tonal-distance"],
    dimensions: ["relationship", "function"],
  },
  "sposobin-34": {
    summary:
      "转调通过共同和弦、半音声部或直接并置进入新调；新调的属—主与终止是确认调性中心的最终证据。",
    keyPoints: [
      "枢轴和弦在两调中有不同功能解释。",
      "转调分析要指出新调的属、主与终止。",
    ],
    concepts: ["modulation", "tonal-distance", "voice-leading"],
    dimensions: ["relationship", "direction"],
  },
  "sposobin-35": {
    summary:
      "到一级关系调的转调最常用共同和弦与属准备；相差一个调号的调既保留熟悉感，又提供足够的色彩变化。",
    keyPoints: [
      "一级关系调的共同和弦数量最多。",
      "新调属和弦的出现是转调的关键信号。",
    ],
    concepts: ["modulation", "tonal-distance", "circle-of-fifths"],
    dimensions: ["relationship", "direction", "color"],
  },
  "sposobin-46": {
    summary:
      "属和声组的变和弦通过降低或升高五音、九音改变属七的张力；变化属七增强解决压力，也扩展色彩。",
    keyPoints: [
      "b9、#9、b5、#5 是属功能的主要变化音。",
      "变化音必须按声部倾向解决到目标和弦。",
    ],
    concepts: ["extensions-alterations", "harmonic-color", "voice-leading"],
    dimensions: ["color", "function", "brightness"],
  },
  "sposobin-47": {
    summary:
      "下属和声组的变和弦包括那不勒斯与增六和弦；它们用半音化下属强化属准备，制造比 iv 更暗或更尖锐的色彩。",
    keyPoints: [
      "bII6 与增六和弦都常接到 V。",
      "增六的 b6–#4 外向扩张到属音八度。",
    ],
    concepts: ["neapolitan-aug6", "harmonic-color", "predominant"],
    dimensions: ["color", "brightness", "function"],
  },
  "sposobin-49": {
    summary:
      "交替大小调体系在同主音大调与小调之间借用和弦；主音不变，调式色彩在小调与大调之间移动。",
    keyPoints: [
      "iv、bVI、bIII、bVII 是大调借用小调的主要和弦。",
      "借用之后通常回到原调主音，不等同转调。",
    ],
    concepts: ["modal-mixture-color", "borrowed-chords"],
    dimensions: ["brightness", "color", "relationship"],
  },
  "sposobin-50": {
    summary:
      "降 VI 级三和弦（tsVI）是交替大小调最醒目的暗色和弦；它常接 V 或 I，制造突然的明暗转折。",
    keyPoints: [
      "bVI 的根音与三音来自同主音小调。",
      "bVI–V 的半音声部让暗色平滑地回到属功能。",
    ],
    concepts: ["modal-mixture-color", "harmonic-color", "voice-leading"],
    dimensions: ["brightness", "color", "function"],
  },
  "sposobin-53": {
    summary:
      "经过降 VI 级或那不勒斯和弦的转调利用半音中介把远关系调连接起来；这类转调强调色彩与声部，而非共同和弦数量。",
    keyPoints: [
      "bVI 与 N6 都可作为半音中介。",
      "声部半音移动比和弦标签更能解释转调路径。",
    ],
    concepts: ["neapolitan-aug6", "modulation", "tonal-distance"],
    dimensions: ["relationship", "color", "brightness"],
  },
  "sposobin-56": {
    summary:
      "意外进行用非预期和弦替换功能目标（如 V–vi、V–bVI），制造句法转折；它依赖听者的功能预期被打破。",
    keyPoints: [
      "意外进行不是无功能，而是延迟或替换预期目标。",
      "阻碍终止是最常见的意外进行之一。",
    ],
    concepts: ["cadences", "harmonic-color", "phrase-structure"],
    dimensions: ["function", "color", "direction"],
  },
  "sposobin-57": {
    summary:
      "等音转调利用减七或属七的等音重解释进入远关系调；减七的对称结构尤其适合多方向解决。",
    keyPoints: [
      "减七的四个等音拼写可指向四个调性中心。",
      "等音转调的关键是重解释后的属准备与终止。",
    ],
    concepts: ["diminished-seventh", "tonal-distance", "modulation"],
    dimensions: ["relationship", "color"],
  },
  "sposobin-59": {
    summary:
      "作品调性布局把各乐章/段落的调性关系组织为整体叙事；主调、属调、下中音调与远关系调承担不同的结构权重。",
    keyPoints: [
      "调性布局是宏观和声，不只是局部进行。",
      "调性距离与曲式位置共同决定色彩强度。",
    ],
    concepts: ["tonal-distance", "phrase-structure", "circle-of-fifths"],
    dimensions: ["relationship", "direction", "brightness"],
  },
  "sposobin-60": {
    summary:
      "和声分析把和弦、功能、声部与曲式放在同一张图上；分析不是贴标签，而是解释音乐为何在此处这样走。",
    keyPoints: [
      "先看低音与外声部，再标和弦与功能。",
      "和声节奏、终止与调性布局共同构成分析结论。",
    ],
    concepts: ["phrase-structure", "harmonic-rhythm", "roman-numerals"],
    dimensions: ["function", "direction", "rhythm"],
  },
};

export const SPOSOBIN_OUTLINE = buildOutline("sposobin", CHAPTERS, NOTES);
