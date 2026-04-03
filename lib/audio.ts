const AUDIO_BASE_PATH = "/audio";

export function getKanaAudioPath(romaji: string) {
  return `${AUDIO_BASE_PATH}/${romaji}.mp3`;
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
