import {
  For,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  type Setter,
  type Accessor,
} from "solid-js";
import { WordStatus } from "./PromptWord.tsx";
import { KeyStatus } from "./PromptKey.tsx";

export type Metakey = {
  set: Setter<KeyStatus>;
  wasInvalid: boolean;
  props: { key: string; status: Accessor<KeyStatus> };
};

export type MetaWord = {
  focus: Accessor<boolean>;
  setFocus: Setter<boolean>;
  status: Accessor<WordStatus>;
  setStatus: Setter<WordStatus>;
  keypressed: number;
  keys: Array<Metakey>;
};

export type Paragraphs = Array<Array<MetaWord>>;

const Enter = () => {
  const [status, setStatus] = createSignal(WordStatus.unset);
  const [focus, setFocus] = createSignal(false);
  const [keyStatus, setKeyStatus] = createSignal(KeyStatus.unset);

  return {
    focus,
    setFocus,
    status,
    setStatus,
    keypressed: 0,
    keys: [
      {
        set: setKeyStatus,
        wasInvalid: false,
        props: {
          key: "Enter",
          status: keyStatus,
        },
      },
    ],
  };
};

export type Parser = (source: string) => Array<MetaWord>;
export const parse: Parser = (source) =>
  source.split("\n").flatMap((line, index) => {
    const words = line.split(/(\s+)/).map((word) => {
      const [status, setStatus] = createSignal(WordStatus.unset);
      const [focus, setFocus] = createSignal(false);
      return {
        focus,
        setFocus,
        status,
        setStatus,
        keypressed: 0,
        keys: word.split("").map((key) => {
          const [status, setStatus] = createSignal(KeyStatus.unset);
          return {
            set: setStatus,
            wasInvalid: false,
            props: {
              key,
              status,
            },
          };
        }),
      };
    });
    if (index !== 0) words.unshift(Enter());
    return words;
  });

export default {
  parse
}
