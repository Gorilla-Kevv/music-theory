import {
  analyzeSpectrum,
  applyBiquad,
  blockLoudness,
  kWeighting,
  measureTruePeak,
  type AudioSpectrum,
  type Biquad,
} from "./audio-analyze";

export interface VectorscopePoint {
  left: number;
  right: number;
}

export interface LiveSnapshot {
  status: "warming" | "running" | "silent";
  sampleRate: number;
  channels: number;
  framesAvailable: number;
  elapsedSeconds: number;
  samplePeakDbfs: number | null;
  truePeakDbtp: number | null;
  rmsDbfs: number | null;
  crestFactorDb: number | null;
  momentaryLufs: number | null;
  shortTermLufs: number | null;
  correlation: number | null;
  stereoWidth: number | null;
  clippedSamples: number;
  vectorscope: VectorscopePoint[];
  spectrum: AudioSpectrum | null;
}

const SILENCE_DB = -120;

function db(value: number): number {
  return value > 0 ? 20 * Math.log10(value) : SILENCE_DB;
}

export class LiveAnalyzer {
  readonly sampleRate: number;
  readonly channels: number;
  private readonly capacity: number;
  private readonly buffers: Float32Array[];
  private readonly coefficients: [Biquad, Biquad];
  private writeIndex = 0;
  private available = 0;
  private totalFrames = 0;

  constructor(sampleRate: number, channels: number, historySeconds = 5) {
    this.sampleRate = sampleRate;
    this.channels = channels;
    this.capacity = Math.max(1, Math.ceil(sampleRate * historySeconds));
    this.buffers = Array.from({ length: channels }, () => new Float32Array(this.capacity));
    this.coefficients = kWeighting(sampleRate);
  }

  pushPcm(buffer: Buffer): void {
    const sampleWidth = 2;
    const frameSize = this.channels * sampleWidth;
    const frames = Math.floor(buffer.length / frameSize);
    for (let frame = 0; frame < frames; frame += 1) {
      const base = frame * frameSize;
      for (let channel = 0; channel < this.channels; channel += 1) {
        this.buffers[channel][this.writeIndex] =
          buffer.readInt16LE(base + channel * sampleWidth) / 32768;
      }
      this.writeIndex = (this.writeIndex + 1) % this.capacity;
      if (this.available < this.capacity) this.available += 1;
      this.totalFrames += 1;
    }
  }

  pushFloat32(buffer: Buffer, frames: number, channels: number): void {
    const usableChannels = Math.min(channels, this.channels);
    for (let frame = 0; frame < frames; frame += 1) {
      const base = frame * channels;
      for (let channel = 0; channel < this.channels; channel += 1) {
        const sourceChannel = Math.min(channel, usableChannels - 1);
        this.buffers[channel][this.writeIndex] =
          buffer.readFloatLE((base + sourceChannel) * 4);
      }
      this.writeIndex = (this.writeIndex + 1) % this.capacity;
      if (this.available < this.capacity) this.available += 1;
      this.totalFrames += 1;
    }
  }

  private recent(seconds: number): Float32Array[] {
    const frames = Math.min(this.available, Math.max(0, Math.round(seconds * this.sampleRate)));
    if (frames === 0) return this.buffers.map(() => new Float32Array(0));
    const start = (this.writeIndex - frames + this.capacity) % this.capacity;
    return this.buffers.map((buffer) => {
      const output = new Float32Array(frames);
      const first = Math.min(frames, this.capacity - start);
      output.set(buffer.subarray(start, start + first), 0);
      if (first < frames) output.set(buffer.subarray(0, frames - first), first);
      return output;
    });
  }

  snapshot(): LiveSnapshot {
    const recent = this.recent(1);
    const frames = recent[0]?.length ?? 0;
    if (frames === 0) {
      return {
        status: "warming",
        sampleRate: this.sampleRate,
        channels: this.channels,
        framesAvailable: 0,
        elapsedSeconds: 0,
        samplePeakDbfs: null,
        truePeakDbtp: null,
        rmsDbfs: null,
        crestFactorDb: null,
        momentaryLufs: null,
        shortTermLufs: null,
        correlation: null,
        stereoWidth: null,
        clippedSamples: 0,
        vectorscope: [],
        spectrum: null,
      };
    }

    let peak = 0;
    let sumSquares = 0;
    let clippedSamples = 0;
    for (const channel of recent) {
      for (const value of channel) {
        const absolute = Math.abs(value);
        if (absolute > peak) peak = absolute;
        sumSquares += value * value;
        if (absolute >= 0.999) clippedSamples += 1;
      }
    }
    const rms = Math.sqrt(sumSquares / Math.max(1, frames * this.channels));
    const truePeak = measureTruePeak(recent, frames, peak);
    const peakDbfs = db(peak);
    const truePeakDbtp = db(truePeak);
    const rmsDbfs = db(rms);
    const crestFactorDb = rms > 0 ? peakDbfs - rmsDbfs : null;

    let correlation: number | null = null;
    let stereoWidth: number | null = null;
    if (this.channels >= 2) {
      let leftRight = 0;
      let leftLeft = 0;
      let rightRight = 0;
      let midEnergy = 0;
      let sideEnergy = 0;
      for (let index = 0; index < frames; index += 1) {
        const left = recent[0][index];
        const right = recent[1][index];
        leftRight += left * right;
        leftLeft += left * left;
        rightRight += right * right;
        const mid = (left + right) / 2;
        const side = (left - right) / 2;
        midEnergy += mid * mid;
        sideEnergy += side * side;
      }
      const denominator = Math.sqrt(leftLeft * rightRight);
      if (denominator > 0) correlation = leftRight / denominator;
      const midRms = Math.sqrt(midEnergy / frames);
      const sideRms = Math.sqrt(sideEnergy / frames);
      if (midRms > 0) stereoWidth = sideRms / midRms;
    }

    const loudnessWindow = this.recent(3.5);
    const loudnessFrames = loudnessWindow[0]?.length ?? 0;
    const weighted = loudnessWindow.map((channel) =>
      applyBiquad(applyBiquad(channel, this.coefficients[0]), this.coefficients[1]),
    );
    const momentaryFrames = Math.round(this.sampleRate * 0.4);
    const shortFrames = Math.round(this.sampleRate * 3);
    const momentaryLufs =
      loudnessFrames >= momentaryFrames
        ? blockLoudness(
            weighted,
            this.channels,
            loudnessFrames - momentaryFrames,
            momentaryFrames,
          )
        : null;
    const shortTermLufs =
      loudnessFrames >= shortFrames
        ? blockLoudness(weighted, this.channels, loudnessFrames - shortFrames, shortFrames)
        : null;

    const spectrum = frames >= 256 ? analyzeSpectrum(recent, frames, this.sampleRate) : null;

    const vectorWindow = this.recent(0.25);
    const vectorFrames = vectorWindow[0]?.length ?? 0;
    const step = Math.max(1, Math.floor(vectorFrames / 256));
    const vectorscope: VectorscopePoint[] = [];
    for (let index = 0; index < vectorFrames; index += step) {
      const left = vectorWindow[0][index];
      const right = this.channels >= 2 ? vectorWindow[1][index] : left;
      vectorscope.push({ left: Number(left.toFixed(4)), right: Number(right.toFixed(4)) });
    }

    return {
      status: frames < this.sampleRate * 0.25 ? "warming" : peak === 0 ? "silent" : "running",
      sampleRate: this.sampleRate,
      channels: this.channels,
      framesAvailable: this.available,
      elapsedSeconds: this.totalFrames / this.sampleRate,
      samplePeakDbfs: peakDbfs,
      truePeakDbtp,
      rmsDbfs,
      crestFactorDb,
      momentaryLufs,
      shortTermLufs,
      correlation,
      stereoWidth,
      clippedSamples,
      vectorscope,
      spectrum,
    };
  }
}
