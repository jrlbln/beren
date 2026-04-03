"use client";

import { playKanaAudio } from "@/lib/audio";
import type { KanaCharacter } from "@/lib/kana";

type KanaCellProps = {
  character: KanaCharacter;
  script: "hiragana" | "katakana";
};

export function KanaCell({ character, script }: KanaCellProps) {
  const symbol = script === "hiragana" ? character.hiragana : character.katakana;

  return (
    <button
      type="button"
      onClick={() => playKanaAudio(character.romaji)}
      className="flex w-full min-w-0 min-h-24 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-2 py-3 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
      aria-label={`Play ${character.romaji} in ${script}`}
    >
      <span className="text-[clamp(2rem,3vw,2.6rem)] font-semibold leading-none tracking-wide text-slate-950">
        {symbol}
      </span>
      <span className="mt-1.5 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-slate-500">
        {character.romaji}
      </span>
    </button>
  );
}
