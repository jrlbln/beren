import {
  getCharacterByGroupAndVowel,
  getGojuonColumns,
  getVoicedGroups,
  type KanaRow,
} from "@/lib/kana";

type VoicedKanaCardProps = {
  hiraganaRows: KanaRow[];
  katakanaRows: KanaRow[];
};

export function VoicedKanaCard({
  hiraganaRows,
  katakanaRows,
}: VoicedKanaCardProps) {
  const vowels = getGojuonColumns();
  const groups = getVoicedGroups();

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-sm sm:p-7">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Dakuten / Handakuten
        </h2>
      </div>

      <div className="rounded-[1.75rem] bg-slate-50/90 p-2 sm:p-3">
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {vowels.flatMap((vowel) =>
            groups.map((groupId) => {
              const hira = getCharacterByGroupAndVowel(hiraganaRows, groupId, vowel);
              const kata = getCharacterByGroupAndVowel(katakanaRows, groupId, vowel);

              return (
                <div
                  key={`voiced-${groupId}-${vowel}`}
                  className="flex min-h-24 flex-col justify-center rounded-2xl border border-slate-200 bg-white px-2 py-3 text-slate-900 shadow-sm"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 px-1 py-2">
                      <span className="text-[2rem] font-semibold leading-none text-slate-950">
                        {hira?.hiragana ?? " "}
                      </span>
                      <span className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.22em] text-slate-500">
                        hira
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 px-1 py-2">
                      <span className="text-[2rem] font-semibold leading-none text-slate-950">
                        {kata?.katakana ?? " "}
                      </span>
                      <span className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.22em] text-slate-500">
                        kata
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-center text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    <span>{hira?.romaji ?? kata?.romaji ?? ""}</span>
                  </div>
                </div>
              );
            }),
          )}
        </div>
      </div>
    </section>
  );
}
