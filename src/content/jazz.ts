import { cite } from "./bibliography";
import { chord, example, line } from "./helpers";
import type { Concept } from "./types";

export const JAZZ: Concept[] = [
  {
    id: "ii-v-i",
    slug: "ii-v-i",
    number: "J-01",
    title: "ii–V–I：爵士的标点",
    titleEn: "THE II–V–I PROGRESSION",
    category: "jazz",
    level: "基础",
    aliases: ["ii-V-I", "二五一", "二五", "two five one", "jazz cadence", "2-5-1"],
    tags: ["进行", "功能", "即兴"],
    summary:
      "ii–V–I 是爵士最核心的短进行：下属（ii7）准备属（V7），属解决到主（Imaj7）；它把古典的 T–PD–D–T 压缩成三个和弦。",
    sections: [
      {
        id: "structure",
        heading: "大调与小调形态",
        blocks: [
          {
            type: "p",
            text:
              "大调 ii–V–I 是 ii7–V7–Imaj7，例如 C 大调的 Dm7–G7–Cmaj7。小调通常写作 iiø7–V7–i，例如 A 小调的 Bm7b5–E7–Am7；属和弦常用变化音（b9、#9、b5、#5）以增强解决。",
            cites: [
              cite("levine", "Chapter 2 Major Scale and Progressions（Ⅱ-Ⅴ-Ⅰ进行）"),
              cite("levine", "Chapter 3 Chord/Scale Theory（小调Ⅱ-Ⅴ-Ⅰ以及Ⅱ-Ⅴ进行）"),
            ],
          },
          {
            type: "p",
            text:
              "ii–V–I 的根音连续下行五度：D–G–C。它既可以作为一首曲子的终止，也可以作为内部乐句的标点；在快速段落里常被压缩成两拍一个和弦。",
            cites: [cite("levine", "Chapter 2 Major Scale and Progressions（Ⅱ-Ⅴ-Ⅰ进行）")],
          },
        ],
      },
      {
        id: "why",
        heading: "为什么它如此有效",
        blocks: [
          {
            type: "p",
            text:
              "低音的下行五度提供方向，三音与七音的半音交换提供平滑连接。ii7 的七音（C）下行到 V7 的三音（B），V7 的七音（F）下行到 Imaj7 的三音（E）；同时 V7 的三音（B）保持到 Imaj7 的七音。",
            cites: [cite("levine", "Chapter 2 Major Scale and Progressions（声部进行）")],
          },
          {
            type: "callout",
            title: "练习方法",
            text: "把 ii–V–I 听成一条低音线，而不是三个孤立和弦；然后在所有十二个调里只弹三音与七音，最后再加根音与延伸音。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-ii-v-i-extended",
        title: "Dm9–G13–Cmaj9",
        caption: "延伸音加厚色彩，但骨架仍是 D–G–C 的低音与 F/C→B/F→E/B 的声部。",
        kind: "progression",
        key: "C",
        tempo: 76,
        beats: 12,
        events: [
          chord(0, 4, ["D3", "F3", "A3", "C4", "E4"], { label: "Dm9" }),
          chord(4, 4, ["G3", "B3", "D4", "F4", "E5"], { label: "G13" }),
          chord(8, 4, ["C3", "E3", "G3", "B3", "D4"], { label: "Cmaj9" }),
        ],
      }),
    ],
    related: ["guide-tones", "chord-scale", "tritone-substitution"],
    review: {
      question: "C 大调的 ii–V–I 是哪三个和弦？三音与七音如何连接？",
      answer: "Dm7–G7–Cmaj7；Dm7 的 F/C，G7 的 B/F，Cmaj7 的 E/B；C→B、F→E 为半音下行，B 保持。",
      hint: "先写 guide tones，再听低音 D–G–C。",
    },
  },
  {
    id: "guide-tones",
    slug: "guide-tones",
    number: "J-02",
    title: "引导音：三音与七音",
    titleEn: "GUIDE TONES",
    category: "jazz",
    level: "基础",
    aliases: ["引导音", "guide tones", "三音七音", "voice leading", "和弦骨架", "target tones"],
    tags: ["声部进行", "即兴", "和弦"],
    summary:
      "三音与七音定义和弦质量，也是即兴与伴奏的骨架；只弹这两个音，ii–V–I 的方向仍然清楚。",
    sections: [
      {
        id: "definition",
        heading: "为什么是三音与七音",
        blocks: [
          {
            type: "p",
            text:
              "三音决定大/小，七音决定大七/属七/小七；根音与五音更多提供稳定性。因此三音与七音是识别和弦、连接声部最经济的两个音。",
            cites: [cite("levine", "Chapter 2 Major Scale and Progressions（声部进行）")],
          },
          {
            type: "p",
            text:
              "在 ii–V–I 中，ii7 的七音与 V7 的三音只差半音，V7 的七音与 Imaj7 的三音也只差半音；V7 的三音同时是 Imaj7 的七音。这条线让三个和弦变成一个连续动作。",
            cites: [cite("levine", "Chapter 2 Major Scale and Progressions（声部进行）")],
          },
        ],
      },
      {
        id: "practice",
        heading: "只弹两个音",
        blocks: [
          {
            type: "p",
            text:
              "练习时可以在所有调里只弹 guide tones，先不弹根音。若两个音的连接听起来像一条旋律，说明声部进行成立；再加根音、五音与延伸音时，和声就不会散。",
            cites: [cite("levine", "Chapter 2 Major Scale and Progressions（声部进行）")],
          },
          {
            type: "callout",
            title: "即兴用法",
            text: "把 guide tones 当作目标音：在强拍或和弦变化点落到三音/七音，中间用音阶、经过音与包围音填充。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-guide-tone-pairs",
        title: "Guide tones 的二声部",
        caption: "F/C → B/F → E/B；C 下行到 B，F 下行到 E，B 保持。",
        kind: "progression",
        key: "C",
        tempo: 68,
        beats: 12,
        events: [
          chord(0, 4, ["F4", "C4"], { label: "Dm7: 3–7" }),
          chord(4, 4, ["B3", "F4"], { label: "G7: 3–7" }),
          chord(8, 4, ["E4", "B3"], { label: "Cmaj7: 3–7" }),
        ],
      }),
    ],
    related: ["seventh-chords", "ii-v-i", "chord-scale"],
    review: {
      question: "Dm7–G7–Cmaj7 的 guide tones 怎样移动？",
      answer: "Dm7：F/C；G7：B/F；Cmaj7：E/B。C→B 与 F→E 半音下行，B 保持。",
      hint: "三音与七音互换位置。",
    },
  },
  {
    id: "chord-scale",
    slug: "chord-scale",
    number: "J-03",
    title: "和弦—音阶理论",
    titleEn: "CHORD–SCALE THEORY",
    category: "jazz",
    level: "进阶",
    aliases: ["和弦音阶", "chord scale", "chord-scale theory", "avoid note", "和弦音阶理论", "避免音"],
    tags: ["音阶", "即兴", "和声"],
    summary:
      "和弦—音阶理论把每个和弦质量对应到一条音阶：Dm7 用 Dorian，G7 用 Mixolydian，Cmaj7 用 Ionian；音阶提供可用的旋律音，但和弦的三音七音仍是骨架。",
    sections: [
      {
        id: "mapping",
        heading: "和弦决定音阶",
        blocks: [
          {
            type: "p",
            text:
              "在 C 大调的 ii–V–I 里，Dm7 对应 D Dorian，G7 对应 G Mixolydian，Cmaj7 对应 C Ionian。三条音阶共享同一组白键，但主音不同，因此色彩与目标音不同。",
            cites: [cite("levine", "Chapter 3 Chord/Scale Theory（大调音阶和声）")],
          },
          {
            type: "p",
            text:
              "和弦音阶不是“照着音阶弹”的许可证。即兴时仍要解决到和弦音，尤其是三音与七音；音阶负责经过与色彩，和弦负责落点。",
            cites: [cite("levine", "Chapter 3 Chord/Scale Theory（为什么是音阶?）")],
          },
        ],
      },
      {
        id: "avoid",
        heading: "避免音与变化音阶",
        blocks: [
          {
            type: "p",
            text:
              "某些音阶音会和和弦的三音形成小九度，听感上像“卡住”，Levine 称之为避免音。例如 Ionian 中的自然 11（F 对 Cmaj7 的 E）与 Mixolydian 中的自然 4（C 对 G7 的 B）都需要谨慎处理。",
            cites: [cite("levine", "Chapter 3 Chord/Scale Theory（“避免”音）")],
          },
          {
            type: "p",
            text:
              "变化属和弦常用旋律小调第七调式（altered scale），它同时包含 b9、#9、b5、#5。小调 ii–V–i 的 V7 也常使用这条音阶。",
            cites: [cite("levine", "Chapter 3 Chord/Scale Theory（变化属七和弦）")],
          },
          {
            type: "callout",
            title: "选择顺序",
            text: "先确定和弦质量与功能，再选音阶；最后用旋律目标音检查。不要反过来从音阶找和弦。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-three-scales",
        title: "D Dorian → G Mixolydian → C Ionian",
        caption: "三条音阶共享白键，但主音与目标音不同；注意每条音阶的第一音就是当前和弦根音。",
        kind: "scale",
        key: "C",
        tempo: 84,
        beats: 12,
        events: [
          ...line(0, 0.5, 0.5, ["D3", "E3", "F3", "G3", "A3", "B3", "C4", "D4"]),
          ...line(4, 0.5, 0.5, ["G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4"]),
          ...line(8, 0.5, 0.5, ["C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4"]),
        ],
      }),
    ],
    related: ["modes", "extensions-alterations", "ii-v-i"],
    review: {
      question: "C 大调 ii–V–I 中，Dm7、G7、Cmaj7 最常用的和弦音阶分别是什么？",
      answer: "D Dorian、G Mixolydian、C Ionian。",
      hint: "每条音阶的主音就是和弦根音。",
    },
  },
  {
    id: "extensions-alterations",
    slug: "extensions-alterations",
    number: "J-04",
    title: "延伸音与变化音",
    titleEn: "EXTENSIONS & ALTERATIONS",
    category: "jazz",
    level: "进阶",
    aliases: ["延伸音", "变化音", "tension", "9", "11", "13", "altered", "b9", "#9", "alt"],
    tags: ["和弦", "色彩", "属七"],
    summary:
      "九、十一、十三度给和弦加厚色彩；降九、升九、降五、升五则改变属七的张力与解决方向。延伸不是越多越好，必须服从声部与旋律。",
    sections: [
      {
        id: "extensions",
        heading: "九、十一、十三",
        blocks: [
          {
            type: "p",
            text:
              "延伸音是在七和弦之上继续叠三度：九音、十一音、十三音。Cmaj9 加 D，Cmaj7#11 加 F#，C13 加 A。它们让同一功能拥有不同颜色，但不改变根音与基本功能。",
            cites: [cite("levine", "Chapter 3 Chord/Scale Theory（大调音阶和声）")],
          },
          {
            type: "p",
            text:
              "延伸音的选择受旋律与声部限制。自然 11 在大七和弦上容易与三音冲突，所以常用 #11；自然 13 在属七上通常可用，但要注意它与 b7 的关系。",
            cites: [cite("levine", "Chapter 3 Chord/Scale Theory（“避免”音）")],
          },
        ],
      },
      {
        id: "altered",
        heading: "变化属七",
        blocks: [
          {
            type: "p",
            text:
              "变化属七同时改变五音与九音：b9、#9、b5、#5。它们制造更强的解决压力，常用于小调 ii–V–i 或终止前的 V7。G7alt 的常用来源是 Ab 旋律小调的第七调式。",
            cites: [cite("levine", "Chapter 3 Chord/Scale Theory（变化属七和弦）")],
          },
          {
            type: "callout",
            title: "配器提醒",
            text: "延伸音在钢琴上容易堆成泥；优先保留三音、七音与一个色彩音，其余交给贝斯或旋律。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-extensions",
        title: "Cmaj9 / G7(b9) / G7(#9)",
        caption: "同样的属功能，不同的张力；注意 b9 与 #9 对解决音 G 的引力。",
        kind: "chord",
        key: "C",
        tempo: 66,
        beats: 6,
        events: [
          chord(0, 2, ["C3", "E3", "G3", "B3", "D4"], { label: "Cmaj9" }),
          chord(2, 2, ["G3", "B3", "D4", "F4", "Ab4"], { label: "G7(b9)" }),
          chord(4, 2, ["G3", "B3", "D4", "F4", "A#4"], { label: "G7(#9)" }),
        ],
      }),
    ],
    related: ["chord-scale", "ii-v-i", "tritone-substitution"],
    review: {
      question: "G7alt 常用哪条音阶？它包含哪些变化音？",
      answer: "Ab 旋律小调的第七调式（变化音阶），包含 b9、#9、b5、#5。",
      hint: "从属和弦根音上行半音的小调音阶。",
    },
  },
  {
    id: "tritone-substitution",
    slug: "tritone-substitution",
    number: "J-05",
    title: "三全音替代",
    titleEn: "TRITONE SUBSTITUTION",
    category: "jazz",
    level: "进阶",
    aliases: ["三全音替代", "tritone substitution", "tritone sub", "bII7", "替代属和弦", "降二代五"],
    tags: ["重配和声", "属七", "半音"],
    summary:
      "三全音替代用降 II 级属七替换 V7：两者共享同一个三全音（三音与七音），低音则从上行四度变成下行半音。",
    sections: [
      {
        id: "shared-tritone",
        heading: "共享的三全音",
        blocks: [
          {
            type: "p",
            text:
              "在 C 大调，G7 的三音 B 与七音 F 构成三全音；Db7 的三音 F 与七音 Cb（等音 B）也构成同一个三全音。两个属七因此可以互相替代，而属功能与解决方向保持不变。",
            cites: [cite("levine", "Chapter 13 Basic Reharmonization（三全音替代）")],
          },
          {
            type: "p",
            text:
              "替代后低音从 G 上行到 C 变成 Db 下行到 C，半音低音带来更顺滑、更“爵士”的收束。ii–V–I 因此可以变成 ii–bII7–I。",
            cites: [cite("levine", "Chapter 13 Basic Reharmonization")],
          },
        ],
      },
      {
        id: "usage",
        heading: "用法与听感",
        blocks: [
          {
            type: "p",
            text:
              "三全音替代最常出现在终止前，也可以和小调 ii–V–i 结合。替和弦常加 b9/#11 等变化音；分析时仍标作 subV7 或 bII7，并说明它替代的是哪一个 V7。",
            cites: [cite("levine", "Chapter 13 Basic Reharmonization")],
          },
          {
            type: "callout",
            title: "不要过度使用",
            text: "替代改变的是低音与色彩，不改变功能。若旋律或声部需要原来的属音，三全音替代可能破坏目标音。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-tritone-sub",
        title: "Dm7–Db7–Cmaj7",
        caption: "Db7 替代 G7；低音 D–Db–C 半音下行，三全音 F/Cb 保留。",
        kind: "progression",
        key: "C",
        tempo: 72,
        beats: 12,
        events: [
          chord(0, 4, ["D3", "F3", "A3", "C4"], { label: "Dm7" }),
          chord(4, 4, ["Db3", "F3", "Ab3", "Cb4"], { label: "Db7 (subV7)" }),
          chord(8, 4, ["C3", "E3", "G3", "B3"], { label: "Cmaj7" }),
        ],
      }),
    ],
    related: ["ii-v-i", "seventh-chords", "extensions-alterations"],
    review: {
      question: "C 大调中 G7 的三全音替代是什么？它们共享哪两个音？",
      answer: "Db7；共享 F 与 B（Db7 写作 Cb），即同一个三全音。",
      hint: "根音相差三全音。",
    },
  },
  {
    id: "rhythm-changes",
    slug: "rhythm-changes",
    number: "J-06",
    title: "Rhythm Changes",
    titleEn: "RHYTHM CHANGES",
    category: "jazz",
    level: "高级",
    aliases: ["Rhythm Changes", "rhythm changes", "I Got Rhythm", "AABA", "32小节", "节奏变化"],
    tags: ["曲式", "进行", "即兴"],
    summary:
      "Rhythm Changes 是建立在 Gershwin《I Got Rhythm》和声上的 32 小节 AABA 曲式；A 段核心是 I–vi–ii–V，B 段常围绕属和弦循环展开。",
    sections: [
      {
        id: "form",
        heading: "32 小节 AABA",
        blocks: [
          {
            type: "p",
            text:
              "A 段八小节，典型进行是 I–vi–ii–V（如 Bb 大调的 Bb–G7–Cm7–F7）；A 段重复后进入 B 段，最后回到 A。B 段常出现属和弦链、五度循环或半音模进。",
            cites: [cite("levine", "Chapter 11 Rhythm Changes")],
          },
          {
            type: "p",
            text:
              "Rhythm Changes 的价值不只在和弦，还在其节奏与曲式模板：大量爵士曲目以此为基础，乐手可以替换和弦、改速度、改拍号，但 AABA 的骨架仍在。",
            cites: [cite("levine", "Chapter 11 Rhythm Changes")],
          },
        ],
      },
      {
        id: "improvise",
        heading: "在 A 段即兴",
        blocks: [
          {
            type: "p",
            text:
              "A 段每个和弦都可以用和弦—音阶对应：Bb 用 Ionian/Mixolydian 色彩，G7 用 Mixolydian 或变化音，Cm7 用 Dorian，F7 用 Mixolydian。guide tones 仍是落点。",
            cites: [cite("levine", "Chapter 11 Rhythm Changes")],
          },
          {
            type: "callout",
            title: "练习顺序",
            text: "先只弹 A 段的和弦与 guide tones，再加节奏变奏；B 段单独循环，最后合起来。不要一开始就背整首。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-rhythm-a",
        title: "Bb 大调 A 段骨架",
        caption: "Bb6–G7–Cm7–F7；这是 A 段最常见的四和弦循环。",
        kind: "progression",
        key: "Bb",
        tempo: 96,
        beats: 8,
        events: [
          chord(0, 2, ["Bb3", "D4", "F4", "G4"], { label: "Bb6" }),
          chord(2, 2, ["G3", "B3", "D4", "F4"], { label: "G7" }),
          chord(4, 2, ["C4", "Eb4", "G4", "Bb4"], { label: "Cm7" }),
          chord(6, 2, ["F3", "A3", "C4", "Eb4"], { label: "F7" }),
        ],
      }),
    ],
    related: ["ii-v-i", "circle-of-fifths", "blues"],
    review: {
      question: "Rhythm Changes 的曲式与 A 段核心进行是什么？",
      answer: "32 小节 AABA；A 段常见 I–vi–ii–V（如 Bb–G7–Cm7–F7）。",
      hint: "AABA 与 I–vi–ii–V。",
    },
  },
  {
    id: "blues",
    slug: "blues",
    number: "J-07",
    title: "布鲁斯语言",
    titleEn: "THE BLUES",
    category: "jazz",
    level: "进阶",
    aliases: ["布鲁斯", "蓝调", "blues", "12-bar blues", "blue notes", "blues scale", "蓝调音"],
    tags: ["曲式", "音阶", "即兴"],
    summary:
      "十二小节布鲁斯用 I7–IV7–V7 的循环构成曲式，蓝调音（b3、b5、b7）与布鲁斯音阶提供独特的音高色彩。",
    sections: [
      {
        id: "form",
        heading: "十二小节循环",
        blocks: [
          {
            type: "p",
            text:
              "最基本的十二小节布鲁斯是四小节 I7、两小节 IV7、两小节 I7、一小节 V7、一小节 IV7、两小节 I7（也有许多变体）。和弦多为属七，即使它们并不是调内 V7。",
            cites: [cite("levine", "Chapter 10 Blues")],
          },
          {
            type: "p",
            text:
              "布鲁斯的属七不是功能错误，而是风格语言：I7 的 b7 提供蓝调色彩，IV7 与 V7 继续保持属七音响。",
            cites: [cite("levine", "Chapter 10 Blues")],
          },
        ],
      },
      {
        id: "language",
        heading: "蓝调音与音阶",
        blocks: [
          {
            type: "p",
            text:
              "蓝调音通常指 b3、b5、b7，它们在同一条旋律里与大调音阶的三音、五音、七音并存，形成“大小三度同时存在”的张力。布鲁斯音阶常写作 1–b3–4–b5–5–b7。",
            cites: [cite("levine", "Chapter 10 Blues")],
          },
          {
            type: "callout",
            title: "即兴提示",
            text: "布鲁斯音阶不是唯一选择；Mixolydian、Dorian 与和弦音都可以用。关键是句子回应与蓝调音的位置感，而不是音阶本身。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-blues-bars",
        title: "C 布鲁斯前四小节骨架",
        caption: "C7–F7–C7–G7；实际十二小节循环会再回到 I7 与 IV7。",
        kind: "progression",
        key: "C",
        tempo: 88,
        beats: 16,
        events: [
          chord(0, 4, ["C3", "E3", "G3", "Bb3"], { label: "C7" }),
          chord(4, 4, ["F3", "A3", "C4", "Eb4"], { label: "F7" }),
          chord(8, 4, ["C3", "E3", "G3", "Bb3"], { label: "C7" }),
          chord(12, 4, ["G3", "B3", "D4", "F4"], { label: "G7" }),
        ],
      }),
    ],
    related: ["rhythm-changes", "chord-scale", "modal-harmony"],
    review: {
      question: "十二小节布鲁斯的基本和弦骨架是什么？为什么 I 级也用属七？",
      answer: "I7–IV7–V7 的十二小节循环；I7 的 b7 是布鲁斯风格色彩，不是功能错误。",
      hint: "属七不是只在 V 级出现。",
    },
  },
  {
    id: "modal-harmony",
    slug: "modal-harmony",
    number: "J-08",
    title: "调式化和声",
    titleEn: "MODAL HARMONY",
    category: "jazz",
    level: "高级",
    aliases: ["调式化和声", "modal harmony", "So What", "持续音", "pedal", "静态和声", "modal jazz"],
    tags: ["调式", "持续音", "编配"],
    summary:
      "调式化和声用少量和弦、持续低音与音程色彩取代功能和声的属—主推进；Miles Davis 的《So What》是典型范例。",
    sections: [
      {
        id: "static",
        heading: "静态和声与持续音",
        blocks: [
          {
            type: "p",
            text:
              "调式化和声不急着解决。它常在一个低音或少数和弦上停留，让听者关注音程颜色、旋律动机与节奏，而不是 V–I 的方向。",
            cites: [cite("levine", "Chapter 2 Major Scale and Progressions（调式爵士）")],
          },
          {
            type: "p",
            text:
              "《So What》用 Dm7 与 Ebm7 的平行关系制造色彩移动：两个小七和弦结构相同，根音相差半音；低音与和弦一起上移，和声功能并没有建立新的调性。",
            cites: [cite("levine", "Chapter 2 Major Scale and Progressions（调式爵士）")],
          },
        ],
      },
      {
        id: "write",
        heading: "写作抓手",
        blocks: [
          {
            type: "p",
            text:
              "调式写作先定主音与音阶，再选能突出特征音的和弦配置。Dorian 的自然 6、Lydian 的 #4、Mixolydian 的 b7 都可以通过声部位置被强调。",
            cites: [cite("levine", "Chapter 3 Chord/Scale Theory")],
          },
          {
            type: "callout",
            title: "和功能化的区别",
            text: "功能化和声问“下一个和弦去哪里”；调式化和声问“这个主音上还能呈现什么颜色”。两者可以混用，但分析时要分清。",
          },
        ],
      },
    ],
    examples: [
      example({
        id: "ex-so-what",
        title: "Dm7 → Ebm7 → Dm7",
        caption: "平行小七和弦的半音移动；没有属—主解决，色彩来自同一结构在不同根音上的重复。",
        kind: "progression",
        key: "C",
        tempo: 64,
        beats: 12,
        events: [
          chord(0, 4, ["D3", "F3", "A3", "C4"], { label: "Dm7" }),
          chord(4, 4, ["Eb3", "Gb3", "Bb3", "Db4"], { label: "Ebm7" }),
          chord(8, 4, ["D3", "F3", "A3", "C4"], { label: "Dm7" }),
        ],
      }),
    ],
    related: ["modes", "chord-scale", "minor-scales"],
    review: {
      question: "调式化和声与功能和声的核心差别是什么？",
      answer: "调式化和声靠持续低音与音程色彩，不按 V–I 功能推进；功能和声靠属—主解决建立方向。",
      hint: "方向 vs 颜色。",
    },
  },
];
