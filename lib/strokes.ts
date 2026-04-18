import kanjivg from "@/data/kanjivg.json";

type StrokeEntry = {
  strokes: string[];
};

const typedKanjivg = kanjivg as Record<string, StrokeEntry>;

export function getStrokePaths(character: string) {
  return typedKanjivg[character]?.strokes ?? [];
}
