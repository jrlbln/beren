"use client";

import { useEffect, useMemo, useReducer } from "react";
import { LearnDeck } from "@/components/Learn/LearnDeck";
import { KanjiDeck } from "@/components/Learn/KanjiDeck";
import {
  buildLessonCardCategories,
  initialLessonFlowState,
  kanjiRowOneSampleReadings,
  lessonFlowReducer,
  type LessonCardItem,
  type LessonCardSourceGroup,
} from "@/lib/lessons";

type CardsBrowserProps = {
  kanaRows: LessonCardSourceGroup[];
  combinationItems: LessonCardItem[];
  kanjiItems: Array<{ id: string; label: string }>;
};

export function CardsBrowser({ kanaRows, combinationItems, kanjiItems }: CardsBrowserProps) {
  const categories = useMemo(
    () => buildLessonCardCategories({ kanaRows, combinationItems, kanjiItems }),
    [kanaRows, combinationItems, kanjiItems],
  );

  const [flow, dispatch] = useReducer(lessonFlowReducer, initialLessonFlowState);

  useEffect(() => {
    const handleReset = (event: Event) => {
      const detail = (event as CustomEvent<{ href?: string }>).detail;
      if (detail?.href === "/cards") {
        dispatch({ type: "reset" });
      }
    };

    window.addEventListener("beren:reset-browser", handleReset);
    return () => window.removeEventListener("beren:reset-browser", handleReset);
  }, []);

  const activeCategory = categories.find((category) => category.id === flow.activeCategoryId) ?? null;
  const activeItems = activeCategory
    ? activeCategory.items.filter((item) => flow.activeItemIds.includes(item.id))
    : [];
  const isCardStage = flow.phase === "card" && activeItems.length > 0;

  const itemGridClass =
    activeCategory?.id === "dakuten"
      ? "grid grid-cols-[minmax(10rem,1fr)] gap-3 w-full max-w-lg mx-auto"
      : "grid grid-cols-[repeat(2,minmax(8rem,1fr))] gap-3 w-full max-w-2xl mx-auto";
  const itemGridItemClass = activeCategory?.items.length === 1 ? "col-span-2 max-w-sm mx-auto" : "";

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      {flow.phase === "categories" ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="grid w-full max-w-5xl gap-4 md:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => dispatch({ type: "select-category", categoryId: category.id })}
                className={`flex min-h-44 items-center justify-center rounded-lg border-[3px] bg-white px-5 py-4 text-center text-slate-950 shadow-[0_6px_18px_-10px_rgba(15,23,42,0.35)] transition ${
                  flow.activeCategoryId === category.id
                    ? "border-[#6aa7ff] text-[#6aa7ff]"
                    : "border-slate-900 hover:border-slate-700"
                }`}
              >
                <div className="max-w-full px-2 text-center text-[1rem] font-semibold leading-tight tracking-[0.08em] whitespace-normal wrap-break-word sm:text-[1.1rem] xl:text-[1.2rem]">
                  {category.title}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {flow.phase === "items" && activeCategory ? (
        <div className="flex flex-1 flex-col pt-3 sm:pt-4">
          <div className="pb-1 text-center sm:pb-2">
            <p className="text-2xl font-bold uppercase tracking-[0.34em] text-slate-950">
              {activeCategory.title}
            </p>
          </div>
          <div className={`${itemGridClass} mt-5 content-start`}>
              {activeCategory.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => dispatch({ type: "toggle-item", itemId: item.id })}
                  className={`flex min-h-16 w-full items-center justify-center rounded-2xl border px-4 py-3 text-center transition ${itemGridItemClass} ${
                    flow.activeItemIds.includes(item.id)
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 bg-white text-slate-800 hover:border-slate-400"
                  }`}
                >
                  <div className="text-sm font-semibold tracking-[0.18em] sm:text-base">
                    {item.label}
                  </div>
                </button>
              ))}
          </div>

          <div className="mt-5 flex justify-center">
            <button
              type="button"
              disabled={activeItems.length === 0}
              onClick={() => dispatch({ type: "proceed" })}
              className="rounded-full bg-slate-950 px-8 py-3 text-sm font-semibold tracking-[0.18em] text-white transition disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Proceed
            </button>
          </div>
        </div>
      ) : null}

      {isCardStage ? (
        <div className="flex h-[calc(100dvh-8.5rem)] max-h-[calc(100dvh-8.5rem)] min-h-0 flex-1 touch-none items-center justify-center overflow-hidden overscroll-none py-1 sm:h-[calc(100dvh-10rem)] sm:max-h-[calc(100dvh-10rem)] sm:py-2">
          {activeCategory?.id === "kanji" ? (
            <KanjiDeck readings={kanjiRowOneSampleReadings} />
          ) : (
            <LearnDeck
              rows={activeItems.map((item) => item.row)}
              showPronounceButton={activeCategory?.id === "kana"}
            />
          )}
        </div>
      ) : null}
    </section>
  );
}
