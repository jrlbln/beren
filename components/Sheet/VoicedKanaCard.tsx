"use client";

import { playKanaAudio } from "@/lib/audio";
import {
  getCharacterByGroupAndVowel,
  getGojuonColumns,
  getVoicedGroups,
  type KanaRow,
} from "@/lib/kana";

type VoicedKanaCardProps = {
  title: string;
  rows: KanaRow[];
  script: "hiragana" | "katakana";
};

export function VoicedKanaCard({ title, rows, script }: VoicedKanaCardProps) {
  const vowels = getGojuonColumns();
  const groups = getVoicedGroups();

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-sm sm:p-7">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          {title}
        </h2>
      </div>

      <div className="md:hidden">
        <div className="overflow-hidden">
          <div className="grid grid-cols-[3rem_repeat(5,minmax(0,1fr))] border-b border-slate-200 text-center text-[0.95rem] font-semibold uppercase tracking-[0.22em] text-slate-800">
            <div className="border-r border-slate-200" />
            {vowels.map((vowel) => (
              <div key={vowel} className="py-3">
                {vowel}
              </div>
            ))}
          </div>

          <div className="divide-y divide-slate-200">
            {groups.map((groupId) => (
              <div
                key={groupId}
                className="grid grid-cols-[3rem_repeat(5,minmax(0,1fr))] items-stretch"
              >
                <div className="flex items-center justify-center border-r border-slate-200 text-[1.4rem] font-semibold italic text-slate-950">
                  {groupId === "ga"
                    ? "g"
                    : groupId === "za"
                      ? "z"
                      : groupId === "da"
                        ? "d"
                        : groupId === "ba"
                          ? "b"
                          : "p"}
                </div>
                {vowels.map((vowel) => {
                  const character = getCharacterByGroupAndVowel(rows, groupId, vowel);

                  return (
                    <div
                      key={`${script}-${groupId}-${vowel}`}
                      className="border-r border-slate-200 last:border-r-0"
                    >
                      <div className="flex min-h-16 items-center justify-center p-1.5">
                        {character ? (
                          <button
                            type="button"
                            onClick={() => playKanaAudio(character.romaji)}
                            className="flex items-center justify-center px-0 py-0"
                            aria-label={`Play ${character.romaji} in ${script}`}
                          >
                            <span className="text-[2rem] font-semibold leading-none text-slate-950">
                              {script === "hiragana" ? character.hiragana : character.katakana}
                            </span>
                          </button>
                        ) : (
                          <span className="text-slate-300">○</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="hidden space-y-4 md:block">
        {groups.map((groupId) => (
          <div key={`${groupId}-desktop`} className="rounded-[1.5rem] bg-slate-50/90 p-3 sm:p-4">
            <div className="grid gap-3 sm:grid-cols-5">
              {vowels.map((vowel) => {
                const character = getCharacterByGroupAndVowel(rows, groupId, vowel);

                return character ? (
                  <button
                    type="button"
                    onClick={() => playKanaAudio(character.romaji)}
                    key={`${script}-${groupId}-${vowel}`}
                    className="flex min-h-24 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm"
                    aria-label={`Play ${character.romaji} in ${script}`}
                  >
                    <span className="text-[2.1rem] font-semibold leading-none text-slate-950">
                      {script === "hiragana" ? character.hiragana : character.katakana}
                    </span>
                    <span className="mt-2 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-slate-500">
                      {character.romaji}
                    </span>
                  </button>
                ) : (
                  <div
                    key={`${script}-${groupId}-${vowel}-desktop-empty`}
                    className="min-h-24 rounded-2xl border border-dashed border-slate-200 bg-white/55"
                    aria-hidden="true"
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
