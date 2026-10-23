import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { buildKnowledgePack } from "../src/lib/theory-api";

const output = resolve(process.cwd(), "public/knowledge.json");
const pack = buildKnowledgePack();
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(pack, null, 2)}\n`, "utf8");
console.log(
  `knowledge.json written: ${pack.meta.conceptCount} concepts, ${pack.meta.exampleCount} examples, ${pack.meta.citationCount} citations`,
);
