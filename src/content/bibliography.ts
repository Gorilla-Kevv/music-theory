import type { BibliographyEntry, CitationRef, SourceId } from "./types";

export const BIBLIOGRAPHY: BibliographyEntry[] = [
  {
    id: "levine",
    authors: "Mark Levine（马克·列文）",
    title: "The Jazz Theory Book",
    originalTitle: "爵士乐宝典——即兴、编曲、乐曲大全",
    publisher: "Sher Music Co.；中译本：上海音乐出版社",
    year: "1995；中译本 2017",
    edition: "英文原版；中译本第 1 版",
    isbn: "978-7-5523-0847-1（中译本）",
    language: "英文 / 中文译本",
    role: "爵士和声、和弦—音阶理论、ii–V–I、布鲁斯、Rhythm Changes 与重配和声的主要依据。",
    locatorNote:
      "引用使用英文原版章号与章名（中译本目录与章序基本对应）。本库只标注到章，不写页码。",
    verifiedVia: "英文版与中译本公开目录（图书馆书目记录、出版社样本目录）核对章名与章号。",
  },
  {
    id: "laitz",
    authors: "Steven G. Laitz & Michael R. Callahan",
    title: "The Complete Musician: An Integrated Approach to Theory, Analysis, and Listening",
    publisher: "Oxford University Press",
    year: "2023",
    edition: "第 5 版",
    isbn: "978-0-19-092450-8",
    language: "英文",
    role: "调性理论、音程、音阶、三和弦与七和弦、声部进行、乐句模型、副属和弦、转调、调式交替、那不勒斯与增六和弦的主要依据。",
    locatorNote:
      "引用使用第 5 版章号与官方章名（如 Chapter 17 Applied Chords）。不同版次章号有差异，页码不写入。",
    verifiedVia: "Oxford University Press 官方产品页目录（第 5 版，2023）。",
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
];

export const BIBLIOGRAPHY_BY_ID = Object.fromEntries(
  BIBLIOGRAPHY.map((entry) => [entry.id, entry]),
) as Record<SourceId, BibliographyEntry>;

export const CITATION_STYLE_NOTE =
  "本书库采用论文式上下标引用：正文中以方括号上标标出序号，页末“注释”给出对应著作与章节定位，完整书目见参考文献页。由于三本著作存在多个版次与译本，页码会随印次变化，本库统一采用章节级定位，不虚构页码；需要精确定位时请按手头版本的章名检索。";

export const cite = (source: SourceId, locator: string, note?: string): CitationRef => ({
  source,
  locator,
  ...(note ? { note } : {}),
});
