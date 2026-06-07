import { Volume2 } from "lucide-react";

type KanjiCardFrontProps = {
  kanji: string;
  onyomi: string;
  kunyomi: string;
  onPronounce?: () => void;
  showPronounceButton?: boolean;
};

export function KanjiCardFront({
  kanji,
  onyomi,
  kunyomi,
  onPronounce,
  showPronounceButton = false,
}: KanjiCardFrontProps) {
  return (
    <div className="relative flex h-full w-full flex-col rounded-4xl border border-slate-200 bg-white/95 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.55)] backdrop-blur">
      <div className="flex flex-1 flex-col items-center justify-between px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-5">
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-400 sm:text-[0.85rem] sm:tracking-[0.28em]">
          onyomi
        </span>
        <div className="flex flex-1 items-center justify-center">
          <span className="text-[1.2rem] font-semibold tracking-[0.18em] text-slate-950 sm:text-[1.4rem]">
            {onyomi}
          </span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-2 sm:px-6 sm:py-4">
        <span className="text-[9rem] font-semibold leading-none text-slate-950 sm:text-[10rem] md:text-[12rem]">
          {kanji}
        </span>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-between px-4 pt-3 pb-4 sm:px-6 sm:pt-5 sm:pb-6">
        <span className="text-[1.2rem] font-semibold tracking-[0.18em] text-slate-950 sm:text-[1.4rem]">
          {kunyomi}
        </span>
        <div className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-400 sm:text-[0.85rem] sm:tracking-[0.28em]">
          <span>kunyomi</span>
          {showPronounceButton ? (
            <button
              type="button"
              aria-label={`Play pronunciation for ${kanji}`}
              className="inline-flex items-center justify-center p-0"
              onClick={(event) => {
                event.stopPropagation();
                onPronounce?.();
              }}
            >
              <Volume2 className="h-3.5 w-3.5 text-slate-700" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
