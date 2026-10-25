import { resolve } from "node:path";
import { analyzeWavFile } from "./audio-analyze";
import { compareAudioAnalyses, type LoudnessTargetInput } from "./audio-compare";

function usage(): never {
  console.error(`用法：
  npm run audio:analyze -- <混音文件.wav> [选项]

选项：
  --reference <参考.wav>     与参考轨比较响度/频段
  --preset streaming         使用通用流媒体检查目标（-14 LUFS / -1 dBTP）
  --lufs <n>                 自定义 integrated LUFS 目标
  --lra-min <n>              自定义 LRA 下限
  --lra-max <n>              自定义 LRA 上限
  --tp <n>                   自定义 true peak 上限（dBTP）
  --tolerance <n>            LUFS 容差，默认 1 LU`);
  process.exit(1);
}

const args = process.argv.slice(2);
if (!args.length || args.includes("--help") || args.includes("-h")) usage();

let input: string | undefined;
let reference: string | undefined;
let preset: string | undefined;
let custom: LoudnessTargetInput | undefined;

function takeValue(index: number, flag: string): string {
  const value = args[index];
  if (!value || value.startsWith("--")) throw new Error(`${flag} 缺少参数值。`);
  return value;
}

function numberValue(index: number, flag: string): number {
  const value = Number(takeValue(index, flag));
  if (!Number.isFinite(value)) throw new Error(`${flag} 需要数字。`);
  return value;
}

try {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--reference") {
      reference = takeValue((index += 1), arg);
    } else if (arg === "--preset") {
      preset = takeValue((index += 1), arg);
    } else if (arg === "--lufs") {
      custom = { ...(custom ?? {}), preset: "custom", targetLufs: numberValue((index += 1), arg) };
    } else if (arg === "--lra-min") {
      custom = { ...(custom ?? {}), preset: "custom", lraMinLu: numberValue((index += 1), arg) };
    } else if (arg === "--lra-max") {
      custom = { ...(custom ?? {}), preset: "custom", lraMaxLu: numberValue((index += 1), arg) };
    } else if (arg === "--tp" || arg === "--true-peak") {
      custom = {
        ...(custom ?? {}),
        preset: "custom",
        truePeakMaxDbtp: numberValue((index += 1), arg),
      };
    } else if (arg === "--tolerance") {
      custom = { ...(custom ?? {}), preset: "custom", toleranceLu: numberValue((index += 1), arg) };
    } else if (!arg.startsWith("--")) {
      if (!input) input = arg;
      else throw new Error(`多余的参数：${arg}`);
    } else {
      throw new Error(`未知选项：${arg}`);
    }
  }

  if (!input) usage();
  const analysis = await analyzeWavFile(resolve(input));
  const referenceAnalysis = reference ? await analyzeWavFile(resolve(reference)) : null;
  const target = custom ?? preset;
  const comparison = compareAudioAnalyses(analysis, referenceAnalysis, target);
  console.log(JSON.stringify(comparison ? { ...analysis, comparison } : analysis, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
