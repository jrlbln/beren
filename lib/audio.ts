const AUDIO_BASE_PATH = "/audio";
const KANA_AUDIO_CATEGORY = "kana";
const SOUND_EFFECTS_CATEGORY = "sound_effects";

type SoundEffectName = "correct" | "wrong";

const SOUND_EFFECT_NAMES = ["correct", "wrong"] as const;

type WebAudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

let soundEffectContext: AudioContext | null = null;
const soundEffectBufferPromises: Partial<Record<SoundEffectName, Promise<AudioBuffer | null>>> = {};

export function getKanaAudioPath(romaji: string) {
  return `${AUDIO_BASE_PATH}/${KANA_AUDIO_CATEGORY}/${romaji}.mp3`;
}

function getSoundEffectPath(name: SoundEffectName) {
  return `${AUDIO_BASE_PATH}/${SOUND_EFFECTS_CATEGORY}/${name}.mp3`;
}

function getSoundEffectContext() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!soundEffectContext) {
    const webAudioWindow = window as WebAudioWindow;
    const AudioContextConstructor = webAudioWindow.AudioContext ?? webAudioWindow.webkitAudioContext;

    if (!AudioContextConstructor) {
      return null;
    }

    soundEffectContext = new AudioContextConstructor();
  }

  return soundEffectContext;
}

async function resumeSoundEffectContext(context: AudioContext) {
  if (context.state !== "suspended") {
    return true;
  }

  try {
    await context.resume();
    return true;
  } catch {
    return false;
  }
}

function loadSoundEffectBuffer(name: SoundEffectName) {
  const context = getSoundEffectContext();
  if (!context) {
    return Promise.resolve(null);
  }

  soundEffectBufferPromises[name] ??= fetch(getSoundEffectPath(name))
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to load ${name} sound effect.`);
      }

      return response.arrayBuffer();
    })
    .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
    .catch(() => null);

  return soundEffectBufferPromises[name];
}

export function preloadSoundEffects() {
  if (typeof window === "undefined") {
    return false;
  }

  SOUND_EFFECT_NAMES.forEach((name) => void loadSoundEffectBuffer(name));

  return true;
}

export function playKanaAudio(romaji: string) {
  if (typeof window === "undefined") {
    return false;
  }

  const src = getKanaAudioPath(romaji);

  const audio = new Audio(src);
  audio.play().catch(() => {
    // Let the caller fall back to speech synthesis if playback fails.
  });

  return true;
}

export function playSoundEffect(name: SoundEffectName) {
  if (typeof window === "undefined") {
    return false;
  }

  const context = getSoundEffectContext();
  if (!context) {
    return false;
  }

  void (async () => {
    const canPlay = await resumeSoundEffectContext(context);
    if (!canPlay) {
      return;
    }

    const buffer = await loadSoundEffectBuffer(name);
    if (!buffer) {
      return;
    }

    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start();
  })();

  return true;
}
