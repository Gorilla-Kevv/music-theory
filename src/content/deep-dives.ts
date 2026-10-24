import { cite } from "./bibliography";
import type { Concept } from "./types";

type DeepDive = NonNullable<Concept["deepDive"]>;

export const DEEP_DIVES: Record<string, DeepDive> = {
  "cadential-six-four": {
    title: "白话解释：它为什么不是“主和弦的第二转位”",
    blocks: [
      {
        type: "p",
        text:
          "先把低音弹出来：G。此时你听到的低音已经站在属的位置上，上方的 C 和 E 只是暂时压在它上面。它们不是稳定的主和弦，而是两个要被“拉下来”的音：E 向下滑到 D，C 向下滑到 B。等 G7 出现时，这两个音落下，属功能才真正站稳。",
        cites: [
          cite("laitz", "Chapter 11 Six-Four Chords and Plagal Motions"),
          cite("sposobin", "第九章 终止四六和弦"),
        ],
      },
      {
        type: "p",
        text:
          "如果把它当成普通 I6/4，你会以为音乐“先回到主再离开”，但听觉上它并没有回家：低音仍在属音上，张力一直悬着，直到 V7 才解决。功能和声看的是“听者期待什么”，而不是和弦符号像什么。",
        cites: [cite("sposobin", "第九章 终止四六和弦")],
      },
      {
        type: "callout",
        title: "判断顺序",
        text: "低音是不是属音？是否在重拍？后面是否接 V？三个条件都满足，才按终止四六理解；否则可能只是经过/辅助四六。",
      },
    ],
  },
  "harmonic-sequence": {
    title: "白话解释：模进像一段有方向的楼梯",
    blocks: [
      {
        type: "p",
        text:
          "模进不是随便重复，而是把一个“楼梯模型”搬到新的高度。自然模进留在调内，楼梯的每一级会根据音阶自动变宽或变窄；真实模进保持原来的形状，哪怕因此离开原调。",
        cites: [
          cite("laitz", "Chapter 19 Harmonic Sequences"),
          cite("sposobin", "第二十六章 自然（调内）模进和副七和弦（模进和弦）"),
        ],
      },
      {
        type: "p",
        text:
          "听模进时先抓低音：低音在连续下行五度，方向就非常明确；低音在级进或半音移动，模进更像“爬坡”。当低音停止、终止出现，模进就到达了目的地。",
        cites: [cite("levine", "Chapter 2 Major Scale and Progressions（五度圈）")],
      },
      {
        type: "callout",
        title: "一句话",
        text: "模进是“有目标的重复”：没有终止或转调收束的重复，只是循环。",
      },
    ],
  },
  "diminished-seventh": {
    title: "白话解释：同一个房间的四扇门",
    blocks: [
      {
        type: "p",
        text:
          "减七和弦像四个等距的房间：B–D–F–Ab。你把其中任意一个音当作根音，房间的形状不变，只是门牌换了。正因为形状对称，它可以用四种等音写法指向四个不同的调。",
        cites: [
          cite("sposobin", "第二十二章 导七和弦（DⅦ7）"),
          cite("laitz", "Chapter 28 Tonal Ambiguity and Symmetrically Constructed Harmonies"),
        ],
      },
      {
        type: "p",
        text:
          "在 C 大调里，Bdim7 的 B 是导音，听感自然想上到 C；但如果你把 Ab 改写成 G#，同一音响就变成 E 大调的导七。等音转调不是“换个名字”，而是让耳朵换一个目标。",
        cites: [cite("sposobin", "第五十七章 等音转调、经过减七和弦的转调")],
      },
      {
        type: "callout",
        title: "听辨抓手",
        text: "减七的张力是均匀的；先听低音和目标音，再决定它往哪个调解决，不要只凭“颜色”判断。",
      },
    ],
  },
  "harmonic-rhythm": {
    title: "白话解释：和声节奏是音乐的呼吸",
    blocks: [
      {
        type: "p",
        text:
          "把每小节想成一次呼吸：一小节换一个和弦，呼吸长；一小节换四个和弦，呼吸短。呼吸突然变短，听者会本能地期待“要发生什么了”，所以和声节奏常被用来把音乐推向终止。",
        cites: [
          cite("laitz", "Chapter 15 Periods"),
          cite("sposobin", "第六十章 和声分析的某些问题"),
        ],
      },
      {
        type: "p",
        text:
          "但呼吸不能一直加速。太早把和弦换得太密，后面的终止就没有空间；太慢则会让段落失去方向。好的和声节奏是在“稳定—加速—落地”之间分配时间。",
        cites: [cite("laitz", "Chapter 9 The Pre-Dominant Function and the Phrase Model")],
      },
      {
        type: "callout",
        title: "编曲提示",
        text: "先数每小节几个和弦，再决定 voicing 的密度；快速和声节奏配简单 voicing，慢速才展开延伸音。",
      },
    ],
  },
  "harmonic-color": {
    title: "白话解释：色彩不是形容词，是张力位置",
    blocks: [
      {
        type: "p",
        text:
          "说一个和弦“暖、暗、亮、紧张”很容易变成玄学。更可靠的做法是问：它比三和弦多了哪个音？这个音和和弦三音/根音形成什么音程？它要求解决，还是可以停留？",
        cites: [
          cite("levine", "Chapter 3 Chord/Scale Theory（“避免”音与变化属七）"),
          cite("laitz", "Chapter 1C Musical Distance: Intervals（Consonant and Dissonant Intervals）"),
        ],
      },
      {
        type: "p",
        text:
          "同一个 Cmaj7，在 C 大调是“家”，在 F 大调是 V 级延伸，在 G 大调是 IV 级；音高一样，功能位置不同，听感就不同。所以色彩分析必须同时说“音程内容”和“功能语境”。",
        cites: [cite("sposobin", "第四十六章 属和声组的变和弦")],
      },
      {
        type: "callout",
        title: "分析顺序",
        text: "先标功能，再听张力，最后才用形容词。只写“很爵士”不是分析。",
      },
    ],
  },
  "modal-mixture-color": {
    title: "白话解释：主音不变，灯光变暗",
    blocks: [
      {
        type: "p",
        text:
          "同主音交替像在同一个房间里换灯光：主音 C 没变，但你把平行小调的 Fm、Ab、Eb 借了进来。听者仍知道“家”是 C，只是墙面的颜色变暗了。",
        cites: [
          cite("laitz", "Chapter 21 Modal Mixture"),
          cite("sposobin", "第四十九章 交替大小调体系"),
        ],
      },
      {
        type: "p",
        text:
          "借用和转调的区别不在变化音，而在“家有没有搬”。借用之后通常回到 C；如果新调建立了自己的属—主与终止，才是转调。",
        cites: [
          cite("sposobin", "第五十章 交替大小调的降Ⅵ级三和弦（tsⅥ）"),
          cite("laitz", "Chapter 21 Modal Mixture"),
        ],
      },
      {
        type: "callout",
        title: "听觉抓手",
        text: "听到 bVI 或 iv 时先问：低音还在 C 吗？后面有没有回到 C？如果都成立，更像借用而不是转调。",
      },
    ],
  },
  "tonal-distance": {
    title: "白话解释：调性距离像城市之间的距离",
    blocks: [
      {
        type: "p",
        text:
          "近关系调像隔壁城市：共享很多和弦，坐一趟车（枢轴和弦）就能到。远关系调像跨省：共同和弦少，需要换乘（半音中介、等音或模进），还要花时间确认“真的到了”。",
        cites: [
          cite("sposobin", "第三十一章 调性关系的类型"),
          cite("sposobin", "第五十一章 调性关系的等级、相差两个调号的转调"),
        ],
      },
      {
        type: "p",
        text:
          "调号差距只是地图上的直线距离；真正的“远”还取决于共同和弦、主音关系与终止确认。关系大小调调号相同，但主音不同；同主音大小调主音相同，却差三个调号。",
        cites: [cite("laitz", "Chapter 18 Modulation")],
      },
      {
        type: "callout",
        title: "转调检查",
        text: "新调有没有自己的属—主？有没有终止？旧调还能不能解释后面的和弦？三个问题决定“到了没有”。",
      },
    ],
  },
  "bass-line": {
    title: "白话解释：低音是地铁线路",
    blocks: [
      {
        type: "p",
        text:
          "把低音想成地铁线：级进下行是一条慢线，每站都能停；五度循环是一条快线，方向最明确；持续音是环线，原地转；半音线是支线，常通往转调或色彩站。",
        cites: [
          cite("laitz", "Chapter 13 The Submediant and the Step-Descent Bass"),
          cite("sposobin", "第四十八章 持续音"),
        ],
      },
      {
        type: "p",
        text:
          "和弦选择常由低音决定：C/E 和 C 的差别不只是低音，它改变了稳定性与下一步的连接。先写低音线，再填和弦，声部会更自然。",
        cites: [cite("sposobin", "第三章 原位三和弦的连接")],
      },
      {
        type: "callout",
        title: "练习",
        text: "用单音弹 C–B–A–G–F–E–D–G–C，再在每个低音上试原位、转位、七和弦；听哪种最能保持线的连续。",
      },
    ],
  },
  "phrase-structure": {
    title: "白话解释：乐段像一问一答",
    blocks: [
      {
        type: "p",
        text:
          "前句提出一个问题，后句给出回答。前句常停在半终止（未完），后句用完全终止（完成）。所以乐段的关键不是“四小节”，而是“问句和答句的终止关系”。",
        cites: [
          cite("laitz", "Chapter 15 Periods"),
          cite("sposobin", "第八章 终止、乐段、乐句"),
        ],
      },
      {
        type: "p",
        text:
          "句法分析先找终止，再划分前后句；不要从第一小节开始数四小节。终止是标点，动机是词语，低音与和声节奏是语气。",
        cites: [cite("laitz", "Chapter 16 Sentences, Double Periods, and Asymmetric Periods")],
      },
      {
        type: "callout",
        title: "一句话",
        text: "乐段不是长度单位，是“出发—偏离—回归”的完整动作。",
      },
    ],
  },
  "voice-leading": {
    title: "白话解释：四个声部像四个人一起走路",
    blocks: [
      {
        type: "p",
        text:
          "四部和声不是把四个音堆在一起，而是让四个声部各走一条线。共同音尽量保持，其余声部就近级进；外声部多用反向进行，内声部填补空隙。听感是否平滑，取决于每一对相邻声部的距离与方向，而不是和弦符号是否漂亮。",
        cites: [
          cite("laitz", "Chapter 5 Tonic, Dominant, and Voice Leading"),
          cite("sposobin", "第三章 原位三和弦的连接"),
        ],
      },
      {
        type: "p",
        text:
          "平行五度、平行八度之所以被限制，是因为两个声部完全同向同距时，听觉上会短暂“合并成一个声部”，独立线条消失。隐伏五八在终止等重要位置也要避免，因为外声部的目标会被提前听见。",
        cites: [
          cite("laitz", "Chapter 5 Tonic, Dominant, and Voice Leading"),
          cite("sposobin", "第一章 大三和弦与小三和弦、四部和声"),
        ],
      },
      {
        type: "callout",
        title: "检查顺序",
        text: "先看低音方向，再找共同音，然后处理三音与七音，最后检查平行五八、声部超越与间距。顺序反了，就会只顾和弦标签而忽略线条。",
      },
    ],
  },
  cadences: {
    title: "白话解释：终止就是音乐的标点符号",
    blocks: [
      {
        type: "p",
        text:
          "完全终止像句号：V–I 都在原位，旋律落在主音上，听者明确知道“到站了”。半终止像逗号：停在 V，话还没说完。阻碍终止像剧情反转：V 本来要去 I，却拐到 vi，把段落延长。",
        cites: [
          cite("laitz", "Chapter 9 The Pre-Dominant Function and the Phrase Model"),
          cite("sposobin", "第八章 终止、乐段、乐句"),
        ],
      },
      {
        type: "p",
        text:
          "判断终止不要只看最后一个和弦。先听低音是否完成 V–I，再听旋律是否落在主音或三音；同样结束在 I，旋律落主音是完全终止，落三音则是不完全终止。半终止后如果继续发展，它只是分句，不是全曲的结束。",
        cites: [cite("laitz", "Chapter 15 Periods")],
      },
      {
        type: "callout",
        title: "听辨抓手",
        text: "闭眼听低音：V–I 是“关门”，停在 V 是“门开着”，V–vi 是“走错房间”。先定性，再数和弦。",
      },
    ],
  },
  predominant: {
    title: "白话解释：下属是离开家之前的那口气",
    blocks: [
      {
        type: "p",
        text:
          "主和弦是家，属和弦是门口，下属功能负责让你先离开沙发。ii 与 IV 都把音乐从主功能推开，为 V 制造期待；ii–V 之所以常见，是因为低声部五度下行最顺，声部也能用共同音与级进连接。",
        cites: [
          cite("laitz", "Chapter 9 The Pre-Dominant Function and the Phrase Model"),
          cite("sposobin", "第十七章 大调与和声小调的完全功能体系、自然音体系"),
        ],
      },
      {
        type: "p",
        text:
          "IV 保留主音，听感更像“同一片土地上的离开”；ii 引入上主音与下属音，离开得更远。ii7 再添一个小七度，解决到 V7 时七音下行、三音保持，推动力更强。需要更暗的颜色时，可用同主音小调的 iv。",
        cites: [
          cite("sposobin", "第二十一章 下属七和弦（SⅡ7）"),
          cite("laitz", "Chapter 21 Modal Mixture"),
        ],
      },
      {
        type: "callout",
        title: "选择顺序",
        text: "要强推动用 ii7；要合唱式、保留主音用 IV；要突然变暗用 iv。选完再检查和弦七音是否妥善解决。",
      },
    ],
  },
  "secondary-dominants": {
    title: "白话解释：给某个和弦临时“升格”",
    blocks: [
      {
        type: "p",
        text:
          "在 C 大调里，A7 出现在 Dm 前面，那个 C# 并不是转调到 D 小调，而是把 Dm 临时当成主音，给它配了一个自己的属。副属和弦的音往往带临时升降号，但它的任务只是把目标和弦“扶正”一小节。",
        cites: [
          cite("laitz", "Chapter 17 Applied Chords"),
          cite("sposobin", "第二十八章 终止中的重属和弦"),
        ],
      },
      {
        type: "p",
        text:
          "识别方法很直接：副属和弦的根音，是目标和弦根音上方五度；它的三音是目标和弦的导音，通常半音上行解决。V/V 解决到 V，V/ii 解决到 ii，V/vi 解决到 vi。连续使用会形成副属链，但每一环都要有明确目标。",
        cites: [
          cite("sposobin", "第二十九章 结构内的重属和弦"),
          cite("sposobin", "第三十章 重属和弦中的变音"),
        ],
      },
      {
        type: "callout",
        title: "写法提醒",
        text: "分析时写 V/ii，不要写成 II7；后者会让人误以为它是调内的二级和弦。副属的关键信息是“它属于谁”。",
      },
    ],
  },
  modulation: {
    title: "白话解释：转调是搬家，不只是出门",
    blocks: [
      {
        type: "p",
        text:
          "从 C 大调去 G 大调，Am7 可以当枢轴：在 C 里它是 vi7，在 G 里它是 ii7。同一个和弦有两套身份，音乐借它完成视角切换，随后 D7–G 的终止确认新家。枢轴本身不是转调，它只是两套功能解释的交汇点。",
        cites: [
          cite("laitz", "Chapter 18 Modulation"),
          cite("sposobin", "第三十四章 转调"),
        ],
      },
      {
        type: "p",
        text:
          "确认转调要看三件事：新调有没有自己的属和弦，有没有解决到新主音，后面有没有新调的终止。调号变化只是线索，不是证据；很多转调在调号出现之前就已经靠临时升降号完成了。",
        cites: [
          cite("sposobin", "第三十五章 到一级关系调的转调"),
          cite("sposobin", "第五十一章 调性关系的等级、相差两个调号的转调"),
        ],
      },
      {
        type: "callout",
        title: "离调与转调",
        text: "副属解决后马上回到原调，是离调；新调获得属—主与终止，并持续足够长，才是转调。分界不在变化音，而在“家有没有搬”。",
      },
    ],
  },
  "borrowed-chords": {
    title: "白话解释：同一个主音，换一套灯光",
    blocks: [
      {
        type: "p",
        text:
          "同主音交替不改变主音，只从平行小调借和弦：C 大调可以借来 Ab（bVI）、Eb（bIII）、Bb（bVII）与 Fm（iv）。听者仍然知道家在 C，但墙面的颜色变暗了。这种“主音不变、调式变色”的效果，就是借用和弦的核心。",
        cites: [
          cite("laitz", "Chapter 21 Modal Mixture"),
          cite("sposobin", "第四十九章 交替大小调体系"),
        ],
      },
      {
        type: "p",
        text:
          "借用和弦常出现在下属位置：bVI 可以走向 V，iv 可以形成变暗的变格终止，bVII 在流行与摇滚里常作为“后门”回到 I。判断借用还是转调，要问低音是否仍围绕原主音，以及后面有没有新调的终止。",
        cites: [
          cite("sposobin", "第五十章 交替大小调的降Ⅵ级三和弦（tsⅥ）"),
          cite("laitz", "Chapter 22 Chromatic Modulation and Text-Music Relations"),
        ],
      },
      {
        type: "callout",
        title: "听觉抓手",
        text: "听到 bVI 或 iv 时先别急着说转调：低音还在 C 吗？后面有没有回到 C 或 G7？如果都成立，更像借用。",
      },
    ],
  },
  "neapolitan-aug6": {
    title: "白话解释：两个吓人的名字，其实都在加强下属",
    blocks: [
      {
        type: "p",
        text:
          "那不勒斯六和弦就是降二级大三和弦的第一转位，在 C 大调写作 Db/F。低音是降二级，上方有 F 与 Ab，听感像“下属功能被压暗了一层”。它通常走向 V，是比 iv 更强烈的下属替代。",
        cites: [
          cite("laitz", "Chapter 23 Neapolitan Chords"),
          cite("sposobin", "第五十三章 经过交替大小调的降Ⅵ级三和弦（tsⅥ）以及经过那不勒斯和弦的转调"),
        ],
      },
      {
        type: "p",
        text:
          "增六和弦的名字来自一个音程：低音与上方某音构成增六度，两个音向外扩张到八度。意大利、法国、德国增六和弦的区别在于中间加了哪些音；它们都强烈指向属和弦，常出现在终止前。",
        cites: [cite("laitz", "Chapter 24 Augmented-Sixth Chords")],
      },
      {
        type: "callout",
        title: "不要混淆",
        text: "那不勒斯六和弦是一个三和弦的转位，增六和弦的核心是那个增六度音程。前者看低音 b2，后者看两个外音向外解决。",
      },
    ],
  },
  "ii-v-i": {
    title: "白话解释：爵士的“句号”是怎么写出来的",
    blocks: [
      {
        type: "p",
        text:
          "ii7–V7–Imaj7 把功能和声的 T–PD–D–T 压缩成三个和弦：Dm7 离开家，G7 制造张力，Cmaj7 落地。低音连续五度下行，三音与七音则半音级进，所以它既稳定又有方向。",
        cites: [
          cite("levine", "Chapter 2 Major Scale and Progressions（Ⅱ-Ⅴ-Ⅰ进行）"),
          cite("laitz", "Chapter 9 The Pre-Dominant Function and the Phrase Model"),
        ],
      },
      {
        type: "p",
        text:
          "小调 ii–V–i 把 ii 换成半减七，V 换成变化属七，解决到小主和弦。b9 与变化音让张力更大，但三音与七音的骨架仍然决定走向。很多标准曲的调性转换，都是把同一组 ii–V 搬到不同主音上。",
        cites: [cite("levine", "Chapter 3 Chord/Scale Theory（变化属七和弦）")],
      },
      {
        type: "callout",
        title: "练习顺序",
        text: "先只弹两条 guide tones，再加根音，最后才加延伸音。骨架不稳时堆九音十三音，只会听成一片颜色。",
      },
    ],
  },
  "guide-tones": {
    title: "白话解释：耳朵只需要抓住两条线",
    blocks: [
      {
        type: "p",
        text:
          "三音决定和弦是大是小，七音决定它是大七、属七还是小七。ii–V–I 里，Dm7 的 F 与 C 分别走到 G7 的 F 与 B，再走到 Cmaj7 的 E 与 B；两条线几乎都是半音或保持，所以听感自然。",
        cites: [
          cite("levine", "Chapter 2 Major Scale and Progressions（声部进行）"),
          cite("laitz", "Chapter 5 Tonic, Dominant, and Voice Leading"),
        ],
      },
      {
        type: "p",
        text:
          "guide tones 也是重配和声的检查工具：三全音替代之所以成立，是因为它保留了同一个三全音；rootless voicing 之所以好听，是因为它把三音与七音放在最容易听见的位置。先写两条线，再决定和弦叫什么。",
        cites: [cite("levine", "Chapter 13 Basic Reharmonization")],
      },
      {
        type: "callout",
        title: "每天五分钟",
        text: "在所有十二个调上，只弹 ii–V–I 的三音与七音，不加根音。能连续走完，再谈 voicing。",
      },
    ],
  },
  "chord-scale": {
    title: "白话解释：音阶是地图，不是许可证",
    blocks: [
      {
        type: "p",
        text:
          "和弦—音阶理论给每个和弦配一条音阶：Dm7 用 Dorian，G7 用 Mixolydian，Cmaj7 用 Ionian。三条音阶可能共享同一组白键，但主音不同，重力方向就不同；即兴时真正决定落点的仍是大三音、小七音这些和弦音。",
        cites: [cite("levine", "Chapter 3 Chord/Scale Theory（为什么是音阶?）")],
      },
      {
        type: "p",
        text:
          "所谓“避免音”不是禁止弹，而是它与和弦三音形成小九度，听感容易卡住，需要尽快解决。Cmaj7 上的自然 11、G7 上的自然 4 都属于这种情况。变化属七则用变化音阶，把 b9、#9、b5、#5 变成有方向的张力。",
        cites: [
          cite("levine", "Chapter 3 Chord/Scale Theory（“避免”音）"),
          cite("levine", "Chapter 3 Chord/Scale Theory（变化属七和弦）"),
        ],
      },
      {
        type: "callout",
        title: "选择顺序",
        text: "先看和弦质量与功能，再选音阶，最后用目标音检查。不要从一条音阶反推它该配什么和弦。",
      },
    ],
  },
  "extensions-alterations": {
    title: "白话解释：加延伸音是加颜色，不是加音量",
    blocks: [
      {
        type: "p",
        text:
          "九、十一、十三是在七和弦之上继续叠三度，它们改变颜色，不改变功能。Cmaj9 比 Cmaj7 多一个 D，Cmaj7#11 多一个 F#；根音与三音仍然是“这是 C 大和弦”的证据。延伸音越多，越需要声部之间留出空间。",
        cites: [
          cite("levine", "Chapter 3 Chord/Scale Theory（大调音阶和声）"),
          cite("laitz", "Chapter 30 Centricity, Extended and Non-Tertian Sonorities, and Collections"),
        ],
      },
      {
        type: "p",
        text:
          "变化属七同时改变五音与九音：b9、#9、b5、#5。它们让解决压力更大，常用于小调 ii–V–i 或终止前。选择哪一种变化音，要看旋律里出现了什么音，以及它是否能让目标音被更清楚地听见。",
        cites: [cite("levine", "Chapter 3 Chord/Scale Theory（变化属七和弦）")],
      },
      {
        type: "callout",
        title: "配器提醒",
        text: "钢琴上同时弹三音、七音和两三个延伸音很容易糊成一片。保留三音、七音与一个色彩音，其余交给贝斯或旋律。",
      },
    ],
  },
  "tritone-substitution": {
    title: "白话解释：同一个三全音，换一个低音方向",
    blocks: [
      {
        type: "p",
        text:
          "G7 的三音 B 与七音 F 构成三全音；Db7 的三音 F 与七音 Cb（等音 B）构成同一个三全音。所以 Db7 可以替代 G7，属功能与解决目标不变，变的只是低音：原本 G 上行到 C，现在 Db 下行到 C。",
        cites: [cite("levine", "Chapter 13 Basic Reharmonization（三全音替代）")],
      },
      {
        type: "p",
        text:
          "替代后 ii–V–I 可以写成 ii–bII7–I，低音形成 D–Db–C 的半音下行。替代属常配 Lydian dominant（在 Db 上是 Db Mixolydian #11），因为它保留了三全音又避免自然四与三音的冲突。",
        cites: [cite("levine", "Chapter 13 Basic Reharmonization")],
      },
      {
        type: "callout",
        title: "使用前提",
        text: "先看旋律有没有原属和弦的根音 G。如果旋律正停在 G 上，Db7 会与它形成冲突；这时替代要谨慎，或把 G 当作经过音处理。",
      },
    ],
  },
  "rhythm-changes": {
    title: "白话解释：32 小节是一张可复用的城市地图",
    blocks: [
      {
        type: "p",
        text:
          "Rhythm Changes 把 32 小节分成四个八小节：A–A–B–A。A 段的核心是 I–vi–ii–V，B 段常围绕属和弦循环或五度模进。曲式像地图，和弦可以替换，但街道的走向不能乱。",
        cites: [cite("levine", "Chapter 11 Rhythm Changes")],
      },
      {
        type: "p",
        text:
          "即兴时最容易在 B 段迷路，因为那里的和声移动更密。练习时先把 A 段与 B 段分开循环，记住每段的目标和弦，再把两段接起来；不要一开始就从头到尾硬背。",
        cites: [cite("levine", "Chapter 11 Rhythm Changes")],
      },
      {
        type: "callout",
        title: "练习顺序",
        text: "A 段只弹和弦与 guide tones，B 段只弹根音走向，最后合起来。先有地图，再谈装饰。",
      },
    ],
  },
  blues: {
    title: "白话解释：十二小节是一种语言，不是填空题",
    blocks: [
      {
        type: "p",
        text:
          "十二小节布鲁斯的 I、IV、V 常全部用属七，因为 b7 在这里是风格色彩，不是功能错误。蓝调音 b3、b5、b7 又常与大调的三音、五音并存，形成“同一时间大小三度都在”的张力。",
        cites: [cite("levine", "Chapter 10 Blues")],
      },
      {
        type: "p",
        text:
          "十二小节更像一问一答的语法：前四小节提出问题，中间四小节回应，最后四小节收束。即兴时先唱一句，再在琴上重复它的节奏与落点；只跑布鲁斯音阶，听起来会像练习而不是说话。",
        cites: [cite("levine", "Chapter 10 Blues")],
      },
      {
        type: "callout",
        title: "即兴提示",
        text: "先决定这一句在第几小节结束、落在哪个和弦音，再选择音阶。句子有目标，蓝调音才不会变成装饰。",
      },
    ],
  },
  "modal-harmony": {
    title: "白话解释：不赶路，也能有方向",
    blocks: [
      {
        type: "p",
        text:
          "调式化和声不急着解决。它常在一个低音或少数和弦上停留，让听者关注音程颜色、旋律动机与节奏，而不是 V–I 的方向。方向来自旋律的呼吸与低音的持续，而不是和弦的连锁。",
        cites: [cite("levine", "Chapter 2 Major Scale and Progressions（调式爵士）")],
      },
      {
        type: "p",
        text:
          "《So What》用 Dm7 与 Ebm7 的平行移动：两个小七和弦结构相同，根音相差半音，低音与和弦一起上移。没有属—主终止，但半音移动本身制造了“换景”的效果。",
        cites: [cite("levine", "Chapter 2 Major Scale and Progressions（调式爵士）")],
      },
      {
        type: "callout",
        title: "写作抓手",
        text: "先定主音与音阶，再选能突出特征音的和弦配置：Dorian 的自然 6、Lydian 的 #4、Mixolydian 的 b7。把特征音放在能被听见的声部。",
      },
    ],
  },
  "bebop-scale": {
    title: "白话解释：为了让八分音符落在正确的拍子上",
    blocks: [
      {
        type: "p",
        text:
          "比波普音阶是在七声音阶里加一个半音经过音，让八分音符的强拍自然落在和弦音上。属七的比波普音阶在 b7 与主音之间加自然七，大调的比波普音阶在 5 与 6 之间加 #5。它首先是一条节奏工具，其次才是音高材料。",
        cites: [cite("levine", "Chapter 7 Bebop Scales")],
      },
      {
        type: "p",
        text:
          "经过音要放在弱拍，否则会把强拍的和弦音挤走。练习时先把重音放在 1、3 拍的和弦音上，再让经过音从指间滑过；先慢后快，听的是落点，不是音阶跑动。",
        cites: [cite("levine", "Chapter 7 Bebop Scales")],
      },
      {
        type: "callout",
        title: "常见错误",
        text: "从音阶第一音开始平均地跑，听起来像练习曲。先设计和弦音的节奏位置，再填经过音。",
      },
    ],
  },
  "coltrane-changes": {
    title: "白话解释：把 ii–V–I 拆成三个调",
    blocks: [
      {
        type: "p",
        text:
          "Coltrane changes 把八度分成三个大三度：B–G–Eb。每个主音都配一组 ii–V，于是和声在三个调之间循环。《Giant Steps》的难点不是和弦多，而是要在快速移动中保持目标音。",
        cites: [cite("levine", "Chapter 15 Coltrane Changes")],
      },
      {
        type: "p",
        text:
          "练习时先只追踪三个主音，再在每个主音上弹 ii–V，最后才加延伸音。guide tones 在大三度循环里会不断改变方向，所以要先听清“现在在哪个调”，再谈音阶。",
        cites: [cite("levine", "Chapter 15 Coltrane Changes")],
      },
      {
        type: "callout",
        title: "练习顺序",
        text: "主音 → ii–V 骨架 → guide tones → 音阶。跳过前三步直接跑音阶，最容易在循环里迷路。",
      },
    ],
  },
  "rootless-voicings": {
    title: "白话解释：贝斯已经给了根音，钢琴不必重复",
    blocks: [
      {
        type: "p",
        text:
          "无根音 voicing 把三音、七音、九音、十三音放在左手或双手的中间音域，让贝斯负责根音。这样和弦更轻、更清晰，也不会与低音打架。常见两种手型：3–7–9–13 与 7–9–3–13，在 ii–V–I 中只需小幅移动。",
        cites: [
          cite("levine", "Chapter 2 Major Scale and Progressions（声部进行）"),
          cite("levine", "Chapter 13 Basic Reharmonization"),
        ],
      },
      {
        type: "p",
        text:
          "连接时优先保留共同音，其余声部级进。Dm7 到 G7 时，F 与 C 可以保持或半音移动；G7 到 Cmaj7 时，B 与 F 解决到 B 与 E。根音缺席时，三音与七音必须清楚，否则和弦质量会听不出来。",
        cites: [cite("levine", "Chapter 2 Major Scale and Progressions（声部进行）")],
      },
      {
        type: "callout",
        title: "没有贝斯时",
        text: "独奏或没有贝斯时，可以偶尔在低音补根音，但不要每个和弦都砸根音，否则又回到块状和弦。",
      },
    ],
  },
  "pentatonic-outside": {
    title: "白话解释：“出去”要有回来的路",
    blocks: [
      {
        type: "p",
        text:
          "Outside playing 常用移位的五声音阶或音阶片段，制造暂时脱离当前和弦的张力。关键不在“用了怪音”，而在张力之后能否回到目标和弦音；没有解决的“外面”，只是错误。",
        cites: [
          cite("levine", "Chapter 8 Playing Outside"),
          cite("levine", "Chapter 9 Pentatonic Scales"),
        ],
      },
      {
        type: "p",
        text:
          "常见做法是把五声音阶上移或下移半音，或在属七上使用相距三全音的五声音阶。重复一个节奏动机能让“外面”听起来像刻意设计，而不是手滑；随后在下一小节落回和弦音。",
        cites: [cite("levine", "Chapter 8 Playing Outside")],
      },
      {
        type: "callout",
        title: "练习",
        text: "先在小节末制造一个不协和音，再在下一小节第一拍解决到三音或七音。每次只出去两拍，确保回来的路清楚。",
      },
    ],
  },
  "pitch-staff": {
    title: "白话解释：五线谱是坐标，不是图画",
    blocks: [
      {
        type: "p",
        text:
          "五线谱先给音高一个纵向坐标：线与间的位置决定音名，谱号决定这套坐标从哪个音开始读。加线不是装饰，而是坐标向上下延伸；同一个音换谱号后位置会变，但音高不变。",
        cites: [
          cite("laitz", "Chapter 1A Musical Space: Pitches, Scales, and Keys"),
          cite("sposobin", "第一章 大三和弦与小三和弦、四部和声"),
        ],
      },
      {
        type: "p",
        text:
          "读谱时不要逐线数。先记三个锚点：高音谱号第二线是 G，低音谱号第四线是 F，中央 C 在高音谱号下加一线、低音谱号上加一线。其余音按线与间的顺序推算，速度会快很多。",
        cites: [cite("laitz", "Chapter 1A Musical Space: Pitches, Scales, and Keys")],
      },
      {
        type: "callout",
        title: "练习",
        text: "任选一个音，写出它在高音谱号与低音谱号中的位置；再用钢琴找到它，确认眼睛与耳朵指的是同一个音。",
      },
    ],
  },
  intervals: {
    title: "白话解释：音程同时看“度数”和“半音数”",
    blocks: [
      {
        type: "p",
        text:
          "度数只数字母：C 到 E 是三度，C 到 F 是四度。半音数决定性质：大三度四个半音，小三度三个半音。只数半音会把增二度与小三度混为一谈，只数度数又分不出大小，所以两者必须一起看。",
        cites: [
          cite("laitz", "Chapter 1C Musical Distance: Intervals"),
          cite("levine", "Chapter 1 Basic Theory"),
        ],
      },
      {
        type: "p",
        text:
          "协和与不协和不是固定标签。三全音在属七里是张力核心，在布鲁斯里却可以当色彩；同一个音程放在不同和弦、不同声部位置，听感会变。判断音程时要同时问：它在什么语境里、下一步往哪里解决。",
        cites: [cite("laitz", "Chapter 1C Musical Distance: Intervals")],
      },
      {
        type: "callout",
        title: "转位口诀",
        text: "度数相加为九，大小互换、增减互换；纯音程转位后仍是纯音程。先用口诀算，再用耳朵确认。",
      },
    ],
  },
  "major-scale": {
    title: "白话解释：大调是一条有固定台阶的楼梯",
    blocks: [
      {
        type: "p",
        text:
          "大调音阶的全半音排列是“全全半全全全半”。这个结构固定后，你从任何一个音出发都能搭出同一条楼梯；调号只是把这条楼梯固定到某个主音上，避免每次写升降号。",
        cites: [
          cite("laitz", "Chapter 1A Musical Space: Pitches, Scales, and Keys"),
          cite("levine", "Chapter 2 Major Scale and Progressions"),
        ],
      },
      {
        type: "p",
        text:
          "主音不是“第一个音”这么简单，它是听感的重力中心。大调的导音（第七级）向上强烈倾向主音，属和弦又围绕这个倾向工作；所以音阶结构与功能和声是同一件事的两面。",
        cites: [cite("laitz", "Chapter 1A Musical Space: Pitches, Scales, and Keys")],
      },
      {
        type: "callout",
        title: "练习",
        text: "不要只背十二个调号。先在 C 大调唱出全半音结构，再把同一结构搬到 G、F、D，听主音与导音的位置是否改变。",
      },
    ],
  },
  "minor-scales": {
    title: "白话解释：小调不是“悲伤的大调”",
    blocks: [
      {
        type: "p",
        text:
          "自然小调的结构是“全半全全半全全”，它没有上方导音，所以属和弦不够有拉力。和声小调把第七级升高，制造导音；旋律小调再在上行时升高第六级，避免增二度，下行时又常回到自然小调。",
        cites: [
          cite("laitz", "Chapter 1A Musical Space: Pitches, Scales, and Keys"),
          cite("sposobin", "第十七章 大调与和声小调的完全功能体系、自然音体系"),
        ],
      },
      {
        type: "p",
        text:
          "三种小调不是三首不同的曲子，而是同一主音上的不同音高选择。和声小调的升七级让 V7–i 成立；旋律小调的升六级让旋律更平滑。分析时要说清当前用的是哪一种，而不是笼统写“小调”。",
        cites: [cite("sposobin", "第十七章 大调与和声小调的完全功能体系、自然音体系")],
      },
      {
        type: "callout",
        title: "听觉抓手",
        text: "先听第六级与第七级：自然小调两者都低，和声小调第七级高，旋律小调上行时第六、七级都高。",
      },
    ],
  },
  modes: {
    title: "白话解释：调式是同一组音的不同“重力中心”",
    blocks: [
      {
        type: "p",
        text:
          "把 C 大调的七个音分别当作主音，就得到七条调式。音高集合相同，但主音不同，因而半音位置与稳定音不同：Dorian 的第六级明亮，Lydian 的第四级升高，Mixolydian 的第七级降低。",
        cites: [
          cite("levine", "Chapter 2 Major Scale and Progressions（调式）"),
          cite("laitz", "Chapter 1A Musical Space: Pitches, Scales, and Keys"),
        ],
      },
      {
        type: "p",
        text:
          "调式不是“从音阶不同位置开始弹”这么简单。真正决定调式的是低音与和声围绕哪个音建立中心；没有主音支撑，同一组音很容易听回大调或小调。",
        cites: [cite("levine", "Chapter 2 Major Scale and Progressions（调式）")],
      },
      {
        type: "callout",
        title: "明暗顺序",
        text: "从最亮到最暗大致是 Lydian–Ionian–Mixolydian–Dorian–Aeolian–Phrygian–Locrian；先听特征音，再记名字。",
      },
    ],
  },
  "circle-of-fifths": {
    title: "白话解释：五度圈是调性距离的地图",
    blocks: [
      {
        type: "p",
        text:
          "五度圈把十二个调按纯五度排列：顺时针每次加一个升号，逆时针每次加一个降号。相邻调只差一个调号，共同和弦多，最容易转调；隔得越远，共同和弦越少。",
        cites: [
          cite("levine", "Chapter 2 Major Scale and Progressions（五度圈）"),
          cite("laitz", "Chapter 1A Musical Space: Pitches, Scales, and Keys"),
        ],
      },
      {
        type: "p",
        text:
          "它不只是墙上的海报。ii–V–I 的根音运动、副属和弦的目标、三全音替代的对称关系，都能在圈上读出来。分析进行时，先看根音在圈上走几步，再谈功能和色彩。",
        cites: [cite("levine", "Chapter 2 Major Scale and Progressions（五度圈）")],
      },
      {
        type: "callout",
        title: "练习",
        text: "任选一个调，顺时针说出它的属调，逆时针说出它的下属调；再找它关系小调的位置。用耳朵确认主音距离。",
      },
    ],
  },
  triads: {
    title: "白话解释：三和弦是“根音 + 两个性格音”",
    blocks: [
      {
        type: "p",
        text:
          "三和弦由根音、三音、五音叠成。三音决定大小性质，五音决定稳定与张力；根音给身份，低音给位置。转位只改变低音，不改变根音，所以 C/E 仍然是 C 和弦，只是站的位置不同。",
        cites: [
          cite("laitz", "Chapter 3 Triads, Seventh Chords, and Texture"),
          cite("sposobin", "第一章 大三和弦与小三和弦、四部和声"),
        ],
      },
      {
        type: "p",
        text:
          "判断和弦不要只看三个音的名字。先找根音，再看三音与五音的音程，最后看低音是不是转位。斜线和弦则把低音进一步独立出来：上方三和弦决定颜色，低音决定功能位置。",
        cites: [
          cite("sposobin", "第三章 原位三和弦的连接"),
          cite("levine", "Chapter 5 Slash Chords"),
        ],
      },
      {
        type: "callout",
        title: "常见错误",
        text: "把转位当成换和弦，或把斜线和弦当成新根音。先问“根音是谁”，再问“低音是谁”。",
      },
    ],
  },
  "seventh-chords": {
    title: "白话解释：七音让和弦从“颜色”变成“方向”",
    blocks: [
      {
        type: "p",
        text:
          "在 triad 上再叠一个七度就得到七和弦。七音不只是加厚：它引入新的不协和与解决方向。属七的三音与七音构成三全音，直接指向主和弦；大七与小七则更多是色彩与稳定性的区别。",
        cites: [
          cite("laitz", "Chapter 3 Triads, Seventh Chords, and Texture"),
          cite("sposobin", "第十四章 原位属七和弦（D7）"),
        ],
      },
      {
        type: "p",
        text:
          "七和弦的转位由低音决定，数字标记（7、6/5、4/3、4/2）告诉你七音在第几声部。分析时先认根音与质量，再看低音与七音位置；不要只背数字。",
        cites: [cite("sposobin", "第十五章 属七和弦的转位")],
      },
      {
        type: "callout",
        title: "听觉抓手",
        text: "先听三音与七音：它们决定和弦是属七、大七还是小七。根音可以交给贝斯，三音七音必须清楚。",
      },
    ],
  },
  "roman-numerals": {
    title: "白话解释：级数标记的是功能，不是和弦绰号",
    blocks: [
      {
        type: "p",
        text:
          "罗马数字表示和弦根音在调内的级数，大小写表示质量：I 是大三，ii 是小三，vi 是小三，vii° 是减三。它把具体音名翻译成功能位置，所以同一进行可以在十二个调里复用。",
        cites: [
          cite("laitz", "Chapter 5 Tonic, Dominant, and Voice Leading"),
          cite("sposobin", "第二章 正三和弦的功能体系"),
        ],
      },
      {
        type: "p",
        text:
          "转位用数字标记：6 表示第一转位，6/4 表示第二转位，7 与 6/5、4/3、4/2 表示七和弦及其转位。级数分析还要说明调性；离开调性谈 V–I 没有意义。",
        cites: [cite("laitz", "Chapter 3 Triads, Seventh Chords, and Texture")],
      },
      {
        type: "callout",
        title: "不要混淆",
        text: "罗马数字是相对功能，和弦符号（C、G7、Dm7）是绝对音高。分析时先写级数，再写具体和弦，两个层次不要混在一行。",
      },
    ],
  },
  "modal-characteristics": {
    title: "白话解释：调式不是“从不同音开始弹大调”",
    blocks: [
      {
        type: "p",
        text:
          "把 C 大调从 D 开始弹，确实能得到 D Dorian 的音高集合，但听者听到的仍可能是 C 大调。真正让 Dorian 成立的，是低音与和声围绕 D 建立中心，并且不断出现它的大六 B。没有特征音，调式就只剩下音阶指法。",
        cites: [
          cite("levine", "Chapter 2 Major Scale and Progressions（调式）"),
          cite("laitz", "Chapter 1A Musical Space: Pitches, Scales, and Keys"),
        ],
      },
      {
        type: "p",
        text:
          "判断调式按五步走：主音是谁、三音是大是小、特征音是哪一个、哪个和弦包含特征音、最后是否靠 V–I 收束。Dorian 的 IV 大、Phrygian 的 bII 大、Lydian 的 II 大，都是“含特征音的终止和弦”，它们不靠导音，而靠颜色回到主音。",
        cites: [
          cite("laitz", "Chapter 30 Centricity, Extended and Non-Tertian Sonorities, and Collections"),
          cite("sposobin", "第二十七章 俄罗斯音乐中的自然调式"),
        ],
      },
      {
        type: "callout",
        title: "听觉练习",
        text: "同一主音先弹自然大调，再弹 Lydian，只改四音；再弹 Mixolydian，只改七音。每次只改一个音，耳朵才会记住“特征音”到底改变了什么。",
      },
    ],
  },
  "modal-interchange": {
    title: "白话解释：同一个主音，七种灯光",
    blocks: [
      {
        type: "p",
        text:
          "调式互换是把同主音的其他调式当成“颜色库”：C 大调可以从 C Dorian 借 IV 大，从 C Phrygian 借 bII，从 C Lydian 借 II 大，从 C Mixolydian 借 bVII。主音仍是 C，听者不会觉得搬家，只会觉得灯光变了。",
        cites: [
          cite("laitz", "Chapter 21 Modal Mixture"),
          cite("levine", "Chapter 3 Chord/Scale Theory（大调音阶和声）"),
        ],
      },
      {
        type: "p",
        text:
          "借用是否成立，看后面有没有回到原主音。C–Ab–Bb–C 里，Ab 与 Bb 都没有建立自己的属—主，最后又回到 C，所以是互换；如果 Ab 后面出现 Eb7–Ab 的终止，中心就搬走了，才是转调。",
        cites: [
          cite("sposobin", "第四十九章 交替大小调体系"),
          cite("laitz", "Chapter 22 Chromatic Modulation and Text-Music Relations"),
        ],
      },
      {
        type: "callout",
        title: "三步检查",
        text: "先锁主音，再找特征音来自哪条调式，最后看终止。三步都指向原主音，就是互换；出现新调终止，才是转调。",
      },
    ],
  },
  "quartal-harmony": {
    title: "白话解释：四度堆叠像一片雾",
    blocks: [
      {
        type: "p",
        text:
          "三度叠置会告诉你“这是大和弦还是小和弦”，四度叠置通常没有三音，所以它不告诉你大小，只给你一片音程颜色。D–G–C–F–A 既像 Dm11，也可以被听成 G 上的挂留，或 C 上的延伸；意义由低音与调式决定。",
        cites: [
          cite("laitz", "Chapter 30 Centricity, Extended and Non-Tertian Sonorities, and Collections"),
          cite("levine", "Chapter 13 Basic Reharmonization"),
        ],
      },
      {
        type: "p",
        text:
          "四度和声最适合“低音不动、上方换色”的段落。低音持续 D，上方四度结构移动，整体仍是 D Dorian；如果低音也离开，调式中心就会松动。它也可以作为功能进行中的插色，但插完要回到明确的目标和弦。",
        cites: [cite("levine", "Chapter 2 Major Scale and Progressions（调式爵士）")],
      },
      {
        type: "callout",
        title: "写作顺序",
        text: "先定主音与调式，再选四度排列，保持低音，最后用特征音定位。不要把四度和弦当成“没有根音”；根音在低音里。",
      },
    ],
  },
  "hybrid-chords": {
    title: "白话解释：斜杠不是一种和弦，而是三种关系",
    blocks: [
      {
        type: "p",
        text:
          "看到 C/E，先问低音 E 是不是 C 和弦的三音；是，它只是转位。看到 G/C，低音 C 不是 G 三和弦的音，上方又没有 E，它就不是普通转位，而是混合和弦。看到两个完整三和弦叠在一起，才是复合和弦。",
        cites: [
          cite("levine", "Chapter 5 Slash Chords"),
          cite("laitz", "Chapter 30 Centricity, Extended and Non-Tertian Sonorities, and Collections"),
        ],
      },
      {
        type: "p",
        text:
          "低音决定“站在哪里”，上层结构决定“是什么颜色”。G/C 的低音把功能位置钉在 C，上方的 G 三和弦提供 B、D 与 G 的色彩；D/C 则把 D 三和弦压在 C 上，得到类似 Cmaj7#11 的音响。九、十一、十三音一般不做低音，否则会被听成另一个和弦。",
        cites: [cite("levine", "Chapter 5 Slash Chords")],
      },
      {
        type: "callout",
        title: "配器提醒",
        text: "混合和弦最容易在低音区糊掉。上层结构放中高音区，低音只留根音或五音；先用钢琴听清两个结构，再分给乐队。",
      },
    ],
  },
  "non-functional-dominants": {
    title: "白话解释：属七的音响，不等于属功能",
    blocks: [
      {
        type: "p",
        text:
          "属功能不是“和弦符号带 7”，而是三全音有没有按方向解决：三音上行、七音下行，目标通常是主和弦。bVI7、bIII7、bVII7 也可以有属七音响，但它们不往主和弦走，所以不能一律标成 V/x。",
        cites: [
          cite("levine", "Chapter 13 Basic Reharmonization"),
          cite("sposobin", "第五十六章 意外进行"),
        ],
      },
      {
        type: "p",
        text:
          "相邻属和弦是连续上行的属七：C7–D7–Eb7。它们彼此平等，不要求解决；可以配模进旋律、掩盖功能，最后突然让 Ab7 下行五度到 Db，形成渐进转调。判断时先看根音方向，再看三全音是否解决。",
        cites: [
          cite("laitz", "Chapter 29 Symmetry Stretches Tonality: Chromatic Sequences and Equal Divisions of the Octave"),
          cite("sposobin", "第五十五章 转调模进"),
        ],
      },
      {
        type: "callout",
        title: "分析顺序",
        text: "先听解决方向，再写级数。没有下行五度/小二度解决，也没有明确目标，就先按色彩和弦或相邻属和弦处理。",
      },
    ],
  },
  "constant-structure": {
    title: "白话解释：平移的和弦块",
    blocks: [
      {
        type: "p",
        text:
          "固定结构像把同一个和弦块沿键盘平移：Cmaj7–Dmaj7–Emaj7 的质量完全相同，只是根音在动。每个声部都按同一方向走，导音与七音不再各自解决，所以功能感被削弱，听感更像一条平行色彩带。",
        cites: [
          cite("laitz", "Chapter 28 Tonal Ambiguity and Symmetrically Constructed Harmonies"),
          cite("levine", "Chapter 14 Advanced Reharmonization"),
        ],
      },
      {
        type: "p",
        text:
          "它不必然无功能。平行段最后接上 G7–C，整段就被功能收束；如果一直平移、没有目标，才接近无功能和声。判断时看终点，不要只看中间是否平行。",
        cites: [
          cite("laitz", "Chapter 29 Symmetry Stretches Tonality: Chromatic Sequences and Equal Divisions of the Octave"),
          cite("sposobin", "第五十五章 转调模进"),
        ],
      },
      {
        type: "callout",
        title: "写作抓手",
        text: "先定平移音程，再定终点。平行段越长，终点越要清楚，否则听众会失去方向。",
      },
    ],
  },
  "melodic-minor-modes": {
    title: "白话解释：旋律小调不是一条音阶，是七种和弦角色",
    blocks: [
      {
        type: "p",
        text:
          "最容易卡住的地方，是把旋律小调当成“小调的第三种写法”，背完音阶就结束。爵士里真正用的是它的七个调式各自对应的和弦：把 C 旋律小调从七个音轮流当主音，就得到 CmMaj7、Dsus b9、增利底亚、Lydian 属七、半减七、7alt 这一整套色彩工具。听见一个奇怪的和弦，先问“它来自哪条旋律小调”，比逐个音辨认快得多。",
        cites: [cite("levine", "Chapter 3 Chord/Scale Theory（旋律小调和声）")],
      },
      {
        type: "p",
        text:
          "判断顺序：先认来源调 → 认调式级数 → 用代表和弦反应（mMaj7 / sus b9 / maj7♯5 / 7♯11 / m7♭5 / 7alt）→ 最后问需不需要属解决。注意边界：mMaj7 只在它自己作主、或给 m7 加花时替换 m7；如果那个 m7 是 ii–V 里的二级，换成 mMaj7 会让后面的属七失去准备。",
        cites: [cite("levine", "Chapter 3 Chord/Scale Theory（旋律小调和声）")],
      },
      {
        type: "callout",
        title: "一句话与练习",
        text: "mMaj7 作主，m7♭5 作二级，其余大多是属色彩；斜线和弦只是它们的快速记法。练习：在 C 旋律小调上把七个代表和弦各弹一遍，再在同一条音阶内串成一条进行，听哪些连接不需要属功能就已经成立。",
      },
    ],
  },
  "meter-syncopation": {
    title: "白话解释：拍子是骨架，切分是性格",
    blocks: [
      {
        type: "p",
        text:
          "先把拍子想成一条均分的网格：4/4 里每小节四格，强弱按“强—弱—次强—弱”循环。你听到的一切音符其实都在回答一个问题——“它落在网格的哪个位置”。同一个音组放在拍点上稳，放在反拍上就开始推。",
        cites: [cite("laitz", "Chapter 1B Musical Time: Meter and Rhythm")],
      },
      {
        type: "p",
        text:
          "切分不是乱来，而是“推迟落点”：要么从弱位起、要么把音拉过强拍、要么直接在反拍加重音。听者一直在等那个强拍上的重音，你偏偏晚半拍给——这一推一补就是律动。所有让人想动的音乐，几乎都在玩这条错位。",
        cites: [cite("laitz", "Chapter 1B Musical Time: Meter and Rhythm")],
      },
      {
        type: "callout",
        title: "一句话与练习",
        text: "练习：用同一组音弹两遍，一遍全在拍点、一遍全从反拍起；什么都不改，只改位置，听“性格”怎么变的。",
      },
    ],
  },
  "melody-motives": {
    title: "白话解释：好旋律是长出来的，不是拼出来的",
    blocks: [
      {
        type: "p",
        text:
          "先立一个动机：三五个音加一种节奏，小到你一眼能记住。然后别再想新句子——把动机重复、挪高挪低、变长变短，听者一边认一边听，旋律就“长”出来了。旋律难写，通常不是素材不够，而是素材之间没有血缘。",
        cites: [cite("laitz", "Chapter 02 Pitch and Meter Combine: Melody and Counterpoint")],
      },
      {
        type: "p",
        text:
          "轮廓上记住三件事：级进为主，跳进是表情；跳进之后向反方向级进，把线收回来；全曲只留一个最高点，把它和和声高点对上。高点太多等于没有高点。",
        cites: [cite("laitz", "Chapter 04 The Role of Context: Embellishing Tones and Melodic Shape")],
      },
      {
        type: "callout",
        title: "一句话与练习",
        text: "写完旋律先唱一遍：动机认得出、跳进收回了、高点只有一个——三问过关再装饰。",
      },
    ],
  },
  "pentatonic-scales": {
    title: "白话解释：删掉倾向，留下骨架",
    blocks: [
      {
        type: "p",
        text:
          "拿走大调里的 4 和 7，剩下五个音就是大调五声。这两个音恰好是半音戏最多的位置——4 想去 3，7 想回家到 1；把它们删掉，音阶里没有任何音“急着去哪”，于是怎么弹都不刺耳。",
        cites: [
          cite("laitz", "Chapter 30 Centricity, Extended and Non-Tertian Sonorities, and Collections"),
          cite("levine", "Chapter 09 Pentatonic Scales"),
        ],
      },
      {
        type: "p",
        text:
          "从 A 开始排同一组音就是 A 小调五声——大小五声是同一条集合的两个视角，不是两条音阶。布鲁斯音阶就是小调五声加一个蓝调音 b5；编曲里一条五声线铺在一组和弦上，是最省力也最不容易错的旋律策略。",
        cites: [cite("levine", "Chapter 09 Pentatonic Scales")],
      },
      {
        type: "callout",
        title: "一句话与练习",
        text: "只弹黑键（就是 Gb 大调五声），听那种没有方向的悬浮；再弹 C 大调五声对比——你会立刻知道被删掉的那两个音管的是什么。",
      },
    ],
  },
  "non-chord-tones": {
    title: "白话解释：外音是声部的歌词",
    blocks: [
      {
        type: "p",
        text:
          "和弦音是骨架，外音是让骨架变成旋律的血肉。弱位的三种最好认：经过音填缝（C–D–E）、辅助音来回（C–D–C）、先现音抢跑。它们不占强拍，随时可以删掉而不伤和弦。",
        cites: [
          cite("laitz", "Chapter 04 The Role of Context: Embellishing Tones and Melodic Shape"),
          cite("sposobin", "第三十八章 一个声部中的自然经过音"),
        ],
      },
      {
        type: "p",
        text:
          "强位的两种才有戏剧：延留音三段式——先作为上一个和弦的自己人出现（准备），赖到强拍制造冲突（延留），再下行还债（解决）；倚音更横，不准备直接跳到强拍上闯祸。终止四六就是两个倚音叠在属音上的大招。",
        cites: [
          cite("laitz", "Chapter 10 Accented and Chromatic Embellishing Tones"),
          cite("sposobin", "第三十六章 在一个声部中的有准备的延留音"),
        ],
      },
      {
        type: "callout",
        title: "判断顺序",
        text: "拍位 → 来源 → 解决方向，三步定名。听到刺耳的音先别当错音，先问它欠谁的、什么时候还。",
      },
    ],
  },
  "suspended-chords": {
    title: "白话解释：三音还没表态",
    blocks: [
      {
        type: "p",
        text:
          "和弦的性质靠三音说话：三音是大三是大和弦，是小三是小和弦。sus4 把三音赶走、让四音站在它的位置——现在既不是大也不是小，像一个悬而未决的表情。传统用法是四音回落到三音，也就是 4–3 延留音的和声化。",
        cites: [cite("laitz", "Chapter 04 The Role of Context: Embellishing Tones and Melodic Shape")],
      },
      {
        type: "p",
        text:
          "爵士的玩法是不回落：Gsus4/G9sus4 没有三音就没有三全音，属和弦的解决压力被拆掉，整条 Mixolydian 随便跑。它和四度和声是亲戚——G–C–D 本身就是两个四度叠起来的。",
        cites: [cite("levine", "Chapter 3 Chord/Scale Theory（sus 与 Phrygian 和弦）")],
      },
      {
        type: "callout",
        title: "一句话与练习",
        text: "Gsus4 → G7 → Cmaj7 弹三遍：第一遍记住“悬”，第二遍听三音 B 落下时力量回来了，第三遍试着不让它回落——听听爵士的松。",
      },
    ],
  },
  "symmetric-scales": {
    title: "白话解释：等分的世界没有家",
    blocks: [
      {
        type: "p",
        text:
          "常规音阶不均等（全全半全全全半），所以有家、有引力。对称音阶全由等距音程生成：全音阶六格全一样大，八音阶半全交替，增音阶小三加大二——转一圈回到自己，转几格也像起点。没有不均等，就没有“想回家”的音。",
        cites: [cite("laitz", "Chapter 28 Tonal Ambiguity and Symmetrically Constructed Harmonies")],
      },
      {
        type: "p",
        text:
          "所以它们是“调味料”不是“主菜”：在 C7♯5 上跑全音、C7♭9 上跑八音，颜色立刻失重、悬空；但要让听者不迷路，就得回到一个有引力的目标和弦上收束。等音重解释也来自对称——减七和弦四个音轮流当根音，四种拼写同一个声音。",
        cites: [
          cite("laitz", "Chapter 29 Symmetry Stretches Tonality: Chromatic Sequences and Equal Divisions of the Octave"),
          cite("levine", "Chapter 3 Chord/Scale Theory（全音与减音阶）"),
        ],
      },
      {
        type: "callout",
        title: "一句话与练习",
        text: "C7♯5 跑全音、C7♭9 跑半全，各解决回 Fmaj7——先听失重，再听落地。对称是颜色，功能是落点。",
      },
    ],
  },
};
