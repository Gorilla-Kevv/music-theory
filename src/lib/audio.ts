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
  private sources = new Set<OscillatorNode>();

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
    this.startTime = ctx.currentTime + 0.1;
    this.sources.clear();

    if (!this.bus) return;
    const now = ctx.currentTime;
    this.bus.gain.cancelScheduledValues(now);
    this.bus.gain.setValueAtTime(0.0001, now);
    this.bus.gain.linearRampToValueAtTime(1, now + 0.02);
    this.schedulePass(token, this.startTime);

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

    this.startFrame(token);
    this.armLoopTimer(token, example);
  }

  private schedulePass(token: number, startTime: number): void {
    if (!this.ctx || !this.bus || !this.example) return;
    const tempo = this.preferredTempo ?? this.example.tempo;
    const beat = 60 / tempo;
    for (const event of this.example.events) {
      const eventStart = startTime + event.beat * beat;
      const eventEnd = startTime + (event.beat + event.duration) * beat;
      event.notes.forEach((note, index) => {
        const velocity = 0.44 + (index === 0 ? 0.08 : 0) - Math.max(0, note.midi - 76) * 0.004;
        this.scheduleVoice(note.midi, eventStart, eventEnd, Math.max(0.2, velocity), this.bus!);
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

  previewNote(midi: number): void {
    const ctx = this.ensureContext();
    if (!this.bus) return;
    const start = ctx.currentTime + 0.02;
    this.scheduleVoice(midi, start, start + 1.1, 0.5, this.bus);
  }

  previewChord(midis: number[]): void {
    const ctx = this.ensureContext();
    if (!this.bus) return;
    const start = ctx.currentTime + 0.02;
    midis.forEach((midi) => this.scheduleVoice(midi, start, start + 1.4, 0.4, this.bus!));
  }
}

export const audioEngine = new AudioEngine();
