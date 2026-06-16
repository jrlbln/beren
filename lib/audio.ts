const AUDIO_BASE_PATH = "/audio";
const KANA_AUDIO_CATEGORY = "kana";
const SOUND_EFFECTS_CATEGORY = "sound_effects";

export function getKanaAudioPath(romaji: string) {
  return `${AUDIO_BASE_PATH}/${KANA_AUDIO_CATEGORY}/${romaji}.mp3`;
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

export function playSoundEffect(name: "correct" | "wrong") {
  if (typeof window === "undefined") {
    return false;
  }

  const audio = new Audio(`${AUDIO_BASE_PATH}/${SOUND_EFFECTS_CATEGORY}/${name}.mp3`);
  audio.play().catch(() => {
    // Ignore playback failures for quiz feedback sounds.
  });

  return true;
}
