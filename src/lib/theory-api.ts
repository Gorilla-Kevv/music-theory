import {
  ALL_EXAMPLES,
  BIBLIOGRAPHY,
  CATEGORIES,
  CITATION_STYLE_NOTE,
  CONCEPTS,
  CONCEPT_BY_SLUG,
  collectCitations,
  getConcept,
} from "../content";
import type { CategoryId, Concept, Example, Level } from "../content/types";
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
    name: "get_bibliography",
    description: "返回三本理论著作的完整书目、版次与章节定位说明。",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_citation_policy",
    description: "返回本知识库的论文式引用体例与章节级定位规则。",
    inputSchema: { type: "object", properties: {} },
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
    language: string;
    licenseNote: string;
  };
  citationStyle: string;
  bibliography: typeof BIBLIOGRAPHY;
  categories: typeof CATEGORIES;
  concepts: Concept[];
  examples: Array<Example & { conceptSlug: string; conceptTitle: string; category: string }>;
  toolSchemas: ToolSchema[];
}

export function buildKnowledgePack(): KnowledgePack {
  return {
    meta: {
      name: "TONIC · 主音",
      version: "0.1.0",
      builtAt: new Date().toISOString(),
      conceptCount: CONCEPTS.length,
      exampleCount: ALL_EXAMPLES.length,
      citationCount: CONCEPTS.reduce((sum, concept) => sum + collectCitations(concept).length, 0),
      language: "zh-CN + en",
      licenseNote:
        "知识条目为原创改写，引用仅作章节级学术定位；不得把本库内容当作三本著作的替代版本。",
    },
    citationStyle: CITATION_STYLE_NOTE,
    bibliography: BIBLIOGRAPHY,
    categories: CATEGORIES,
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
  reviewQueue: getReviewQueue,
  bibliography: () => BIBLIOGRAPHY,
  citationPolicy: () => CITATION_STYLE_NOTE,
  pack: buildKnowledgePack,
};
