import { TableBrowser } from "@/components/Sheet/TableBrowser";
import {
  getBaseRows,
  getDakutenRows,
  getHandakutenRows,
} from "@/lib/kana";
import { getTableCombinationGroups } from "@/lib/lessons";

export default async function SheetPage() {
  const baseRows = getBaseRows();
  const voicedRows = [...getDakutenRows(), ...getHandakutenRows()];
  const { hiraganaGroups, katakanaGroups } = getTableCombinationGroups();

  return (
    <TableBrowser
      baseRows={baseRows}
      voicedRows={voicedRows}
      hiraganaGroups={hiraganaGroups}
      katakanaGroups={katakanaGroups}
    />
  );
}
