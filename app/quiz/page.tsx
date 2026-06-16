"use client";

import { useEffect, useMemo, useState } from "react";
import { getBaseRows, getDakutenRows, getHandakutenRows } from "@/lib/kana";
import {
  getCardsCombinationItems,
  kanjiRowOneSampleReadings,
  type LessonId,
} from "@/lib/lessons";
import { playSoundEffect } from "@/lib/audio";
import { getQuizResultCopy } from "@/lib/quiz-messages";

type QuizFlowPhase = "categories" | "script" | "items" | "quiz" | "results";
type KanaScript = "hiragana" | "katakana";
type QuizCategoryId = LessonId;

type QuizItem = {
  id: string;
  categoryId: QuizCategoryId;
  groupId: string;
  label: string;
  kana: string;
  reading: string;
};

type QuizQuestion = {
  id: string;
  item: QuizItem;
  options: string[];
};

const QUESTION_COUNT = 10;
const CHOICE_COUNT = 4;
const MAX_ATTEMPTS = 2;

const categoryCopy: Record<QuizCategoryId, string> = {
  kana: "KANA",
  dakuten: "DAKUTEN / HANDAKUTEN",
  combination: "COMBINATION",
  kanji: "KANJI",
};

const confusableReadings: Record<string, string[]> = {
  a: ["o", "i", "u"],
  i: ["e", "u", "a"],
  u: ["o", "a", "e"],
  e: ["i", "me", "o"],
  o: ["a", "u", "ro"],
  ka: ["ha", "ga", "ta"],
  ki: ["shi", "ri", "chi"],
  ku: ["fu", "nu", "su"],
  ke: ["ne", "ge", "se"],
  ko: ["so", "go", "no"],
  sa: ["ta", "za", "shi"],
  shi: ["chi", "ji", "ri"],
  su: ["tsu", "zu", "fu"],
  se: ["ze", "te", "ne"],
  so: ["zo", "ho", "ko"],
  ta: ["da", "sa", "ka"],
  chi: ["ji", "shi", "ni"],
  tsu: ["zu", "su", "fu"],
  te: ["de", "se", "ne"],
  to: ["do", "so", "ko"],
  na: ["ma", "ha", "ra"],
  ni: ["mi", "hi", "ri"],
  nu: ["mu", "fu", "ru"],
  ne: ["me", "he", "re"],
  no: ["mo", "ho", "ro"],
  ha: ["ba", "ma", "ka"],
  hi: ["bi", "mi", "ri"],
  fu: ["bu", "mu", "ku"],
  he: ["be", "me", "re"],
  ho: ["bo", "mo", "ro"],
  ma: ["na", "ra", "ha"],
  mi: ["ni", "ri", "ki"],
  mu: ["nu", "ru", "ku"],
  me: ["ne", "re", "ke"],
  mo: ["no", "ro", "ko"],
  ya: ["wa", "ra", "a"],
  yu: ["u", "yo", "ru"],
  yo: ["o", "yu", "ro"],
  ra: ["na", "ma", "ya"],
  ri: ["hi", "ni", "mi"],
  ru: ["nu", "mu", "yu"],
  re: ["ne", "me", "ke"],
  ro: ["o", "no", "mo"],
  wa: ["ya", "ra", "a"],
  wo: ["o", "ro", "ho"],
  n: ["mu", "ru", "no"],
  ga: ["ka", "ba", "da"],
  gi: ["ki", "bi", "ji"],
  gu: ["ku", "bu", "zu"],
  ge: ["ke", "be", "de"],
  go: ["ko", "bo", "do"],
  za: ["sa", "da", "ja"],
  ji: ["shi", "chi", "di"],
  zu: ["su", "tsu", "du"],
  ze: ["se", "de", "re"],
  zo: ["so", "do", "ro"],
  da: ["ta", "za", "ba"],
  de: ["te", "ze", "be"],
  do: ["to", "zo", "bo"],
  ba: ["pa", "ha", "ma"],
  bi: ["pi", "hi", "mi"],
  bu: ["pu", "fu", "mu"],
  be: ["pe", "he", "me"],
  bo: ["po", "ho", "mo"],
  pa: ["ba", "ha", "ma"],
  pi: ["bi", "hi", "mi"],
  pu: ["bu", "fu", "mu"],
  pe: ["be", "he", "me"],
  po: ["bo", "ho", "mo"],
  kya: ["sha", "cha", "gya"],
  kyu: ["shu", "chu", "gyu"],
  kyo: ["sho", "cho", "gyo"],
  sha: ["sya", "cha", "ja"],
  shu: ["syu", "chu", "ju"],
  sho: ["syo", "cho", "jo"],
  cha: ["sha", "ja", "nya"],
  chu: ["shu", "ju", "nyu"],
  cho: ["sho", "jo", "nyo"],
};

const shuffle = <T,>(items: T[]) => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
};

const repeatToLength = <T,>(items: T[], length: number) => {
  if (items.length === 0) return [];
  const repeated: T[] = [];
  while (repeated.length < length) repeated.push(...items);
  return repeated.slice(0, length);
};

const kanaRows = getBaseRows();
const dakutenRows = getDakutenRows();
const handakutenRows = getHandakutenRows();
const combinationRows = getCardsCombinationItems();

type QuizCategoryConfig = {
  id: QuizCategoryId;
  title: string;
  groups: Array<{ id: string; label: string; rows?: string[] }>;
};

function getItemGridClass(categoryId: QuizCategoryId | null) {
  return categoryId === "dakuten"
    ? "grid grid-cols-[minmax(10rem,1fr)] gap-3 w-full max-w-lg mx-auto"
    : "grid grid-cols-[repeat(2,minmax(8rem,1fr))] gap-3 w-full max-w-2xl mx-auto";
}

function getItemGridColumnClass(categoryId: QuizCategoryId | null, itemCount: number) {
  if (categoryId === "dakuten") {
    return "col-span-2 md:col-span-1";
  }

  if (itemCount === 1) {
    return "col-span-2 max-w-sm mx-auto";
  }

  return "";
}

function getItemLabelClass(categoryId: QuizCategoryId | null) {
  return categoryId === "combination"
    ? "text-xs font-semibold uppercase tracking-[0.22em] sm:text-sm"
    : "text-sm font-semibold tracking-[0.18em] sm:text-base";
}

const quizCategories: QuizCategoryConfig[] = [
  {
    id: "kana",
    title: categoryCopy.kana,
    groups: kanaRows.map((row) => ({
      id: row.id,
      label: `${row.characters[0]?.romaji ?? row.id}-${row.characters[row.characters.length - 1]?.romaji ?? row.id}`,
    })),
  },
  {
    id: "dakuten",
    title: categoryCopy.dakuten,
    groups: [...dakutenRows, ...handakutenRows].map((row) => ({
      id: row.id,
      label: `${row.characters[0]?.romaji ?? row.id}-${row.characters[row.characters.length - 1]?.romaji ?? row.id}`,
    })),
  },
  {
    id: "combination",
    title: categoryCopy.combination,
    groups: combinationRows.map((item) => ({
      id: item.id,
      label: item.label,
    })),
  },
  {
    id: "kanji",
    title: categoryCopy.kanji,
    groups: [{ id: "kanji-1", label: "Numbers" }],
  },
];

function getCategoryReadingPool(categoryId: QuizCategoryId, script: KanaScript) {
  if (categoryId === "kana") {
    return kanaRows.flatMap((row) => row.characters.map((character) => character.romaji));
  }

  if (categoryId === "dakuten") {
    return [...dakutenRows, ...handakutenRows].flatMap((row) =>
      row.characters.map((character) => character.romaji),
    );
  }

  if (categoryId === "combination") {
    return combinationRows.flatMap((item) => item.row.characters.map((character) => character.romaji));
  }

  return kanjiRowOneSampleReadings.flatMap((item) => {
    const onyomiParts = item.onyomi.split("/").map((part) => part.trim()).filter(Boolean);
    return onyomiParts;
  });
}

function buildQuizItems(categoryId: QuizCategoryId, groupIds: string[], script: KanaScript) {
  const items: QuizItem[] = [];

  if (categoryId === "kana") {
    kanaRows
      .filter((row) => groupIds.includes(row.id))
      .forEach((row) => {
        row.characters.forEach((character) => {
          items.push({
            id: `kana-${row.id}-${character.romaji}`,
            categoryId,
            groupId: row.id,
            label: row.label,
            kana: character[script],
            reading: character.romaji,
          });
        });
      });
  }

  if (categoryId === "dakuten") {
    [...dakutenRows, ...handakutenRows]
      .filter((row) => groupIds.includes(row.id))
      .forEach((row) => {
        row.characters.forEach((character) => {
          items.push({
            id: `dakuten-${row.id}-${character.romaji}`,
            categoryId,
            groupId: row.id,
            label: row.label,
            kana: character[script],
            reading: character.romaji,
          });
        });
      });
  }

  if (categoryId === "combination") {
    combinationRows.forEach((item) => {
      if (!groupIds.includes(item.id)) {
        return;
      }

      item.row.characters.forEach((character) => {
        items.push({
          id: `combination-${item.id}-${character.romaji}`,
          categoryId,
          groupId: item.id,
          label: item.label,
          kana: character[script],
          reading: character.romaji,
        });
      });
    });
  }

  if (categoryId === "kanji") {
    kanjiRowOneSampleReadings.forEach((item) => {
      const primaryReading = item.onyomi.split("/")[0]?.trim() ?? item.onyomi.trim();

      items.push({
        id: `kanji-${item.kanji}-${primaryReading}`,
        categoryId,
        groupId: "kanji-1",
        label: item.meaning,
        kana: item.kanji,
        reading: primaryReading,
      });
    });
  }

  return items;
}

function buildBalancedRoundItems(items: QuizItem[]) {
  const uniqueItems = Array.from(new Map(items.map((item) => [item.reading, item])).values());

  if (uniqueItems.length === 0) {
    return [];
  }

  const copiesNeeded = Math.ceil(QUESTION_COUNT / uniqueItems.length);
  const pool = Array.from({ length: copiesNeeded }, () => uniqueItems).flat().slice(0, QUESTION_COUNT);
  const buckets = new Map<string, QuizItem[]>();

  pool.forEach((item) => {
    const bucket = buckets.get(item.reading) ?? [];
    bucket.push(item);
    buckets.set(item.reading, bucket);
  });

  const ordered: QuizItem[] = [];
  let lastReading: string | null = null;

  while (ordered.length < pool.length) {
    const preferred = Array.from(buckets.entries())
      .filter(([reading, bucket]) => bucket.length > 0 && reading !== lastReading)
      .map(([, bucket]) => bucket[0]);
    const fallback = Array.from(buckets.values())
      .filter((bucket) => bucket.length > 0)
      .map((bucket) => bucket[0]);

    const nextItem = shuffle(preferred.length > 0 ? preferred : fallback)[0];
    if (!nextItem) break;

    const bucket = buckets.get(nextItem.reading);
    bucket?.shift();
    ordered.push(nextItem);
    lastReading = nextItem.reading;
  }

  return ordered;
}

function buildQuestionSet(items: QuizItem[], categoryId: QuizCategoryId, script: KanaScript) {
  const source = buildBalancedRoundItems(items);
  const categoryReadings = getCategoryReadingPool(categoryId, script);
  const kanjiReadings = kanjiRowOneSampleReadings.flatMap((item) =>
    item.onyomi.split("/").map((part) => part.trim()).filter(Boolean),
  );

  return source.map<QuizQuestion>((item, index) => {
    const distractorSource =
      categoryId === "kanji"
        ? kanjiReadings
        : [
            ...(confusableReadings[item.reading] ?? []),
            ...items.map((entry) => entry.reading),
            ...categoryReadings,
          ];

    const distractors = distractorSource.filter((reading) => reading !== item.reading);

    const options = shuffle([
      item.reading,
      ...Array.from(new Set(distractors)).filter((reading) => reading !== item.reading).slice(0, CHOICE_COUNT - 1),
    ]);

    return {
      id: `${item.id}-${index}`,
      item,
      options,
    };
  });
}

export default function QuizPage() {
  const [phase, setPhase] = useState<QuizFlowPhase>("categories");
  const [activeCategory, setActiveCategory] = useState<QuizCategoryId | null>(null);
  const [activeScript, setActiveScript] = useState<KanaScript | null>(null);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [score, setScore] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [wrongAnswer, setWrongAnswer] = useState<string | null>(null);
  const [revealedAnswer, setRevealedAnswer] = useState<string | null>(null);
  const isRevealMode = revealedAnswer !== null;

  const activeCategoryConfig = useMemo(
    () => quizCategories.find((category) => category.id === activeCategory) ?? null,
    [activeCategory],
  );

  const currentQuestion = questions[questionIndex] ?? null;
  const resultTime = startedAt ? elapsedSeconds : 0;
  const resultCopy = getQuizResultCopy(score, resultTime);

  useEffect(() => {
    if (phase !== "quiz" || finishedAt) return;
    const interval = window.setInterval(() => {
      setElapsedSeconds((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [phase, finishedAt]);

  useEffect(() => {
    const handleReset = (event: Event) => {
      const detail = (event as CustomEvent<{ href?: string }>).detail;
      if (detail?.href === "/quiz") {
        setPhase("categories");
        setActiveCategory(null);
        setActiveScript(null);
        setSelectedGroupIds([]);
        setQuestions([]);
        setQuestionIndex(0);
        setAttemptsLeft(MAX_ATTEMPTS);
        setScore(0);
        setStartedAt(null);
        setElapsedSeconds(0);
        setFinishedAt(null);
        setFeedback(null);
        setWrongAnswer(null);
        setRevealedAnswer(null);
      }
    };

    window.addEventListener("beren:reset-browser", handleReset);
    return () => window.removeEventListener("beren:reset-browser", handleReset);
  }, []);

  const resetToCategories = () => {
    setPhase("categories");
    setActiveCategory(null);
    setActiveScript(null);
    setSelectedGroupIds([]);
    setQuestions([]);
    setQuestionIndex(0);
    setAttemptsLeft(MAX_ATTEMPTS);
    setScore(0);
    setStartedAt(null);
    setElapsedSeconds(0);
    setFinishedAt(null);
    setFeedback(null);
    setWrongAnswer(null);
    setRevealedAnswer(null);
  };

  const startSelection = (categoryId: QuizCategoryId) => {
    setActiveCategory(categoryId);
    setActiveScript(null);
    setSelectedGroupIds([]);
    setPhase(categoryId === "kana" || categoryId === "dakuten" || categoryId === "combination" ? "script" : "items");
  };

  const startScriptSelection = (script: KanaScript) => {
    setActiveScript(script);
    setSelectedGroupIds([]);
    setPhase("items");
  };

  const toggleGroup = (groupId: string) => {
    setSelectedGroupIds((current) =>
      current.includes(groupId) ? current.filter((id) => id !== groupId) : [...current, groupId],
    );
  };

  const startQuiz = () => {
    if (!activeCategory) return;
    if (
      (activeCategory === "kana" || activeCategory === "dakuten" || activeCategory === "combination") &&
      !activeScript
    )
      return;
    const script = activeScript ?? "hiragana";
    const items = buildQuizItems(activeCategory, selectedGroupIds, script);
    const roundQuestions = buildQuestionSet(items, activeCategory, script);
    setQuestions(roundQuestions);
    setQuestionIndex(0);
    setAttemptsLeft(MAX_ATTEMPTS);
    setScore(0);
    setStartedAt(Date.now());
    setElapsedSeconds(0);
    setFinishedAt(null);
    setFeedback(null);
    setWrongAnswer(null);
    setRevealedAnswer(null);
    setPhase("quiz");
  };

  const handleAnswer = (reading: string) => {
    if (!currentQuestion || phase !== "quiz") return;

    if (reading === currentQuestion.item.reading) {
      playSoundEffect("correct");
      setFeedback("correct");
      setWrongAnswer(null);
      setRevealedAnswer(currentQuestion.item.reading);
      setScore((value) => value + 1);
      window.setTimeout(() => {
        const nextIndex = questionIndex + 1;
        setFeedback(null);
        setAttemptsLeft(MAX_ATTEMPTS);
        setWrongAnswer(null);
        setRevealedAnswer(null);
        if (nextIndex >= questions.length) {
          setQuestionIndex(nextIndex);
          setFinishedAt(Date.now());
          setPhase("results");
          return;
        }
        setQuestionIndex(nextIndex);
      }, 1000);
      return;
    }

    if (attemptsLeft > 1) {
      playSoundEffect("wrong");
      setAttemptsLeft((value) => value - 1);
      setFeedback("wrong");
      setWrongAnswer(reading);
      setRevealedAnswer(null);
      window.setTimeout(() => setFeedback(null), 450);
      return;
    }

    playSoundEffect("wrong");
    setFeedback("correct");
    setWrongAnswer(reading);
    setRevealedAnswer(currentQuestion.item.reading);
    setAttemptsLeft(MAX_ATTEMPTS);
    window.setTimeout(() => {
      const nextIndex = questionIndex + 1;
      setFeedback(null);
      setWrongAnswer(null);
      setRevealedAnswer(null);
      if (nextIndex >= questions.length) {
        setQuestionIndex(nextIndex);
        setFinishedAt(Date.now());
        setPhase("results");
        return;
      }
      setQuestionIndex(nextIndex);
    }, 1000);
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      {phase === "categories" ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="grid w-full max-w-5xl gap-4 md:grid-cols-2 xl:grid-cols-4">
            {quizCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  if (phase !== "categories" && activeCategory === category.id) {
                    resetToCategories();
                    return;
                  }
                  startSelection(category.id);
                }}
                className="flex min-h-44 items-center justify-center rounded-lg border-[3px] bg-white px-5 py-4 text-center text-slate-950 shadow-[0_6px_18px_-10px_rgba(15,23,42,0.35)] transition hover:border-slate-700"
              >
                <div className="max-w-full px-2 text-center text-[1rem] font-semibold leading-tight tracking-[0.08em] whitespace-normal wrap-break-word sm:text-[1.1rem] xl:text-[1.2rem]">
                  {category.title}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {phase === "script" && (activeCategory === "kana" || activeCategory === "dakuten" || activeCategory === "combination") ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="grid w-full max-w-5xl gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => startScriptSelection("hiragana")}
              className="flex min-h-44 items-center justify-center rounded-lg border-[3px] bg-white px-5 py-4 text-center text-slate-950 shadow-[0_6px_18px_-10px_rgba(15,23,42,0.35)] transition hover:border-slate-700"
            >
              <div className="max-w-full px-2 text-center text-[1rem] font-semibold leading-tight tracking-[0.08em] whitespace-normal wrap-break-word sm:text-[1.1rem] xl:text-[1.2rem]">
                HIRAGANA
              </div>
            </button>
            <button
              type="button"
              onClick={() => startScriptSelection("katakana")}
              className="flex min-h-44 items-center justify-center rounded-lg border-[3px] bg-white px-5 py-4 text-center text-slate-950 shadow-[0_6px_18px_-10px_rgba(15,23,42,0.35)] transition hover:border-slate-700"
            >
              <div className="max-w-full px-2 text-center text-[1rem] font-semibold leading-tight tracking-[0.08em] whitespace-normal wrap-break-word sm:text-[1.1rem] xl:text-[1.2rem]">
                KATAKANA
              </div>
            </button>
          </div>
        </div>
      ) : null}

      {phase === "items" && activeCategoryConfig ? (
        <div className="flex flex-1 flex-col space-y-5 pt-3 sm:pt-4">
          <div className="pb-1 text-center sm:pb-2">
            <p className="text-2xl font-bold uppercase tracking-[0.34em] text-slate-950">
              {activeCategoryConfig.title}
            </p>
            {(activeCategory === "kana" || activeCategory === "dakuten" || activeCategory === "combination") && activeScript ? (
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                {activeScript}
              </p>
            ) : null}
          </div>

          <div className={`${getItemGridClass(activeCategory)} flex-1 content-start`}>
            {activeCategoryConfig.groups.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => toggleGroup(group.id)}
                className={`flex min-h-16 w-full items-center justify-center rounded-2xl border px-4 py-3 text-center transition ${getItemGridColumnClass(
                  activeCategory,
                  activeCategoryConfig.groups.length,
                )} ${
                  selectedGroupIds.includes(group.id)
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 bg-white text-slate-800 hover:border-slate-400"
                }`}
              >
                <div className={getItemLabelClass(activeCategory)}>
                  {group.label}
                </div>
              </button>
            ))}
          </div>

          <div className="mx-auto flex w-full max-w-xl items-center justify-center gap-4">
            <button
              type="button"
              disabled={selectedGroupIds.length === 0}
              onClick={startQuiz}
              className="rounded-full bg-slate-950 px-8 py-3 text-sm font-semibold tracking-[0.18em] text-white transition disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Proceed
            </button>
          </div>
        </div>
      ) : null}

      {phase === "quiz" && currentQuestion ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-2xl space-y-6">
            <div className="mx-auto flex w-full max-w-md items-center justify-between px-1 text-sm font-medium text-slate-600">
              <span>
                {questionIndex + 1}/{QUESTION_COUNT}
              </span>
              <span>{resultTime}s</span>
            </div>

            <div className="flex justify-center">
              <div className="aspect-square w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex h-full items-center justify-center rounded-[2rem] bg-white text-center text-slate-950">
                  <div className="text-8xl font-semibold leading-none tracking-tight sm:text-[8.5rem]">
                    {currentQuestion.item.kana}
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto grid w-full max-w-md gap-3 sm:grid-cols-2">
              {currentQuestion.options.map((option) => {
                const isCorrectReveal =
                  option === currentQuestion.item.reading && revealedAnswer === currentQuestion.item.reading;
                const isWrongChoice = option === wrongAnswer && !isRevealMode;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleAnswer(option)}
                    disabled={option === wrongAnswer || isRevealMode}
                    className={`flex min-h-16 items-center justify-center rounded-3xl border px-5 py-4 text-center text-lg font-semibold transition ${
                      isCorrectReveal
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : isWrongChoice
                          ? "border-rose-400 bg-rose-50 text-rose-700"
                          : "border-slate-200 bg-slate-50 text-slate-800 hover:border-amber-300 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-70"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {phase === "results" ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex min-h-[72vh] w-full max-w-2xl flex-col items-center justify-center rounded-[2rem] border border-slate-200 bg-white/90 p-8 text-center shadow-sm">
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">{resultCopy.headline}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{resultCopy.subtext}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Score {score}/{QUESTION_COUNT} time: {resultTime}s
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={resetToCategories}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Change selection
              </button>
              <button
                type="button"
                onClick={startQuiz}
                className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Run again
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
