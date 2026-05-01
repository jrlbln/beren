"use client";

import { playKanaAudio } from "@/lib/audio";
import type { KanaCharacter } from "@/lib/kana";

type CircleKanaCellProps = {
  character: KanaCharacter;
  script: "hiragana" | "katakana";
  sizeClassName?: string;
};

export function CircleKanaCell({
  character,
  script,
  sizeClassName = "aspect-square h-14 w-14 sm:h-16 sm:w-16",
}: CircleKanaCellProps) {
  return (
    <button
      type="button"
      onClick={() => playKanaAudio(character.romaji)}
      className={`flex shrink-0 items-center justify-center rounded-full border-2 border-slate-900 bg-white p-0 text-[2rem] font-extrabold leading-none text-slate-950 shadow-sm transition active:scale-95 ${sizeClassName}`}
      aria-label={`Play ${character.romaji} in ${script}`}
    >
      {script === "hiragana" ? character.hiragana : character.katakana}
    </button>
  );
}
