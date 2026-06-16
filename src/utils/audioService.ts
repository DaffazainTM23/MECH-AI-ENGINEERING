/**
 * Web Audio API procedurally synthesized mechanical & industrial sound effects.
 * Fully responsive, self-contained, and offline-compatible.
 */

class AudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private activeProcessingInterval: any = null;

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.ctx = new AudioContextClass();
      } catch (err) {
        console.error("Failed to initialize Web Audio Context:", err);
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuteStatus() {
    return this.isMuted;
  }

  /**
   * Crisp high-precision mechanical tactile button click.
   * Simulates a heavy-duty physical control panel toggle. (Primary Action)
   */
  public playClick() {
    this.playPrimaryClick();
  }

  /**
   * Primary Action: Crisp metallic mechanical panel relay switch.
   * Gives a heavy, satisfying premium industrial feedback.
   */
  public playPrimaryClick() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Metal snap oscillator
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.06);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);

    // Deep hydraulic valve slider undertone
    const slideOsc = ctx.createOscillator();
    const slideGain = ctx.createGain();
    slideOsc.type = "triangle";
    slideOsc.frequency.setValueAtTime(220, now);
    slideOsc.frequency.exponentialRampToValueAtTime(55, now + 0.08);

    slideGain.gain.setValueAtTime(0.12, now);
    slideGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    slideOsc.connect(slideGain);
    slideGain.connect(ctx.destination);
    slideOsc.start(now);
    slideOsc.stop(now + 0.11);
  }

  /**
   * Secondary Action: Soft high-frequency smart electronic transducer pulse.
   * Crisp, lightweight, tactile glass-like micro-tick feedback.
   */
  public playSecondaryClick() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.03);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  /**
   * Premium Cinematic Sci-Fi Robotic Server Boot-up Sound.
   * Played during the initial startup loading screen of the application.
   * Disabled to keep startup completely silent and quiet as requested.
   */
  public playStartup() {
    // Disabled for quiet/silent startup
  }

  /**
   * Industrial CNC machine / motor spindle spin-up audio sweep.
   * Simulates heavy machinery gearing up for calculation.
   * Disabled to keep background training/compiling silent.
   */
  public playCompileStart() {
    // Disabled for silent processing
  }

  /**
   * Cyclic machinery background hum during compiling process.
   * Disabled to keep processing/training completely quiet.
   */
  public startProcessingHum() {
    // Disabled for quiet execution
  }

  public stopProcessingHum() {
    // Disabled for quiet execution
  }

  /**
   * Heavy-duty industrial success announcement sound.
   * Disabled to prevent post-training success sound effect.
   */
  public playSuccess() {
    // Disabled for quiet execution
  }

  /**
   * Modern technological tab switch chime.
   * Transition sound effect.
   */
  public playTabSwitch() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "sine";

    osc1.frequency.setValueAtTime(320, now);
    osc1.frequency.exponentialRampToValueAtTime(480, now + 0.12);

    osc2.frequency.setValueAtTime(640, now + 0.04);
    osc2.frequency.exponentialRampToValueAtTime(960, now + 0.18);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.setValueAtTime(0.04, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.04);
    osc1.stop(now + 0.3);
    osc2.stop(now + 0.35);
  }
}

export const audio = new AudioService();
