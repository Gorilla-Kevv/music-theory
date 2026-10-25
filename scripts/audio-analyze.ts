import { readFile } from "node:fs/promises";

export interface AudioFinding {
  code: string;
  severity: "info" | "warn" | "risk";
  message: string;
  suggestion?: string;
}

export interface SpectrumBand {
  name: string;
  centerHz: number;
  lowHz: number;
  highHz: number;
  energyDb: number;
  sharePercent: number;
}

export interface SpectrogramColumn {
  timeSeconds: number;
  bands: number[];
  totalDb: number | null;
}

export interface AudioSpectrogram {
  segmentSeconds: number;
  hopSeconds: number;
  bandNames: string[];
  columns: SpectrogramColumn[];
}

export interface AudioSpectrum {
  method: string;
  fftSize: number;
  binHz: number;
  framesAnalyzed: number;
  centroidHz: number | null;
  rolloff85Hz: number | null;
  tiltDbPerOctave: number | null;
  bands: SpectrumBand[];
  spectrogram: AudioSpectrogram | null;
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
  truePeakDbtp: number;
  truePeakOversampling: number;
  truePeakAboveSampleDb: number;
  rmsDbfs: number;
  integratedLufs: number | null;
  shortTermLufsMin: number | null;
  shortTermLufsMax: number | null;
  loudnessRangeLu: number | null;
  crestFactorDb: number;
  truePeakCrestDb: number;
  peakToLoudnessDb: number | null;
  truePeakToLoudnessDb: number | null;
  dcOffset: number;
  clippedSamples: number;
  clippedFrames: number;
  stereoCorrelation: number | null;
  midRmsDbfs: number | null;
  sideRmsDbfs: number | null;
  stereoWidth: number | null;
  spectrum: AudioSpectrum | null;
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

const TRUE_PEAK_PHASES = 4;
const TRUE_PEAK_HALF_TAPS = 8;

function buildTruePeakKernels(): Float64Array[] {
  const kernels: Float64Array[] = [];
  const taps = TRUE_PEAK_HALF_TAPS * 2;
  for (let phase = 1; phase < TRUE_PEAK_PHASES; phase += 1) {
    const fraction = phase / TRUE_PEAK_PHASES;
    const kernel = new Float64Array(taps);
    let sum = 0;
    for (let tap = 0; tap < taps; tap += 1) {
      const offset = tap - TRUE_PEAK_HALF_TAPS + 1;
      const x = offset - fraction;
      const sinc = Math.abs(x) < 1e-12 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x);
      const window =
        Math.abs(x) <= TRUE_PEAK_HALF_TAPS
          ? 0.42 +
            0.5 * Math.cos((Math.PI * x) / TRUE_PEAK_HALF_TAPS) +
            0.08 * Math.cos((2 * Math.PI * x) / TRUE_PEAK_HALF_TAPS)
          : 0;
      kernel[tap] = sinc * window;
      sum += kernel[tap];
    }
    if (sum !== 0) {
      for (let tap = 0; tap < taps; tap += 1) kernel[tap] /= sum;
    }
    kernels.push(kernel);
  }
  return kernels;
}

const TRUE_PEAK_KERNELS = buildTruePeakKernels();

function measureTruePeak(
  channels: Float32Array[],
  frames: number,
  samplePeak: number,
): number {
  if (samplePeak === 0) return 0;
  let maximum = samplePeak;
  const taps = TRUE_PEAK_HALF_TAPS * 2;
  for (const samples of channels) {
    for (let index = 0; index < frames; index += 1) {
      for (const kernel of TRUE_PEAK_KERNELS) {
        let sum = 0;
        for (let tap = 0; tap < taps; tap += 1) {
          const source = index - (tap - TRUE_PEAK_HALF_TAPS + 1);
          if (source >= 0 && source < frames) {
            sum += samples[source] * kernel[tap];
          }
        }
        const absolute = Math.abs(sum);
        if (absolute > maximum) maximum = absolute;
      }
    }
  }
  return maximum;
}

const OCTAVE_CENTERS = [31.5, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

function makeBitReverse(size: number): Uint32Array {
  const bits = Math.round(Math.log2(size));
  const reverse = new Uint32Array(size);
  for (let index = 0; index < size; index += 1) {
    let value = index;
    let result = 0;
    for (let bit = 0; bit < bits; bit += 1) {
      result = (result << 1) | (value & 1);
      value >>= 1;
    }
    reverse[index] = result;
  }
  return reverse;
}

function fftInPlace(real: Float64Array, imag: Float64Array, reverse: Uint32Array): void {
  const size = real.length;
  for (let index = 0; index < size; index += 1) {
    const target = reverse[index];
    if (target > index) {
      [real[index], real[target]] = [real[target], real[index]];
      [imag[index], imag[target]] = [imag[target], imag[index]];
    }
  }
  for (let length = 2; length <= size; length <<= 1) {
    const angle = (-2 * Math.PI) / length;
    const stepReal = Math.cos(angle);
    const stepImag = Math.sin(angle);
    for (let start = 0; start < size; start += length) {
      let twiddleReal = 1;
      let twiddleImag = 0;
      for (let offset = 0; offset < length / 2; offset += 1) {
        const even = start + offset;
        const odd = even + length / 2;
        const oddReal = real[odd] * twiddleReal - imag[odd] * twiddleImag;
        const oddImag = real[odd] * twiddleImag + imag[odd] * twiddleReal;
        real[odd] = real[even] - oddReal;
        imag[odd] = imag[even] - oddImag;
        real[even] += oddReal;
        imag[even] += oddImag;
        const nextReal = twiddleReal * stepReal - twiddleImag * stepImag;
        twiddleImag = twiddleReal * stepImag + twiddleImag * stepReal;
        twiddleReal = nextReal;
      }
    }
  }
}

function percentile(sorted: number[], fraction: number): number {
  if (sorted.length === 0) return 0;
  const position = Math.min(1, Math.max(0, fraction)) * (sorted.length - 1);
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
}

function analyzeSpectrum(
  channels: Float32Array[],
  frames: number,
  sampleRate: number,
): AudioSpectrum | null {
  if (frames < 256) return null;
  let fftSize = 4096;
  while (fftSize > frames && fftSize > 256) fftSize >>= 1;
  const maxFramesPerChannel = 2048;
  let hop = Math.floor(fftSize / 2);
  const possible = Math.floor((frames - fftSize) / hop) + 1;
  if (possible > maxFramesPerChannel) {
    hop = Math.max(1, Math.ceil((frames - fftSize) / (maxFramesPerChannel - 1)));
  }
  const half = fftSize / 2;
  const binHz = sampleRate / fftSize;
  const nyquist = sampleRate / 2;
  const bandRanges: Array<{
    name: string;
    centerHz: number;
    lowHz: number;
    highHz: number;
    lowBin: number;
    highBin: number;
  }> = [];
  for (const centerHz of OCTAVE_CENTERS) {
    const lowHz = centerHz / Math.SQRT2;
    const highHz = Math.min(centerHz * Math.SQRT2, nyquist);
    if (lowHz >= nyquist) continue;
    const lowBin = Math.max(1, Math.ceil(lowHz / binHz));
    const highBin = Math.min(half, Math.floor(highHz / binHz));
    if (highBin < lowBin) continue;
    bandRanges.push({
      name: centerHz >= 1000 ? `${centerHz / 1000}k` : `${centerHz}`,
      centerHz,
      lowHz,
      highHz,
      lowBin,
      highBin,
    });
  }

  const window = new Float64Array(fftSize);
  let windowSquares = 0;
  for (let index = 0; index < fftSize; index += 1) {
    window[index] = 0.5 * (1 - Math.cos((2 * Math.PI * index) / fftSize));
    windowSquares += window[index] * window[index];
  }
  const reverse = makeBitReverse(fftSize);
  const real = new Float64Array(fftSize);
  const imag = new Float64Array(fftSize);
  const power = new Float64Array(half + 1);
  const binToBand = new Int16Array(half + 1).fill(-1);
  for (let bandIndex = 0; bandIndex < bandRanges.length; bandIndex += 1) {
    for (let bin = bandRanges[bandIndex].lowBin; bin <= bandRanges[bandIndex].highBin; bin += 1) {
      if (binToBand[bin] < 0) binToBand[bin] = bandIndex;
    }
  }

  const durationSeconds = frames / sampleRate;
  const maxColumns = 120;
  const segmentSeconds = Math.max(1, durationSeconds / maxColumns);
  const segmentHop = segmentSeconds;
  const segmentCount = Math.max(1, Math.ceil(durationSeconds / segmentSeconds));
  const segmentBandPowers = Array.from(
    { length: segmentCount },
    () => new Float64Array(bandRanges.length),
  );
  const segmentTotals = new Float64Array(segmentCount);
  const segmentCounts = new Uint32Array(segmentCount);
  const frameBandPower = new Float64Array(bandRanges.length);

  let analyzedFrames = 0;
  for (const samples of channels) {
    for (let start = 0; start + fftSize <= frames; start += hop) {
      for (let index = 0; index < fftSize; index += 1) {
        real[index] = samples[start + index] * window[index];
        imag[index] = 0;
      }
      fftInPlace(real, imag, reverse);
      frameBandPower.fill(0);
      let frameTotal = 0;
      for (let bin = 0; bin <= half; bin += 1) {
        const binPower =
          ((real[bin] * real[bin] + imag[bin] * imag[bin]) /
            (fftSize * windowSquares)) *
          (bin > 0 && bin < half ? 2 : 1);
        power[bin] += binPower;
        if (bin > 0) {
          frameTotal += binPower;
          const bandIndex = binToBand[bin];
          if (bandIndex >= 0) frameBandPower[bandIndex] += binPower;
        }
      }
      const centerTime = (start + fftSize / 2) / sampleRate;
      const segmentIndex = Math.min(
        segmentCount - 1,
        Math.max(0, Math.floor(centerTime / segmentSeconds)),
      );
      if (frameTotal > 0) {
        segmentCounts[segmentIndex] += 1;
        segmentTotals[segmentIndex] += frameTotal;
        for (let bandIndex = 0; bandIndex < bandRanges.length; bandIndex += 1) {
          segmentBandPowers[segmentIndex][bandIndex] += frameBandPower[bandIndex];
        }
      }
      analyzedFrames += 1;
    }
  }
  if (analyzedFrames === 0) return null;
  for (let bin = 0; bin <= half; bin += 1) power[bin] /= analyzedFrames;
  let totalPower = 0;
  for (let bin = 1; bin <= half; bin += 1) totalPower += power[bin];
  if (totalPower <= 0) return null;

  const bands: SpectrumBand[] = bandRanges.map((range) => {
    let bandPower = 0;
    for (let bin = range.lowBin; bin <= range.highBin; bin += 1) bandPower += power[bin];
    return {
      name: range.name,
      centerHz: range.centerHz,
      lowHz: range.lowHz,
      highHz: range.highHz,
      energyDb: bandPower > 0 ? 10 * Math.log10(bandPower) : SILENCE_DB,
      sharePercent: (bandPower / totalPower) * 100,
    };
  });

  let weightedFrequency = 0;
  for (let bin = 1; bin <= half; bin += 1) {
    weightedFrequency += bin * binHz * power[bin];
  }
  const centroidHz = weightedFrequency / totalPower;
  const target = totalPower * 0.85;
  let cumulative = 0;
  let rolloff85Hz: number | null = null;
  for (let bin = 1; bin <= half; bin += 1) {
    cumulative += power[bin];
    if (cumulative >= target) {
      rolloff85Hz = bin * binHz;
      break;
    }
  }

  const usableBands = bands.filter(
    (band) => band.energyDb > -80 && band.sharePercent >= 0.5,
  );
  let tiltDbPerOctave: number | null = null;
  if (usableBands.length >= 2) {
    const xs = usableBands.map((band) => Math.log2(band.centerHz));
    const ys = usableBands.map((band) => band.energyDb);
    const meanX = xs.reduce((sum, value) => sum + value, 0) / xs.length;
    const meanY = ys.reduce((sum, value) => sum + value, 0) / ys.length;
    let numerator = 0;
    let denominator = 0;
    for (let index = 0; index < xs.length; index += 1) {
      numerator += (xs[index] - meanX) * (ys[index] - meanY);
      denominator += (xs[index] - meanX) ** 2;
    }
    if (denominator > 0) tiltDbPerOctave = numerator / denominator;
  }

  const columns: SpectrogramColumn[] = [];
  for (let segment = 0; segment < segmentCount; segment += 1) {
    if (!segmentCounts[segment] || segmentTotals[segment] <= 0) continue;
    columns.push({
      timeSeconds: segment * segmentSeconds,
      bands: bandRanges.map(
        (_, bandIndex) =>
          (segmentBandPowers[segment][bandIndex] / segmentTotals[segment]) * 100,
      ),
      totalDb: 10 * Math.log10(segmentTotals[segment] / segmentCounts[segment]),
    });
  }
  const spectrogram: AudioSpectrogram | null =
    columns.length >= 2
      ? {
          segmentSeconds,
          hopSeconds: segmentHop,
          bandNames: bands.map((band) => band.name),
          columns,
        }
      : null;

  return {
    method: `Hann 窗 · FFT ${fftSize} · hop ${hop} · ${analyzedFrames} 帧（声道合计）`,
    fftSize,
    binHz,
    framesAnalyzed: analyzedFrames,
    centroidHz,
    rolloff85Hz,
    tiltDbPerOctave,
    bands,
    spectrogram,
  };
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
): {
  integrated: number | null;
  shortTermMin: number | null;
  shortTermMax: number | null;
  loudnessRangeLu: number | null;
} {
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
  const shortTermValues: number[] = [];
  for (let start = 0; start + shortSize <= frames; start += shortHop) {
    const loudness = blockLoudness(weighted, channels, start, shortSize);
    if (loudness !== null && Number.isFinite(loudness) && loudness > -70) {
      shortTermValues.push(loudness);
    }
  }
  let shortTermMin: number | null = null;
  let shortTermMax: number | null = null;
  let loudnessRangeLu: number | null = null;
  if (shortTermValues.length) {
    shortTermMin = shortTermValues[0];
    shortTermMax = shortTermValues[0];
    for (const value of shortTermValues) {
      if (value < shortTermMin) shortTermMin = value;
      if (value > shortTermMax) shortTermMax = value;
    }
    if (shortTermValues.length >= 2) {
      const meanEnergy =
        shortTermValues.reduce(
          (sum, value) => sum + Math.pow(10, (value + 0.691) / 10),
          0,
        ) / shortTermValues.length;
      const relativeGate = -0.691 + 10 * Math.log10(meanEnergy) - 20;
      const gated = shortTermValues
        .filter((value) => value > relativeGate)
        .sort((a, b) => a - b);
      if (gated.length >= 2) {
        loudnessRangeLu = percentile(gated, 0.95) - percentile(gated, 0.1);
      }
    }
  }

  return { integrated, shortTermMin, shortTermMax, loudnessRangeLu };
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
  const truePeak = measureTruePeak(samples, frames, peak);
  const truePeakDbtp = db(truePeak);
  const truePeakAboveSampleDb = peak > 0 ? truePeakDbtp - db(peak) : 0;

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
  const truePeakCrestDb = rms > 0 ? truePeakDbtp - rmsDbfs : 0;
  const dcOffset = Math.max(...dcOffsets.map((value) => Math.abs(value)));
  const coefficients = kWeighting(sampleRate);
  const weighted = samples.map((channel) =>
    applyBiquad(applyBiquad(channel, coefficients[0]), coefficients[1]),
  );
  const { integrated, shortTermMin, shortTermMax, loudnessRangeLu } = integrateLoudness(
    weighted,
    channels,
    sampleRate,
    frames,
  );
  const spectrum = analyzeSpectrum(samples, frames, sampleRate);
  const peakToLoudnessDb =
    integrated === null ? null : peakDbfs - integrated;
  const truePeakToLoudnessDb =
    integrated === null ? null : truePeakDbtp - integrated;

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
  if (peak > 0) {
    if (truePeakDbtp > -0.1) {
      findings.push({
        code: "audio-true-peak-hot",
        severity: "risk",
        message: `true peak 为 ${truePeakDbtp.toFixed(2)} dBTP，已经顶到 0 dBTP。`,
        suggestion: "给 limiter/总线留至少 -1 dBTP，或降低发送与主推子。",
      });
    } else if (truePeakDbtp > -1) {
      findings.push({
        code: "audio-true-peak-low-headroom",
        severity: "warn",
        message: `true peak 为 ${truePeakDbtp.toFixed(2)} dBTP，余量小于 1 dB。`,
      });
    }
    if (truePeakAboveSampleDb > 0.5) {
      findings.push({
        code: "audio-intersample-peak",
        severity: "info",
        message: `4× 过采样 true peak 比 sample peak 高 ${truePeakAboveSampleDb.toFixed(2)} dB，存在采样点之间的峰值。`,
        suggestion: "发行母带按 dBTP 而不是 dBFS 检查 limiter 输出。",
      });
    }
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
  if (loudnessRangeLu !== null) {
    if (loudnessRangeLu < 2) {
      findings.push({
        code: "audio-lra-flat",
        severity: "info",
        message: `LRA 只有 ${loudnessRangeLu.toFixed(1)} LU，响度非常一致（可能压缩/限制较强）。`,
      });
    } else if (loudnessRangeLu > 15) {
      findings.push({
        code: "audio-lra-wide",
        severity: "info",
        message: `LRA 为 ${loudnessRangeLu.toFixed(1)} LU，动态范围较大。`,
      });
    }
  }
  if (spectrum) {
    const share = new Map(spectrum.bands.map((band) => [band.name, band.sharePercent]));
    const lowShare = (share.get("31.5") ?? 0) + (share.get("63") ?? 0) + (share.get("125") ?? 0);
    const highShare = (share.get("8k") ?? 0) + (share.get("16k") ?? 0);
    const midShare = (share.get("500") ?? 0) + (share.get("1k") ?? 0) + (share.get("2k") ?? 0);
    if (lowShare > 45) {
      findings.push({
        code: "audio-spectrum-low",
        severity: "info",
        message: `低频（31.5–125 Hz）占频谱能量 ${lowShare.toFixed(0)}%，低频偏重。`,
      });
    }
    if (highShare > 25) {
      findings.push({
        code: "audio-spectrum-bright",
        severity: "info",
        message: `高频（8–16 kHz）占频谱能量 ${highShare.toFixed(0)}%，整体偏亮。`,
      });
    }
    if (midShare < 15) {
      findings.push({
        code: "audio-spectrum-mid-scoop",
        severity: "info",
        message: `中频（500 Hz–2 kHz）只占 ${midShare.toFixed(0)}%，可能有中频凹陷。`,
      });
    }
  }
  if (peak > 0 && Math.max(crestFactorDb, truePeakCrestDb) < 6) {
    findings.push({
      code: "audio-compressed",
      severity: "info",
      message: `true-peak crest 只有 ${Math.max(crestFactorDb, truePeakCrestDb).toFixed(1)} dB，动态余量较小。`,
    });
  } else if (peak > 0 && Math.max(crestFactorDb, truePeakCrestDb) > 20) {
    findings.push({
      code: "audio-dynamic",
      severity: "info",
      message: `true-peak crest 为 ${Math.max(crestFactorDb, truePeakCrestDb).toFixed(1)} dB，瞬态余量很大。`,
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
      "sample peak 与 4× 过采样 true peak（窗函数 sinc）为波形统计；RMS/crest/DC/削波/立体声相关为时域统计；integrated LUFS 按 ITU-R BS.1770-4，LRA 按 EBU Tech 3342 的短时响度分布；频谱为 Hann 窗 FFT 的声道平均倍频程能量。不是实验室级 true-peak 表，也不做逐帧频谱图。",
    file,
    format: data.formatLabel,
    sampleRate,
    channels,
    bitDepth: data.bitDepth,
    frames,
    durationSeconds: frames / sampleRate,
    peakDbfs,
    truePeakDbtp,
    truePeakOversampling: TRUE_PEAK_PHASES,
    truePeakAboveSampleDb,
    rmsDbfs,
    integratedLufs: integrated,
    shortTermLufsMin: shortTermMin,
    shortTermLufsMax: shortTermMax,
    loudnessRangeLu,
    crestFactorDb,
    truePeakCrestDb,
    peakToLoudnessDb,
    truePeakToLoudnessDb,
    dcOffset,
    clippedSamples,
    clippedFrames,
    stereoCorrelation,
    midRmsDbfs,
    sideRmsDbfs,
    stereoWidth,
    spectrum,
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
