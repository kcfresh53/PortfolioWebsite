export type SoundName = 'item' | 'category' | 'blocked' | 'open' | 'close' | 'gallery' | 'hover' | 'select' | 'toggleOn' | 'toggleOff';

const FILES: Readonly<Record<SoundName, string>> = {
  item: 'item.wav',
  category: 'category.wav',
  blocked: 'blocked.wav',
  open: 'open.wav',
  close: 'close.wav',
  gallery: 'gallery.wav',
  hover: 'hover.wav',
  select: 'select.wav',
  toggleOn: 'toggle-on.wav',
  toggleOff: 'toggle-off.wav',
};

/** Per-sound loudness so tiny ticks don't get lost next to the longer cues. */
const VOLUME: Readonly<Record<SoundName, number>> = {
  item: 0.55,
  category: 0.6,
  blocked: 0.35,
  open: 0.6,
  close: 0.55,
  gallery: 0.5,
  hover: 0.28,
  select: 0.55,
  toggleOn: 0.6,
  toggleOff: 0.6,
};

const STORAGE_KEY = 'portfolio-sound';
const UNLOCK_EVENTS: readonly string[] = ['pointerdown', 'keydown', 'touchstart'];

function readPreference(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

function writePreference(enabled: boolean): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off');
  } catch {
    // Storage can be unavailable (private mode, blocked cookies); the preference just won't persist.
  }
}

/**
 * Menu sound effects on the Web Audio API for low-latency playback.
 * Browsers only allow audio after a user gesture, so nothing plays (or even loads) until the first one.
 */
export class SoundBank {
  enabled: boolean = $state(readPreference());

  private readonly baseUrl: string;
  private context: AudioContext | null = null;
  private unlocked = false;
  private loading: Promise<void> | null = null;
  private readonly buffers = new Map<SoundName, AudioBuffer>();

  constructor(root: string) {
    this.baseUrl = new URL(`${root}sfx/`, document.baseURI).href;
  }

  /** Starts listening for the first user gesture. Returns a detach function. */
  attachUnlock(): () => void {
    const unlock = (): void => {
      this.unlocked = true;
      void this.load();
      this.detach(unlock);
    };
    for (const type of UNLOCK_EVENTS) window.addEventListener(type, unlock, { passive: true });
    return (): void => this.detach(unlock);
  }

  play(name: SoundName): void {
    if (!this.enabled || !this.unlocked) return;
    const buffer: AudioBuffer | undefined = this.buffers.get(name);
    if (buffer !== undefined) {
      this.start(buffer, VOLUME[name]);
      return;
    }
    // First sounds can race the download; play them as soon as it lands.
    void this.load().then((): void => {
      const loaded: AudioBuffer | undefined = this.buffers.get(name);
      if (loaded !== undefined && this.enabled) this.start(loaded, VOLUME[name]);
    });
  }

  toggle(): void {
    if (this.enabled) {
      this.play('toggleOff');
      this.enabled = false;
    } else {
      this.enabled = true;
      this.play('toggleOn');
    }
    writePreference(this.enabled);
  }

  private detach(listener: () => void): void {
    for (const type of UNLOCK_EVENTS) window.removeEventListener(type, listener);
  }

  private ensureContext(): AudioContext | null {
    if (this.context === null) {
      try {
        this.context = new AudioContext();
      } catch {
        return null;
      }
    }
    if (this.context.state === 'suspended') void this.context.resume();
    return this.context;
  }

  private load(): Promise<void> {
    if (this.loading !== null) return this.loading;
    const context: AudioContext | null = this.ensureContext();
    if (context === null) return Promise.resolve();
    this.loading = Promise.all(
      (Object.keys(FILES) as SoundName[]).map(async (name: SoundName): Promise<void> => {
        try {
          const response: Response = await fetch(`${this.baseUrl}${FILES[name]}`);
          if (!response.ok) return;
          this.buffers.set(name, await context.decodeAudioData(await response.arrayBuffer()));
        } catch {
          // A missing or undecodable file just means that cue stays silent.
        }
      }),
    ).then((): void => undefined);
    return this.loading;
  }

  private start(buffer: AudioBuffer, volume: number): void {
    const context: AudioContext | null = this.ensureContext();
    if (context === null) return;
    const source: AudioBufferSourceNode = context.createBufferSource();
    const gain: GainNode = context.createGain();
    source.buffer = buffer;
    gain.gain.value = volume;
    source.connect(gain).connect(context.destination);
    source.start();
  }
}
