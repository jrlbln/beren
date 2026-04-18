"use client";

import { useState } from "react";
import { CardBack } from "@/components/Card/CardBack";
import { CardFront } from "@/components/Card/CardFront";
import type { KanaCharacter } from "@/lib/kana";
import { playKanaAudio } from "@/lib/audio";

type CardSceneProps = {
  character: KanaCharacter;
};

export function CardScene({ character }: CardSceneProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-10rem)] w-full items-stretch justify-center">
      <div
        className="relative flex min-h-[36rem] w-full cursor-pointer"
        onClick={() => setFlipped((value) => !value)}
      >
        {!flipped ? (
          <CardFront character={character} onPronounce={() => playKanaAudio(character.romaji)} />
        ) : (
          <CardBack character={character} />
        )}
      </div>
    </div>
  );
}
