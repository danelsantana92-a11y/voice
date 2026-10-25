/**
 * Ambient background audio generator using standard Web Audio API.
 * Synthesizes procedural ambient textures to accompany speech narration.
 */

class AmbientPlayer {
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private isPlaying = false;
  private currentTrack = "none";
  private volume = 0.15;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume() {
    return this.volume;
  }

  public stop() {
    this.isPlaying = false;
    this.currentTrack = "none";

    // Clear any timers
    this.activeNodes.forEach((node) => {
      if (typeof node === "number") {
        clearInterval(node);
      } else {
        try {
          if ("stop" in node && typeof (node as any).stop === "function") {
            (node as any).stop();
          }
          node.disconnect();
        } catch {
          // Ignore disconnection errors on teardown
        }
      }
    });
    this.activeNodes = [];

    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch {}
      this.gainNode = null;
    }
  }

  public play(trackId: string, volume?: number) {
    this.stop();
    if (trackId === "none") return;

    this.initContext();
    if (!this.ctx) return;

    if (volume !== undefined) {
      this.volume = volume;
    }

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    this.isPlaying = true;
    this.currentTrack = trackId;

    switch (trackId) {
      case "rain":
        this.startRainAmbience();
        break;
      case "cinematic":
        this.startCinematicPad();
        break;
      case "lofi":
        this.startLofiWarmth();
        break;
      case "zen":
        this.startZenDrone();
        break;
    }
  }

  private startRainAmbience() {
    if (!this.ctx || !this.gainNode) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    whiteNoise.start();

    this.activeNodes.push(whiteNoise, filter);
  }

  private startCinematicPad() {
    if (!this.ctx || !this.gainNode) return;

    const freqs = [65.41, 98.0, 130.81, 196.0]; // C2, G2, C3, G3
    freqs.forEach((freq) => {
      if (!this.ctx || !this.gainNode) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      oscGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(this.gainNode);
      osc.start();

      this.activeNodes.push(osc, filter, oscGain);
    });
  }

  private startLofiWarmth() {
    if (!this.ctx || !this.gainNode) return;

    const freqs = [174.61, 220.0, 261.63, 329.63]; // F3, A3, C4, E4 (Fmaj7)
    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.gainNode) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      oscGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(this.gainNode);
      osc.start();

      this.activeNodes.push(osc, filter, oscGain);
    });
  }

  private startZenDrone() {
    if (!this.ctx || !this.gainNode) return;

    // 432Hz peaceful harmonic drone
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const padGain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(108, this.ctx.currentTime); // Sub-harmonic

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(216, this.ctx.currentTime); // Mid harmonic

    padGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    osc.connect(padGain);
    osc2.connect(padGain);
    padGain.connect(this.gainNode);

    osc.start();
    osc2.start();

    this.activeNodes.push(osc, osc2, padGain);
  }

  public getTrack() {
    return this.currentTrack;
  }
}

export const ambientPlayer = new AmbientPlayer();
