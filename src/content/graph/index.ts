import { CONCEPTS, CONCEPT_BY_SLUG } from "../index";
import type { CategoryId, Concept, HarmonyDimension, SourceId } from "../types";

export type AtlasNodeKind = "source" | "hub" | "concept";
export type AtlasEdgeType = "source" | "system" | "related" | "prerequisite";

export interface AtlasNode {
  id: string;
  kind: AtlasNodeKind;
  label: string;
  subtitle?: string;
  x: number;
  y: number;
  category?: CategoryId;
  dimensions?: HarmonyDimension[];
  slug?: string;
  sourceId?: SourceId;
  summary?: string;
}

export interface AtlasEdge {
  id: string;
  source: string;
  target: string;
  type: AtlasEdgeType;
}

export interface AtlasHub {
  id: string;
  label: string;
  subtitle: string;
  y: number;
  category?: CategoryId;
  dimensions?: HarmonyDimension[];
  description: string;
}

export const ATLAS_WIDTH = 1200;
// 高度随概念数自适应：4 列网格，每行 98px；首行 y=55，末行底部约 45px 标签，
// 再留图例与底部内边距。
export const ATLAS_ROWS = Math.ceil(CONCEPTS.length / 4);
export const ATLAS_HEIGHT = 55 + (ATLAS_ROWS - 1) * 98 + 45 + 35 + 20;

export const ATLAS_HUBS: AtlasHub[] = [
  {
    id: "hub-foundations",
    label: "基础语法",
    subtitle: "FOUNDATIONS",
    y: 90,
    category: "foundations",
    description: "音高、音程、音阶、调式与和弦构件；所有后续体系的最小单位。",
  },
  {
    id: "hub-functional",
    label: "功能与句法",
    subtitle: "FUNCTION & PHRASE",
    y: 300,
    dimensions: ["function", "direction", "rhythm"],
    description: "T–PD–D–T、声部进行、终止、和声节奏与乐句模型。",
  },
  {
    id: "hub-color",
    label: "色彩与张力",
    subtitle: "COLOR & TENSION",
    y: 430,
    dimensions: ["color"],
    description: "协和/不协和、延伸音、变化音、四度排列、混合和弦与 voicing 色彩。",
  },
  {
    id: "hub-brightness",
    label: "明暗与调式",
    subtitle: "BRIGHTNESS & MODE",
    y: 560,
    dimensions: ["brightness"],
    description: "大调/小调、中古调式、同主音交替、调式互换、那不勒斯与调式色彩。",
  },
  {
    id: "hub-relationship",
    label: "关系与转调",
    subtitle: "RELATIONSHIP",
    y: 690,
    dimensions: ["relationship"],
    description: "调性距离、五度圈、枢轴和弦、等音关系、替代与无功能属和弦。",
  },
  {
    id: "hub-jazz",
    label: "爵士语言",
    subtitle: "JAZZ LANGUAGE",
    y: 880,
    category: "jazz",
    description: "ii–V–I、和弦音阶、重配和声、曲式与 outside。",
  },
];

const SOURCE_NODES: AtlasNode[] = [
  {
    id: "source-levine",
    kind: "source",
    label: "Levine",
    subtitle: "The Jazz Theory Book",
    x: 80,
    y: 240,
    sourceId: "levine",
    summary: "爵士和声、和弦—音阶、ii–V–I、重配和声与曲式。",
  },
  {
    id: "source-laitz",
    kind: "source",
    label: "Laitz",
    subtitle: "The Complete Musician",
    x: 80,
    y: 520,
    sourceId: "laitz",
    summary: "调性理论、声部进行、乐句模型、半音体系与曲式。",
  },
  {
    id: "source-sposobin",
    kind: "source",
    label: "Sposobin",
    subtitle: "和声学教程",
    x: 80,
    y: 820,
    sourceId: "sposobin",
    summary: "俄罗斯功能和声、连接、终止、离调、转调与变和弦。",
  },
];

const SOURCE_HUBS: Record<SourceId, string[]> = {
  levine: ["hub-color", "hub-relationship", "hub-jazz"],
  laitz: ["hub-foundations", "hub-functional", "hub-color", "hub-brightness", "hub-relationship"],
  sposobin: ["hub-functional", "hub-brightness", "hub-relationship"],
  soundquest: [],
};

const PREREQUISITES: Array<[string, string]> = [
  ["intervals", "triads"],
  ["triads", "seventh-chords"],
  ["seventh-chords", "ii-v-i"],
  ["roman-numerals", "voice-leading"],
  ["voice-leading", "cadences"],
  ["cadences", "phrase-structure"],
  ["predominant", "ii-v-i"],
  ["circle-of-fifths", "modulation"],
  ["secondary-dominants", "modulation"],
  ["tonal-distance", "modulation"],
  ["diminished-seventh", "tonal-distance"],
  ["guide-tones", "ii-v-i"],
  ["chord-scale", "harmonic-color"],
  ["extensions-alterations", "harmonic-color"],
  ["tritone-substitution", "ii-v-i"],
  ["modal-mixture-color", "borrowed-chords"],
  ["harmonic-rhythm", "phrase-structure"],
  ["bass-line", "voice-leading"],
  ["blues", "rhythm-changes"],
  ["modes", "modal-harmony"],
  ["tonal-distance", "coltrane-changes"],
  ["harmonic-color", "rootless-voicings"],
  ["rootless-voicings", "ii-v-i"],
  ["bebop-scale", "blues"],
  ["coltrane-changes", "rootless-voicings"],
  ["modes", "modal-characteristics"],
  ["modal-characteristics", "modal-interchange"],
  ["modal-interchange", "quartal-harmony"],
  ["bass-line", "hybrid-chords"],
  ["secondary-dominants", "non-functional-dominants"],
  ["harmonic-sequence", "constant-structure"],
  ["quartal-harmony", "constant-structure"],
  ["minor-scales", "melodic-minor-modes"],
  ["chord-scale", "melodic-minor-modes"],
  ["meter-syncopation", "harmonic-rhythm"],
  ["meter-syncopation", "phrase-structure"],
  ["melody-motives", "phrase-structure"],
  ["non-chord-tones", "cadential-six-four"],
  ["voice-leading", "non-chord-tones"],
  ["triads", "suspended-chords"],
  ["suspended-chords", "quartal-harmony"],
  ["diminished-seventh", "symmetric-scales"],
  ["chord-scale", "symmetric-scales"],
  ["major-scale", "pentatonic-scales"],
  ["pentatonic-scales", "pentatonic-outside"],
  ["intervals", "harmonic-series"],
  ["roman-numerals", "connection-system"],
  ["harmonic-sequence", "connection-system"],
  ["non-functional-dominants", "axis-system"],
  ["tritone-substitution", "axis-system"],
  ["harmonic-sequence", "neo-riemannian"],
  ["modal-mixture-color", "neo-riemannian"],
  ["modal-characteristics", "lydian-chromatic-concept"],
  ["chord-scale", "lydian-chromatic-concept"],
  ["intervals", "tonal-gravity"],
  ["non-chord-tones", "tonal-gravity"],
  ["meter-syncopation", "shuffle-beat"],
  ["blues", "shuffle-beat"],
  ["connection-system", "royal-road"],
  ["roman-numerals", "royal-road"],
  ["modulation", "pop-modulation"],
  ["tonal-distance", "pop-modulation"],
  ["meter-syncopation", "clave"],
  ["blues", "clave"],
  ["tonal-gravity", "gaijitsu-ks"],
  ["guide-tones", "gaijitsu-ks"],
  ["non-chord-tones", "line-cliche"],
  ["bass-line", "line-cliche"],
  ["gaijitsu-ks", "harmonization"],
  ["roman-numerals", "harmonization"],
  ["roman-numerals", "metatheory"],
  ["metatheory", "harmonic-polysemy"],
  ["roman-numerals", "harmonic-polysemy"],
  ["secondary-dominants", "harmonic-polysemy"],
  ["tonal-distance", "harmonic-polysemy"],
  ["diminished-seventh", "passing-chords"],
  ["secondary-dominants", "passing-chords"],
  ["bass-line", "passing-chords"],
  ["harmonic-polysemy", "passing-chords"],
];

function hubForConcept(slug: string): AtlasHub {
  const concept = CONCEPT_BY_SLUG[slug];
  if (!concept) return ATLAS_HUBS[1];
  if (concept.category === "foundations") return ATLAS_HUBS[0];
  if (concept.category === "jazz") return ATLAS_HUBS[5];
  const dimensions = concept.dimensions ?? [];
  if (dimensions.includes("color") && !dimensions.includes("relationship")) return ATLAS_HUBS[2];
  if (dimensions.includes("brightness")) return ATLAS_HUBS[3];
  if (dimensions.includes("relationship")) return ATLAS_HUBS[4];
  return ATLAS_HUBS[1];
}

function conceptPosition(index: number): { x: number; y: number } {
  const columns = 4;
  const column = index % columns;
  const row = Math.floor(index / columns);
  return { x: 640 + column * 155, y: 55 + row * 98 };
}

function buildGraph() {
  const nodes: AtlasNode[] = [...SOURCE_NODES];
  const edges: AtlasEdge[] = [];

  for (const hub of ATLAS_HUBS) {
    nodes.push({
      id: hub.id,
      kind: "hub",
      label: hub.label,
      subtitle: hub.subtitle,
      x: 350,
      y: hub.y,
      dimensions: hub.dimensions,
      category: hub.category,
      summary: hub.description,
    });
  }

  CONCEPTS.forEach((concept, index) => {
    const position = conceptPosition(index);
    nodes.push({
      id: `concept-${concept.slug}`,
      kind: "concept",
      label: concept.title,
      subtitle: concept.number,
      x: position.x,
      y: position.y,
      category: concept.category,
      dimensions: concept.dimensions,
      slug: concept.slug,
      summary: concept.summary,
    });

    const hub = hubForConcept(concept.slug);
    edges.push({
      id: `hub-${concept.slug}`,
      source: hub.id,
      target: `concept-${concept.slug}`,
      type: "system",
    });

    for (const dimension of concept.dimensions ?? []) {
      const dimensionHub = ATLAS_HUBS.find((item) => item.dimensions?.includes(dimension));
      if (dimensionHub && dimensionHub.id !== hub.id) {
        edges.push({
          id: `dim-${dimensionHub.id}-${concept.slug}`,
          source: dimensionHub.id,
          target: `concept-${concept.slug}`,
          type: "system",
        });
      }
    }
  });

  for (const source of SOURCE_NODES) {
    if (!source.sourceId) continue;
    for (const hubId of SOURCE_HUBS[source.sourceId]) {
      edges.push({
        id: `src-${source.id}-${hubId}`,
        source: source.id,
        target: hubId,
        type: "source",
      });
    }
  }

  const relationSeen = new Set<string>();
  for (const concept of CONCEPTS) {
    for (const related of concept.related) {
      if (!CONCEPT_BY_SLUG[related]) continue;
      const pair = [concept.slug, related].sort().join("|");
      if (relationSeen.has(pair)) continue;
      relationSeen.add(pair);
      edges.push({
        id: `rel-${pair}`,
        source: `concept-${concept.slug}`,
        target: `concept-${related}`,
        type: "related",
      });
    }
  }

  for (const [source, target] of PREREQUISITES) {
    if (!CONCEPT_BY_SLUG[source] || !CONCEPT_BY_SLUG[target]) continue;
    edges.push({
      id: `pre-${source}-${target}`,
      source: `concept-${source}`,
      target: `concept-${target}`,
      type: "prerequisite",
    });
  }

  return { nodes, edges };
}

export const ATLAS_GRAPH = buildGraph();

export function getAtlasNode(id: string): AtlasNode | undefined {
  return ATLAS_GRAPH.nodes.find((node) => node.id === id);
}

export function getConceptHubs(slug: string): AtlasHub[] {
  const node = ATLAS_GRAPH.nodes.find((item) => item.slug === slug);
  if (!node) return [];
  return ATLAS_HUBS.filter((hub) =>
    ATLAS_GRAPH.edges.some(
      (edge) =>
        edge.target === node.id &&
        edge.source === hub.id &&
        edge.type === "system",
    ),
  );
}

export function getPrerequisites(slug: string): Concept[] {
  return ATLAS_GRAPH.edges
    .filter((edge) => edge.type === "prerequisite" && edge.target === `concept-${slug}`)
    .map((edge) => CONCEPT_BY_SLUG[edge.source.replace("concept-", "")])
    .filter((concept): concept is Concept => Boolean(concept));
}

export function getNextConcepts(slug: string): Concept[] {
  return ATLAS_GRAPH.edges
    .filter((edge) => edge.type === "prerequisite" && edge.source === `concept-${slug}`)
    .map((edge) => CONCEPT_BY_SLUG[edge.target.replace("concept-", "")])
    .filter((concept): concept is Concept => Boolean(concept));
}

function directPrerequisiteSlugs(slug: string): string[] {
  return ATLAS_GRAPH.edges
    .filter((edge) => edge.type === "prerequisite" && edge.target === `concept-${slug}`)
    .map((edge) => edge.source.replace("concept-", ""));
}

function directNextSlugs(slug: string): string[] {
  return ATLAS_GRAPH.edges
    .filter((edge) => edge.type === "prerequisite" && edge.source === `concept-${slug}`)
    .map((edge) => edge.target.replace("concept-", ""));
}

function collectChainDepths(
  start: string,
  direction: "prerequisites" | "next",
): Map<string, number> {
  const depths = new Map<string, number>();
  const walk = (slug: string, depth: number) => {
    if (depth > CONCEPTS.length) return;
    const nextSlugs =
      direction === "prerequisites" ? directPrerequisiteSlugs(slug) : directNextSlugs(slug);
    for (const nextSlug of nextSlugs) {
      const nextDepth = depth + 1;
      if ((depths.get(nextSlug) ?? -1) >= nextDepth) continue;
      depths.set(nextSlug, nextDepth);
      walk(nextSlug, nextDepth);
    }
  };
  walk(start, 0);
  return depths;
}

function chainFromDepths(
  depths: Map<string, number>,
  order: "far-first" | "near-first",
): Concept[] {
  return [...depths.entries()]
    .sort(([aSlug, aDepth], [bSlug, bDepth]) => {
      const depthDelta = order === "far-first" ? bDepth - aDepth : aDepth - bDepth;
      if (depthDelta !== 0) return depthDelta;
      const a = CONCEPT_BY_SLUG[aSlug];
      const b = CONCEPT_BY_SLUG[bSlug];
      return (a?.number ?? "").localeCompare(b?.number ?? "");
    })
    .map(([slug]) => CONCEPT_BY_SLUG[slug])
    .filter((concept): concept is Concept => Boolean(concept));
}

export function getPrerequisiteChain(slug: string): Concept[] {
  if (!CONCEPT_BY_SLUG[slug]) return [];
  return chainFromDepths(collectChainDepths(slug, "prerequisites"), "far-first");
}

export function getNextChain(slug: string): Concept[] {
  if (!CONCEPT_BY_SLUG[slug]) return [];
  return chainFromDepths(collectChainDepths(slug, "next"), "near-first");
}

export const ATLAS_STATS = {
  concepts: CONCEPTS.length,
  hubs: ATLAS_HUBS.length,
  sources: SOURCE_NODES.length,
  relations: ATLAS_GRAPH.edges.filter((edge) => edge.type === "related").length,
  prerequisites: ATLAS_GRAPH.edges.filter((edge) => edge.type === "prerequisite").length,
};
