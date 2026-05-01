import { CardsBrowser } from "@/components/Learn/CardsBrowser";
import type { KanaRow } from "@/lib/kana";
import { getBaseRows, getDakutenRows, getHandakutenRows } from "@/lib/kana";

export default async function CardsPage() {
  const baseRows = getBaseRows();
  const dakutenRows = [...getDakutenRows(), ...getHandakutenRows()];
  const labelForRow = (row: KanaRow) => {
    const first = row.characters[0]?.romaji ?? row.id;
    const last = row.characters[row.characters.length - 1]?.romaji ?? first;
    return `${first}-${last}`;
  };
  const kanaRows = [
    {
      id: "kana",
      title: "KANA",
      rows: baseRows.map((row) => ({
        ...row,
        label: labelForRow(row),
      })),
    },
    {
      id: "dakuten",
      title: "DAKUTEN / HANDAKUTEN",
      rows: dakutenRows.map((row) => ({
        ...row,
        label: row.characters[0]?.romaji ? row.characters[0].romaji.toUpperCase() : row.label,
      })),
    },
  ];

  const combinationItems: Array<{ id: string; label: string; row: KanaRow }> = [
    {
      id: "kya",
      label: "KYA",
      row: {
        id: "kya",
        label: "KYA",
        characters: [
          { romaji: "kya", hiragana: "きゃ", katakana: "キャ" },
          { romaji: "kyu", hiragana: "きゅ", katakana: "キュ" },
          { romaji: "kyo", hiragana: "きょ", katakana: "キョ" },
        ],
      },
    },
    {
      id: "sha",
      label: "SHA",
      row: {
        id: "sha",
        label: "SHA",
        characters: [
          { romaji: "sha", hiragana: "しゃ", katakana: "シャ" },
          { romaji: "shu", hiragana: "しゅ", katakana: "シュ" },
          { romaji: "sho", hiragana: "しょ", katakana: "ショ" },
        ],
      },
    },
    {
      id: "cha",
      label: "CHA",
      row: {
        id: "cha",
        label: "CHA",
        characters: [
          { romaji: "cha", hiragana: "ちゃ", katakana: "チャ" },
          { romaji: "chu", hiragana: "ちゅ", katakana: "チュ" },
          { romaji: "cho", hiragana: "ちょ", katakana: "チョ" },
        ],
      },
    },
    {
      id: "nya",
      label: "NYA",
      row: {
        id: "nya",
        label: "NYA",
        characters: [
          { romaji: "nya", hiragana: "にゃ", katakana: "ニャ" },
          { romaji: "nyu", hiragana: "にゅ", katakana: "ニュ" },
          { romaji: "nyo", hiragana: "にょ", katakana: "ニョ" },
        ],
      },
    },
    {
      id: "hya",
      label: "HYA",
      row: {
        id: "hya",
        label: "HYA",
        characters: [
          { romaji: "hya", hiragana: "ひゃ", katakana: "ヒャ" },
          { romaji: "hyu", hiragana: "ひゅ", katakana: "ヒュ" },
          { romaji: "hyo", hiragana: "ひょ", katakana: "ヒョ" },
        ],
      },
    },
    {
      id: "mya",
      label: "MYA",
      row: {
        id: "mya",
        label: "MYA",
        characters: [
          { romaji: "mya", hiragana: "みゃ", katakana: "ミャ" },
          { romaji: "myu", hiragana: "みゅ", katakana: "ミュ" },
          { romaji: "myo", hiragana: "みょ", katakana: "ミョ" },
        ],
      },
    },
    {
      id: "rya",
      label: "RYA",
      row: {
        id: "rya",
        label: "RYA",
        characters: [
          { romaji: "rya", hiragana: "りゃ", katakana: "リャ" },
          { romaji: "ryu", hiragana: "りゅ", katakana: "リュ" },
          { romaji: "ryo", hiragana: "りょ", katakana: "リョ" },
        ],
      },
    },
    {
      id: "gya",
      label: "GYA",
      row: {
        id: "gya",
        label: "GYA",
        characters: [
          { romaji: "gya", hiragana: "ぎゃ", katakana: "ギャ" },
          { romaji: "gyu", hiragana: "ぎゅ", katakana: "ギュ" },
          { romaji: "gyo", hiragana: "ぎょ", katakana: "ギョ" },
        ],
      },
    },
    {
      id: "ja",
      label: "JA",
      row: {
        id: "ja",
        label: "JA",
        characters: [
          { romaji: "ja", hiragana: "じゃ", katakana: "ジャ" },
          { romaji: "ju", hiragana: "じゅ", katakana: "ジュ" },
          { romaji: "jo", hiragana: "じょ", katakana: "ジョ" },
        ],
      },
    },
    {
      id: "dya",
      label: "DYA",
      row: {
        id: "dya",
        label: "DYA",
        characters: [
          { romaji: "dya", hiragana: "ぢゃ", katakana: "ヂャ" },
          { romaji: "dyu", hiragana: "ぢゅ", katakana: "ヂュ" },
          { romaji: "dyo", hiragana: "ぢょ", katakana: "ヂョ" },
        ],
      },
    },
    {
      id: "bya",
      label: "BYA",
      row: {
        id: "bya",
        label: "BYA",
        characters: [
          { romaji: "bya", hiragana: "びゃ", katakana: "ビャ" },
          { romaji: "byu", hiragana: "びゅ", katakana: "ビュ" },
          { romaji: "byo", hiragana: "びょ", katakana: "ビョ" },
        ],
      },
    },
    {
      id: "pya",
      label: "PYA",
      row: {
        id: "pya",
        label: "PYA",
        characters: [
          { romaji: "pya", hiragana: "ぴゃ", katakana: "ピャ" },
          { romaji: "pyu", hiragana: "ぴゅ", katakana: "ピュ" },
          { romaji: "pyo", hiragana: "ぴょ", katakana: "ピョ" },
        ],
      },
    },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <CardsBrowser
        kanaRows={kanaRows}
        combinationItems={combinationItems}
        kanjiItems={[
          { id: "kanji-1", label: "ROW 1" },
          { id: "kanji-2", label: "ROW 2" },
          { id: "kanji-3", label: "ROW 3" },
          { id: "kanji-4", label: "ROW 4" },
          { id: "kanji-5", label: "ROW 5" },
          { id: "kanji-6", label: "ROW 6" },
          { id: "kanji-7", label: "ROW 7" },
          { id: "kanji-8", label: "ROW 8" },
          { id: "kanji-9", label: "ROW 9" },
          { id: "kanji-10", label: "ROW 10" },
        ]}
      />
    </div>
  );
}
