import { WordStatus } from "../components/prompt/PromptWord.tsx";
import { KeyFocus, KeyStatus } from "../typingMetrics/KeyMetrics.ts";

type NonEmptyArray<T> = [T, ...T[]];

export type MetaKey = {
  // index: number;
  status: KeyStatus;
  focus: KeyFocus;
  ghostFocus: KeyFocus;
  // wasInvalid: boolean;
  key: string;
};

export type MetaWord = {
  /* Core */
  keys: NonEmptyArray<MetaKey>;
  isSeparator: boolean;
  /* --- */
  status: WordStatus;
  focus: boolean;
  wasCorrect: boolean;
  spentTime: number;
  wpm: number;
};

export type Paragraph = Array<MetaWord>;
export type Paragraphs = Array<Paragraph>;

const makeKey = (key: string): MetaKey => ({
  key,
  status: KeyStatus.unset,
  focus: KeyFocus.unset,
  ghostFocus: KeyFocus.unset,
});

const makeWordFromKeys = (
  keys: NonEmptyArray<MetaKey>,
  isSeparator = false,
): MetaWord => ({
  keys,
  isSeparator,
  status: WordStatus.unstart,
  focus: false,
  wasCorrect: false,
  spentTime: 0,
  wpm: 0,
});

const makeWordOneKey = (key: string, isSeparator = false): MetaWord =>
  makeWordFromKeys([makeKey(key)], isSeparator);

const makeWordFromString = (
  word: string,
  keyCallback?: (key: string) => void,
): MetaWord | null => {
  const keys = word.split("").map((key) => {
    keyCallback && keyCallback(key);
    return makeKey(key);
  });

  return keys.length > 0
    ? makeWordFromKeys(keys as NonEmptyArray<MetaKey>, word.trim() === "")
    : null;
};

const makeEnter = (): MetaWord => makeWordOneKey("Enter", true);
const makeSpace = (): MetaWord => makeWordOneKey(" ", true);

const parseWord = (keySet: Set<string>) => (word: string) =>
  makeWordFromString(word, (key) => keySet.add(key));

/* ContentData */

export type ContentData = {
  paragraphs: Paragraphs;
  keySet: Set<string>;
  wordsCount: number;
};

const emptyContentData: () => ContentData = () => ({
  paragraphs: [],
  keySet: new Set<string>(),
  wordsCount: 0,
});

export type Parser = (source: string) => ContentData;
export const parse: Parser = (source) => {
  const keySet = new Set<string>();
  const wordParser = parseWord(keySet);
  let wordsCount = 0;
  const paragraphs = source
    .split("\n")
    .map((line) => {
      return line
        .split(/(\s+)/)
        .map((word) => {
          if (word.trim() !== "") {
            wordsCount++;
          }
          return wordParser(word);
        })
        .filter((word) => word);
    })
    .filter((paragraph) => paragraph.length > 0) as Paragraphs;
  // TODO: use a flatMap
  if (paragraphs.length > 1) {
    for (let i = 0; i < paragraphs.length - 1; i++) {
      paragraphs[i].push(makeEnter());
    }
  }
  return { paragraphs, keySet, wordsCount };
};


// One paragraph from words
const parseWords = (source: Array<string>): ContentData => {
  const keySet = new Set<string>();
  const wordParser = parseWord(keySet);
  let wordsCount = 0;
  const words = source
    .flatMap((word, index) => {
      wordsCount++;
      if (index < source.length - 1) {
        return [wordParser(word), makeSpace()];
      } else {
        return wordParser(word);
      }
    })
    .filter((word) => word) as Paragraph;
  return { paragraphs: [words], keySet, wordsCount };
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

const contentDataFromParagraphs = (
  paragraphs: Paragraphs,
  wordsCount: number,
): ContentData => ({
  paragraphs,
  keySet: makeKeySet(paragraphs),
  wordsCount,
});

const deepClone = (paragraphs: Paragraphs) =>
  paragraphs.map((paragraph) =>
    paragraph.map((word) => ({
      ...word,
      keys: word.keys.map((key) => ({ ...key })),
    })),
  );

const deepCloneReset = (paragraphs: Paragraphs): Paragraphs => {
  return paragraphs.map(
    (paragraph) =>
      paragraph
        .map((word) => {
          const keys = word.keys.map((key) => makeKey(`${key.key}`));
          if (keys.length === 0) return;
          return makeWordFromKeys(
            keys as NonEmptyArray<MetaKey>,
            word.isSeparator,
          );
        })
        .filter((word) => word) as Paragraph,
  );
};

export default {
  parse,
  parseWords,
  deepClone,
  deepCloneReset,
  makeWordOneKey,
  makeEnter,
  makeSpace,
  contentDataFromParagraphs,
  emptyContentData,
};
