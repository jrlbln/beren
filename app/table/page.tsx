import { TableBrowser } from "@/components/Sheet/TableBrowser";
import {
  getBaseRows,
  getDakutenRows,
  getHandakutenRows,
} from "@/lib/kana";

export default async function SheetPage() {
  const baseRows = getBaseRows();
  const voicedRows = [...getDakutenRows(), ...getHandakutenRows()];
  const hiraganaGroups = [
    {
      title: "i-row combinations",
      items: [
        { kana: "きゃ", romaji: "kya" },
        { kana: "きゅ", romaji: "kyu" },
        { kana: "きょ", romaji: "kyo" },
        { kana: "しゃ", romaji: "sha" },
        { kana: "しゅ", romaji: "shu" },
        { kana: "しょ", romaji: "sho" },
        { kana: "ちゃ", romaji: "cha" },
        { kana: "ちゅ", romaji: "chu" },
        { kana: "ちょ", romaji: "cho" },
        { kana: "にゃ", romaji: "nya" },
        { kana: "にゅ", romaji: "nyu" },
        { kana: "にょ", romaji: "nyo" },
      ],
    },
    {
      title: "more i-row combinations",
      items: [
        { kana: "ひゃ", romaji: "hya" },
        { kana: "ひゅ", romaji: "hyu" },
        { kana: "ひょ", romaji: "hyo" },
        { kana: "みゃ", romaji: "mya" },
        { kana: "みゅ", romaji: "myu" },
        { kana: "みょ", romaji: "myo" },
        { kana: "りゃ", romaji: "rya" },
        { kana: "りゅ", romaji: "ryu" },
        { kana: "りょ", romaji: "ryo" },
        { kana: "ぎゃ", romaji: "gya" },
        { kana: "ぎゅ", romaji: "gyu" },
        { kana: "ぎょ", romaji: "gyo" },
      ],
    },
    {
      title: "voiced and semi-voiced",
      items: [
        { kana: "じゃ", romaji: "ja" },
        { kana: "じゅ", romaji: "ju" },
        { kana: "じょ", romaji: "jo" },
        { kana: "ぢゃ", romaji: "dya" },
        { kana: "ぢゅ", romaji: "dyu" },
        { kana: "ぢょ", romaji: "dyo" },
        { kana: "びゃ", romaji: "bya" },
        { kana: "びゅ", romaji: "byu" },
        { kana: "びょ", romaji: "byo" },
        { kana: "ぴゃ", romaji: "pya" },
        { kana: "ぴゅ", romaji: "pyu" },
        { kana: "ぴょ", romaji: "pyo" },
      ],
    },
  ];

  const katakanaGroups = [
    {
      title: "basic combinations",
      items: [
        { kana: "キャ", romaji: "kya" },
        { kana: "キュ", romaji: "kyu" },
        { kana: "キョ", romaji: "kyo" },
        { kana: "シャ", romaji: "sha" },
        { kana: "シュ", romaji: "shu" },
        { kana: "ショ", romaji: "sho" },
        { kana: "チャ", romaji: "cha" },
        { kana: "チュ", romaji: "chu" },
        { kana: "チョ", romaji: "cho" },
        { kana: "ギャ", romaji: "gya" },
        { kana: "ギュ", romaji: "gyu" },
        { kana: "ギョ", romaji: "gyo" },
      ],
    },
    {
      title: "other combinations",
      items: [
        { kana: "ジャ", romaji: "ja" },
        { kana: "ジュ", romaji: "ju" },
        { kana: "ジョ", romaji: "jo" },
        { kana: "ビャ", romaji: "bya" },
        { kana: "ビュ", romaji: "byu" },
        { kana: "ビョ", romaji: "byo" },
        { kana: "ピャ", romaji: "pya" },
        { kana: "ピュ", romaji: "pyu" },
        { kana: "ピョ", romaji: "pyo" },
        { kana: "ニャ", romaji: "nya" },
        { kana: "ニュ", romaji: "nyu" },
        { kana: "ニョ", romaji: "nyo" },
      ],
    },
  ];

  return (
    <TableBrowser
      baseRows={baseRows}
      voicedRows={voicedRows}
      hiraganaGroups={hiraganaGroups}
      katakanaGroups={katakanaGroups}
    />
  );
}
