import kanaData from "@/data/kana.json";

export type KanaCharacter = {
  romaji: string;
  hiragana: string;
  katakana: string;
};

export type KanaRow = {
  id: string;
  label: string;
  characters: KanaCharacter[];
};

export type KanaDataset = {
  baseRows: KanaRow[];
  dakutenRows: KanaRow[];
  handakutenRows: KanaRow[];
};

export type KanaChartCell = KanaCharacter | null;

export type KanaChartRow = {
  id: string;
  label: string;
  cells: [KanaChartCell, KanaChartCell, KanaChartCell, KanaChartCell, KanaChartCell];
};

const GOJUON_COLUMNS = ["a", "i", "u", "e", "o"] as const;
const GOJUON_GROUPS = ["a", "ka", "sa", "ta", "na", "ha", "ma", "ya", "ra"] as const;
const VOICED_GROUPS = ["ga", "za", "da", "ba", "pa"] as const;

const typedKanaData = kanaData as KanaDataset;

export function getKanaSections() {
  return typedKanaData;
}

export function getBaseRows() {
  return typedKanaData.baseRows;
}

export function getDakutenRows() {
  return typedKanaData.dakutenRows;
}

export function getHandakutenRows() {
  return typedKanaData.handakutenRows;
}

export function getAllRows() {
  return [
    ...typedKanaData.baseRows,
    ...typedKanaData.dakutenRows,
    ...typedKanaData.handakutenRows,
  ];
}

export function getGojuonColumns() {
  return GOJUON_COLUMNS;
}

export function getGojuonGroups() {
  return GOJUON_GROUPS;
}

export function getVoicedGroups() {
  return VOICED_GROUPS;
}

export function buildKanaChartRows(rows: KanaRow[]) {
  return rows.map((row) => {
    const cells = GOJUON_COLUMNS.map((columnRomaji) => {
      return (
        row.characters.find((character) => character.romaji.endsWith(columnRomaji)) ??
        row.characters.find((character) => character.romaji === columnRomaji) ??
        null
      );
    }) as KanaChartRow["cells"];

    return {
      id: row.id,
      label: row.id,
      cells,
    };
  });
}

export function getStandaloneN(rows: KanaRow[]) {
  return rows
    .flatMap((row) => row.characters)
    .find((character) => character.romaji === "n");
}

export function getCharacterByGroupAndVowel(rows: KanaRow[], groupId: string, vowel: string) {
  const row = rows.find((entry) => entry.id === groupId);

  if (!row) {
    return null;
  }

  return (
    row.characters.find((character) => character.romaji === groupId && vowel === "a") ??
    row.characters.find((character) => character.romaji.endsWith(vowel)) ??
    null
  );
}
