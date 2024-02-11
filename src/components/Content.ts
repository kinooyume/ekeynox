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
export const parse: Parser = (source) =>
  source.split("\n").map((line, index) => {
    const words = line.split(/(\s+)/).map((word) => {
      return {
        focus: false,
        status: WordStatus.unstart,
        keys: word.split("").map((key) => {
          return {
            key,
            status: KeyStatus.unset,
          };
        }),
      };
    });
    // if (index !== 0) words.unshift(Enter());
    return words;
  });

export default {
  parse,
};
