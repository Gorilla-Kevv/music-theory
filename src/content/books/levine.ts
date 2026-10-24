import { buildOutline, type ChapterSeed, type NoteSeed } from "./types";

const CHAPTERS: ChapterSeed[] = [
  { number: "01", title: "Basic Theory", titleZh: "基本理论", part: "Part I · Theory: Chords and Scales", sourceFile: "jazz-baodian/OEBPS/Text/chapter5.html" },
  { number: "02", title: "Major Scale and Progressions", titleZh: "大调音阶与和弦进行", part: "Part I · Theory: Chords and Scales", sourceFile: "jazz-baodian/OEBPS/Text/chapter9.html" },
  { number: "03", title: "Chord/Scale Theory", titleZh: "和弦—音阶理论", part: "Part I · Theory: Chords and Scales", sourceFile: "jazz-baodian/OEBPS/Text/chapter25.html" },
  { number: "04", title: "How to Practice Scales", titleZh: "如何练习音阶", part: "Part I · Theory: Chords and Scales", sourceFile: "jazz-baodian/OEBPS/Text/chapter56.html" },
  { number: "05", title: "Slash Chords", titleZh: "斜线和弦", part: "Part I · Theory: Chords and Scales", sourceFile: "jazz-baodian/OEBPS/Text/chapter57.html" },
  { number: "06", title: "From Scales to Music", titleZh: "从音阶到音乐", part: "Part II · Improvisation: Playing the Changes", sourceFile: "jazz-baodian/OEBPS/Text/chapter60.html" },
  { number: "07", title: "Bebop Scales", titleZh: "比波普音阶", part: "Part II · Improvisation: Playing the Changes", sourceFile: "jazz-baodian/OEBPS/Text/chapter76.html" },
  { number: "08", title: "Playing Outside", titleZh: "演奏“外部”", part: "Part II · Improvisation: Playing the Changes", sourceFile: "jazz-baodian/OEBPS/Text/chapter84.html" },
  { number: "09", title: "Pentatonic Scales", titleZh: "五声音阶", part: "Part II · Improvisation: Playing the Changes", sourceFile: "jazz-baodian/OEBPS/Text/chapter92.html" },
  { number: "10", title: "Blues", titleZh: "布鲁斯", part: "Part II · Improvisation: Playing the Changes", sourceFile: "jazz-baodian/OEBPS/Text/chapter105.html" },
  { number: "11", title: "Rhythm Changes", titleZh: "Rhythm Changes", part: "Part II · Improvisation: Playing the Changes", sourceFile: "jazz-baodian/OEBPS/Text/chapter111.html" },
  { number: "12", title: "Practice, Practice, Practice", titleZh: "练习、练习、再练习", part: "Part II · Improvisation: Playing the Changes", sourceFile: "jazz-baodian/OEBPS/Text/chapter112.html" },
  { number: "13", title: "Basic Reharmonization", titleZh: "基础重配和声", part: "Part III · Reharmonization", sourceFile: "jazz-baodian/OEBPS/Text/chapter128.html" },
  { number: "14", title: "Advanced Reharmonization", titleZh: "高级重配和声", part: "Part III · Reharmonization", sourceFile: "jazz-baodian/OEBPS/Text/chapter150.html" },
  { number: "15", title: "Coltrane Changes", titleZh: "Coltrane 进行", part: "Part III · Reharmonization", sourceFile: "jazz-baodian/OEBPS/Text/chapter167.html" },
  { number: "16", title: "Three Reharmonizations", titleZh: "三种重配和声", part: "Part III · Reharmonization", sourceFile: "jazz-baodian/OEBPS/Text/chapter175.html" },
  { number: "17", title: "Song Forms and Composition", titleZh: "曲式与作曲", part: "Part IV · The Tune", sourceFile: "jazz-baodian/OEBPS/Text/chapter180.html" },
  { number: "18", title: "Reading a Lead Sheet", titleZh: "读 Lead Sheet", part: "Part IV · The Tune", sourceFile: "jazz-baodian/OEBPS/Text/chapter198.html" },
  { number: "19", title: "Memorizing a Tune", titleZh: "记曲", part: "Part IV · The Tune", sourceFile: "jazz-baodian/OEBPS/Text/chapter204.html" },
  { number: "20", title: "Heads", titleZh: "Head 旋律", part: "Part IV · The Tune", sourceFile: "jazz-baodian/OEBPS/Text/chapter208.html" },
  { number: "21", title: "The Repertoire", titleZh: "曲目库", part: "Part IV · The Tune", sourceFile: "jazz-baodian/OEBPS/Text/chapter209.html" },
  { number: "22", title: "Salsa and Latin Jazz", titleZh: "Salsa 与拉丁爵士", part: "Part V · The Rest of It", sourceFile: "jazz-baodian/OEBPS/Text/chapter211.html" },
  { number: "23", title: "Loose Ends", titleZh: "杂项", part: "Part V · The Rest of It", sourceFile: "jazz-baodian/OEBPS/Text/chapter216.html" },
  // 第二十四章「聆听」：手头 EPUB 未收录该章正文（索引提及但无对应文件），留空待补。
  { number: "24", title: "Listening", titleZh: "聆听", part: "Part V · The Rest of It" },
];

const NOTES: Record<string, NoteSeed> = {
  "levine-01": {
    summary:
      "从音程、转位与三和弦重新建立爵士和声的最小单位：音程度数决定距离，三音与七音决定和弦质量，转位改变低音与声部连接。",
    keyPoints: [
      "音程同时看“度数”和“半音数”，三全音是属功能张力的核心。",
      "三和弦的四类质量是后续七和弦、延伸音与替代的构件。",
    ],
    concepts: ["intervals", "triads", "seventh-chords"],
    dimensions: ["function", "color"],
  },
  "levine-02": {
    summary:
      "大调音阶内部七个调式对应不同和弦质量；ii–V–I、声部进行与五度圈把调式、功能和低音方向串成一首曲子的骨架。",
    keyPoints: [
      "Dorian–Mixolydian–Ionian 是 C 大调 ii–V–I 最常用的三块色彩。",
      "低音下行五度、三音七音半音交换，是进行有方向感的两个来源。",
    ],
    concepts: ["modes", "ii-v-i", "guide-tones", "circle-of-fifths", "voice-leading"],
    dimensions: ["function", "direction", "relationship"],
  },
  "levine-03": {
    summary:
      "和弦—音阶理论把每个和弦质量映射到一条音阶；避免音、延伸音、变化属七与旋律小调各调式共同构成爵士即兴的色彩词汇。",
    keyPoints: [
      "音阶负责经过与色彩，和弦三音七音负责落点。",
      "变化属七来自旋律小调第七调式，同时包含 b9、#9、b5、#5。",
    ],
    concepts: ["chord-scale", "extensions-alterations", "harmonic-color", "melodic-minor-modes"],
    dimensions: ["color", "function", "brightness"],
  },
  "levine-05": {
    summary:
      "斜线和弦把三和弦叠在另一个低音上，改变和弦的稳定性、低音方向与色彩；它既可以是转位，也可以是独立的和声层。",
    keyPoints: [
      "低音决定“站在哪里”，上方三和弦决定“是什么颜色”。",
      "斜线和弦常用来制造级进低音、持续音与调式漂移。",
    ],
    concepts: ["bass-line", "rootless-voicings", "tonal-distance"],
    dimensions: ["color", "direction", "relationship"],
  },
  "levine-07": {
    summary:
      "比波普音阶在自然音阶中加入半音经过音，使和弦音落在强拍；属、大调与旋律小调各有对应的比波普形态。",
    keyPoints: [
      "比波普属音阶 = Mixolydian + 自然 7（作为经过音）。",
      "经过音不是新的和弦音，它服务于线条的节拍落点。",
    ],
    concepts: ["bebop-scale", "chord-scale"],
    dimensions: ["direction", "color"],
  },
  "levine-08": {
    summary:
      "Outside playing 通过叠加与当前和弦无关的音阶或三和弦制造短时张力，再用 guide tones 或目标和弦回到“里面”。",
    keyPoints: [
      "外部音响必须被解决；张力与回归是一对。",
      "半音位移、三和弦叠加与五声替代是常见入口。",
    ],
    concepts: ["pentatonic-outside", "tritone-substitution", "harmonic-color"],
    dimensions: ["color", "relationship"],
  },
  "levine-09": {
    summary:
      "五声音阶省略半音与 tritone，因而稳定、易唱；大调、小调与叠加五声可以在同一和弦上产生不同的“内外”程度。",
    keyPoints: [
      "五声不是简化音阶，而是独立的旋律集合。",
      "叠加五声的根音与当前和弦根音的距离决定外部感。",
    ],
    concepts: ["pentatonic-outside", "chord-scale"],
    dimensions: ["color", "relationship"],
  },
  "levine-10": {
    summary:
      "十二小节布鲁斯以 I7–IV7–V7 的循环构成曲式；蓝调音、布鲁斯音阶与属七色彩让“功能和声”让位于风格语言。",
    keyPoints: [
      "I7 的 b7 是布鲁斯色彩，不是功能错误。",
      "蓝调音 b3、b5、b7 可以与大调三音同时存在。",
    ],
    concepts: ["blues", "harmonic-color", "rhythm-changes"],
    dimensions: ["color", "direction", "rhythm"],
  },
  "levine-11": {
    summary:
      "Rhythm Changes 是建立在 I Got Rhythm 和声上的 32 小节 AABA 曲式；A 段 I–vi–ii–V，B 段常用属和弦链与模进。",
    keyPoints: [
      "AABA 的骨架比具体和弦更重要，替换和弦仍保留曲式。",
      "A 段的 vi–ii–V 是五度圈最常用的切片之一。",
    ],
    concepts: ["rhythm-changes", "circle-of-fifths", "harmonic-rhythm"],
    dimensions: ["rhythm", "direction", "relationship"],
  },
  "levine-13": {
    summary:
      "基础重配和声用三全音替代、副属和弦、经过和弦与斜线和弦改变低音与色彩，但不改变原进行的功能方向。",
    keyPoints: [
      "三全音替代用 bII7 替换 V7，共享同一个 tritone。",
      "重配和声的目标是改变“怎么走”，不是抹掉“去哪里”。",
    ],
    concepts: ["tritone-substitution", "secondary-dominants", "rootless-voicings"],
    dimensions: ["relationship", "color", "direction"],
  },
  "levine-14": {
    summary:
      "高级重配和声把声部配置、持续音、调式交替与多层替代结合起来；色彩变化必须由 voice leading 支撑，否则只是堆叠。",
    keyPoints: [
      "先写 guide tones 与低音，再决定延伸音与替代。",
      "同一功能可以有多种色彩，但目标音与解决方向要保持清楚。",
    ],
    concepts: ["rootless-voicings", "harmonic-color", "modal-mixture-color"],
    dimensions: ["color", "brightness", "function"],
  },
  "levine-15": {
    summary:
      "Coltrane Changes 用大三级循环把八度分成三个调性中心，并在其间插入属和弦或 ii–V，形成快速而对称的调性移动。",
    keyPoints: [
      "C–Ab–E 的大三级循环是 Giant Steps 的骨架。",
      "即兴时用目标和弦的 guide tones 定位，而不是逐和弦背音阶。",
    ],
    concepts: ["coltrane-changes", "tonal-distance", "guide-tones"],
    dimensions: ["relationship", "direction"],
  },
};

const EXTRA_NOTES: Record<string, NoteSeed> = {
  "levine-04": {
    summary:
      "音阶练习的目标不是速度，而是把音阶变成可随时调用的线条：慢速、准确、均匀，再逐步加入节奏与目标音。",
    keyPoints: [
      "所有调、所有调式都要能上行、下行、分段与模进。",
      "练习时必须听节拍与音准，不要用惯性代替耳朵。",
    ],
    concepts: ["chord-scale", "bebop-scale"],
    dimensions: ["direction"],
    deepSummary:
      "Levine 把音阶视为即兴的字母表，但字母表本身不构成句子。练习应先建立均匀的八分/十六分线条，再把音阶落到 ii–V–I 的三音七音上；速度只是控制力的结果，不是目标。",
    analysis: [
      "先慢速、无重音，检查每个音的准确与均匀。",
      "加入节拍器、重音移位与不同起拍，避免只会从根音开始。",
      "把音阶最后两音改成目标和弦音，训练“音阶→落点”的连接。",
    ],
    crossBook: ["Laitz 1A：音阶与调", "Laitz 3：和弦与织体"],
    visualHint: "调式轮 + 半音尺",
    confusions: [
      {
        question: "把十二个调的音阶都背下来，就会即兴了吗？",
        answer: "不会。即兴还需要节奏、动机、目标音与曲式判断；音阶只是可用音集合。",
      },
    ],
  },
  "levine-06": {
    summary:
      "从音阶到音乐，需要动机、节奏、留白与目标和弦音；连续跑音阶不等于有句子。",
    keyPoints: [
      "用短动机与模进组织线条，而不是从头跑到尾。",
      "强拍落到三音/七音，弱拍用音阶与经过音填充。",
    ],
    concepts: ["chord-scale", "harmonic-sequence", "phrase-structure"],
    dimensions: ["direction", "color"],
    deepSummary:
      "这一章把“音阶材料”转成“语法”：一个动机经过重复、移位、节奏变化，最后用目标和弦音收束。Levine 反复强调听唱片、模仿语气与留白，因为音乐性来自句法，不来自音阶数量。",
    analysis: [
      "先设计 2–4 个音的动机，再决定它在哪些和弦上移位。",
      "每个乐句至少有一个明确的目标音与一个呼吸点。",
      "用录音检查：线条是否有开头、发展、收束，而不是平均的十六分音符。",
    ],
    crossBook: ["Laitz 2：旋律与对位", "Laitz 16：乐句与句法"],
    visualHint: "体系图中的“乐句/关系”分支",
    confusions: [
      {
        question: "音阶跑得越快越“高级”吗？",
        answer: "不是。速度只有在节奏、目标音和句法清楚时才有意义。",
      },
    ],
  },
  "levine-12": {
    summary:
      "练习设计比练习时长更重要：把难点拆成小单元，慢速循环，再放回完整进行。",
    keyPoints: [
      "拆解、慢练、循环、录音复盘是四个基本动作。",
      "每次练习只解决一个具体问题，不要同时改十件事。",
    ],
    concepts: ["harmonic-rhythm", "guide-tones"],
    dimensions: ["rhythm"],
    deepSummary:
      "Levine 的练习观接近“刻意练习”：把一段进行拆成和弦连接、guide tones、节奏型或单一声部，慢到能听见每个错误，再逐步加速并放回曲目。练习的成果要用录音与演出检验。",
    analysis: [
      "把 ii–V–I 拆成低音、guide tones、音阶、节奏四层。",
      "设定可观察目标（不掉拍、不碰错音、能循环四遍）。",
      "录音回听，记录下一步唯一要修的点。",
    ],
    crossBook: ["Laitz 5：声部进行"],
    visualHint: "试听坞 + 复习卡",
    confusions: [
      {
        question: "每天练两小时一定比练四十分钟好吗？",
        answer: "不一定。没有目标与反馈的两小时，可能只是重复已有错误。",
      },
    ],
  },
  "levine-16": {
    summary:
      "同一首曲子的三种重配和声并置，展示低音、色彩与功能可以怎样独立变化而不丢失原曲。",
    keyPoints: [
      "重配和声先保住旋律与 guide tones，再改低音/色彩。",
      "比较三种版本的“走向”和“明暗”，而不是只比和弦名字。",
    ],
    concepts: ["tritone-substitution", "rootless-voicings", "harmonic-color"],
    dimensions: ["relationship", "color"],
    deepSummary:
      "三种重配不是三个答案，而是三种分析视角：低音替代、色彩替代与功能替代。把它们并排弹奏，可以听出“同一个旋律在三种和声世界中”如何改变重心与明暗。",
    analysis: [
      "第一遍只弹原和弦与旋律，标出旋律落点。",
      "第二遍改低音（转位/斜线和弦），听方向变化。",
      "第三遍加三全音替代与延伸音，检查旋律是否冲突。",
    ],
    crossBook: ["Laitz 21：调式交替", "Laitz 24：增六和弦"],
    visualHint: "张力光谱",
    confusions: [
      {
        question: "重配和声是不是和弦越复杂越好？",
        answer: "不是。重配要服务旋律与曲式；复杂和弦若破坏目标音或句法，就只是堆叠。",
      },
    ],
  },
  "levine-17": {
    summary:
      "曲式决定和声节奏与终止位置：AABA、ABAC、布鲁斯与 Rhythm Changes 的段落边界比单个和弦更重要。",
    keyPoints: [
      "先标 A/B 段与终止，再分析局部和弦。",
      "turnaround 与段落开头的和声决定“循环感”。",
    ],
    concepts: ["phrase-structure", "rhythm-changes", "blues"],
    dimensions: ["rhythm", "function"],
    deepSummary:
      "曲式是宏观句法。Levine 把曲目按 AABA、ABAC、12-bar blues 等模板归类，是为了让即兴者知道“现在处于哪一句、下一句往哪里走”。分析和声时先看段落边界，才能理解为什么某些和弦在此处出现。",
    analysis: [
      "用 A/B 标记段落，标出每段终止类型。",
      "比较各段开头的低音与和弦；找出 turnaround。",
      "把旋律动机与曲式边界对齐，判断句法是否呼应。",
    ],
    crossBook: ["Laitz 20/25/26/27：曲式"],
    visualHint: "体系图的“曲式/句法”分支",
    confusions: [
      {
        question: "AABA 只是 32 小节吗？",
        answer: "AABA 是段落关系；32 小节是常见长度，但很多曲目会扩展或压缩。",
      },
    ],
  },
  "levine-18": {
    summary:
      "Lead sheet 是压缩谱：旋律、和弦符号、曲式与节奏提示；演奏者要自己补 voicing、低音与节奏。",
    keyPoints: [
      "和弦符号是功能/色彩指令，不是完整钢琴谱。",
      "先读旋律与曲式，再决定 voicing 与节奏型。",
    ],
    concepts: ["rootless-voicings", "extensions-alterations", "roman-numerals"],
    dimensions: ["function", "color"],
    deepSummary:
      "读 lead sheet 的能力，核心是把符号还原成和声动作：这个和弦在调里是什么功能？三音七音在哪里？旋律音与延伸音是否冲突？Levine 强调用耳朵和曲目经验补足纸面信息。",
    analysis: [
      "先唱旋律，标出强拍与目标音。",
      "把和弦符号转成级数与功能，判断进行方向。",
      "选择 rootless/shell voicing，检查与旋律的冲突音。",
    ],
    crossBook: ["Laitz 3：和弦", "Laitz 17：副属和弦"],
    visualHint: "张力光谱 + 钢琴键盘",
    confusions: [
      {
        question: "看到 Cmaj7 就必须弹全部四个音吗？",
        answer: "不必。三音七音已经定义和弦，根音可交给贝斯，九/十三音按语境选择。",
      },
    ],
  },
  "levine-19": {
    summary:
      "背曲靠结构：先记曲式与终止，再记低音与 guide tones，最后填旋律细节。",
    keyPoints: [
      "用段落、终止与低音线建立记忆锚点。",
      "不要在没记清曲式前死背音符。",
    ],
    concepts: ["phrase-structure", "guide-tones", "bass-line"],
    dimensions: ["rhythm", "direction"],
    deepSummary:
      "Levine 的记曲方法把“记忆”拆成结构记忆与听觉记忆：结构记忆是 A/B、终止、turnaround；听觉记忆是低音、guide tones、旋律轮廓。两者结合，才能在台上不靠纸。",
    analysis: [
      "先听三遍，标出段落与终止。",
      "用低音和 guide tones 弹一遍，不弹旋律。",
      "最后加旋律，检查段落连接处是否记得。",
    ],
    crossBook: ["Laitz 15/16：乐段与句法"],
    visualHint: "体系图的曲式路径",
    confusions: [
      {
        question: "背曲就是背和弦吗？",
        answer: "和弦只是骨架；曲式、旋律、低音与段落关系同样重要。",
      },
    ],
  },
  "levine-20": {
    summary:
      "Head 是作曲旋律本身；语气、发音、节奏与句法决定它是否“像爵士”。",
    keyPoints: [
      "先模仿唱片语气，再分析音高与和弦。",
      "Head 的节奏重音常暗示和声节奏与即兴方向。",
    ],
    concepts: ["rhythm-changes", "blues", "phrase-structure"],
    dimensions: ["rhythm", "color"],
    deepSummary:
      "Head 不是等待即兴开始的过场。它的旋律动机、节奏型与落音往往已经给出整首曲子的语气和即兴素材。Levine 建议从唱片模仿发音、连断与重音，再把它与和弦/曲式对应。",
    analysis: [
      "跟着唱片唱 head，模仿连音、重音与呼吸。",
      "标出 head 的目标音与和弦变化点。",
      "把 head 的动机移调到即兴中，形成统一语气。",
    ],
    crossBook: ["Laitz 2：旋律", "Laitz 16：句法"],
    visualHint: "谱例点击 + 试听",
    confusions: [
      {
        question: "Head 只要音高对就行了吗？",
        answer: "不够。爵士的语气、发音与节奏重音是 head 的一部分。",
      },
    ],
  },
  "levine-21": {
    summary:
      "曲目库不是清单，而是和声与曲式的分类系统：布鲁斯、Rhythm Changes、ballad、Latin 各有语法。",
    keyPoints: [
      "按曲式/和声类型学曲目，而不是按字母顺序。",
      "同一类曲目共享 turnaround、常用替代与即兴策略。",
    ],
    concepts: ["rhythm-changes", "blues", "ii-v-i", "phrase-structure"],
    dimensions: ["relationship", "rhythm"],
    deepSummary:
      "Levine 的曲目观强调“可迁移”：学一首 Rhythm Changes，等于学一类曲目；学一首 blues，等于学和声语言与蓝调词汇。曲目库应组织成语法家族，而不是无限扩张的清单。",
    analysis: [
      "把曲目按 blues / rhythm changes / AABA / ABAC / Latin 分类。",
      "每类记 2–3 首代表曲，比较 turnarounds 与常用替代。",
      "用同一套 guide tones/音阶策略迁移到同类曲目。",
    ],
    crossBook: ["Laitz 20/25/26/27：曲式"],
    visualHint: "体系图的曲式森林",
    confusions: [
      {
        question: "学的曲目越多越好吗？",
        answer: "数量不等于体系；能把曲目归类、提取语法并迁移，才是曲目库的价值。",
      },
    ],
  },
  "levine-22": {
    summary:
      "Salsa 与拉丁爵士把爵士和声放进 clave、montuno 与 tumbao 的节奏结构；和声节奏必须服从节奏层。",
    keyPoints: [
      "clave 是时间组织，不是装饰节奏。",
      "钢琴 montuno 与贝斯 tumbao 共同定义和声节奏。",
    ],
    concepts: ["rhythm-changes", "harmonic-rhythm", "blues"],
    dimensions: ["rhythm", "color"],
    deepSummary:
      "拉丁语境中的和声不是独立层：钢琴的 montuno、贝斯的 tumbao 与打击乐的 clave 共同决定何时换和弦、如何留白。把爵士 voicing 直接搬进来，常会与节奏层冲突。",
    analysis: [
      "先锁定 clave 方向与 2-3 / 3-2 感觉。",
      "让 montuno 的和弦变化与 clave 重音对齐。",
      "检查贝斯 tumbao 是否与钢琴 voicing 争抢低频。",
    ],
    crossBook: ["Laitz 1B：节拍与节奏"],
    visualHint: "节奏层与和声节奏对照",
    confusions: [
      {
        question: "拉丁爵士就是把爵士和弦加上拉丁节奏吗？",
        answer: "不是。节奏层会重新组织和声节奏与段落，和声必须服从 clave/montuno 的结构。",
      },
    ],
  },
  "levine-23": {
    summary:
      "杂项章节处理实际演出问题：引子、尾声、变速、动态、乐队沟通与“没有纸”的现场判断。",
    keyPoints: [
      "引子/尾声与 turnaround 常决定演出是否“落地”。",
      "现场优先级：曲式 > 目标音 > 色彩。",
    ],
    concepts: ["phrase-structure", "harmonic-color", "rhythm-changes"],
    dimensions: ["rhythm", "function"],
    deepSummary:
      "这些看似零散的主题，实际上都在回答“如何在现场保持结构”。Levine 把引子、尾声、节奏与沟通放在同一层，是因为演出中的和声选择必须服务时间与乐队互动，而不是纸面和弦。",
    analysis: [
      "准备 2–3 个通用引子/尾声模板。",
      "在曲目结尾标记 turnaround 或 final cadence。",
      "现场先保曲式与目标音，再考虑替代与延伸。",
    ],
    crossBook: ["Laitz 15：乐段", "Laitz 20：曲式"],
    visualHint: "曲式森林 + 试听坞",
    confusions: [
      {
        question: "尾声可以随便停吗？",
        answer: "不可以。尾声需要和声/节奏的收束信号，否则乐队与听众都无法判断结束。",
      },
    ],
  },
  "levine-24": {
    summary:
      "聆听是理论的前置条件：主动听唱片、扒谱、比较版本，才能把和声词汇变成听觉直觉。",
    keyPoints: [
      "主动听：标曲式、低音、guide tones、乐句。",
      "比较不同版本，听同一进行的不同色彩与节奏。",
    ],
    concepts: ["harmonic-color", "guide-tones", "phrase-structure"],
    dimensions: ["color"],
    deepSummary:
      "Levine 把 listening 放在全书末尾，不是附属品，而是回环：所有理论最终都要回到唱片。主动听意味着带着问题听——曲式在哪里、低音怎么走、guide tones 如何解决、乐手如何留白。",
    analysis: [
      "选一首标准曲，听三遍：曲式、低音、旋律。",
      "扒出 guide tones 与 turnaround。",
      "比较两个版本，写下一个色彩/节奏差异。",
    ],
    crossBook: ["Laitz 2：旋律", "Laitz 19：临时主化与转调"],
    visualHint: "试听坞",
    confusions: [
      {
        question: "听唱片算学习吗？",
        answer: "被动听不算；带着曲式、低音、目标音问题去听并复盘，才算。",
      },
    ],
  },
};

const DEEPEN: Record<string, Partial<NoteSeed>> = {
  "levine-01": {
    deepSummary:
      "音程与三和弦不是入门填空题，而是后续所有替代、张力与声部进行的度量单位。三全音既解释属功能，也解释三全音替代；三音与七音既定义和弦质量，也构成 guide tones。",
    analysis: [
      "把音程听成“距离 + 张力”，再把它映射到和弦质量。",
      "三和弦转位先看低音，再看声部连接，不要只看和弦名。",
    ],
    crossBook: ["Laitz 1A：音乐空间（音程）", "Laitz 3：音乐密度（三和弦与七和弦）"],
    visualHint: "半音尺",
  },
  "levine-02": {
    deepSummary:
      "第 2 章从“大调音阶有七个音、从哪个音开始弹就是哪条调式”讲起，把 ii–V–I 直接长在调式上（每隔一个音框出来的就是七和弦：Ionian→CΔ、Dorian→D-7、Mixolydian→G7）。声部进行的原话是“重力或磁力”：每个和弦的七音都向下解决半音变成下一个和弦的三音——管乐手给主旋律勾背景线靠的就是这一条。五度圈在 Levine 手里既是练习路线图（每个调逆时针走），也是曲库现实的镜子：II–V–I 的根音 D–G–C 本来就排在五度圈上，《All The Things You Are》的和弦根音同样沿着圈走。Locrian 和调式爵士放在章末——现代爵士可以从任何调式出发写作，不必先回 V–I。",
    analysis: [
      "弹 ii–V–I 时只盯七音：D-7 的 C 下行到 G7 的 B，G7 的 F 下行到 CΔ 的 E。",
      "练习走五度圈逆时针：C→F→B♭→E♭……每个新调先弹 ii–V–I。",
      "拿一首标准曲的和弦根音对五度圈（如 All The Things You Are），看进行如何沿圈走。",
    ],
    crossBook: ["Laitz 5：调性支柱与声部进行", "Laitz 9：下属功能与乐句模型"],
    visualHint: "五度圈 + 体系图",
  },
  "levine-03": {
    deepSummary:
      "第 3 章是 CST 的方法论总纲：和弦记号同时告诉你和弦与该用的音阶。Levine 对“避免音”的处理极有名——他亲口说这个名字起得不好，更好的叫法是“需小心处理的音（handle with care note）”：大七和弦的四音快速经过时并不刺耳，故意强调再解决到三音反而有效（Stella By Starlight 的 ♭E）。不协和不是坏事，“对不协和的创造性运用”是整个西方音乐发展的写照。#11 的术语史也在章里：♭5 的叫法让位于 #4/#11，40 年代比波普乐手升四音还被 Down Beat 读者骂“爵士乐死了”。大调、旋律小调、减、全音四套音阶和声在此并列，旋律小调的七个调式各有代表和弦且可互换。",
    analysis: [
      "左手和弦右手音阶逐音试：找到那个“要小心”的音，再听它作为经过音时如何失效。",
      "属七上的四音：比波普之前只作经过，之后升四（#11）成为标准色彩。",
      "先定三音七音，再决定停留音与经过音——曲子的整体决定不协和的容忍度。",
    ],
    crossBook: ["Laitz 3：音乐密度（三和弦与七和弦）", "Laitz 21：调式交替"],
    visualHint: "张力光谱 + 调式轮",
  },
  "levine-13": {
    deepSummary:
      "第 13 章开宗明义：重配和声属于作曲——“让曲子听起来更像你的创作，而不是原曲作者的创作”，有时改一个和弦就够。四种形式：改性质、加和弦、减和弦、替换和弦。两个标志性手法：① V 前加 ii 变成 ii–V（1930 年代乐手让老歌“现代化”的第一招）；② 三全音替代——E♭7 换成 A7，低音走半音线；原理是属七的三音七音互换（三全音守恒），书中用 3–4 音的声部逻辑推演，并扩展成 ii–V 替代单个 V。",
    analysis: [
      "先弹原进行的低音与三音七音，再试替代——目标和弦不变才算成立。",
      "V→ii–V 现代化：在所有老歌的 V 前试加 ii。",
      "三全音替代造半音低音线：D–D♭–C，先听低音再看内声部。",
    ],
    crossBook: ["Laitz 18：副属和弦", "Laitz 19：临时主化与转调"],
    visualHint: "张力光谱 + 体系图“关系”分支",
  },
  "levine-14": {
    deepSummary:
      "高级重配把 voicing、持续音、调式交替与替代叠在一起，但每一层都必须有 voice leading 支撑。色彩是结果，不是起点；先决定低音与目标音，再决定延伸音。",
    analysis: [
      "先弹 shell（根/三/七），再加一个色彩音。",
      "检查低音与旋律是否争抢同一音区。",
    ],
    crossBook: ["Laitz 21：调式交替", "Laitz 23/24：那不勒斯/增六"],
    visualHint: "张力光谱",
  },
  "levine-15": {
    deepSummary:
      "Coltrane Changes 把八度分成三个大三级调性中心，用属和弦连接；它听起来复杂，但骨架是“目标调 + guide tones + 对称根音运动”。分析时先标三个目标调，再看属和弦如何指向它们。",
    analysis: [
      "先只弹 Cmaj7–Abmaj7–Emaj7 三个目标和弦。",
      "再加入 Eb7/B7/G7，听属和弦如何把根音推向下一个目标。",
    ],
    crossBook: ["Laitz 29：对称与八度等分"],
    visualHint: "五度圈/关系网络",
  },
  "levine-05": {
    deepSummary:
      "斜线和弦把“低音的功能”和“上方和弦的颜色”拆成两层：低音决定你站在哪个音级，上方三和弦决定这一刻是什么色彩。它可以是转位，也可以是独立的和声层；判断时要先看低音是否形成级进线或持续音。",
    analysis: [
      "先标低音级数，再问上方三和弦与低音构成什么音程。",
      "把斜线和弦放回低音线：它是在级进、持续，还是制造半音漂移？",
      "检查解决：低音下一步去哪里，上方三和弦是否随之改变功能。",
    ],
    crossBook: ["Laitz 13：级进下行低音", "Sposobin 48：持续音"],
    visualHint: "低音线 + 钢琴键盘",
  },
  "levine-07": {
    deepSummary:
      "比波普音阶本质上是节奏工具：加一个半音经过音，让八分音符的强拍落在和弦音上。它不改变和弦功能，只改变线条的落点与摆动；练习时必须先设计和弦音的节拍位置。",
    analysis: [
      "先标每小节 1、3 拍要落哪个和弦音，再填经过音。",
      "经过音只放弱拍；强拍上的经过音会听起来像错音。",
      "把同一句移调，检查落点是否仍然稳定。",
    ],
    crossBook: ["Laitz 04：和弦外音", "Levine 03：和弦—音阶"],
    visualHint: "半音尺 + 节奏格",
  },
  "levine-08": {
    deepSummary:
      "Outside playing 的核心不是“用外面的音”，而是“制造张力并回来”。有效的外部音响通常有清晰的入口、重复的动机与明确的解决点；没有回归的外部音只是错误。",
    analysis: [
      "先决定在哪一拍出去、在哪一拍回来。",
      "用节奏重复让外部音响听起来像设计，而不是手滑。",
      "回到目标和弦的三音、七音或 guide tone，确认解决。",
    ],
    crossBook: ["Laitz 22：半音转调", "Levine 13：重配和声"],
    visualHint: "张力光谱",
  },
  "levine-09": {
    deepSummary:
      "五声音阶省略半音与三全音，因此稳定、易唱，也更难听出“调性方向”。它既可以作为调内旋律材料，也可以整体移位制造外部感；关键在根音与当前和弦的距离。",
    analysis: [
      "先判断五声的根音与当前和弦根音的关系。",
      "同主音五声偏“里面”，半音或三全音移位偏“外面”。",
      "用五声写一句，再检查和弦三音七音是否仍被强调。",
    ],
    crossBook: ["Levine 08：演奏外部", "Laitz 1A：音阶"],
    visualHint: "五度圈",
  },
  "levine-10": {
    deepSummary:
      "布鲁斯把功能和声暂时放在一边：I、IV、V 都可以是属七，b7 是风格色彩而不是功能错误；蓝调音又与大调三音并存，形成大小三度的双重身份。分析时要同时看十二小节骨架与句子回应。",
    analysis: [
      "先背十二小节骨架，再听每个四小节乐句如何回应。",
      "标出蓝调音与大调三音同时出现的位置。",
      "不要把 I7 硬解释成 V7/I；先承认它是布鲁斯语言。",
    ],
    crossBook: ["Levine 07：比波普音阶", "Laitz 1A：音阶与调"],
    visualHint: "十二小节格 + 张力光谱",
  },
  "levine-11": {
    deepSummary:
      "Rhythm Changes 的价值在曲式模板：32 小节 AABA、A 段 I–vi–ii–V、B 段属和弦循环。和弦可以替换，但每段的目标与转折点必须保留；即兴迷路通常不是音阶问题，而是曲式地图不清。",
    analysis: [
      "先标 A/B 段边界与每段最后一个目标和弦。",
      "A 段只弹 guide tones，B 段只弹根音走向。",
      "替换和弦后检查是否仍能在段末落到原目标。",
    ],
    crossBook: ["Laitz 20：二部曲式与变奏", "Levine 02：五度圈"],
    visualHint: "曲式地图 + 五度圈",
  },
};

const ALL_NOTES = Object.fromEntries(
  Object.entries(NOTES).map(([id, note]) => [id, { ...note, ...(DEEPEN[id] ?? {}) }]),
) as Record<string, NoteSeed>;

export const LEVINE_OUTLINE = buildOutline("levine", CHAPTERS, {
  ...ALL_NOTES,
  ...EXTRA_NOTES,
}, {
  file: "jazz-baodian/OEBPS/Text/TOC.xhtml",
  kind: "epub",
  label: "《爵士乐宝典》中译本（赵贝露译）EPUB，已解包内嵌于 /books/jazz-baodian/；第二十四章 EPUB 未收录",
});
