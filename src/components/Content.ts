import { WordStatus } from "./PromptWord.tsx";
import { KeyStatus } from "./PromptKey.tsx";

export type Metakey = {
  status: KeyStatus;
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
      status: KeyStatus.unset,
    },
  ],
});

export type Parser = (source: string) => Paragraphs;
export const parse: Parser = (source) => {
  const paragraphs = source.split("\n").map((line) =>
    line.split(/(\s+)/).map((word) => ({
      focus: false,
      status: WordStatus.unstart,
      keys: word.split("").map((key) => ({ key, status: KeyStatus.unset })),
    })),
  );
  if (paragraphs.length > 1) {
    for (let i = 1; i < paragraphs.length; i++) {
      paragraphs[i].unshift(Enter());
    }
  }
  return paragraphs;
};

export default {
  parse,
};
