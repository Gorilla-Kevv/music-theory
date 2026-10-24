import type { BibliographyEntry, CitationRef, SourceId } from "./types";

export const BIBLIOGRAPHY: BibliographyEntry[] = [
  {
    id: "levine",
    authors: "Mark Levine（马克·列文）",
    title: "The Jazz Theory Book",
    originalTitle: "爵士乐宝典——即兴、编曲、乐曲大全",
    publisher: "Sher Music Co.；中译本：上海音乐出版社",
    year: "1995；中译本 2017",
    edition: "英文原版；中译本第 1 版（赵贝露译，用户持有 EPUB，已内嵌）",
    isbn: "978-7-5523-0847-1（中译本）",
    language: "英文 / 中文译本",
    role: "爵士和声、和弦—音阶理论、ii–V–I、布鲁斯、Rhythm Changes 与重配和声的主要依据。",
    locatorNote:
      "引用使用英文原版章号与章名；已核对中译本 EPUB，24 章章序与英文原版一致。本库每章附内嵌 EPUB 章节深链。",
    verifiedVia: "英文版公开目录 + 用户持有中译本 EPUB 目录核对（2026-10-24）。",
  },
  {
    id: "laitz",
    authors: "Steven G. Laitz & Michael R. Callahan",
    title: "The Complete Musician: An Integrated Approach to Theory, Analysis, and Listening",
    publisher: "Oxford University Press",
    year: "2016",
    edition: "第 4 版（英文原版，用户持有 PDF，已内嵌）",
    isbn: "978-0-19-934709-4（第 4 版）",
    language: "英文",
    role: "调性理论、音程、音阶、三和弦与七和弦、声部进行、乐句模型、副属和弦、转调、调式交替、那不勒斯与增六和弦的主要依据。",
    locatorNote:
      "引用使用第 4 版章号与章名（1A/1B + 32 章，共九个 Part）；本书库每章附内嵌 PDF 页码深链（#page=N）。注意：第 4 版与第 5 版章名/章号不同，本库一律按第 4 版。",
    verifiedVia: "用户持有第 4 版 PDF 的书签大纲逐章核对（2026-10-24）。",
  },
  {
    id: "sposobin",
    authors: "伊·杜波夫斯基、斯·叶甫谢耶夫、伊·斯波索宾、符·索科洛夫",
    title: "和声学教程",
    publisher: "人民音乐出版社",
    year: "2021",
    edition: "第 3 版，陈敏译",
    isbn: "978-7-103-06096-4",
    language: "中文译本",
    role: "俄罗斯功能和声体系、正三和弦功能、声部连接、终止式、下属与属功能组、重属和弦、离调、转调、交替大小调与变和弦的结构性依据。",
    locatorNote:
      "引用使用第 3 版中译本章号与章名（共 60 章）。同一章在不同印次中页码会移动，因此不写页码。",
    verifiedVia: "图书馆书目记录所载第 3 版（2021）完整目录。",
  },
  {
    id: "soundquest",
    authors: "SoundQuest（日文原站）；自由派音乐理论（中译站）",
    title: "SoundQuest · 自由派音乐理论",
    publisher: "soundquest.jp / music-theory.aizcutei.com",
    year: "持续更新的网页版",
    edition: "网页版（和弦篇 C1–C75、旋律篇、节奏篇等）",
    language: "日文 / 中文译本",
    role:
      "扩展来源（Tier 2）：三本书未覆盖的站点理论框架——泛音列、连接系统论、轴心体系、新里曼理论、Lydian Chromatic Concept、元音乐理论、多义论、经过和弦等。站点条目为原创归纳，不复制正文。",
    locatorNote:
      "引用定位到站内篇章编号与小节名（如 和弦篇 C64「轴心体系」）；站点持续增删，引用以抓取时的目录为准。",
    verifiedVia: "WebFetch 抓取页面后归纳；日文原站与中译站对照。",
  },
];

export const BIBLIOGRAPHY_BY_ID = Object.fromEntries(
  BIBLIOGRAPHY.map((entry) => [entry.id, entry]),
) as Record<SourceId, BibliographyEntry>;

export const CITATION_STYLE_NOTE =
  "本书库采用论文式上下标引用：正文中以方括号上标标出序号，页末“注释”给出对应来源与章节/页面定位，完整书目见参考文献页。三本著作存在多个版次/译本，页码会随印次变化，统一采用章节级定位；站点来源（SoundQuest）定位到篇章编号与小节名。均不虚构页码；需要精确定位时请按手头版本检索。";

export const cite = (source: SourceId, locator: string, note?: string): CitationRef => ({
  source,
  locator,
  ...(note ? { note } : {}),
});
