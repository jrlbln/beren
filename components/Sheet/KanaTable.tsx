"use client";

import { playKanaAudio } from "@/lib/audio";
import { KanaCell } from "@/components/Sheet/KanaCell";
import {
  getCharacterByGroupAndVowel,
  getGojuonColumns,
  getGojuonGroups,
  getStandaloneN,
  type KanaRow,
} from "@/lib/kana";

type KanaTableProps = {
  title: string;
  rows: KanaRow[];
  script: "hiragana" | "katakana";
};

export function KanaTable({
  title,
  rows,
  script,
}: KanaTableProps) {
  const vowels = getGojuonColumns();
  const groups = getGojuonGroups();
  const standaloneN = getStandaloneN(rows);
  const waRow = rows.find((row) => row.id === "wa");
  const wa = waRow?.characters.find((character) => character.romaji === "wa") ?? null;
  const wo = waRow?.characters.find((character) => character.romaji === "wo") ?? null;
  const mobileRows = [
    { id: "ka", label: "k" },
    { id: "sa", label: "s" },
    { id: "ta", label: "t" },
    { id: "na", label: "n" },
    { id: "ha", label: "h" },
    { id: "ma", label: "m" },
    { id: "ya", label: "y" },
    { id: "ra", label: "r" },
    { id: "wa", label: "w" },
  ];

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
            {mobileRows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-[3rem_repeat(5,minmax(0,1fr))] items-stretch"
              >
                <div className="flex items-center justify-center border-r border-slate-200 text-[1.4rem] font-semibold italic text-slate-950">
                  {row.label}
                </div>
                {vowels.map((vowel) => {
                  const character = getCharacterByGroupAndVowel(rows, row.id, vowel);

                  return (
                    <div key={`${script}-${row.id}-${vowel}`} className="border-r border-slate-200 last:border-r-0">
                      <div className="flex min-h-16 items-center justify-center p-1.5">
                        {character ? (
                          <button
                            type="button"
                            onClick={() => playKanaAudio(character.romaji)}
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-transparent px-0 py-0 transition hover:bg-slate-100 active:bg-slate-200 sm:h-14 sm:w-14"
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

            <div className="grid grid-cols-[3rem_repeat(5,minmax(0,1fr))] items-stretch">
              <div className="flex items-center justify-center border-r border-slate-200 text-[1.4rem] font-semibold italic text-slate-950">
                n
              </div>
              <div className="col-start-2 flex min-h-16 items-center justify-center border-r border-slate-200 p-1.5">
                {standaloneN ? (
                  <button
                    type="button"
                    onClick={() => playKanaAudio(standaloneN.romaji)}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-transparent px-0 py-0 transition hover:bg-slate-100 active:bg-slate-200 sm:h-14 sm:w-14"
                    aria-label={`Play ${standaloneN.romaji} in ${script}`}
                  >
                    <span className="text-[2rem] font-semibold leading-none text-slate-950">
                      {script === "hiragana" ? standaloneN.hiragana : standaloneN.katakana}
                    </span>
                  </button>
                ) : (
                  <span className="text-slate-300">○</span>
                )}
              </div>
              <div className="col-span-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block rounded-[1.75rem] bg-slate-50/90 p-2 sm:p-3">
        <div className="grid grid-cols-9 gap-1.5 sm:gap-2">
          {vowels.flatMap((vowel) =>
            groups.map((groupId) => {
              const character = getCharacterByGroupAndVowel(rows, groupId, vowel);

              return character ? (
                <KanaCell
                  key={`${script}-${groupId}-${vowel}`}
                  character={character}
                  script={script}
                />
              ) : (
                <div
                  key={`${script}-${groupId}-${vowel}-empty`}
                  className="min-h-24 rounded-2xl border border-dashed border-slate-200 bg-white/55"
                  aria-hidden="true"
                />
              );
            }),
          )}
        </div>

        {(wa || wo || standaloneN) ? (
          <div className="mt-2 grid grid-cols-9 gap-1.5 sm:gap-2">
            <div className="col-start-2 -translate-x-1/2">
              {wa ? (
                <KanaCell character={wa} script={script} />
              ) : (
                <div className="min-h-24 rounded-2xl border border-dashed border-slate-200 bg-white/55" aria-hidden="true" />
              )}
            </div>
            <div className="col-start-3 -translate-x-1/2">
              {wo ? (
                <KanaCell character={wo} script={script} />
              ) : (
                <div className="min-h-24 rounded-2xl border border-dashed border-slate-200 bg-white/55" aria-hidden="true" />
              )}
            </div>
            <div className="col-start-8 translate-x-1/2">
              {standaloneN ? (
                <KanaCell character={standaloneN} script={script} />
              ) : (
                <div className="min-h-24 rounded-2xl border border-dashed border-slate-200 bg-white/55" aria-hidden="true" />
              )}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
