"use client";

import { useMemo, useState } from "react";
import { LearnDeck } from "@/components/Learn/LearnDeck";
import type { KanaCharacter, KanaRow } from "@/lib/kana";

type CardGroup = {
  id: string;
  title: string;
  rows: KanaRow[];
};

type CategoryGroup = {
  id: string;
  title: string;
  items: Array<{
    id: string;
    label: string;
    row: KanaRow;
  }>;
};

type CardsBrowserProps = {
  kanaRows: CardGroup[];
  combinationItems: Array<{ id: string; label: string; row: KanaRow }>;
  kanjiItems: Array<{ id: string; label: string }>;
};

function makeSingleCharacterRow(id: string, label: string, character: KanaCharacter): KanaRow {
  return {
    id,
    label,
    characters: [character],
  };
}

export function CardsBrowser({ kanaRows, combinationItems, kanjiItems }: CardsBrowserProps) {
  const categories = useMemo<CategoryGroup[]>(
    () => [
      {
        id: "kana",
        title: "KANA",
        items: kanaRows[0]?.rows.map((row) => ({
          id: row.id,
          label: row.label,
          row,
        })) ?? [],
      },
      {
        id: "dakuten",
        title: "DAKUTEN / HANDAKUTEN",
        items: kanaRows[1]?.rows.map((row) => ({
          id: row.id,
          label: row.label,
          row,
        })) ?? [],
      },
      {
        id: "combination",
        title: "COMBINATION",
        items: combinationItems,
      },
      {
        id: "kanji",
        title: "KANJI",
        items: kanjiItems.map((item, index) => {
          const placeholder = makeSingleCharacterRow(
            item.id,
            item.label,
            {
              hiragana: "一",
              katakana: "一",
              romaji: `row${index + 1}`,
            },
          );

          return {
            id: item.id,
            label: item.label,
            row: placeholder,
          };
        }),
      },
    ],
    [kanaRows, combinationItems, kanjiItems],
  );

  const [phase, setPhase] = useState<"categories" | "items" | "card">("categories");
  const [activeCategoryId, setActiveCategoryId] = useState<string>("");
  const [activeItemIds, setActiveItemIds] = useState<string[]>([]);

  const activeCategory = categories.find((category) => category.id === activeCategoryId) ?? null;
  const activeItems = activeCategory
    ? activeCategory.items.filter((item) => activeItemIds.includes(item.id))
    : [];
  const itemGridClass =
    activeCategory?.id === "dakuten"
      ? "grid grid-cols-[minmax(10rem,1fr)] gap-3 w-full max-w-lg mx-auto"
      : "grid grid-cols-[repeat(2,minmax(8rem,1fr))] gap-3 w-full max-w-2xl mx-auto";

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      {phase === "categories" ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setActiveCategoryId(category.id);
                  setActiveItemIds([]);
                  setPhase("items");
                }}
                className={`flex min-h-44 items-center justify-center rounded-[0.5rem] border-[3px] bg-white px-5 py-4 text-center text-slate-950 shadow-[0_6px_18px_-10px_rgba(15,23,42,0.35)] transition ${
                  activeCategoryId === category.id
                    ? "border-[#6aa7ff] text-[#6aa7ff]"
                    : "border-slate-900 hover:border-slate-700"
                }`}
              >
                <div className="text-[1.6rem] font-semibold tracking-[0.16em]">
                  {category.title}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {phase === "items" && activeCategory ? (
          <div className="flex flex-1 flex-col space-y-6">
            <div className="text-center">
              <p className="text-2xl font-bold uppercase tracking-[0.34em] text-slate-950">
                {activeCategory.title}
              </p>
            </div>
            <div className={`${itemGridClass} flex-1 content-start`}>
              {activeCategory.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                onClick={() =>
                  setActiveItemIds((current) =>
                    current.includes(item.id)
                      ? current.filter((id) => id !== item.id)
                      : [...current, item.id],
                  )
                }
                  className={`flex min-h-16 w-full items-center justify-center rounded-2xl border px-4 py-3 text-center transition ${
                    activeItemIds.includes(item.id)
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 bg-white text-slate-800 hover:border-slate-400"
                  }`}
                >
                  <div className="text-base font-semibold tracking-[0.22em]">
                    {item.label}
                  </div>
                </button>
              ))}
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              disabled={activeItems.length === 0}
              onClick={() => setPhase("card")}
              className="rounded-full bg-slate-950 px-8 py-3 text-sm font-semibold tracking-[0.18em] text-white transition disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Proceed
            </button>
          </div>
        </div>
      ) : null}

      {phase === "card" && activeItems.length > 0 ? (
        <div className="flex min-h-0 flex-1 items-stretch justify-center py-2">
          <LearnDeck
            rows={activeItems.map((item) => item.row)}
            showPronounceButton={activeCategory?.id === "kana"}
          />
        </div>
      ) : null}
    </section>
  );
}
