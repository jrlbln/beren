import type { KanaCharacter } from "@/lib/kana";
import { Volume2 } from "lucide-react";

type CardFrontProps = {
  character: KanaCharacter;
  onPronounce?: () => void;
  showPronounceButton?: boolean;
};

export function CardFront({
  character,
  onPronounce,
  showPronounceButton = true,
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
      <div className="flex flex-1 flex-col items-center justify-between px-6 pt-4 pb-5">
        <span className="text-[0.85rem] font-semibold uppercase tracking-[0.28em] text-slate-400">
          hiragana
        </span>
        <div className="flex flex-1 items-center justify-center">
          <span className="text-[8.5rem] font-semibold leading-none text-slate-950 sm:text-[11rem]">
            {character.hiragana}
          </span>
        </div>
      </div>

      <div className="relative flex items-center justify-center px-6 py-4">
        <div className="flex w-full items-center gap-4">
          <div className="h-[3px] flex-1 rounded-full bg-slate-900/90" />
          <div className="relative z-10 inline-flex w-fit items-center justify-center px-3">
            <button
              type="button"
              disabled={!showPronounceButton}
              aria-label={`Play pronunciation for ${character.romaji}`}
              className={`relative inline-flex h-8 items-center justify-center px-0 ${
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
                className="absolute left-full top-[40%] -ml-2.5 -translate-y-3 p-0"
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

      <div className="flex flex-1 flex-col items-center justify-between px-6 pt-5 pb-4">
        <span className="text-[8.25rem] font-semibold leading-none text-slate-950 sm:text-[10.5rem]">
          {character.katakana}
        </span>
        <span className="text-[0.85rem] font-semibold uppercase tracking-[0.28em] text-slate-400">
          katakana
        </span>
      </div>
    </div>
  );
}
