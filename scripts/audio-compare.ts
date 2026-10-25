import type { AudioAnalysis, AudioFinding } from "./audio-analyze";

export interface LoudnessTargetInput {
  preset?: string;
  label?: string;
  targetLufs?: number;
  truePeakMaxDbtp?: number;
  lraMinLu?: number;
  lraMaxLu?: number;
  toleranceLu?: number;
}

export interface ResolvedTarget {
  preset: string;
  label: string;
  targetLufs: number | null;
  truePeakMaxDbtp: number | null;
  lraMinLu: number | null;
  lraMaxLu: number | null;
  toleranceLu: number;
  note: string;
}

export interface ReferenceSummary {
  file: string | null;
  integratedLufs: number | null;
  truePeakDbtp: number;
  loudnessRangeLu: number | null;
  crestFactorDb: number;
  peakToLoudnessDb: number | null;
}

export interface ReferenceDeltas {
  lufs: number | null;
  truePeak: number | null;
  lra: number | null;
  crest: number | null;
  peakToLoudness: number | null;
}

export interface BandComparison {
  name: string;
  centerHz: number;
  mixSharePercent: number;
  referenceSharePercent: number;
  deltaDb: number | null;
}

export interface AudioComparison {
  target: ResolvedTarget | null;
  targetDeltas: {
    lufs: number | null;
    truePeakMarginDb: number | null;
    lraInRange: boolean | null;
  } | null;
  reference: ReferenceSummary | null;
  referenceDeltas: ReferenceDeltas | null;
  bands: BandComparison[];
  findings: AudioFinding[];
}

const STREAMING_TARGET: ResolvedTarget = {
  preset: "streaming",
  label: "通用流媒体检查",
  targetLufs: -14,
  truePeakMaxDbtp: -1,
  lraMinLu: 3,
  lraMaxLu: 12,
  toleranceLu: 1,
  note: "-14 LUFS / -1 dBTP 是通用检查值，不代表各平台强制标准；LRA 3–12 LU 只是宽泛提醒。",
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function readOptionalNumber(record: Record<string, unknown>, key: string): number | undefined {
  const value = record[key];
  if (value === undefined || value === null || value === "") return undefined;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
}

export function resolveTarget(input: unknown): ResolvedTarget | null {
  if (typeof input === "string") {
    if (!input.trim() || input === "none") return null;
    if (input === "streaming") return { ...STREAMING_TARGET };
    throw new Error(`未知目标预设：${input}`);
  }
  const record = asRecord(input);
  if (!record) return null;
  const preset = typeof record.preset === "string" ? record.preset : "";
  if (preset === "streaming") return { ...STREAMING_TARGET };
  const targetLufs = readOptionalNumber(record, "targetLufs");
  const truePeakMaxDbtp = readOptionalNumber(record, "truePeakMaxDbtp");
  const lraMinLu = readOptionalNumber(record, "lraMinLu");
  const lraMaxLu = readOptionalNumber(record, "lraMaxLu");
  const toleranceLu = readOptionalNumber(record, "toleranceLu") ?? 1;
  if (
    targetLufs === undefined &&
    truePeakMaxDbtp === undefined &&
    lraMinLu === undefined &&
    lraMaxLu === undefined
  ) {
    return null;
  }
  if (lraMinLu !== undefined && lraMaxLu !== undefined && lraMinLu > lraMaxLu) {
    throw new Error("LRA 目标范围无效：min 大于 max。");
  }
  return {
    preset: preset || "custom",
    label: typeof record.label === "string" && record.label.trim() ? record.label.trim() : "自定义目标",
    targetLufs: targetLufs ?? null,
    truePeakMaxDbtp: truePeakMaxDbtp ?? null,
    lraMinLu: lraMinLu ?? null,
    lraMaxLu: lraMaxLu ?? null,
    toleranceLu: Math.max(0.1, toleranceLu),
    note: "目标是用户设定的检查值，不是对风格或平台的强制判断。",
  };
}

function referenceSummary(analysis: AudioAnalysis): ReferenceSummary {
  return {
    file: analysis.file,
    integratedLufs: analysis.integratedLufs,
    truePeakDbtp: analysis.truePeakDbtp,
    loudnessRangeLu: analysis.loudnessRangeLu,
    crestFactorDb: analysis.truePeakCrestDb,
    peakToLoudnessDb: analysis.truePeakToLoudnessDb,
  };
}

function compareBands(mix: AudioAnalysis, reference: AudioAnalysis): BandComparison[] {
  if (!mix.spectrum || !reference.spectrum) return [];
  const referenceBands = new Map(
    reference.spectrum.bands.map((band) => [band.name, band.sharePercent]),
  );
  return mix.spectrum.bands.map((band) => {
    const referenceSharePercent = referenceBands.get(band.name);
    const deltaDb =
      referenceSharePercent !== undefined &&
      band.sharePercent > 0 &&
      referenceSharePercent > 0
        ? 10 * Math.log10(band.sharePercent / referenceSharePercent)
        : null;
    return {
      name: band.name,
      centerHz: band.centerHz,
      mixSharePercent: band.sharePercent,
      referenceSharePercent: referenceSharePercent ?? 0,
      deltaDb,
    };
  });
}

export function compareAudioAnalyses(
  mix: AudioAnalysis,
  reference: AudioAnalysis | null,
  targetInput: unknown,
): AudioComparison | null {
  const target = resolveTarget(targetInput);
  if (!target && !reference) return null;
  const findings: AudioFinding[] = [];

  let targetDeltas: AudioComparison["targetDeltas"] = null;
  if (target) {
    const lufs =
      target.targetLufs !== null && mix.integratedLufs !== null
        ? mix.integratedLufs - target.targetLufs
        : null;
    const truePeakMarginDb =
      target.truePeakMaxDbtp !== null ? target.truePeakMaxDbtp - mix.truePeakDbtp : null;
    const lraInRange =
      target.lraMinLu !== null &&
      target.lraMaxLu !== null &&
      mix.loudnessRangeLu !== null
        ? mix.loudnessRangeLu >= target.lraMinLu &&
          mix.loudnessRangeLu <= target.lraMaxLu
        : null;
    targetDeltas = { lufs, truePeakMarginDb, lraInRange };

    if (target.targetLufs !== null) {
      if (mix.integratedLufs === null) {
        findings.push({
          code: "target-lufs-unavailable",
          severity: "info",
          message: "无法计算 integrated LUFS（文件太短或全静音），不能与响度目标比较。",
        });
      } else if (Math.abs(lufs!) > target.toleranceLu) {
        findings.push({
          code: "target-lufs",
          severity: Math.abs(lufs!) > target.toleranceLu * 2 ? "warn" : "info",
          message: `integrated LUFS 为 ${mix.integratedLufs.toFixed(1)}，比目标 ${target.targetLufs} ${
            lufs! > 0 ? "高" : "低"
          } ${Math.abs(lufs!).toFixed(1)} LU。`,
          suggestion: `目标容差 ±${target.toleranceLu} LU；注意流媒体平台会做响度归一化。`,
        });
      }
    }
    if (truePeakMarginDb !== null) {
      if (truePeakMarginDb < 0) {
        findings.push({
          code: "target-true-peak",
          severity: "risk",
          message: `true peak 为 ${mix.truePeakDbtp.toFixed(2)} dBTP，超过目标上限 ${target.truePeakMaxDbtp} dBTP。`,
          suggestion: "降低 limiter 输出或总线电平，按 dBTP 留余量。",
        });
      } else if (truePeakMarginDb < 0.5) {
        findings.push({
          code: "target-true-peak-margin",
          severity: "warn",
          message: `true peak 距离目标上限只有 ${truePeakMarginDb.toFixed(2)} dB。`,
        });
      }
    }
    if (target.lraMinLu !== null && target.lraMaxLu !== null) {
      if (mix.loudnessRangeLu === null) {
        findings.push({
          code: "target-lra-unavailable",
          severity: "info",
          message: "LRA 不可用（文件太短），不能与目标范围比较。",
        });
      } else if (!lraInRange) {
        findings.push({
          code: "target-lra",
          severity: "warn",
          message: `LRA 为 ${mix.loudnessRangeLu.toFixed(1)} LU，目标范围 ${target.lraMinLu}–${target.lraMaxLu} LU。`,
        });
      }
    }
  }

  let referenceDeltas: ReferenceDeltas | null = null;
  let bands: BandComparison[] = [];
  if (reference) {
    referenceDeltas = {
      lufs:
        mix.integratedLufs !== null && reference.integratedLufs !== null
          ? mix.integratedLufs - reference.integratedLufs
          : null,
      truePeak: mix.truePeakDbtp - reference.truePeakDbtp,
      lra:
        mix.loudnessRangeLu !== null && reference.loudnessRangeLu !== null
          ? mix.loudnessRangeLu - reference.loudnessRangeLu
          : null,
      crest: mix.truePeakCrestDb - reference.truePeakCrestDb,
      peakToLoudness:
        mix.truePeakToLoudnessDb !== null && reference.truePeakToLoudnessDb !== null
          ? mix.truePeakToLoudnessDb - reference.truePeakToLoudnessDb
          : null,
    };
    if (referenceDeltas.lufs !== null && Math.abs(referenceDeltas.lufs) > 3) {
      findings.push({
        code: "reference-loudness",
        severity: "info",
        message: `与参考轨的 integrated LUFS 相差 ${referenceDeltas.lufs.toFixed(1)} LU（参考不是投放目标，比较频段前先做音量匹配）。`,
      });
    }
    bands = compareBands(mix, reference);
    const significant = bands
      .filter(
        (band) =>
          band.deltaDb !== null &&
          Math.abs(band.deltaDb) >= 6 &&
          Math.max(band.mixSharePercent, band.referenceSharePercent) >= 1,
      )
      .sort((a, b) => Math.abs(b.deltaDb!) - Math.abs(a.deltaDb!))
      .slice(0, 3);
    for (const band of significant) {
      const oneSided = band.mixSharePercent < 0.5 || band.referenceSharePercent < 0.5;
      findings.push({
        code: "reference-band",
        severity: "info",
        message: oneSided
          ? `相对参考，${band.name} 频段只在${
              band.mixSharePercent >= band.referenceSharePercent ? "混音" : "参考"
            }中有明显能量（${band.mixSharePercent.toFixed(1)}% vs ${band.referenceSharePercent.toFixed(1)}%）。`
          : `相对参考，${band.name} 频段${band.deltaDb! > 0 ? "多" : "少"} ${Math.abs(
              band.deltaDb!,
            ).toFixed(1)} dB（${band.mixSharePercent.toFixed(1)}% vs ${band.referenceSharePercent.toFixed(1)}%）。`,
      });
    }
    if (bands.length === 0) {
      findings.push({
        code: "reference-spectrum-unavailable",
        severity: "info",
        message: "参考轨没有可用频谱，未做频段对比。",
      });
    }
  }

  const severityRank = { risk: 0, warn: 1, info: 2 } as const;
  findings.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);

  return {
    target,
    targetDeltas,
    reference: reference ? referenceSummary(reference) : null,
    referenceDeltas,
    bands,
    findings,
  };
}
