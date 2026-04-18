"use client";

import { useEffect } from "react";
import { ensureAnonymousSession, hasFirebaseConfig, seedMnemonicDoc } from "@/lib/firebase";
import type { KanaCharacter } from "@/lib/kana";

type LearnBootstrapProps = {
  seedCharacters: KanaCharacter[];
};

export function LearnBootstrap({ seedCharacters }: LearnBootstrapProps) {
  useEffect(() => {
    void ensureAnonymousSession();
  }, []);

  useEffect(() => {
    if (!hasFirebaseConfig()) return;

    seedCharacters.forEach((character) => {
      void seedMnemonicDoc(character.hiragana, {
        hira_text: `Placeholder mnemonic for ${character.hiragana}`,
        hira_sub: "Replace with your own hiragana mnemonic.",
        hira_image_url: "",
        kata_text: `Placeholder mnemonic for ${character.katakana}`,
        kata_sub: "Replace with your own katakana mnemonic.",
        kata_image_url: "",
      });
    });
  }, [seedCharacters]);

  return null;
}
