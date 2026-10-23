import {
  ALL_CHAPTERS,
  ALL_EXAMPLES,
  BIBLIOGRAPHY,
  BILIBILI_SEASON,
  BILIBILI_VIDEOS,
  BILIBILI_VIDEO_COUNT,
  BILIBILI_READ_COUNT,
  BOOK_OUTLINES,
  BOOK_STATS,
  CATEGORIES,
  CITATION_STYLE_NOTE,
  CONCEPTS,
  CONCEPT_BY_SLUG,
  HARMONY_DIMENSIONS,
  SOURCE_NOTES,
  collectCitations,
  getBilibiliVideo,
  getBookOutline,
  getChaptersForConcept,
  getConcept,
  getSourceNote,
  searchSourceNotes,
} from "../content";
import type { CategoryId, Concept, Example, HarmonyDimension, Level, SourceId } from "../content/types";
import { getDueRecords, getNewConcepts, getStats, loadReviewState, type ReviewState } from "./review";
import { searchConcepts } from "./search";

export interface ToolSchema {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export const TOOL_SCHEMAS: ToolSchema[] = [
  {
    name: "search_theory",
    description: "在本地乐理知识库中做中英文模糊检索，返回概念、摘要与路由 slug。",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "检索词，例如 ii-V-I、五度圈、tritone" },
        category: { type: "string", enum: ["foundations", "harmony", "jazz"] },
        level: { type: "string", enum: ["基础", "进阶", "高级"] },
        limit: { type: "number", default: 8 },
      },
      required: ["query"],
    },
  },
  {
    name: "get_concept",
    description: "按 slug 读取一个概念的完整正文、章节引用、谱例与复习卡。",
    inputSchema: {
      type: "object",
      properties: { slug: { type: "string" } },
      required: ["slug"],
    },
  },
  {
    name: "list_examples",
    description: "列出可播放谱例，可按概念、分类或类型筛选，返回事件级音符数据。",
    inputSchema: {
      type: "object",
      properties: {
        concept: { type: "string" },
        category: { type: "string", enum: ["foundations", "harmony", "jazz"] },
        kind: { type: "string", enum: ["melody", "chord", "progression", "scale"] },
      },
    },
  },
  {
    name: "get_related",
    description: "读取一个概念的相关概念，用于构建学习路径或解释上下文。",
    inputSchema: {
      type: "object",
      properties: { slug: { type: "string" } },
      required: ["slug"],
    },
  },
  {
    name: "get_review_queue",
    description: "读取到期复习卡与新卡；可传入从网页导出的学习状态 JSON。",
    inputSchema: {
      type: "object",
      properties: {
        state: { type: "object", description: "网页导出的 review state；省略则读取本地浏览器存储（Node 中不可用）" },
      },
    },
  },
  {
    name: "search_sources",
    description: "在三本书的完整章目与原创章节笔记中检索，可筛选书籍与和声维度。",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string" },
        book: { type: "string", enum: ["levine", "laitz", "sposobin"] },
        dimension: {
          type: "string",
          enum: ["function", "direction", "color", "brightness", "relationship", "rhythm"],
        },
        onlyExpanded: { type: "boolean", default: false },
      },
      required: ["query"],
    },
  },
  {
    name: "get_book_outline",
    description: "读取一本书的完整章目结构，包括已展开笔记的章节与概念映射。",
    inputSchema: {
      type: "object",
      properties: { book: { type: "string", enum: ["levine", "laitz", "sposobin"] } },
      required: ["book"],
    },
  },
  {
    name: "get_source_note",
    description: "读取一章的原创读书笔记、深度归纳、分析清单、跨书对应、常见误解、和声维度与对应知识库概念。",
    inputSchema: {
      type: "object",
      properties: { chapterId: { type: "string" } },
      required: ["chapterId"],
    },
  },
  {
    name: "get_bibliography",
    description: "返回三本理论著作的完整书目、版次与章节定位说明。",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_citation_policy",
    description: "返回本知识库的论文式引用体例与章节级定位规则。",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_video_research",
    description:
      "返回 B 站课程调研台账：已读取/已编目的视频、主题映射与关联概念，用于避免重复搜索；视频不作为理论依据。",
    inputSchema: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["read", "catalogued"] },
        query: { type: "string", description: "按 BV、标题、主题或关联概念检索" },
        theme: { type: "string" },
      },
    },
  },
];

export interface KnowledgePack {
  meta: {
    name: string;
    version: string;
    builtAt: string;
    conceptCount: number;
    exampleCount: number;
    citationCount: number;
    bookCount: number;
    chapterCount: number;
    sourceNoteCount: number;
    videoCount: number;
    videoReadCount: number;
    language: string;
    licenseNote: string;
  };
  citationStyle: string;
  bibliography: typeof BIBLIOGRAPHY;
  categories: typeof CATEGORIES;
  harmonyDimensions: typeof HARMONY_DIMENSIONS;
  books: typeof BOOK_OUTLINES;
  sourceNotes: typeof SOURCE_NOTES;
  videoResearch: {
    season: typeof BILIBILI_SEASON;
    videos: typeof BILIBILI_VIDEOS;
  };
  concepts: Concept[];
  examples: Array<Example & { conceptSlug: string; conceptTitle: string; category: string }>;
  toolSchemas: ToolSchema[];
}

export function buildKnowledgePack(): KnowledgePack {
  return {
    meta: {
      name: "TONIC · 主音",
      version: "0.3.0",
      builtAt: new Date().toISOString(),
      conceptCount: CONCEPTS.length,
      exampleCount: ALL_EXAMPLES.length,
      citationCount: CONCEPTS.reduce((sum, concept) => sum + collectCitations(concept).length, 0),
      bookCount: BOOK_OUTLINES.length,
      chapterCount: ALL_CHAPTERS.length,
      sourceNoteCount: SOURCE_NOTES.length,
      videoCount: BILIBILI_VIDEO_COUNT,
      videoReadCount: BILIBILI_READ_COUNT,
      language: "zh-CN + en",
      licenseNote:
        "知识条目为原创改写，引用仅作章节级学术定位；本库不复制教材正文，不得把本库内容当作三本著作的替代版本。",
    },
    citationStyle: CITATION_STYLE_NOTE,
    bibliography: BIBLIOGRAPHY,
    categories: CATEGORIES,
    harmonyDimensions: HARMONY_DIMENSIONS,
    books: BOOK_OUTLINES,
    sourceNotes: SOURCE_NOTES,
    videoResearch: {
      season: BILIBILI_SEASON,
      videos: BILIBILI_VIDEOS,
    },
    concepts: CONCEPTS,
    examples: ALL_EXAMPLES.map((example) => ({
      id: example.id,
      title: example.title,
      caption: example.caption,
      kind: example.kind,
      key: example.key,
      clef: example.clef,
      timeSignature: example.timeSignature,
      tempo: example.tempo,
      beats: example.beats,
      events: example.events,
      conceptSlug: example.conceptSlug,
      conceptTitle: example.conceptTitle,
      category: example.category,
    })),
    toolSchemas: TOOL_SCHEMAS,
  };
}

export function searchTheory(
  query: string,
  options: { category?: CategoryId; level?: Level; limit?: number } = {},
) {
  return searchConcepts(query, options).map(({ concept, score }) => ({
    slug: concept.slug,
    number: concept.number,
    title: concept.title,
    titleEn: concept.titleEn,
    category: concept.category,
    level: concept.level,
    summary: concept.summary,
    tags: concept.tags,
    score: Number(score.toFixed(3)),
    url: `/theory/${concept.slug}`,
  }));
}

export function listExamples(options: {
  concept?: string;
  category?: CategoryId;
  kind?: Example["kind"];
} = {}) {
  return ALL_EXAMPLES.filter((example) => {
    if (options.concept && example.conceptSlug !== options.concept) return false;
    if (options.category && example.category !== options.category) return false;
    if (options.kind && example.kind !== options.kind) return false;
    return true;
  });
}

export function searchSources(
  query: string,
  options: {
    book?: SourceId;
    dimension?: HarmonyDimension;
    onlyExpanded?: boolean;
  } = {},
) {
  return searchSourceNotes(query, options);
}

export function getConceptSources(slug: string) {
  return getChaptersForConcept(slug).map((chapter) => ({
    id: chapter.id,
    book: chapter.book,
    number: chapter.number,
    title: chapter.title,
    titleZh: chapter.titleZh,
    summary: chapter.summary,
    keyPoints: chapter.keyPoints,
    dimensions: chapter.dimensions,
  }));
}

export function getRelated(slug: string) {
  const concept = getConcept(slug);
  if (!concept) return [];
  return concept.related.map((relatedSlug) => {
    const related = CONCEPT_BY_SLUG[relatedSlug];
    return related
      ? {
          slug: related.slug,
          title: related.title,
          titleEn: related.titleEn,
          category: related.category,
          summary: related.summary,
        }
      : null;
  }).filter(Boolean);
}

export function listVideoResearch(
  options: {
    status?: "read" | "catalogued";
    query?: string;
    theme?: string;
  } = {},
) {
  const term = options.query?.trim().toLowerCase();
  return BILIBILI_VIDEOS.filter((video) => {
    if (options.status && video.status !== options.status) return false;
    if (options.theme && !video.themes.includes(options.theme)) return false;
    if (!term) return true;
    const haystack = [
      video.bvid,
      video.title,
      video.episode,
      video.takeaway ?? "",
      video.themes.join(" "),
      (video.usedIn ?? []).join(" "),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(term);
  });
}

export function getReviewQueue(state?: ReviewState) {
  const current = state ?? loadReviewState();
  return {
    due: getDueRecords(current).map((record) => {
      const concept = CONCEPT_BY_SLUG[record.conceptSlug];
      return {
        ...record,
        title: concept?.title ?? record.conceptSlug,
        question: concept?.review.question ?? "",
        answer: concept?.review.answer ?? "",
      };
    }),
    newConcepts: getNewConcepts(current).map((concept) => ({
      slug: concept.slug,
      title: concept.title,
      category: concept.category,
      level: concept.level,
    })),
    stats: getStats(current),
  };
}

export const theoryApi = {
  search: searchTheory,
  concept: getConcept,
  examples: listExamples,
  related: getRelated,
  sources: getConceptSources,
  searchSources,
  bookOutline: getBookOutline,
  sourceNote: getSourceNote,
  videos: listVideoResearch,
  video: getBilibiliVideo,
  videoResearch: () => ({ season: BILIBILI_SEASON, videos: BILIBILI_VIDEOS }),
  harmonyDimensions: () => HARMONY_DIMENSIONS,
  bookStats: () => BOOK_STATS,
  reviewQueue: getReviewQueue,
  bibliography: () => BIBLIOGRAPHY,
  citationPolicy: () => CITATION_STYLE_NOTE,
  pack: buildKnowledgePack,
};
