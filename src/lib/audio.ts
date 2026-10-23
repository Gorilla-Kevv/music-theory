import type { Example } from "../content/types";
import { activeNotesAt, midiToFrequency, uniqueSorted } from "./theory";

export interface PlaybackMeta {
  conceptSlug?: string;
  conceptTitle?: string;
}

export interface PlaybackState {
  isPlaying: boolean;
  exampleId: string | null;
  title: string;
  conceptSlug?: string;
  tempo: number;
  position: number;
  duration: number;
  loop: boolean;
  activeNotes: number[];
}

type Listener = (state: PlaybackState) => void;

interface HoldVoice {
  gain: GainNode;
  sources: AudioScheduledSourceNode[];
  startedAt: number;
}

const INITIAL_STATE: PlaybackState = {
  isPlaying: false,
  exampleId: null,
  title: "",
  tempo: 84,
  position: 0,
  duration: 0,
  loop: false,
  activeNotes: [],
};

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bus: GainNode | null = null;
  private dry: GainNode | null = null;
  private holdBus: GainNode | null = null;
  private holds = new Map<number, HoldVoice>();
  private holdSeq = 0;
  private state: PlaybackState = { ...INITIAL_STATE };
  private listeners = new Set<Listener>();
  private example: Example | null = null;
  private meta: PlaybackMeta = {};
  private preferredTempo: number | null = null;
  private startTime = 0;
  private beatDuration = 0.6;
  private token = 0;
  private frame: number | null = null;
  private loopTimer: number | null = null;
  private sources = new Set<AudioScheduledSourceNode>();
  private sampleData = new Map<number, ArrayBuffer>();
  private sampleBuffers = new Map<number, AudioBuffer>();
  private samplePromise: Promise<void> | null = null;
  private decodePromise: Promise<void> | null = null;

  private static readonly SAMPLE_FILES: Record<number, string> = {
    48: "C3",
    51: "Ds3",
    54: "Fs3",
    57: "A3",
    60: "C4",
    63: "Ds4",
    66: "Fs4",
    69: "A4",
    72: "C5",
  };

  preloadSamples(): Promise<void> {
    if (this.samplePromise) return this.samplePromise;
    this.samplePromise = Promise.all(
      Object.entries(AudioEngine.SAMPLE_FILES).map(async ([midi, name]) => {
        try {
          const response = await fetch(
            `${import.meta.env.BASE_URL}audio/salamander/${name}.mp3`,
          );
          if (!response.ok) return;
          this.sampleData.set(Number(midi), await response.arrayBuffer());
        } catch {
          // Sample load failure falls back to the synthesized voice.
        }
      }),
    ).then(() => undefined);
    return this.samplePromise;
  }

  private async ensureSamples(ctx: AudioContext): Promise<void> {
    await this.preloadSamples();
    if (this.sampleBuffers.size > 0) return;
    if (!this.decodePromise) {
      this.decodePromise = Promise.all(
        [...this.sampleData.entries()].map(async ([midi, data]) => {
          try {
            const buffer = await ctx.decodeAudioData(data.slice(0));
            this.sampleBuffers.set(midi, buffer);
          } catch {
            // Ignore a single bad sample; the rest and the fallback remain usable.
          }
        }),
      ).then(() => undefined);
    }
    await this.decodePromise;
  }

  private nearestSample(midi: number): { midi: number; buffer: AudioBuffer } | null {
    let best: { midi: number; buffer: AudioBuffer } | null = null;
    let distance = Infinity;
    for (const [sampleMidi, buffer] of this.sampleBuffers) {
      const delta = Math.abs(sampleMidi - midi);
      if (delta < distance) {
        distance = delta;
        best = { midi: sampleMidi, buffer };
      }
    }
    return best;
  }

  private scheduleSampleVoice(
    midi: number,
    sampleMidi: number,
    buffer: AudioBuffer,
    start: number,
    end: number,
    velocity: number,
    destination: AudioNode,
  ): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = Math.pow(2, (midi - sampleMidi) / 12);

    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 6800;
    filter.Q.value = 0.3;
    source.connect(gain).connect(filter).connect(destination);

    const naturalEnd = start + buffer.duration / source.playbackRate.value;
    const releaseEnd = Math.max(start + 0.08, end + 0.28);
    const stopAt = Math.min(naturalEnd, releaseEnd);
    const fadeStart = Math.max(start + 0.02, stopAt - 0.08);
    const level = Math.max(0.08, Math.min(0.52, velocity * 0.82));

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(level, start + 0.006);
    gain.gain.setValueAtTime(level, fadeStart);
    gain.gain.exponentialRampToValueAtTime(0.0001, Math.max(fadeStart + 0.05, stopAt));

    source.start(start);
    source.stop(Math.max(fadeStart + 0.06, stopAt + 0.02));
    this.sources.add(source);
    source.onended = () => this.sources.delete(source);
  }

  private playPreparedVoice(
    midi: number,
    start: number,
    end: number,
    velocity: number,
    destination: AudioNode,
  ): void {
    const sample = this.nearestSample(midi);
    if (sample) {
      this.scheduleSampleVoice(
        midi,
        sample.midi,
        sample.buffer,
        start,
        end,
        velocity,
        destination,
      );
    } else {
      this.scheduleVoice(midi, start, end, velocity, destination);
    }
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  getState(): PlaybackState {
    return this.state;
  }

  private emit(patch: Partial<PlaybackState>): void {
    this.state = { ...this.state, ...patch };
    for (const listener of this.listeners) listener(this.state);
  }

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.72;

      const convolver = this.ctx.createConvolver();
      convolver.buffer = this.createImpulse(this.ctx, 1.6, 2.8);
      const wet = this.ctx.createGain();
      wet.gain.value = 0.16;
      const dry = this.ctx.createGain();
      dry.gain.value = 0.92;

      dry.connect(this.master);
      convolver.connect(wet).connect(this.master);
      this.master.connect(this.ctx.destination);

      const send = this.ctx.createGain();
      send.connect(dry);
      send.connect(convolver);
      this.bus = send;

      this.dry = dry;
      const holdBus = this.ctx.createGain();
      holdBus.connect(dry);
      holdBus.connect(convolver);
      this.holdBus = holdBus;
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  private createImpulse(ctx: AudioContext, seconds: number, decay: number): AudioBuffer {
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel += 1) {
      const data = buffer.getChannelData(channel);
      for (let index = 0; index < length; index += 1) {
        const envelope = Math.pow(1 - index / length, decay);
        data[index] = (Math.random() * 2 - 1) * envelope;
      }
    }
    return buffer;
  }

  private scheduleVoice(
    midi: number,
    start: number,
    end: number,
    velocity: number,
    destination: AudioNode,
  ): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const frequency = midiToFrequency(midi);
    const attack = 0.008;
    const release = 0.32;
    const stopAt = end + release;

    const voice = ctx.createGain();
    voice.gain.setValueAtTime(0.0001, start);
    voice.gain.linearRampToValueAtTime(Math.max(0.02, velocity), start + attack);
    voice.gain.exponentialRampToValueAtTime(
      0.22 * velocity,
      start + Math.min(0.22, Math.max(attack + 0.01, end - start)),
    );
    voice.gain.exponentialRampToValueAtTime(0.0001, stopAt);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 5200;
    filter.Q.value = 0.4;
    voice.connect(filter).connect(destination);

    const carrier = ctx.createOscillator();
    carrier.type = "sine";
    carrier.frequency.value = frequency;
    carrier.connect(voice);
    carrier.start(start);
    carrier.stop(stopAt);

    const upper = ctx.createOscillator();
    upper.type = "sine";
    upper.frequency.value = frequency * 2.002;
    const upperGain = ctx.createGain();
    upperGain.gain.value = 0.1 * velocity;
    upper.connect(upperGain).connect(voice);
    upper.start(start);
    upper.stop(stopAt);

    const modulator = ctx.createOscillator();
    modulator.type = "sine";
    modulator.frequency.value = frequency * 2.01;
    const modGain = ctx.createGain();
    modGain.gain.setValueAtTime(frequency * 1.1 * velocity, start);
    modGain.gain.exponentialRampToValueAtTime(Math.max(1, frequency * 0.02), start + 0.38);
    modulator.connect(modGain).connect(carrier.frequency);
    modulator.start(start);
    modulator.stop(stopAt);

    this.sources.add(carrier);
    this.sources.add(upper);
    this.sources.add(modulator);
  }

  play(example: Example, meta: PlaybackMeta = {}): void {
    const ctx = this.ensureContext();
    this.stop(false);
    const token = ++this.token;
    this.example = example;
    this.meta = meta;
    const tempo = this.preferredTempo ?? example.tempo;
    this.beatDuration = 60 / tempo;
    this.sources.clear();

    if (!this.bus) return;
    const now = ctx.currentTime;
    this.bus.gain.cancelScheduledValues(now);
    this.bus.gain.setValueAtTime(0.0001, now);
    this.bus.gain.linearRampToValueAtTime(1, now + 0.02);

    this.emit({
      isPlaying: true,
      exampleId: example.id,
      title: meta.conceptTitle ? `${meta.conceptTitle} · ${example.title}` : example.title,
      conceptSlug: meta.conceptSlug,
      tempo,
      position: 0,
      duration: example.beats,
      loop: this.state.loop,
      activeNotes: [],
    });

    void this.ensureSamples(ctx).then(() => {
      if (token !== this.token || !this.ctx) return;
      this.startTime = this.ctx.currentTime + 0.08;
      this.schedulePass(token, this.startTime);
      this.startFrame(token);
      this.armLoopTimer(token, example);
    });
  }

  private schedulePass(token: number, startTime: number): void {
    if (!this.ctx || !this.bus || !this.example) return;
    const tempo = this.preferredTempo ?? this.example.tempo;
    const beat = 60 / tempo;
    for (const event of this.example.events) {
      const eventStart = startTime + event.beat * beat;
      const eventEnd = startTime + (event.beat + event.duration) * beat;
      event.notes.forEach((note, index) => {
        const velocity = 0.42 + (index === 0 ? 0.07 : 0) - Math.max(0, note.midi - 76) * 0.004;
        this.playPreparedVoice(
          note.midi,
          eventStart,
          eventEnd,
          Math.max(0.18, velocity),
          this.bus!,
        );
      });
    }
    if (token !== this.token) return;
  }

  private armLoopTimer(token: number, example: Example): void {
    if (this.loopTimer) window.clearTimeout(this.loopTimer);
    const tempo = this.preferredTempo ?? example.tempo;
    const seconds = (example.beats * 60) / tempo + 0.4;
    this.loopTimer = window.setTimeout(() => {
      if (token !== this.token || !this.ctx) return;
      if (!this.state.loop) {
        this.stop();
        return;
      }
      this.startTime = this.ctx.currentTime + 0.06;
      this.schedulePass(token, this.startTime);
      this.armLoopTimer(token, example);
    }, seconds * 1000);
  }

  private startFrame(token: number): void {
    if (this.frame) cancelAnimationFrame(this.frame);
    const tick = () => {
      if (token !== this.token || !this.ctx || !this.example) return;
      const elapsed = this.ctx.currentTime - this.startTime;
      const position = Math.max(0, Math.min(this.example.beats, elapsed / this.beatDuration));
      const active = uniqueSorted(activeNotesAt(this.example, position + 0.001));
      this.emit({ position, activeNotes: active });
      if (this.state.isPlaying) this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }

  stop(reset = true): void {
    this.token += 1;
    if (this.loopTimer) {
      window.clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    if (this.frame) {
      cancelAnimationFrame(this.frame);
      this.frame = null;
    }
    for (const source of this.sources) {
      try {
        source.stop();
      } catch {
        // already stopped
      }
    }
    this.sources.clear();
    if (this.bus && this.ctx) {
      const now = this.ctx.currentTime;
      this.bus.gain.cancelScheduledValues(now);
      this.bus.gain.setValueAtTime(1, now);
      this.bus.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    }
    if (reset) {
      this.example = null;
      this.meta = {};
      this.emit({
        isPlaying: false,
        exampleId: null,
        title: "",
        conceptSlug: undefined,
        position: 0,
        duration: 0,
        activeNotes: [],
      });
    } else {
      this.emit({ isPlaying: false, position: 0, activeNotes: [] });
    }
  }

  setTempo(tempo: number): void {
    this.preferredTempo = Math.min(220, Math.max(40, Math.round(tempo)));
    if (this.state.isPlaying && this.example) {
      const meta = this.meta;
      const example = this.example;
      this.play(example, meta);
    } else {
      this.emit({ tempo: this.preferredTempo });
    }
  }

  replay(): void {
    if (this.example) this.play(this.example, this.meta);
  }

  toggleLoop(): void {
    this.emit({ loop: !this.state.loop });
  }

  private schedulePreview(
    midis: number[],
    duration: number,
    stepSeconds: number,
    velocity: number,
  ): void {
    const ctx = this.ensureContext();
    void this.ensureSamples(ctx).then(() => {
      if (!this.bus) return;
      const start = ctx.currentTime + 0.02;
      midis.forEach((midi, index) => {
        const noteStart = start + index * stepSeconds;
        this.playPreparedVoice(
          midi,
          noteStart,
          noteStart + duration,
          velocity,
          this.bus!,
        );
      });
    });
  }

  previewNote(midi: number): void {
    this.schedulePreview([midi], 1.1, 0, 0.5);
  }

  previewChord(midis: number[]): void {
    this.schedulePreview(midis, 1.4, 0, 0.4);
  }

  previewSequence(midis: number[], stepSeconds = 0.18): void {
    this.schedulePreview(midis, stepSeconds * 1.5, stepSeconds, 0.38);
  }

  /** 按住发声：返回 hold id，用 holdEnd 释放；最短发声 0.35s，松手 ~0.3s 淡出。 */
  holdStart(midis: number[]): number {
    const ctx = this.ensureContext();
    if (!this.holdBus || midis.length === 0) return -1;
    const id = ++this.holdSeq;
    const hold: HoldVoice = {
      gain: ctx.createGain(),
      sources: [],
      startedAt: ctx.currentTime,
    };
    hold.gain.gain.value = 1;
    hold.gain.connect(this.holdBus);
    this.holds.set(id, hold);
    void this.ensureSamples(ctx).then(() => {
      if (!this.ctx || !this.holds.has(id)) return;
      const start = this.ctx.currentTime + 0.01;
      hold.startedAt = start;
      for (const midi of midis) this.startHoldVoice(midi, start, 0.46, hold);
    });
    return id;
  }

  holdEnd(id: number): void {
    const hold = this.holds.get(id);
    if (!hold || !this.ctx) return;
    this.holds.delete(id);
    const releaseAt = Math.max(this.ctx.currentTime, hold.startedAt + 0.35);
    hold.gain.gain.setTargetAtTime(0.0001, releaseAt, 0.09);
    const stopAt = releaseAt + 0.5;
    for (const source of hold.sources) {
      try {
        source.stop(stopAt);
      } catch {
        // already stopped
      }
    }
  }

  private startHoldVoice(midi: number, start: number, velocity: number, hold: HoldVoice): void {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const gain = ctx.createGain();
    const level = Math.max(0.08, Math.min(0.5, velocity * 0.8));
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(level, start + 0.008);
    gain.connect(hold.gain);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 6800;
    filter.Q.value = 0.3;
    filter.connect(gain);

    const sample = this.nearestSample(midi);
    if (sample) {
      const source = ctx.createBufferSource();
      source.buffer = sample.buffer;
      source.playbackRate.value = Math.pow(2, (midi - sample.midi) / 12);
      source.connect(filter);
      source.start(start);
      hold.sources.push(source);
      return;
    }

    const frequency = midiToFrequency(midi);
    const carrier = ctx.createOscillator();
    carrier.type = "sine";
    carrier.frequency.value = frequency;
    carrier.connect(filter);
    carrier.start(start);
    carrier.stop(start + 8);
    hold.sources.push(carrier);

    const upper = ctx.createOscillator();
    upper.type = "sine";
    upper.frequency.value = frequency * 2.002;
    const upperGain = ctx.createGain();
    upperGain.gain.value = 0.1 * velocity;
    upper.connect(upperGain).connect(filter);
    upper.start(start);
    upper.stop(start + 8);
    hold.sources.push(upper);
  }
}

export const audioEngine = new AudioEngine();
