import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  buildKnowledgePack,
  getRelated,
  listExamples,
  listVideoResearch,
  searchSources,
  searchTheory,
  TOOL_SCHEMAS,
} from "../src/lib/theory-api";
import {
  BIBLIOGRAPHY,
  BOOK_OUTLINES,
  CITATION_STYLE_NOTE,
  getConcept,
  getSourceNote,
} from "../src/content";
import { getReviewQueue } from "../src/lib/theory-api";

const args = process.argv.slice(2);
const jsonFlag = args.includes("--json");
const OPTION_VALUE = new Set([
  "book",
  "dimension",
  "category",
  "level",
  "limit",
  "state",
  "out",
  "concept",
  "kind",
  "status",
  "query",
  "theme",
]);
const positional: string[] = [];
for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (arg.startsWith("--")) {
    const name = arg.slice(2);
    if (OPTION_VALUE.has(name) && args[index + 1] && !args[index + 1].startsWith("--")) {
      index += 1;
    }
    continue;
  }
  positional.push(arg);
}
const [command, ...rest] = positional;

function option(name: string): string | undefined {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : undefined;
}

function printJson(value: unknown): void {
  console.log(JSON.stringify(value, null, 2));
}

function printHelp(): void {
  console.log(`
TONIC theory CLI — 本地乐理知识库

  npm run theory -- search <query> [--category foundations|harmony|jazz] [--limit 8] [--json]
  npm run theory -- concept <slug> [--json]
  npm run theory -- examples [--concept <slug>] [--kind melody|chord|progression|scale] [--json]
  npm run theory -- related <slug> [--json]
  npm run theory -- refs [--json]
  npm run theory -- books [--book <id>] [--json]
  npm run theory -- source <chapterId> [--json]
  npm run theory -- sources <query> [--book <id>] [--dimension <id>] [--json]
  npm run theory -- videos [--status read|catalogued] [--query <text>] [--theme <text>] [--json]
  npm run theory -- policy [--json]
  npm run theory -- tools [--json]
  npm run theory -- queue --state <review-state.json> [--json]
  npm run theory -- pack [--out public/knowledge.json]
`);
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

if (!command || command === "help") {
  printHelp();
  process.exit(0);
}

if (command === "search") {
  const query = rest.join(" ").trim();
  if (!query) fail("Usage: search <query>");
  const limit = Number(option("limit") ?? 8);
  const results = searchTheory(query, {
    category: option("category") as never,
    level: option("level") as never,
    limit,
  });
  if (jsonFlag) printJson(results);
  else {
    for (const result of results) {
      console.log(`${result.number}  ${result.title} / ${result.titleEn}  [${result.category}]  → ${result.url}`);
    }
    if (results.length === 0) console.log("No matches.");
  }
  process.exit(0);
}

if (command === "concept") {
  const slug = rest[0];
  if (!slug) fail("Usage: concept <slug>");
  const concept = getConcept(slug);
  if (!concept) fail(`Concept not found: ${slug}`);
  if (jsonFlag) printJson(concept);
  else {
    console.log(`${concept.number} ${concept.title} / ${concept.titleEn}`);
    console.log(`${concept.summary}\n`);
    for (const section of concept.sections) {
      console.log(`## ${section.heading}`);
      for (const block of section.blocks) {
        if (block.text) console.log(block.text);
        for (const item of block.items ?? []) console.log(`- ${item}`);
        for (const cite of block.cites ?? []) console.log(`  [${cite.source}] ${cite.locator}`);
      }
      console.log();
    }
    console.log("Examples:", concept.examples.map((example) => example.id).join(", "));
    console.log("Related:", concept.related.join(", "));
    console.log("Review:", concept.review.question);
  }
  process.exit(0);
}

if (command === "examples") {
  const examples = listExamples({
    concept: option("concept"),
    kind: option("kind") as never,
    category: option("category") as never,
  });
  if (jsonFlag) printJson(examples);
  else {
    for (const example of examples) {
      console.log(`${example.id}  ${example.title}  [${example.kind}]  ${example.conceptSlug}`);
    }
  }
  process.exit(0);
}

if (command === "related") {
  const slug = rest[0];
  if (!slug) fail("Usage: related <slug>");
  const related = getRelated(slug);
  if (jsonFlag) printJson(related);
  else related.forEach((item) => console.log(`${item?.slug}  ${item?.title}  [${item?.category}]`));
  process.exit(0);
}

if (command === "videos") {
  const videos = listVideoResearch({
    status: option("status") as "read" | "catalogued" | undefined,
    query: option("query"),
    theme: option("theme"),
  });
  if (jsonFlag) printJson(videos);
  else {
    for (const video of videos) {
      console.log(
        `${video.status === "read" ? "READ" : "CAT "}  ${video.bvid}  ${video.episode || "—"}  ${video.title}`,
      );
    }
    console.log(`\n${videos.length} video(s).`);
  }
  process.exit(0);
}

if (command === "refs") {
  if (jsonFlag) printJson(BIBLIOGRAPHY);
  else {
    for (const entry of BIBLIOGRAPHY) {
      console.log(`${entry.authors}. ${entry.title}. ${entry.publisher}, ${entry.year}. ${entry.edition}.`);
      console.log(`  ${entry.role}`);
      console.log(`  ${entry.locatorNote}\n`);
    }
  }
  process.exit(0);
}

if (command === "books") {
  const book = option("book") as "levine" | "laitz" | "sposobin" | undefined;
  const books = book
    ? BOOK_OUTLINES.filter((item) => item.id === book)
    : BOOK_OUTLINES;
  if (jsonFlag) printJson(books);
  else {
    for (const item of books) {
      console.log(`${item.id}: ${item.chapters.length} chapters, ${item.noteCount} notes`);
    }
  }
  process.exit(0);
}

if (command === "source") {
  const chapterId = rest[0];
  if (!chapterId) fail("Usage: source <chapterId>");
  const note = getSourceNote(chapterId);
  if (!note) fail(`Source note not found: ${chapterId}`);
  if (jsonFlag) printJson(note);
  else {
    console.log(`${note.book} ${note.number} ${note.titleZh ?? note.title}`);
    console.log(note.summary);
    for (const point of note.keyPoints ?? []) console.log(`- ${point}`);
    console.log(`dimensions: ${(note.dimensions ?? []).join(", ")}`);
    console.log(`concepts: ${(note.concepts ?? []).join(", ")}`);
  }
  process.exit(0);
}

if (command === "sources") {
  const query = rest.join(" ").trim();
  if (!query) fail("Usage: sources <query>");
  const notes = searchSources(query, {
    book: option("book") as never,
    dimension: option("dimension") as never,
  });
  if (jsonFlag) printJson(notes);
  else {
    for (const note of notes) {
      console.log(`${note.id}  ${note.number} ${note.titleZh ?? note.title}${note.expanded ? "  [note]" : ""}`);
    }
  }
  process.exit(0);
}

if (command === "policy") {
  if (jsonFlag) printJson({ citationStyle: CITATION_STYLE_NOTE });
  else console.log(CITATION_STYLE_NOTE);
  process.exit(0);
}

if (command === "tools") {
  if (jsonFlag) printJson(TOOL_SCHEMAS);
  else TOOL_SCHEMAS.forEach((tool) => console.log(`${tool.name}: ${tool.description}`));
  process.exit(0);
}

if (command === "queue") {
  const statePath = option("state");
  if (!statePath) fail("Usage: queue --state <review-state.json>");
  const raw = readFileSync(resolve(process.cwd(), statePath), "utf8");
  const state = JSON.parse(raw) as unknown;
  const queue = getReviewQueue(state);
  if (jsonFlag) printJson(queue);
  else {
    console.log(`Due: ${queue.due.length}; New: ${queue.newCards.length}`);
    queue.due.forEach((item) => console.log(`- ${item.title}: ${item.question}`));
  }
  process.exit(0);
}

if (command === "pack") {
  const out = option("out") ?? "public/knowledge.json";
  const pack = buildKnowledgePack();
  if (jsonFlag) printJson(pack);
  else console.log(`Pack ready: ${pack.meta.conceptCount} concepts → ${out}`);
  process.exit(0);
}

fail(`Unknown command: ${command}. Run with no arguments for help.`);
