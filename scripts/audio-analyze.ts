import { readFile } from "node:fs/promises";

export interface AudioFinding {
  code: string;
  severity: "info" | "warn" | "risk";
  message: string;
  suggestion?: string;
}

export interface AudioAnalysis {
  ok: true;
  measurementAvailable: true;
  measurementNote: string;
  file: string | null;
  format: string;
  sampleRate: number;
  channels: number;
  bitDepth: number;
  frames: number;
  durationSeconds: number;
  peakDbfs: number;
  rmsDbfs: number;
  integratedLufs: number | null;
  shortTermLufsMax: number | null;
  crestFactorDb: number;
  peakToLoudnessDb: number | null;
  dcOffset: number;
  clippedSamples: number;
  clippedFrames: number;
  stereoCorrelation: number | null;
  midRmsDbfs: number | null;
  sideRmsDbfs: number | null;
  stereoWidth: number | null;
  findings: AudioFinding[];
}

interface Biquad {
  b0: number;
  b1: number;
  b2: number;
  a1: number;
  a2: number;
}

interface WavData {
  format: "pcm" | "float";
  formatLabel: string;
  sampleRate: number;
  channels: number;
  bitDepth: number;
  frames: number;
  samples: Float32Array[];
}

const SILENCE_DB = -120;

function db(value: number): number {
  return value > 0 ? 20 * Math.log10(value) : SILENCE_DB;
}

function parseWav(buffer: Buffer): WavData {
  if (buffer.length < 12) throw new Error("不是有效的 WAV：文件太短。");
  if (buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WAVE") {
    throw new Error("只支持 RIFF/WAVE 文件（FL 导出时选择 WAV）。");
  }

  let audioFormat = 0;
  let channels = 0;
  let sampleRate = 0;
  let bitDepth = 0;
  let dataStart = -1;
  let dataSize = 0;
  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const id = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const start = offset + 8;
    const available = buffer.length - start;
    if (id === "fmt " && size >= 16 && start + 16 <= buffer.length) {
      audioFormat = buffer.readUInt16LE(start);
      channels = buffer.readUInt16LE(start + 2);
      sampleRate = buffer.readUInt32LE(start + 4);
      bitDepth = buffer.readUInt16LE(start + 14);
      if (audioFormat === 0xfffe && size >= 40 && start + 26 <= buffer.length) {
        audioFormat = buffer.readUInt16LE(start + 24);
      }
    } else if (id === "data") {
      dataStart = start;
      dataSize = size === 0xffffffff ? available : Math.min(size, available);
      break;
    }
    const advance = size + (size % 2);
    if (advance <= 0) break;
    offset = start + advance;
  }

  if (!channels || !sampleRate || !bitDepth) throw new Error("WAV 缺少有效的 fmt 块。");
  if (dataStart < 0 || dataSize <= 0) throw new Error("WAV 缺少可读的 data 块。");
  if (channels < 1 || channels > 8) throw new Error(`不支持的声道数：${channels}`);
  if (sampleRate < 8000 || sampleRate > 192000) {
    throw new Error(`不支持的采样率：${sampleRate}`);
  }
  if (![8, 16, 24, 32, 64].includes(bitDepth)) {
    throw new Error(`不支持的位深：${bitDepth}`);
  }
  if (![1, 3].includes(audioFormat)) {
    throw new Error("只支持 PCM 或 IEEE float WAV；压缩格式请先转成 WAV。");
  }
  if (audioFormat === 1 && bitDepth === 64) {
    throw new Error("不支持 64-bit 整数 PCM。");
  }
  if (audioFormat === 3 && ![32, 64].includes(bitDepth)) {
    throw new Error("IEEE float WAV 只支持 32/64-bit。");
  }

  const bytesPerSample = bitDepth / 8;
  const frameSize = channels * bytesPerSample;
  const frames = Math.floor(dataSize / frameSize);
  if (frames <= 0) throw new Error("WAV data 块没有完整采样帧。");
  const samples = Array.from({ length: channels }, () => new Float32Array(frames));

  for (let frame = 0; frame < frames; frame += 1) {
    const base = dataStart + frame * frameSize;
    for (let channel = 0; channel < channels; channel += 1) {
      const at = base + channel * bytesPerSample;
      let value = 0;
      if (audioFormat === 3) {
        value = bitDepth === 32 ? buffer.readFloatLE(at) : buffer.readDoubleLE(at);
      } else if (bitDepth === 8) {
        value = (buffer.readUInt8(at) - 128) / 128;
      } else if (bitDepth === 16) {
        value = buffer.readInt16LE(at) / 32768;
      } else if (bitDepth === 24) {
        const raw = buffer.readUIntLE(at, 3);
        value = (raw & 0x800000 ? raw - 0x1000000 : raw) / 8388608;
      } else if (bitDepth === 32) {
        value = buffer.readInt32LE(at) / 2147483648;
      }
      samples[channel][frame] = value;
    }
  }

  return {
    format: audioFormat === 3 ? "float" : "pcm",
    formatLabel: `${audioFormat === 3 ? "IEEE float" : "PCM"} ${bitDepth}-bit`,
    sampleRate,
    channels,
    bitDepth,
    frames,
    samples,
  };
}

function kWeighting(sampleRate: number): [Biquad, Biquad] {
  let shelf: Biquad;
  let highPass: Biquad;
  if (Math.abs(sampleRate - 48000) < 0.5) {
    shelf = {
      b0: 1.53512485958697,
      b1: -2.69169618940638,
      b2: 1.19839281085285,
      a1: -1.69065929318241,
      a2: 0.73248077421585,
    };
    highPass = {
      b0: 1,
      b1: -2,
      b2: 1,
      a1: -1.99004745483398,
      a2: 0.99007225036621,
    };
    return [shelf, highPass];
  }

  const shelfF0 = 1681.974450955533;
  const shelfGain = 3.999843853973347;
  const shelfQ = 0.7071752369554196;
  const kShelf = Math.tan((Math.PI * shelfF0) / sampleRate);
  const vh = Math.pow(10, shelfGain / 20);
  const vb = Math.pow(vh, 0.4996667741545416);
  const a0Shelf = 1 + kShelf / shelfQ + kShelf * kShelf;
  shelf = {
    b0: (vh + (vb * kShelf) / shelfQ + kShelf * kShelf) / a0Shelf,
    b1: (2 * (kShelf * kShelf - vh)) / a0Shelf,
    b2: (vh - (vb * kShelf) / shelfQ + kShelf * kShelf) / a0Shelf,
    a1: (2 * (kShelf * kShelf - 1)) / a0Shelf,
    a2: (1 - kShelf / shelfQ + kShelf * kShelf) / a0Shelf,
  };

  const highPassF0 = 38.13547087602444;
  const highPassQ = 0.5003270373238773;
  const kHighPass = Math.tan((Math.PI * highPassF0) / sampleRate);
  const a0HighPass = 1 + kHighPass / highPassQ + kHighPass * kHighPass;
  highPass = {
    b0: 1 / a0HighPass,
    b1: -2 / a0HighPass,
    b2: 1 / a0HighPass,
    a1: (2 * (kHighPass * kHighPass - 1)) / a0HighPass,
    a2: (1 - kHighPass / highPassQ + kHighPass * kHighPass) / a0HighPass,
  };
  return [shelf, highPass];
}

function applyBiquad(input: Float32Array, coefficients: Biquad): Float32Array {
  const output = new Float32Array(input.length);
  let x1 = 0;
  let x2 = 0;
  let y1 = 0;
  let y2 = 0;
  for (let index = 0; index < input.length; index += 1) {
    const x = input[index];
    const y =
      coefficients.b0 * x +
      coefficients.b1 * x1 +
      coefficients.b2 * x2 -
      coefficients.a1 * y1 -
      coefficients.a2 * y2;
    output[index] = y;
    x2 = x1;
    x1 = x;
    y2 = y1;
    y1 = y;
  }
  return output;
}

function channelWeight(channels: number, index: number): number {
  if (channels <= 2) return 1;
  if (index === 3) return 0;
  if (index === 4 || index === 5) return 1.41;
  return 1;
}

function blockLoudness(
  weighted: Float32Array[],
  channels: number,
  start: number,
  length: number,
): number | null {
  let sum = 0;
  for (let channel = 0; channel < channels; channel += 1) {
    const weight = channelWeight(channels, channel);
    if (weight === 0) continue;
    const samples = weighted[channel];
    let energy = 0;
    for (let index = start; index < start + length; index += 1) {
      energy += samples[index] * samples[index];
    }
    sum += (weight * energy) / length;
  }
  return sum > 0 ? -0.691 + 10 * Math.log10(sum) : null;
}

function integrateLoudness(
  weighted: Float32Array[],
  channels: number,
  sampleRate: number,
  frames: number,
): { integrated: number | null; shortTermMax: number | null } {
  const blockSize = Math.round(sampleRate * 0.4);
  const hop = Math.round(sampleRate * 0.1);
  const blocks: number[] = [];
  for (let start = 0; start + blockSize <= frames; start += hop) {
    const loudness = blockLoudness(weighted, channels, start, blockSize);
    if (loudness !== null && Number.isFinite(loudness)) blocks.push(loudness);
  }
  let integrated: number | null = null;
  if (blocks.length) {
    const aboveAbsolute = blocks.filter((value) => value > -70);
    if (aboveAbsolute.length) {
      const meanEnergy =
        aboveAbsolute.reduce((sum, value) => sum + Math.pow(10, (value + 0.691) / 10), 0) /
        aboveAbsolute.length;
      const relativeGate = -0.691 + 10 * Math.log10(meanEnergy) - 10;
      const gate = Math.max(-70, relativeGate);
      const gated = blocks.filter((value) => value > gate);
      if (gated.length) {
        const gatedEnergy =
          gated.reduce((sum, value) => sum + Math.pow(10, (value + 0.691) / 10), 0) /
          gated.length;
        integrated = -0.691 + 10 * Math.log10(gatedEnergy);
      }
    }
  }

  const shortSize = Math.round(sampleRate * 3);
  const shortHop = Math.round(sampleRate * 1);
  let shortTermMax: number | null = null;
  for (let start = 0; start + shortSize <= frames; start += shortHop) {
    const loudness = blockLoudness(weighted, channels, start, shortSize);
    if (loudness !== null && Number.isFinite(loudness)) {
      shortTermMax = shortTermMax === null ? loudness : Math.max(shortTermMax, loudness);
    }
  }
  return { integrated, shortTermMax };
}

function analyzeDecoded(data: WavData, file: string | null): AudioAnalysis {
  const { channels, frames, samples, sampleRate } = data;
  const totalSamples = frames * channels;
  let peak = 0;
  let sumSquares = 0;
  let clippedSamples = 0;
  const clippedFrameFlags = new Uint8Array(frames);
  const dcOffsets: number[] = [];
  for (let channel = 0; channel < channels; channel += 1) {
    const channelSamples = samples[channel];
    let channelSum = 0;
    let channelPeak = 0;
    for (let index = 0; index < frames; index += 1) {
      const value = channelSamples[index];
      const absolute = Math.abs(value);
      channelSum += value;
      sumSquares += value * value;
      if (absolute > channelPeak) channelPeak = absolute;
      if (absolute > peak) peak = absolute;
      if (absolute >= 0.999) {
        clippedSamples += 1;
        clippedFrameFlags[index] = 1;
      }
    }
    dcOffsets.push(channelSum / frames);
  }
  const clippedFrames = clippedFrameFlags.reduce((sum, value) => sum + value, 0);

  let stereoCorrelation: number | null = null;
  let midRmsDbfs: number | null = null;
  let sideRmsDbfs: number | null = null;
  let stereoWidth: number | null = null;
  if (channels >= 2) {
    let leftRight = 0;
    let leftLeft = 0;
    let rightRight = 0;
    let midEnergy = 0;
    let sideEnergy = 0;
    const left = samples[0];
    const right = samples[1];
    for (let index = 0; index < frames; index += 1) {
      const l = left[index];
      const r = right[index];
      leftRight += l * r;
      leftLeft += l * l;
      rightRight += r * r;
      const mid = (l + r) / 2;
      const side = (l - r) / 2;
      midEnergy += mid * mid;
      sideEnergy += side * side;
    }
    const denominator = Math.sqrt(leftLeft * rightRight);
    if (denominator > 0) stereoCorrelation = leftRight / denominator;
    midRmsDbfs = db(Math.sqrt(midEnergy / frames));
    sideRmsDbfs = db(Math.sqrt(sideEnergy / frames));
    const midRms = Math.sqrt(midEnergy / frames);
    const sideRms = Math.sqrt(sideEnergy / frames);
    if (midRms > 0) stereoWidth = sideRms / midRms;
  }

  const rms = Math.sqrt(sumSquares / Math.max(1, totalSamples));
  const peakDbfs = db(peak);
  const rmsDbfs = db(rms);
  const crestFactorDb = rms > 0 ? peakDbfs - rmsDbfs : 0;
  const dcOffset = Math.max(...dcOffsets.map((value) => Math.abs(value)));
  const coefficients = kWeighting(sampleRate);
  const weighted = samples.map((channel) =>
    applyBiquad(applyBiquad(channel, coefficients[0]), coefficients[1]),
  );
  const { integrated, shortTermMax } = integrateLoudness(
    weighted,
    channels,
    sampleRate,
    frames,
  );
  const peakToLoudnessDb =
    integrated === null ? null : peakDbfs - integrated;

  const findings: AudioFinding[] = [];
  if (peak === 0) {
    findings.push({
      code: "audio-silence",
      severity: "warn",
      message: "文件没有可测信号（全静音），峰值/LUFS/立体声统计没有意义。",
      suggestion: "确认 FL 导出范围、总线静音/独奏状态与主输出。",
    });
  }
  if (clippedFrames > 0) {
    findings.push({
      code: "audio-clipping",
      severity: "risk",
      message: `检测到 ${clippedSamples} 个达到/超过 0 dBFS 的样本，涉及 ${clippedFrames} 个采样帧。`,
      suggestion: "降低总线或限制器输入，导出前给峰值留至少 -1 dBFS 余量。",
    });
  }
  if (peakDbfs > -0.1) {
    findings.push({
      code: "audio-peak-hot",
      severity: "risk",
      message: `sample peak 为 ${peakDbfs.toFixed(2)} dBFS，几乎没有余量。`,
      suggestion: "把峰值压到 -1 dBFS 以下，再检查削波。",
    });
  } else if (peakDbfs > -1) {
    findings.push({
      code: "audio-peak-low-headroom",
      severity: "warn",
      message: `sample peak 为 ${peakDbfs.toFixed(2)} dBFS，余量偏小。`,
    });
  }
  if (integrated !== null) {
    if (integrated > -9) {
      findings.push({
        code: "audio-loud",
        severity: "warn",
        message: `integrated LUFS 为 ${integrated.toFixed(1)}，对多数流媒体目标偏响。`,
        suggestion: "常见发行目标是 -14 到 -9 LUFS；先确认平台与风格。",
      });
    } else if (integrated < -24) {
      findings.push({
        code: "audio-quiet",
        severity: "warn",
        message: `integrated LUFS 为 ${integrated.toFixed(1)}，整体偏轻。`,
      });
    }
  }
  if (peak > 0 && crestFactorDb < 6) {
    findings.push({
      code: "audio-compressed",
      severity: "info",
      message: `crest factor 只有 ${crestFactorDb.toFixed(1)} dB，动态余量较小。`,
    });
  } else if (peak > 0 && crestFactorDb > 20) {
    findings.push({
      code: "audio-dynamic",
      severity: "info",
      message: `crest factor 为 ${crestFactorDb.toFixed(1)} dB，瞬态余量很大。`,
    });
  }
  if (stereoCorrelation !== null && stereoCorrelation < -0.1) {
    findings.push({
      code: "audio-phase",
      severity: "warn",
      message: `左右声道相关性为 ${stereoCorrelation.toFixed(2)}，单声道折叠可能抵消。`,
      suggestion: "检查宽度插件、延迟与反相；用单声道监听复核。",
    });
  }
  if (dcOffset > 0.002) {
    findings.push({
      code: "audio-dc",
      severity: "warn",
      message: `DC offset 达到 ${dcOffset.toFixed(4)}。`,
      suggestion: "在总线加高通/DC filter，或检查采样与合成器。",
    });
  }
  if (data.frames / sampleRate < 1) {
    findings.push({
      code: "audio-short",
      severity: "info",
      message: "文件短于 1 秒，LUFS/统计的代表性有限。",
    });
  }
  if (sampleRate !== 44100 && sampleRate !== 48000) {
    findings.push({
      code: "audio-rate",
      severity: "info",
      message: `采样率为 ${sampleRate} Hz；发行前确认目标采样率。`,
    });
  }

  const severityRank = { risk: 0, warn: 1, info: 2 } as const;
  findings.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);

  return {
    ok: true,
    measurementAvailable: true,
    measurementNote:
      "sample peak / RMS / crest / DC / 削波 / 立体声相关为波形统计；integrated LUFS 按 ITU-R BS.1770-4（400ms 块、75% 重叠、绝对/相对门限）计算；不是 true peak，也不做频谱分析。",
    file,
    format: data.formatLabel,
    sampleRate,
    channels,
    bitDepth: data.bitDepth,
    frames,
    durationSeconds: frames / sampleRate,
    peakDbfs,
    rmsDbfs,
    integratedLufs: integrated,
    shortTermLufsMax: shortTermMax,
    crestFactorDb,
    peakToLoudnessDb,
    dcOffset,
    clippedSamples,
    clippedFrames,
    stereoCorrelation,
    midRmsDbfs,
    sideRmsDbfs,
    stereoWidth,
    findings,
  };
}

export function analyzeWavBuffer(buffer: Buffer, file: string | null = null): AudioAnalysis {
  return analyzeDecoded(parseWav(buffer), file);
}

export async function analyzeWavFile(path: string): Promise<AudioAnalysis> {
  const buffer = await readFile(path);
  return analyzeWavBuffer(buffer, path);
}
