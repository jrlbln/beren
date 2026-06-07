import type { KanaRow } from "@/lib/kana";

export type AppTabId = "cards" | "quiz" | "table";
export type LessonId = "kana" | "dakuten" | "combination" | "kanji";

export type AppTab = {
  id: AppTabId;
  href: `/${AppTabId}`;
  label: string;
};

export type LessonTopic = {
  id: LessonId;
  label: string;
};

export type LessonFlowPhase = "categories" | "items" | "card";

export type LessonFlowState = {
  phase: LessonFlowPhase;
  activeCategoryId: string;
  activeItemIds: string[];
};

export type LessonFlowAction =
  | { type: "reset" }
  | { type: "select-category"; categoryId: string }
  | { type: "toggle-item"; itemId: string }
  | { type: "proceed" };

export const initialLessonFlowState: LessonFlowState = {
  phase: "categories",
  activeCategoryId: "",
  activeItemIds: [],
};

export function lessonFlowReducer(
  state: LessonFlowState,
  action: LessonFlowAction,
): LessonFlowState {
  switch (action.type) {
    case "reset":
      return initialLessonFlowState;
    case "select-category":
      return {
        phase: "items",
        activeCategoryId: action.categoryId,
        activeItemIds: [],
      };
    case "toggle-item":
      return {
        ...state,
        activeItemIds: state.activeItemIds.includes(action.itemId)
          ? state.activeItemIds.filter((id) => id !== action.itemId)
          : [...state.activeItemIds, action.itemId],
      };
    case "proceed":
      return state.activeItemIds.length > 0
        ? { ...state, phase: "card" }
        : state;
    default:
      return state;
  }
}

export type LessonCardItem = {
  id: string;
  label: string;
  row: KanaRow;
};

export type LessonCardCategory = {
  id: "kana" | "dakuten" | "combination" | "kanji";
  title: string;
  items: LessonCardItem[];
};

export type LessonCardSourceGroup = {
  id: "kana" | "dakuten";
  title: string;
  rows: KanaRow[];
};

export type LessonGroupItem = {
  id: string;
  kana: string;
  romaji: string;
};

export type LessonGroup = {
  title: string;
  items: LessonGroupItem[];
};

export type KanjiReading = {
  kanji: string;
  onyomi: string;
  kunyomi: string;
  meaning: string;
};

export const appTabs: AppTab[] = [
  { id: "cards", href: "/cards", label: "Cards" },
  { id: "quiz", href: "/quiz", label: "Quiz" },
  { id: "table", href: "/table", label: "Table" },
];

export const lessonTopics: LessonTopic[] = [
  { id: "kana", label: "Kana" },
  { id: "dakuten", label: "Dakuten / Handakuten" },
  { id: "combination", label: "Combination" },
  { id: "kanji", label: "Kanji" },
];

export const kanjiRowOneSampleReadings: KanjiReading[] = [
  { kanji: "一", onyomi: "ichi", kunyomi: "hito(tsu)", meaning: "one" },
  { kanji: "二", onyomi: "ni", kunyomi: "futa(tsu)", meaning: "two" },
  { kanji: "三", onyomi: "san", kunyomi: "mi(tsu)", meaning: "three" },
  { kanji: "四", onyomi: "shi / yon", kunyomi: "yo(tsu)", meaning: "four" },
  { kanji: "五", onyomi: "go", kunyomi: "itsu(tsu)", meaning: "five" },
  { kanji: "六", onyomi: "roku", kunyomi: "mu(tsu)", meaning: "six" },
  { kanji: "七", onyomi: "shichi / nana", kunyomi: "na(tsu)", meaning: "seven" },
  { kanji: "八", onyomi: "hachi", kunyomi: "ya(tsu)", meaning: "eight" },
  { kanji: "九", onyomi: "kyu / ku", kunyomi: "kokono(tsu)", meaning: "nine" },
  { kanji: "十", onyomi: "juu", kunyomi: "too", meaning: "ten" },
];

export function makeCombinationRow(
  id: string,
  label: string,
  characters: KanaRow["characters"],
): KanaRow {
  return {
    id,
    label,
    characters,
  };
}

export function makePlaceholderRow(id: string, label: string, index: number): KanaRow {
  return {
    id,
    label,
    characters: [
      {
        hiragana: "一",
        katakana: "一",
        romaji: `row${index + 1}`,
      },
    ],
  };
}

export function buildLessonCardCategories(input: {
  kanaRows: LessonCardSourceGroup[];
  combinationItems: LessonCardItem[];
  kanjiItems: Array<{ id: string; label: string }>;
}): LessonCardCategory[] {
  return [
    {
      id: "kana",
      title: "KANA",
      items:
        input.kanaRows[0]?.rows.map((row) => ({
          id: row.id,
          label: row.label,
          row,
        })) ?? [],
    },
    {
      id: "dakuten",
      title: "DAKUTEN / HANDAKUTEN",
      items:
        input.kanaRows[1]?.rows.map((row) => ({
          id: row.id,
          label: row.label,
          row,
        })) ?? [],
    },
    {
      id: "combination",
      title: "COMBINATION",
      items: input.combinationItems,
    },
    {
      id: "kanji",
      title: "KANJI",
      items: input.kanjiItems.map((item, index) => ({
        id: item.id,
        label: item.label,
        row: makePlaceholderRow(item.id, item.label, index),
      })),
    },
  ];
}

export function getCardsCombinationItems(): LessonCardItem[] {
  return [
    {
      id: "kya",
      label: "KYA",
      row: makeCombinationRow("kya", "KYA", [
        { romaji: "kya", hiragana: "きゃ", katakana: "キャ" },
        { romaji: "kyu", hiragana: "きゅ", katakana: "キュ" },
        { romaji: "kyo", hiragana: "きょ", katakana: "キョ" },
      ]),
    },
    {
      id: "sha",
      label: "SHA",
      row: makeCombinationRow("sha", "SHA", [
        { romaji: "sha", hiragana: "しゃ", katakana: "シャ" },
        { romaji: "shu", hiragana: "しゅ", katakana: "シュ" },
        { romaji: "sho", hiragana: "しょ", katakana: "ショ" },
      ]),
    },
    {
      id: "cha",
      label: "CHA",
      row: makeCombinationRow("cha", "CHA", [
        { romaji: "cha", hiragana: "ちゃ", katakana: "チャ" },
        { romaji: "chu", hiragana: "ちゅ", katakana: "チュ" },
        { romaji: "cho", hiragana: "ちょ", katakana: "チョ" },
      ]),
    },
    {
      id: "nya",
      label: "NYA",
      row: makeCombinationRow("nya", "NYA", [
        { romaji: "nya", hiragana: "にゃ", katakana: "ニャ" },
        { romaji: "nyu", hiragana: "にゅ", katakana: "ニュ" },
        { romaji: "nyo", hiragana: "にょ", katakana: "ニョ" },
      ]),
    },
    {
      id: "hya",
      label: "HYA",
      row: makeCombinationRow("hya", "HYA", [
        { romaji: "hya", hiragana: "ひゃ", katakana: "ヒャ" },
        { romaji: "hyu", hiragana: "ひゅ", katakana: "ヒュ" },
        { romaji: "hyo", hiragana: "ひょ", katakana: "ヒョ" },
      ]),
    },
    {
      id: "mya",
      label: "MYA",
      row: makeCombinationRow("mya", "MYA", [
        { romaji: "mya", hiragana: "みゃ", katakana: "ミャ" },
        { romaji: "myu", hiragana: "みゅ", katakana: "ミュ" },
        { romaji: "myo", hiragana: "みょ", katakana: "ミョ" },
      ]),
    },
    {
      id: "rya",
      label: "RYA",
      row: makeCombinationRow("rya", "RYA", [
        { romaji: "rya", hiragana: "りゃ", katakana: "リャ" },
        { romaji: "ryu", hiragana: "りゅ", katakana: "リュ" },
        { romaji: "ryo", hiragana: "りょ", katakana: "リョ" },
      ]),
    },
    {
      id: "gya",
      label: "GYA",
      row: makeCombinationRow("gya", "GYA", [
        { romaji: "gya", hiragana: "ぎゃ", katakana: "ギャ" },
        { romaji: "gyu", hiragana: "ぎゅ", katakana: "ギュ" },
        { romaji: "gyo", hiragana: "ぎょ", katakana: "ギョ" },
      ]),
    },
    {
      id: "ja",
      label: "JA",
      row: makeCombinationRow("ja", "JA", [
        { romaji: "ja", hiragana: "じゃ", katakana: "ジャ" },
        { romaji: "ju", hiragana: "じゅ", katakana: "ジュ" },
        { romaji: "jo", hiragana: "じょ", katakana: "ジョ" },
      ]),
    },
    {
      id: "dja",
      label: "JA",
      row: makeCombinationRow("dja", "JA", [
        { romaji: "ja", hiragana: "ぢゃ", katakana: "ヂャ" },
        { romaji: "ju", hiragana: "ぢゅ", katakana: "ヂュ" },
        { romaji: "jo", hiragana: "ぢょ", katakana: "ヂョ" },
      ]),
    },
    {
      id: "bya",
      label: "BYA",
      row: makeCombinationRow("bya", "BYA", [
        { romaji: "bya", hiragana: "びゃ", katakana: "ビャ" },
        { romaji: "byu", hiragana: "びゅ", katakana: "ビュ" },
        { romaji: "byo", hiragana: "びょ", katakana: "ビョ" },
      ]),
    },
    {
      id: "pya",
      label: "PYA",
      row: makeCombinationRow("pya", "PYA", [
        { romaji: "pya", hiragana: "ぴゃ", katakana: "ピャ" },
        { romaji: "pyu", hiragana: "ぴゅ", katakana: "ピュ" },
        { romaji: "pyo", hiragana: "ぴょ", katakana: "ピョ" },
      ]),
    },
  ];
}

export function getTableCombinationGroups(): {
  hiraganaGroups: LessonGroup[];
  katakanaGroups: LessonGroup[];
} {
  return {
    hiraganaGroups: [
      {
        title: "ya-row combinations",
        items: [
          { id: "kya", kana: "きゃ", romaji: "kya" },
          { id: "kyu", kana: "きゅ", romaji: "kyu" },
          { id: "kyo", kana: "きょ", romaji: "kyo" },
          { id: "sha", kana: "しゃ", romaji: "sha" },
          { id: "shu", kana: "しゅ", romaji: "shu" },
          { id: "sho", kana: "しょ", romaji: "sho" },
          { id: "cha", kana: "ちゃ", romaji: "cha" },
          { id: "chu", kana: "ちゅ", romaji: "chu" },
          { id: "cho", kana: "ちょ", romaji: "cho" },
          { id: "nya", kana: "にゃ", romaji: "nya" },
          { id: "nyu", kana: "にゅ", romaji: "nyu" },
          { id: "nyo", kana: "にょ", romaji: "nyo" },
        ],
      },
      {
        title: "more ya-row combinations",
        items: [
          { id: "hya", kana: "ひゃ", romaji: "hya" },
          { id: "hyu", kana: "ひゅ", romaji: "hyu" },
          { id: "hyo", kana: "ひょ", romaji: "hyo" },
          { id: "mya", kana: "みゃ", romaji: "mya" },
          { id: "myu", kana: "みゅ", romaji: "myu" },
          { id: "myo", kana: "みょ", romaji: "myo" },
          { id: "rya", kana: "りゃ", romaji: "rya" },
          { id: "ryu", kana: "りゅ", romaji: "ryu" },
          { id: "ryo", kana: "りょ", romaji: "ryo" },
          { id: "gya", kana: "ぎゃ", romaji: "gya" },
          { id: "gyu", kana: "ぎゅ", romaji: "gyu" },
          { id: "gyo", kana: "ぎょ", romaji: "gyo" },
        ],
      },
      {
        title: "additional voiced combinations",
        items: [
          { id: "ja", kana: "じゃ", romaji: "ja" },
          { id: "ju", kana: "じゅ", romaji: "ju" },
          { id: "jo", kana: "じょ", romaji: "jo" },
          { id: "dja", kana: "ぢゃ", romaji: "ja" },
          { id: "dju", kana: "ぢゅ", romaji: "ju" },
          { id: "djo", kana: "ぢょ", romaji: "jo" },
          { id: "bya", kana: "びゃ", romaji: "bya" },
          { id: "byu", kana: "びゅ", romaji: "byu" },
          { id: "byo", kana: "びょ", romaji: "byo" },
          { id: "pya", kana: "ぴゃ", romaji: "pya" },
          { id: "pyu", kana: "ぴゅ", romaji: "pyu" },
          { id: "pyo", kana: "ぴょ", romaji: "pyo" },
        ],
      },
    ],
    katakanaGroups: [
      {
        title: "ya-row combinations",
        items: [
          { id: "kya", kana: "キャ", romaji: "kya" },
          { id: "kyu", kana: "キュ", romaji: "kyu" },
          { id: "kyo", kana: "キョ", romaji: "kyo" },
          { id: "sha", kana: "シャ", romaji: "sha" },
          { id: "shu", kana: "シュ", romaji: "shu" },
          { id: "sho", kana: "ショ", romaji: "sho" },
          { id: "cha", kana: "チャ", romaji: "cha" },
          { id: "chu", kana: "チュ", romaji: "chu" },
          { id: "cho", kana: "チョ", romaji: "cho" },
          { id: "gya", kana: "ギャ", romaji: "gya" },
          { id: "gyu", kana: "ギュ", romaji: "gyu" },
          { id: "gyo", kana: "ギョ", romaji: "gyo" },
        ],
      },
      {
        title: "additional voiced combinations",
        items: [
          { id: "ja", kana: "ジャ", romaji: "ja" },
          { id: "ju", kana: "ジュ", romaji: "ju" },
          { id: "jo", kana: "ジョ", romaji: "jo" },
          { id: "bya", kana: "ビャ", romaji: "bya" },
          { id: "byu", kana: "ビュ", romaji: "byu" },
          { id: "byo", kana: "ビョ", romaji: "byo" },
          { id: "pya", kana: "ピャ", romaji: "pya" },
          { id: "pyu", kana: "ピュ", romaji: "pyu" },
          { id: "pyo", kana: "ピョ", romaji: "pyo" },
          { id: "nya", kana: "ニャ", romaji: "nya" },
          { id: "nyu", kana: "ニュ", romaji: "nyu" },
          { id: "nyo", kana: "ニョ", romaji: "nyo" },
        ],
      },
    ],
  };
}
