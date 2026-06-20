const AUDIO_BASE_PATH = "/audio";
const KANA_AUDIO_CATEGORY = "kana";
const SOUND_EFFECTS_CATEGORY = "sound_effects";

type SoundEffectName = "correct" | "wrong";

const soundEffectCache: Partial<Record<SoundEffectName, HTMLAudioElement>> = {};

export function getKanaAudioPath(romaji: string) {
  return `${AUDIO_BASE_PATH}/${KANA_AUDIO_CATEGORY}/${romaji}.mp3`;
}

function getSoundEffectPath(name: SoundEffectName) {
  return `${AUDIO_BASE_PATH}/${SOUND_EFFECTS_CATEGORY}/${name}.mp3`;
}

function getSoundEffectAudio(name: SoundEffectName) {
  if (typeof window === "undefined") {
    return null;
  }

  soundEffectCache[name] ??= new Audio(getSoundEffectPath(name));
  const audio = soundEffectCache[name];
  audio.preload = "auto";
  return audio;
}

function stopSoundEffectAudio(audio: HTMLAudioElement) {
  audio.pause();
  try {
    audio.currentTime = 0;
  } catch {
    // Some browsers disallow seeking before metadata is available.
  }
}

export function preloadSoundEffects() {
  if (typeof window === "undefined") {
    return false;
  }

  (["correct", "wrong"] as const).forEach((name) => {
    const audio = getSoundEffectAudio(name);
    audio?.load();
  });

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

  const audio = getSoundEffectAudio(name);
  if (!audio) {
    return false;
  }

  (["correct", "wrong"] as const).forEach((effectName) => {
    const cachedAudio = soundEffectCache[effectName];
    if (cachedAudio) {
      stopSoundEffectAudio(cachedAudio);
    }
  });

  audio.play().catch(() => {
    // Ignore playback failures for quiz feedback sounds.
  });

  return true;
}
