import { WordStatus } from "./PromptWord.tsx";
import { PromptKeyFocus, PromptKeyStatus } from "./KeyMetrics.ts";

export type Metakey = {
  status: PromptKeyStatus;
  focus: PromptKeyFocus;
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

const Enter = () => ({
  focus: false,
  status: WordStatus.unstart,
  isSeparator: true,
  wasCorrect: false,
  wpm: 0,
  keys: [
    {
      key: "Enter",
      status: PromptKeyStatus.unstart,
      focus: PromptKeyFocus.unset,
    },
  ],
});

export type Parser = (source: string) => [Paragraphs, Set<string>];
export const parse: Parser = (source) => {
  const keySet = new Set<string>();
  const paragraphs = source
    .split("\n")
    .map((line) => {
      return line
        .split(/(\s+)/)
        .map((word) => ({
          focus: false,
          status: WordStatus.unstart,
          wasCorrect: false,
          wpm: 0,
          isSeparator: word.trim() === "",
          keys: word.split("").map((key) => {
            keySet.add(key);
            return {
              key,
              status: PromptKeyStatus.unstart,
              focus: PromptKeyFocus.unset,
            };
          }),
        }))
        .filter((word) => word.keys.length > 0);
    })
    .filter((paragraph) => paragraph.length > 0);
  if (paragraphs.length > 1) {
    for (let i = 0; i < paragraphs.length - 1; i++) {
      paragraphs[i].push(Enter());
    }
  }
  return [paragraphs, keySet];
};

const deepClone = (paragraphs: Paragraphs) =>
  paragraphs.map((paragraph) =>
    paragraph.map((word) => ({
      ...word,
      keys: word.keys.map((key) => ({ ...key })),
    })),
  );

export default {
  parse,
  deepClone,
};
