"use client";

import { useState } from "react";
import { Brush } from "lucide-react";
import { MnemonicPanel } from "@/components/Card/MnemonicPanel";
import { StrokeCanvas } from "@/components/Card/StrokeCanvas";
import type { KanaCharacter } from "@/lib/kana";

type CardBackProps = {
  character: KanaCharacter;
};

export function CardBack({ character }: CardBackProps) {
  const [showStrokes, setShowStrokes] = useState(false);

  const topCharacter = character.hiragana;
  const bottomCharacter = character.katakana;

  return (
    <div className="relative flex h-full w-full flex-col rounded-[2rem] border border-slate-200 bg-white/95 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.55)] backdrop-blur">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-4">
        {showStrokes ? (
          <StrokeCanvas character={topCharacter} buttonPosition="top" />
        ) : (
          <MnemonicPanel character={topCharacter} script="hiragana" />
        )}
      </div>

      <div className="relative z-20 flex items-center justify-center px-4 py-2">
        <div className="absolute left-6 right-6 h-[3px] rounded-full bg-slate-900/90" />
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setShowStrokes((value) => !value);
          }}
          className="relative z-30 flex items-center justify-center rounded-full bg-white p-3 shadow-md hover:bg-slate-50 active:shadow-sm"
          aria-label={showStrokes ? "Show mnemonic" : "Show strokes"}
        >
          <Brush className="h-6 w-6 text-slate-900" />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-4">
        {showStrokes ? (
          <StrokeCanvas character={bottomCharacter} buttonPosition="bottom" />
        ) : (
          <MnemonicPanel character={bottomCharacter} script="katakana" />
        )}
      </div>
    </div>
  );
}
