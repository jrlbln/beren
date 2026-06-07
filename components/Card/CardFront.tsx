import type { KanaCharacter } from "@/lib/kana";
import { Volume2 } from "lucide-react";

type CardFrontProps = {
  character: KanaCharacter;
  onPronounce?: () => void;
  showPronounceButton?: boolean;
  mode?: "kana" | "kanji";
  topLabel?: string;
  bottomLabel?: string;
  centerText?: string;
  topText?: string;
  bottomText?: string;
};

export function CardFront({
  character,
  onPronounce,
  showPronounceButton = true,
  mode = "kana",
  topLabel,
  bottomLabel,
  centerText,
  topText,
  bottomText,
}: CardFrontProps) {
  const romajiLength = character.romaji.length;
  const romajiSize =
    romajiLength <= 1
      ? "text-[1.75rem]"
      : romajiLength === 2
        ? "text-[1.6rem]"
        : "text-[1.45rem]";

  return (
    <div className="relative flex h-full w-full flex-col rounded-4xl border border-slate-200 bg-white/95 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.55)] backdrop-blur">
      <div className="flex flex-1 flex-col items-center justify-between px-4 pt-2 pb-2 sm:px-6 sm:pt-4 sm:pb-5">
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-400 sm:text-[0.85rem] sm:tracking-[0.28em]">
          {topLabel ?? (mode === "kanji" ? "onyomi" : "hiragana")}
        </span>
        <div className="flex flex-1 items-center justify-center">
          <span className="text-[8.4rem] font-semibold leading-none text-slate-950 sm:text-[8.5rem] md:text-[11rem]">
            {topText ?? (mode === "kanji" ? character.hiragana : character.hiragana)}
          </span>
        </div>
      </div>

      <div className="relative flex items-center justify-center px-4 py-2 sm:px-6 sm:py-4">
        <div className="flex w-full items-center gap-3 sm:gap-4">
          <div className="h-[3px] flex-1 rounded-full bg-slate-900/90" />
          <div className="relative z-10 inline-flex w-fit items-center justify-center px-2 sm:px-3">
            <button
              type="button"
              disabled={!showPronounceButton}
              aria-label={`Play pronunciation for ${character.romaji}`}
              className={`relative inline-flex h-7 items-center justify-center px-0 sm:h-8 ${
                showPronounceButton ? "cursor-pointer" : "cursor-default"
              }`}
              onClick={(event) => {
                event.stopPropagation();
                onPronounce?.();
              }}
            >
              <span
                className={`block font-semibold lowercase tracking-[0.14em] text-slate-950 ${romajiSize}`}
              >
                {character.romaji}
              </span>
            </button>
            {showPronounceButton ? (
              <button
                type="button"
                aria-label={`Play pronunciation for ${character.romaji}`}
                className="absolute left-full top-[40%] -ml-2 -translate-y-3 p-0"
                onClick={(event) => {
                  event.stopPropagation();
                  onPronounce?.();
                }}
              >
                <Volume2 className="h-3.5 w-3.5 text-slate-700" />
              </button>
            ) : null}
          </div>
          <div className="h-[3px] flex-1 rounded-full bg-slate-900/90" />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 pt-2 sm:px-6 sm:pt-5">
        <span className="text-[8.4rem] font-semibold leading-none text-slate-950 sm:text-[8.25rem] md:text-[10.5rem]">
          {centerText ?? (mode === "kanji" ? character.hiragana : character.katakana)}
        </span>
      </div>

      <div className="flex items-center justify-center px-4 pb-2 sm:px-6 sm:pb-4">
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-400 sm:text-[0.85rem] sm:tracking-[0.28em]">
          {bottomLabel ?? (mode === "kanji" ? "kunyomi" : "katakana")}
        </span>
      </div>
    </div>
  );
}
