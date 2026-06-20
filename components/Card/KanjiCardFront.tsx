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
    <div className="relative flex h-full w-full min-w-0 flex-col overflow-hidden rounded-4xl border border-slate-200 bg-white/95 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.55)] backdrop-blur">
      <div className="flex min-h-0 flex-[1_1_0] flex-col items-center justify-between px-4 pt-4 pb-2 sm:px-6 sm:pt-6 sm:pb-4">
        <span className="shrink-0 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-400 sm:text-[0.82rem] sm:tracking-[0.28em]">
          onyomi
        </span>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <span className="text-[clamp(1rem,4vw,1.4rem)] font-semibold tracking-[0.18em] text-slate-950">
            {onyomi}
          </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-[1.35_1_0] items-center justify-center px-4 py-1 sm:px-6 sm:py-3">
        <span className="block text-[clamp(6rem,34vw,11.5rem)] font-semibold leading-none text-slate-950 sm:text-[clamp(7rem,22vw,12rem)]">
          {kanji}
        </span>
      </div>

      <div className="relative flex min-h-0 flex-[1_1_0] flex-col items-center justify-between px-4 pt-2 pb-4 sm:px-6 sm:pt-4 sm:pb-6">
        <span className="text-[clamp(1rem,4vw,1.4rem)] font-semibold tracking-[0.18em] text-slate-950">
          {kunyomi}
        </span>
        <div className="flex shrink-0 items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-400 sm:text-[0.82rem] sm:tracking-[0.28em]">
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
