"use client";

import { useEffect, useState } from "react";
import { KanaTable } from "@/components/Sheet/KanaTable";
import { KanjiReadingCard } from "@/components/Sheet/KanjiReadingCard";
import { VoicedKanaCard } from "@/components/Sheet/VoicedKanaCard";
import { CombinationSection } from "@/components/Sheet/CombinationSection";
import type { KanaRow } from "@/lib/kana";
import type { LessonGroup, LessonId } from "@/lib/lessons";
import { kanjiRowOneSampleReadings, lessonTopics } from "@/lib/lessons";

type TableBrowserProps = {
  baseRows: KanaRow[];
  voicedRows: KanaRow[];
  hiraganaGroups: LessonGroup[];
  katakanaGroups: LessonGroup[];
};

export function TableBrowser({
  baseRows,
  voicedRows,
  hiraganaGroups,
  katakanaGroups,
}: TableBrowserProps) {
  const [activeLesson, setActiveLesson] = useState<LessonId | null>(null);

  useEffect(() => {
    const handleReset = (event: Event) => {
      const detail = (event as CustomEvent<{ href?: string }>).detail;
      if (detail?.href === "/table") {
        setActiveLesson(null);
      }
    };

    window.addEventListener("beren:reset-browser", handleReset);
    return () => window.removeEventListener("beren:reset-browser", handleReset);
  }, []);

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      {activeLesson === null ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="grid w-full max-w-5xl gap-4 md:grid-cols-2 xl:grid-cols-4">
            {lessonTopics.map((lesson) => (
              <button
                key={lesson.id}
                type="button"
                onClick={() => setActiveLesson(lesson.id)}
                className="flex min-h-44 items-center justify-center rounded-lg border-[3px] border-slate-900 bg-white px-5 py-4 text-center text-slate-950 shadow-[0_6px_18px_-10px_rgba(15,23,42,0.35)] transition hover:border-slate-700"
              >
                <div className="max-w-full px-2 text-center text-[1rem] font-semibold leading-tight tracking-[0.08em] whitespace-normal break-words sm:text-[1.1rem] xl:text-[1.2rem]">
                  {lesson.label.toUpperCase()}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col space-y-5 pt-3 sm:pt-4">
          <div className="pb-1 text-center sm:pb-2">
            <p className="text-2xl font-bold uppercase tracking-[0.34em] text-slate-950">
              {lessonTopics.find((lesson) => lesson.id === activeLesson)?.label}
            </p>
          </div>

          {activeLesson === "kana" ? (
            <div className="space-y-6">
              <KanaTable title="Hiragana" rows={baseRows} script="hiragana" />
              <KanaTable title="Katakana" rows={baseRows} script="katakana" />
            </div>
          ) : null}

          {activeLesson === "dakuten" ? (
            <div className="space-y-6">
              <VoicedKanaCard
                title="Hiragana"
                rows={voicedRows}
                script="hiragana"
              />
              <VoicedKanaCard
                title="Katakana"
                rows={voicedRows}
                script="katakana"
              />
            </div>
          ) : null}

          {activeLesson === "combination" ? (
            <CombinationSection
              hiraganaGroups={hiraganaGroups}
              katakanaGroups={katakanaGroups}
            />
          ) : null}

          {activeLesson === "kanji" ? (
            <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-sm sm:p-7">
              <div className="mb-5">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  Kanji
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Sample row 1 with numbers one to ten.
                </p>
              </div>

              <div className="space-y-4">
                <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Row 1
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {kanjiRowOneSampleReadings.map((item) => (
                    <KanjiReadingCard
                      key={item.kanji}
                      kanji={item.kanji}
                      onyomi={item.onyomi}
                      kunyomi={item.kunyomi}
                      meaning={item.meaning}
                    />
                  ))}
                </div>
              </div>
            </section>
          ) : null}
        </div>
      )}
    </section>
  );
}
