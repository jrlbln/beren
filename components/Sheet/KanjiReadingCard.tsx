type KanjiReadingCardProps = {
  kanji: string;
  onyomi: string;
  kunyomi: string;
  meaning: string;
};

export function KanjiReadingCard({
  kanji,
  onyomi,
  kunyomi,
  meaning,
}: KanjiReadingCardProps) {
  return (
    <article className="flex min-h-36 flex-col justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="text-4xl font-semibold leading-none text-slate-950 sm:text-5xl">
          {kanji}
        </div>
        <div className="text-right text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
          {meaning}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div>
          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Onyomi
          </div>
          <div className="mt-1 text-sm font-semibold tracking-[0.08em] text-slate-900">
            {onyomi}
          </div>
        </div>

        <div>
          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Kunyomi
          </div>
          <div className="mt-1 text-sm font-semibold tracking-[0.08em] text-slate-900">
            {kunyomi}
          </div>
        </div>
      </div>
    </article>
  );
}
