import { resolve } from "node:path";
import { analyzeWavFile } from "./audio-analyze";

const input = process.argv[2];
if (!input) {
  console.error("用法：npm run audio:analyze -- <混音文件.wav>");
  process.exit(1);
}
try {
  const analysis = await analyzeWavFile(resolve(input));
  console.log(JSON.stringify(analysis, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
