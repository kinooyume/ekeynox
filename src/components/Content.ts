import { WordStatus } from "./PromptWord.tsx";
import { PromptKeyFocus, PromptKeyStatus } from "./KeyMetrics.ts";

export type Metakey = {
  status: PromptKeyStatus;
  focus: PromptKeyFocus;
  key: string;
};

export type MetaWord = {
  status: WordStatus;
  focus: boolean;
  keys: Array<Metakey>;
};

export type Paragraph = Array<MetaWord>;
export type Paragraphs = Array<Paragraph>;

const Enter = () => ({
  focus: false,
  status: WordStatus.unstart,
  keys: [
    {
      key: "Enter",
      status: PromptKeyStatus.unstart,
      focus: PromptKeyFocus.unset,
    },
  ],
});

const wordSplit = (word: string) =>
  word.split("").map((key) => ({
    key,
    status: PromptKeyStatus.unstart,
    focus: PromptKeyFocus.unset,
  }));

export type Parser = (source: string) => Paragraphs;
export const parse: Parser = (source) => {
  const paragraphs = source.split("\n").map(
    (line) =>
      line
        .split(/(\s+)/)
        .map((word) => ({
          focus: false,
          status: WordStatus.unstart,
          keys: wordSplit(word),
        }))
        .filter((word) => word.keys.length > 0),
    // NOTE: it create empty artefact when a string start or end with a space
  );
  if (paragraphs.length > 1) {
    for (let i = 0; i < paragraphs.length - 1; i++) {
      paragraphs[i].push(Enter());
    }
  }
  return paragraphs;
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
