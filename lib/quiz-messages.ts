type QuizResultCopy = {
  headline: string;
  subtext: string;
};

type QuizMessageBand = {
  minScore: number;
  maxScore: number;
  maxTime: number;
  options: QuizResultCopy[];
};

const resultMessageBands: QuizMessageBand[] = [
  {
    minScore: 10,
    maxScore: 10,
    maxTime: 35,
    options: [
      {
        headline: "Flawless and fast",
        subtext: "You kept the full set under control from start to finish.",
      },
      {
        headline: "Perfect pace",
        subtext: "Ten for ten, and you moved with confidence.",
      },
    ],
  },
  {
    minScore: 10,
    maxScore: 10,
    maxTime: 999,
    options: [
      {
        headline: "Perfect score",
        subtext: "Accurate work. The next step is to trim the time.",
      },
      {
        headline: "Clean round",
        subtext: "You answered everything correctly. Push the speed next run.",
      },
    ],
  },
  {
    minScore: 8,
    maxScore: 9,
    maxTime: 40,
    options: [
      {
        headline: "Strong round",
        subtext: "Good accuracy and a solid pace. You are close to the top tier.",
      },
      {
        headline: "Sharp work",
        subtext: "Most of the set was locked in. Keep tightening the misses.",
      },
    ],
  },
  {
    minScore: 8,
    maxScore: 9,
    maxTime: 999,
    options: [
      {
        headline: "Solid accuracy",
        subtext: "The recall is there. Speed is the next lever.",
      },
      {
        headline: "Good control",
        subtext: "You know the set. Now make the decisions faster.",
      },
    ],
  },
  {
    minScore: 5,
    maxScore: 7,
    maxTime: 45,
    options: [
      {
        headline: "Steady progress",
        subtext: "You have the base. A cleaner repeat will lift the score fast.",
      },
      {
        headline: "Building momentum",
        subtext: "The set is starting to stick. Keep the pace and the focus.",
      },
    ],
  },
  {
    minScore: 5,
    maxScore: 7,
    maxTime: 999,
    options: [
      {
        headline: "Useful round",
        subtext: "You found the gaps. That makes the next run more efficient.",
      },
      {
        headline: "Good start",
        subtext: "The pattern is visible now. Repeat it and the score will climb.",
      },
    ],
  },
  {
    minScore: 0,
    maxScore: 4,
    maxTime: 999,
    options: [
      {
        headline: "Start point logged",
        subtext: "The misses show you what to train next.",
      },
      {
        headline: "First pass complete",
        subtext: "Use this round to target the weak rows on the next run.",
      },
    ],
  },
];

function hashText(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function getQuizResultCopy(score: number, timeSeconds: number): QuizResultCopy {
  const band =
    resultMessageBands.find(
      (entry) => score >= entry.minScore && score <= entry.maxScore && timeSeconds <= entry.maxTime,
    ) ?? resultMessageBands[resultMessageBands.length - 1];

  const index = hashText(`${score}:${timeSeconds}`) % band.options.length;
  return band.options[index];
}
