import { WordStatus } from "../prompt/PromptWord.tsx";
import { KeyFocus, KeyStatus } from "../metrics/KeyMetrics.ts";

export type Metakey = {
  status: KeyStatus;
  focus: KeyFocus;
  // wasInvalid: boolean;
  key: string;
};

export type MetaWord = {
  isSeparator: boolean;
  status: WordStatus;
  focus: boolean;
  wasCorrect: boolean;
  wpm: number;
  keys: Array<Metakey>;
};

export type Paragraph = Array<MetaWord>;
export type Paragraphs = Array<Paragraph>;

const makeEnter = () => ({
  focus: false,
  status: WordStatus.unstart,
  isSeparator: true,
  wasCorrect: false,
  wpm: 0,
  keys: [
    {
      key: "Enter",
      status: KeyStatus.unset,
      focus: KeyFocus.unset,
    },
  ],
});

const makeSpace = () => ({
  focus: false,
  status: WordStatus.unstart,
  isSeparator: true,
  wasCorrect: false,
  wpm: 0,
  keys: [
    {
      key: " ",
      status: KeyStatus.unset,
      focus: KeyFocus.unset,
    },
  ],
});

export type ContentData = { paragraphs: Paragraphs; keySet: Set<string> };

const parseWord =
  (keySet: Set<string>) =>
  ({ word }: { word: string }) => ({
    focus: false,
    status: WordStatus.unstart,
    wasCorrect: false,
    wpm: 0,
    isSeparator: word.trim() === "",
    keys: word.split("").map((key) => {
      keySet.add(key);
      return {
        key,
        status: KeyStatus.unset,
        focus: KeyFocus.unset,
      };
    }),
  });

export type Parser = (source: string) => ContentData;
export const parse: Parser = (source) => {
  const keySet = new Set<string>();
  const wordParser = parseWord(keySet);
  const paragraphs = source
    .split("\n")
    .map((line) => {
      return line
        .split(/(\s+)/)
        .map((word) => wordParser({ word }))
        .filter((word) => word.keys.length > 0);
    })
    .filter((paragraph) => paragraph.length > 0);
  // TODO: use a flatMap
  if (paragraphs.length > 1) {
    for (let i = 0; i < paragraphs.length - 1; i++) {
      paragraphs[i].push(makeEnter());
    }
  }
  return { paragraphs, keySet };
};

const parseWords = (source: Array<string>): ContentData => {
  const keySet = new Set<string>();
  const wordParser = parseWord(keySet);
  const words = source.flatMap((word, index) =>
    index < source.length - 1
      ? [wordParser({ word }), makeSpace()]
      : wordParser({ word }),
  );
  return { paragraphs: [words], keySet };
};

const deepClone = (paragraphs: Paragraphs) =>
  paragraphs.map((paragraph) =>
    paragraph.map((word) => ({
      ...word,
      keys: word.keys.map((key) => ({ ...key })),
    })),
  );

const deepCloneReset = (paragraphs: Paragraphs) => {
  return paragraphs.map((paragraph) =>
    paragraph.map((word) => {
      const newWord = { ...word, wpm: 0, wasCorrect: false };
      newWord.keys = word.keys.map((key) => ({
        ...key,
        status: KeyStatus.unset,
        focus: KeyFocus.unset,
      }));
      return newWord;
    }),
  );
};

const makeKeySet = (paragraphs: Paragraphs) => {
  const keySet = new Set<string>();
  paragraphs.forEach((paragraph) =>
    paragraph.forEach((word) =>
      word.keys.forEach((key) => keySet.add(key.key)),
    ),
  );
  return keySet;
};

const contentDataFromParagraphs = (paragraphs: Paragraphs): ContentData => ({
  paragraphs,
  keySet: makeKeySet(paragraphs),
});

export default {
  parse,
  parseWords,
  deepClone,
  deepCloneReset,
  makeEnter,
  makeSpace,
  contentDataFromParagraphs,
};
