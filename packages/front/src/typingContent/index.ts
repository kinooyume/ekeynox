import { Paragraph, Paragraphs } from "./paragraphs/types";
import { createEnter, createSpace, parseWord } from "./word";

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
      paragraphs[i].push(createEnter());
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
        return [wordParser(word), createSpace()];
      } else {
        return wordParser(word);
      }
    })
    .filter((word) => word) as Paragraph;
  return { paragraphs: [words], keySet, wordsCount };
};

const makeKeySet = (paragraphs: Paragraphs) : Set<string> => {
  const keySet = new Set<string>();
  paragraphs.forEach((paragraph) =>
    paragraph.forEach((word) =>
      word.characters.forEach((key) => keySet.add(key.char)),
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

/* Paragraphs */

export default {
  parse,
  parseWords,
  contentDataFromParagraphs,
  emptyContentData,
};

