"use client";

import { useState } from "react";
import { KanaTable } from "@/components/Sheet/KanaTable";
import { VoicedKanaCard } from "@/components/Sheet/VoicedKanaCard";
import { CombinationSection } from "@/components/Sheet/CombinationSection";
import type { KanaRow } from "@/lib/kana";

type ComboItem = {
  kana: string;
  romaji: string;
};

type ComboGroup = {
  title: string;
  items: ComboItem[];
};

type TableBrowserProps = {
  baseRows: KanaRow[];
  voicedRows: KanaRow[];
  hiraganaGroups: ComboGroup[];
  katakanaGroups: ComboGroup[];
};

type LessonId = "kana" | "dakuten" | "combination" | "kanji";

const lessons: Array<{ id: LessonId; label: string }> = [
  { id: "kana", label: "Kana" },
  { id: "dakuten", label: "Dakuten / Handakuten" },
  { id: "combination", label: "Combination" },
  { id: "kanji", label: "Kanji" },
];

export function TableBrowser({
  baseRows,
  voicedRows,
  hiraganaGroups,
  katakanaGroups,
}: TableBrowserProps) {
  const [activeLesson, setActiveLesson] = useState<LessonId | null>(null);

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      {activeLesson === null ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                type="button"
                onClick={() => setActiveLesson(lesson.id)}
                className="flex min-h-44 items-center justify-center rounded-lg border-[3px] border-slate-900 bg-white px-5 py-4 text-center text-slate-950 shadow-[0_6px_18px_-10px_rgba(15,23,42,0.35)] transition hover:border-slate-700"
              >
                <div className="text-[1.6rem] font-semibold tracking-[0.16em]">
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
              {lessons.find((lesson) => lesson.id === activeLesson)?.label}
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
            <section className="rounded-4xl border border-slate-200 bg-white/90 p-6 shadow-sm sm:p-7">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Kanji
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Kanji table content will be added here.
              </p>
            </section>
          ) : null}
        </div>
      )}
    </section>
  );
}
