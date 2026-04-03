type ComboItem = {
  kana: string;
  romaji: string;
};

type ComboGroup = {
  title: string;
  items: ComboItem[];
};

type CombinationSectionProps = {
  hiraganaGroups: ComboGroup[];
  katakanaGroups: ComboGroup[];
};

function CombinationCard({
  title,
  subtitle,
  groups,
}: {
  title: string;
  subtitle: string;
  groups: ComboGroup[];
}) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-sm sm:p-7">
      <div className="mb-5">
        <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
      </div>

      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.title} className="rounded-[1.5rem] bg-slate-50/90 p-3 sm:p-4">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              {group.title}
            </h4>
            <div className="grid gap-3 sm:grid-cols-3">
              {group.items.map((item) => (
                <div
                  key={`${group.title}-${item.romaji}`}
                  className="flex min-h-24 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm"
                >
                  <span className="text-[2.1rem] font-semibold leading-none text-slate-950">
                    {item.kana}
                  </span>
                  <span className="mt-2 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-slate-500">
                    {item.romaji}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CombinationSection({
  hiraganaGroups,
  katakanaGroups,
}: CombinationSectionProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-sm sm:p-7">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Combination
        </h2>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <CombinationCard
          title="Hiragana"
          subtitle="Kana from the i-row combines with small ゃ, ゅ, ょ to make new sounds."
          groups={hiraganaGroups}
        />
        <CombinationCard
          title="Katakana"
          subtitle="Katakana uses the same idea, combining big kana with small ャ, ュ, ョ."
          groups={katakanaGroups}
        />
      </div>
    </section>
  );
}
