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
      "第 4 版短小但立场鲜明：“不动脑筋地上行下行成不了爵士乐手。”两条硬要求：① 任何内容都要在全部 12 个调上练——Lush Life 是 D♭、Giant Steps 是 B，所谓难调的 ii–V–I 其实非常普遍；② 古典式的上下行音阶让你永远从根音出发——正确练法是上行用爱奥尼亚、下行接多利亚、再弗里几亚上行、利底亚下行……让音阶里每个音都被平等地当作起点和终点，这样即兴时是耳朵选音，而不是手指凭记忆从根音开始。",
    analysis: [
      "调式链练习：上行一个调式、下行换下一个调式，每音平等出场。",
      "强制练“难调”：D♭/G♭/B 的 ii–V–I 与常调同权重。",
      "录音自查：是否每条线都从根音开始？是就换成三音或五音起手。",
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
      "第 16 章是全书重配技法的实战汇编：同一首 Spring Is Here 给出三版——Coltrane 1958 版（C7♯11 连接两个 GΔ、D7 改全音低音的 F7、CΔ–B7alt 改小调 ii–V、四小节 III–VI–II–V 反复结尾）；Kenny Barron 版（整曲 G 持续低音的“教科书”：GΔ♯5 上的旋律音只用 ♯5 或大七、Gsus♭9 解决到 C/G 当临时主、明亮 GΔ 与暗淡 C-Δ/G 交替造成明暗摆动）；Coltrane 的 Body And Soul 版。读法是逐条列“重配亮点”再回放对比——同一旋律在三套和声世界里各成一体。",
    analysis: [
      "对比阅读：原版与重配版并排弹，逐小节标“改了什么（低音/性质/数量/替换）”。",
      "Coltrane 手法清单：副属连接同功能和弦、全音低音替代、ii–V 替换单和弦、反复结尾扩展。",
      "Barron 的持续低音课：低音不动，上方明暗（GΔ♯5 ↔ C-Δ/G）交替即结构。",
      "旋律音为大七度时优先考虑增利底亚（Δ♯5）重配。",
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
      "第 17 章把曲式当作“可预知性与突然性之间的平衡”：听过无数遍 Stella By Starlight 仍爱听，因为旋律与进行给了可预知性；断句微调与重配给了突然性。字母曲式的操作定义很直接：八小节为一段，旋律相同的段用同一个字母（I Hear A Rhapsody = AABA）；B 段不等于桥段（ABAC 里的 B 不是 bridge）。曲式的实用价值是背谱——“记 A 和 B 两个八小节，而不是 32 个小节”。Rhythm Changes 的来历也在章里：Gershwin 原曲是 34 小节 AABA（8–8–8–10），两小节尾巴早被丢弃，Oleo/Anthropology 等曲头定型为 8–8–8–8。章末的作曲建议：“大部分伟大的爵士乐手同时也是伟大的作曲家”，曲式建议只是入口。",
    analysis: [
      "拿到一首新曲先扫旋律与进行，按八小节分段并标 A/B/C。",
      "比较各段终止与段首低音，找出 turnaround 的位置与形式。",
      "用曲式模板辅助背谱：只记不同的段落。",
      "作/改编时先守可预知性（段落与终止），再在断句与重配上放突然性。",
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
      "第 18 章讲读 lead sheet 的门道：① 调号只管主旋律、不管和弦——F 调的 GΔ 上可以用 F♯；先查调号再读第一个和弦（Night And Day 是 E♭ 调但开头是 BΔ）。② 主旋律写在谱面中间只是为了少加线；演奏时可以移八度制造对话感，但别频繁。③ 和弦进行的“摩西石板”并不可信——Levine 给了八步演化年表（作曲家→出版商代笔的通行版→录音→乐手改编→新标准版），结论是标准曲的“原始进行”几乎无从考据；爵士原创曲的进行接近原版，则是因为它们本就为爵士使用而写。其余小节讲节奏与断句、和弦记号的正确/错误/可选。",
    analysis: [
      "读谱三查：调号（只影响旋律）→ 主旋律实际音区 → 和弦记号是否疑似错印/可选。",
      "记住 lead sheet 的演化史：眼前的进行是历代乐手层累的结果，可以继续重配。",
      "移八度断句制造对话感，但一首曲子至多一两次。",
      "先唱旋律，标出强拍与目标音；把符号转成级数与功能，再选 rootless/shell voicing 检查冲突。",
    ],
    crossBook: ["Laitz 3：音乐密度（和弦与织体）", "Laitz 18：副属和弦"],
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
      "第 1 章的教法是“用曲库学音程”：每个音程都配一首标准曲的开头两音（上行小二度=Blue Monk、下行大三度=Giant Steps、三全音=Isotope……），先唱准再上乐器——把音程从算术变成肌肉记忆。转位法则用“九度公式”讲：大小互变、纯保持、三全音转三全音；并提醒实用场景——“现场把曲子升大六度”不如“降小三度”方便。三和弦部分强调三音与五音决定质量。这一章的底层立场：音程是原子，后续所有替代（三全音替代）、张力（属七）、线条（guide tones）都是它的分子。",
    analysis: [
      "唱音程配曲名：Blue Monk（上行 m2）、Giant Steps（下行 M3）、Isotope（三全音）……每天练。",
      "转位心算：度数相加为九；大小/增减互换，纯音程不变。",
      "三和弦先认三音五音定质量，再谈转位与低音。",
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
      "第 14 章开宗明义：“使用这些技术你等于是把一首标准曲目重新作曲。”工具箱按结构逻辑排列：反向进行（contrary motion，旋律与低音反向展开，“反向进行不仅好听，还迎合了我们对结构的期待”——Yesterdays 每个旋律音配一个和弦）；平行进行（parallelism，同类和弦同向移动，“功能并不重要，平行进行的同类和弦不需要彼此解决”——Tyner 的 Peresina、四度堆叠、减音阶上小三度平行）；斜线和弦重配（F♯/G 连接 G 大三和弦、Blue Bossa 的多个斜线和弦，低音可加七和弦）；伪终止（deceptive resolution：F7→GΔ、C7alt→A♭-7、B7→D♭——V 没有向下五度解决就是伪终止，Joe Henderson 甚至把 B7 换个方向解到 AΔ）；用 V 引出任何和弦、减和弦重配、改变旋律本身、 Pedal 低音。",
    analysis: [
      "反向进行造结构：先写旋律方向，低音反着走，每个旋律音配一个和弦。",
      "平行进行认逻辑不认功能：同一类和弦（如全 m7 或全斜线）沿旋律/低音平移，最后一个落回功能。",
      "伪终止三步：V 不下五度解决 → 看它实际去了哪 → 用新方向串起后面的进行。",
      "综合：低音 pedal + 上方变化 + 斜线和弦，可以叠用，但结构感优先。",
    ],
    crossBook: ["Laitz 21：调式交替", "Laitz 23/24：那不勒斯/增六"],
    visualHint: "张力光谱 + 低音线",
  },
  "levine-15": {
    deepSummary:
      "第 15 章把 Giant Steps 拆到只剩骨架：26 个和弦“只不过是 B、G、E♭ 三个调上的 V–I 与 ii–V–I”——每个调性中心与下一个相隔大三度，把八度三等分。历史一课给出既有调性中心运动的全部样式（五度循环、全音下行、半音下行），并点名大三度进行的先例：Night And Day（1932）、Have You Met Miss Jones（1937）等。Countdown 是方法论展示：Tune Up 的 D 调 ii–V–I 被重配成 D→B♭→G♭→D 三个大三度下行的调性中心，每个新 I 前都放它的 V，而第一个和弦 E-7 保持不变。练习法：Countdown 前四小节在全部 12 个调上慢练，“速度来自准确”。",
    analysis: [
      "先只弹三个调性中心的全音符（B–G–E♭），再插回各自的 V 或 ii–V。",
      "把 Tune Up 的 ii–V–I 逐拍换成大三度下行的调中心，自己做一遍 Countdown。",
      "guide tones 走半音/级进：三全音交替让跨调连接平滑。",
    ],
    crossBook: ["Laitz 29：旋律与和声对称结合", "Laitz 19：临时主化与转调"],
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
      "第 7 章的论证极干脆：在 C7 上下行 Mixolydian “节奏上非常不舒服”——和弦音（C、E、G、B♭）落在尴尬的弱位；加入半音经过音变成比波普属音阶后，“和弦内音都在强拍上、外音在弱半拍上”，线就“在节奏上变得正确（rhythmically correct）”——后者是 David Baker 的原话。史料也在：1927 年 Louis Armstrong 的 Hotter Than That 已经吹出了比波普属音阶，而“比波普”这个词 40 年代中期才出现。四种常用形态：比波普属七（Mixolydian+♮7）、比波普多利亚（Dorian+♯7）、比波普大调（Ionian+♯5）、比波普旋律小调——七声音阶加一个经过音变八声音阶。",
    analysis: [
      "先弹下行 Mixolydian 听别扭，再加半音经过音对比——亲耳确认“和弦音落强拍”。",
      "八分音符线里检查：1、3 拍是不是和弦音（根三五七）？",
      "四种比波普音阶各自对应它的母音阶，只差那一个经过音。",
    ],
    crossBook: ["Laitz 4：当和声、旋律与节奏交汇", "Levine 03：和弦—音阶"],
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
      "第 9 章的定义与我们的 F-11 概念一致——五声音阶是大调的 1–2–3–5–6（缺 4 与 7），音级关系“全音、全音、小三度、全音”。Levine 给它的听感描述很到位：没有半音，所以“有更多空气、空间与光亮”。历史线：摇摆时代 Tatum/Young/Wilson 常用，比波普时代少用，1960 年代初靠 Coltrane 与 McCoy Tyner 复兴（这正是 F-11 外部五声的原爆点）。小调五声与布鲁斯音阶的关系、五声音阶的调式旋转都在本章展开。",
    analysis: [
      "先弹大调 1–2–3–5–6 确认“缺 4 缺 7”，再移到小调五声对比明暗。",
      "转调式：同一条五声从五个音轮流当主音，听五个角度。",
      "1960s 手法：整条五声压在慢变的和声上（参考 Levine 08 的外部用法）。",
    ],
    crossBook: ["Levine 08：演奏外部", "Laitz 1A：音乐空间（音阶）"],
    visualHint: "五度圈",
  },
  "levine-10": {
    deepSummary:
      "第 10 章开篇就承认：“传统音乐理论无法很好地‘解释’布鲁斯。”布鲁斯音阶的音程结构是“小三度、全音、半音、半音、小三度、全音”——两个小三度加 F–F♯–G 的连续半音，这种组合在大小调音阶里找不到。布鲁斯 I 级和弦本身就是属七。最反常理的一条：同一条布鲁斯音阶可以压在基本布鲁斯的全部三个和弦（C7–F7–G7）上——F 在 C7 上是避免音、B♭ 在 F7 上是避免音、G♭ 是 G7 的大七“错”音，但这些不协和自爵士诞生之初就存在，Levine 的结论是“这不是用西方音乐理论可以解释的”。小调布鲁斯的 9–11 小节是 ♭VI–V–I（而非大调的 V–IV–I）。和弦进行部分从三和弦基本型讲起。",
    analysis: [
      "背音程口诀：小三度、全音、半音、半音、小三度、全音。",
      "在 C7–F7–G7 上逐和弦弹同一条 C 布鲁斯音阶，逐个听那些“不该对”的音如何成立。",
      "十二小节骨架先于音阶选择；小调布鲁斯记住 ♭VI–V–I 的 9–11 小节。",
      "不要把 I7 解释成 V7/I——先承认布鲁斯是自己的语言。",
    ],
    crossBook: ["Levine 07：比波普音阶", "Laitz 1A：音乐空间（音阶与调）"],
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
