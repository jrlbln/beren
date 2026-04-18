"use client";

import { useEffect, useState } from "react";
import {
  getMnemonicDoc,
  hasFirebaseConfig,
  seedMnemonicDoc,
} from "@/lib/firebase";

type MnemonicPanelProps = {
  character: string;
  script: "hiragana" | "katakana";
};

type MnemonicData = {
  text?: string;
  sub?: string;
  image_url?: string;
};

const fallbackMnemonic: Record<string, MnemonicData> = {
  あ: {
    text: "A simple mnemonic placeholder for あ",
    sub: "Replace with your own note.",
  },
  ア: {
    text: "A simple mnemonic placeholder for ア",
    sub: "Replace with your own note.",
  },
};

export function MnemonicPanel({ character, script }: MnemonicPanelProps) {
  const [data, setData] = useState<MnemonicData | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      if (hasFirebaseConfig()) {
        const remote = await getMnemonicDoc(character);
        if (active && remote) {
          setData({
            text: remote[`${script.slice(0, 4)}_text`] as string | undefined,
            sub: remote[`${script.slice(0, 4)}_sub`] as string | undefined,
            image_url: remote[`${script.slice(0, 4)}_image_url`] as
              | string
              | undefined,
          });
          return;
        }
      }

      setData(
        fallbackMnemonic[character] ?? {
          text: "Mnemonic placeholder",
          sub: "Add your own mnemonic for this character.",
        },
      );
    }

    load();

    return () => {
      active = false;
    };
  }, [character, script]);

  useEffect(() => {
    if (hasFirebaseConfig()) {
      const seed = {
        hira_text: "Placeholder mnemonic for hiragana",
        hira_sub: "Add your own study note.",
        kata_text: "Placeholder mnemonic for katakana",
        kata_sub: "Add your own study note.",
      };
      void seedMnemonicDoc(character, seed);
    }
  }, [character]);

  return (
    <div className="flex h-full items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
      {data?.text ?? "mnemonic image placeholder"}
    </div>
  );
}
