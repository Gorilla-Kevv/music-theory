import MiniSearch, { type SearchResult } from "minisearch";
import { CONCEPTS, CONCEPT_BY_SLUG } from "../content";
import type { CategoryId, Concept, Level } from "../content/types";

interface SearchDocument {
  id: string;
  slug: string;
  number: string;
  title: string;
  titleEn: string;
  aliases: string[];
  tags: string[];
  summary: string;
  body: string;
  category: CategoryId;
  level: Level;
}

export interface ConceptHit {
  concept: Concept;
  score: number;
}

export interface SearchFilters {
  category?: CategoryId;
  level?: Level;
  limit?: number;
}

function tokenize(text: string): string[] {
  const normalized = text.toLowerCase().normalize("NFKC").replace(/[’']/g, "");
  const latin = normalized.match(/[a-z0-9]+/g) ?? [];
  const runs = normalized.match(/[\u3400-\u9fff]+/g) ?? [];
  const tokens: string[] = [...latin];

  for (const run of runs) {
    tokens.push(run);
    for (let index = 0; index < run.length; index += 1) {
      tokens.push(run[index]);
    }
    for (let index = 0; index < run.length - 1; index += 1) {
      tokens.push(run.slice(index, index + 2));
    }
  }
  return tokens;
}

function conceptBody(concept: Concept): string {
  const sectionText = concept.sections
    .map((section) => {
      const blocks = section.blocks
        .map((block) => [block.title, block.text, ...(block.items ?? [])].filter(Boolean).join(" "))
        .join(" ");
      return `${section.heading} ${blocks}`;
    })
    .join(" ");
  const examples = concept.examples
    .map((example) => `${example.title} ${example.caption}`)
    .join(" ");
  return `${sectionText} ${examples}`;
}

const DOCUMENTS: SearchDocument[] = CONCEPTS.map((concept) => ({
  id: concept.id,
  slug: concept.slug,
  number: concept.number,
  title: concept.title,
  titleEn: concept.titleEn,
  aliases: concept.aliases,
  tags: concept.tags,
  summary: concept.summary,
  body: conceptBody(concept),
  category: concept.category,
  level: concept.level,
}));

const miniSearch = new MiniSearch<SearchDocument>({
  fields: ["title", "titleEn", "aliases", "tags", "summary", "body"],
  storeFields: [
    "slug",
    "number",
    "title",
    "titleEn",
    "aliases",
    "tags",
    "summary",
    "category",
    "level",
  ],
  tokenize,
  processTerm: (term) => term.toLowerCase(),
  searchOptions: {
    boost: { title: 5, titleEn: 4, aliases: 4, tags: 2.5, summary: 1.4, body: 0.8 },
    fuzzy: 0.2,
    prefix: true,
    combineWith: "OR",
  },
});

miniSearch.addAll(DOCUMENTS);

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, "");
}

function conceptSearchText(concept: Concept): string {
  return normalize(
    [
      concept.title,
      concept.titleEn,
      ...concept.aliases,
      ...concept.tags,
      concept.summary,
      conceptBody(concept),
    ].join(" "),
  );
}

function exactnessBoost(concept: Concept, query: string): number {
  const target = normalize(query);
  if (!target) return 0;
  const title = normalize(concept.title);
  const titleEn = normalize(concept.titleEn);
  const aliases = concept.aliases.map(normalize);
  let boost = 0;
  if (title === target || titleEn === target || aliases.includes(target)) boost += 12;
  if (title.startsWith(target) || titleEn.startsWith(target)) boost += 4;
  if (aliases.some((alias) => alias.startsWith(target))) boost += 3;
  return boost;
}

function fallbackSubstring(query: string): ConceptHit[] {
  const target = normalize(query);
  if (!target) return [];
  return CONCEPTS.map((concept) => {
    const haystack = normalize(
      [
        concept.title,
        concept.titleEn,
        ...concept.aliases,
        ...concept.tags,
        concept.summary,
        conceptBody(concept),
      ].join(" "),
    );
    if (!haystack.includes(target)) return null;
    const titleHit = normalize(concept.title).includes(target) ||
      normalize(concept.titleEn).includes(target);
    return { concept, score: titleHit ? 8 : 2 };
  }).filter((hit): hit is ConceptHit => Boolean(hit));
}

export function searchConcepts(query: string, filters: SearchFilters = {}): ConceptHit[] {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const results = miniSearch.search(trimmed, {
    prefix: true,
    fuzzy: 0.2,
    boost: { title: 5, titleEn: 4, aliases: 4, tags: 2.5, summary: 1.4, body: 0.8 },
  }) as SearchResult[];

  const hits = results
    .map((result) => {
      const concept = CONCEPT_BY_SLUG[String(result.slug)];
      if (!concept) return null;
      if (filters.category && concept.category !== filters.category) return null;
      if (filters.level && concept.level !== filters.level) return null;
      const score = result.score + exactnessBoost(concept, trimmed);
      return { concept, score };
    })
    .filter((hit): hit is ConceptHit => Boolean(hit));

  const fuzzyHits = hits.length > 0 ? hits : fallbackSubstring(trimmed);
  const exactTarget = normalize(trimmed);
  const exactHits =
    exactTarget.length >= 2
      ? fuzzyHits.filter((hit) => conceptSearchText(hit.concept).includes(exactTarget))
      : [];
  const merged = exactHits.length > 0 ? exactHits : fuzzyHits;
  const filtered = merged
    .filter((hit) => !filters.category || hit.concept.category === filters.category)
    .filter((hit) => !filters.level || hit.concept.level === filters.level)
    .sort((a, b) => b.score - a.score);

  return filtered.slice(0, filters.limit ?? 12);
}

export function suggestTerms(query: string): string[] {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const hits = searchConcepts(trimmed, { limit: 4 });
  const tags = hits.flatMap((hit) => hit.concept.tags);
  return [...new Set(tags)].slice(0, 6);
}
