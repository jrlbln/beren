"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CardFront } from "@/components/Card/CardFront";
import { SwipeCard } from "@/components/Card/SwipeCard";
import type { KanaCharacter, KanaRow } from "@/lib/kana";
import { playKanaAudio } from "@/lib/audio";

type LearnDeckProps = {
  rows: KanaRow[];
  showPronounceButton?: boolean;
};

type CardItem = {
  id: string;
  character: KanaCharacter;
};

function buildDeck(rows: KanaRow[]) {
  return rows.flatMap((row) =>
    row.characters.map((character) => ({
      id: `${row.id}-${character.romaji}`,
      character,
    })),
  );
}

export function LearnDeck({
  rows,
  showPronounceButton = true,
}: LearnDeckProps) {
  const [deck, setDeck] = useState<CardItem[]>(() => buildDeck(rows));

  const visibleItems = useMemo(() => deck.slice(0, 3), [deck]);

  const rotateDeck = () => {
    setDeck((current) => {
      if (current.length <= 1) return current;
      return [...current.slice(1), current[0]];
    });
  };

  const handleLeftScreen = () => {
    rotateDeck();
  };

  return (
    <div className="relative flex h-full min-h-0 w-full flex-1 items-center justify-center overflow-visible px-0">
      {visibleItems.length > 0 ? (
        <div className="relative h-full max-h-full w-full max-w-[22rem] self-center sm:max-w-[26rem] md:max-w-[28rem] lg:max-w-[30rem]">
          {visibleItems
            .slice()
            .reverse()
            .map((item, reverseIndex) => {
              const offset = visibleItems.length - 1 - reverseIndex;
              const isTop = offset === 0;

              return (
                <motion.div
                  key={item.id}
                  className="absolute inset-0"
                  initial={false}
                  animate={{ y: 0 }}
                  transition={{ type: "spring", stiffness: 520, damping: 42 }}
                >
                  {isTop ? (
                    <SwipeCard
                      className="h-full w-full"
                      onCardLeftScreen={handleLeftScreen}
                    >
                      <CardFront
                        character={item.character}
                        showPronounceButton={showPronounceButton}
                        onPronounce={() => playKanaAudio(item.character.romaji)}
                      />
                    </SwipeCard>
                  ) : (
                    <div className="pointer-events-none h-full w-full">
                      <CardFront
                        character={item.character}
                        showPronounceButton={showPronounceButton}
                        onPronounce={() => playKanaAudio(item.character.romaji)}
                      />
                    </div>
                  )}
                </motion.div>
              );
            })}
        </div>
      ) : null}
    </div>
  );
}
