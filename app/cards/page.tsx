import { CardsBrowser } from "@/components/Learn/CardsBrowser";
import type { KanaRow } from "@/lib/kana";
import { getBaseRows, getDakutenRows, getHandakutenRows } from "@/lib/kana";
import { getCardsCombinationItems, type LessonCardSourceGroup } from "@/lib/lessons";

export default async function CardsPage() {
  const baseRows = getBaseRows();
  const dakutenRows = [...getDakutenRows(), ...getHandakutenRows()];
  const labelForRow = (row: KanaRow) => {
    const first = row.characters[0]?.romaji ?? row.id;
    const last = row.characters[row.characters.length - 1]?.romaji ?? first;
    return `${first}-${last}`;
  };
  const kanaRows: LessonCardSourceGroup[] = [
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

  const combinationItems = getCardsCombinationItems();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <CardsBrowser
        kanaRows={kanaRows}
        combinationItems={combinationItems}
        kanjiItems={[
          { id: "kanji-1", label: "NUMBERS" },
        ]}
      />
    </div>
  );
}
