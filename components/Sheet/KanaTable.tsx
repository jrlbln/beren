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

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-sm sm:p-7">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          {title}
        </h2>
      </div>

      <div className="rounded-[1.75rem] bg-slate-50/90 p-2 sm:p-3">
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
