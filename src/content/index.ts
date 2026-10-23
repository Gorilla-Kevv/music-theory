import { FOUNDATIONS } from "./foundations";
import { HARMONY } from "./harmony";
import { HARMONY_ADVANCED } from "./harmony-advanced";
import { JAZZ } from "./jazz";
import { JAZZ_ADVANCED } from "./jazz-advanced";
import type { Category, CitationRef, Concept, Example, HarmonyDimension } from "./types";

export * from "./types";
export * from "./books";
export { BIBLIOGRAPHY, BIBLIOGRAPHY_BY_ID, CITATION_STYLE_NOTE } from "./bibliography";

export const CATEGORIES: Category[] = [
  {
    id: "foundations",
    name: "基础",
    nameEn: "FOUNDATIONS",
    token: "cobalt",
    description: "音高、音程、音阶、调式与和弦的构件。",
  },
  {
    id: "harmony",
    name: "功能和声",
    nameEn: "FUNCTIONAL HARMONY",
    token: "cadmium",
    description: "级数、声部进行、终止、离调与转调。",
  },
  {
    id: "jazz",
    name: "爵士语言",
    nameEn: "JAZZ LANGUAGE",
    token: "acid",
    description: "ii–V–I、和弦音阶、替代与曲式。",
  },
];

const CATEGORY_ORDER = { foundations: 0, harmony: 1, jazz: 2 } as const;

const conceptNumber = (concept: Concept) => concept.number.split("-")[1] ?? "";

export const CONCEPTS: Concept[] = [
  ...FOUNDATIONS,
  ...HARMONY,
  ...HARMONY_ADVANCED,
  ...JAZZ,
  ...JAZZ_ADVANCED,
].sort((a, b) => {
  const categoryDelta = CATEGORY_ORDER[a.category] - CATEGORY_ORDER[b.category];
  if (categoryDelta !== 0) return categoryDelta;
  return conceptNumber(a).localeCompare(conceptNumber(b));
});

export const CONCEPT_BY_SLUG = Object.fromEntries(
  CONCEPTS.map((concept) => [concept.slug, concept]),
) as Record<string, Concept>;

export const CONCEPT_BY_ID = Object.fromEntries(
  CONCEPTS.map((concept) => [concept.id, concept]),
) as Record<string, Concept>;

export const getConcept = (slug: string): Concept | undefined => CONCEPT_BY_SLUG[slug];

export const getCategory = (id: string): Category | undefined =>
  CATEGORIES.find((category) => category.id === id);

export interface ExampleWithContext extends Example {
  conceptSlug: string;
  conceptTitle: string;
  category: string;
}

export const ALL_EXAMPLES: ExampleWithContext[] = CONCEPTS.flatMap((concept) =>
  concept.examples.map((example) => ({
    ...example,
    conceptSlug: concept.slug,
    conceptTitle: concept.title,
    category: concept.category,
  })),
);

export const getConceptExamples = (slug: string): ExampleWithContext[] =>
  ALL_EXAMPLES.filter((example) => example.conceptSlug === slug);

export const getRelatedConcepts = (concept: Concept): Concept[] =>
  concept.related
    .map((slug) => CONCEPT_BY_SLUG[slug])
    .filter((related): related is Concept => Boolean(related));

export const citationKey = (ref: CitationRef) => `${ref.source}::${ref.locator}`;

export interface NumberedCitation {
  ref: CitationRef;
  number: number;
}

export function collectCitations(concept: Concept): NumberedCitation[] {
  const seen = new Map<string, NumberedCitation>();
  for (const section of concept.sections) {
    for (const block of section.blocks) {
      for (const ref of block.cites ?? []) {
        const key = citationKey(ref);
        if (!seen.has(key)) {
          seen.set(key, { ref, number: seen.size + 1 });
        }
      }
    }
  }
  return [...seen.values()];
}

export function citationNumberMap(concept: Concept): Map<string, number> {
  return new Map(
    collectCitations(concept).map(({ ref, number }) => [citationKey(ref), number]),
  );
}

export const TOTAL_CITATIONS = CONCEPTS.reduce(
  (sum, concept) => sum + collectCitations(concept).length,
  0,
);

export const getConceptsForDimension = (dimension: HarmonyDimension): Concept[] =>
  CONCEPTS.filter((concept) => concept.dimensions?.includes(dimension));

export const HARMONY_CONCEPTS = CONCEPTS.filter((concept) => concept.category === "harmony");
