import { WordStatus } from "../prompt/PromptWord.tsx";
import { PromptKeyFocus, PromptKeyStatus } from "../metrics/KeyMetrics.ts";
import List, { type DLinkedList } from "../List.ts";
import {
  type ContentIterator,
  type NavMeta,
  hookWrapper,
  type MakeNavHooks,
  curryAndApplyIterator,
  makeIteratorFromMetaNav,
  rootIterator,
  appendParentHooks,
  metaIterator,
} from "./ContentNav.ts";
import { wrapParentHooks } from "./ContentIterator.ts";

export type MetaKey = {
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
  // keys: DLinkedList<NavMeta<MetaKey>>;
};

const keyHooks: MakeNavHooks<MetaKey> = (key) => ({
  enter: () => {
    key.focus = PromptKeyFocus.focus;
  },
  exit: ({ back }) => {
    key.focus = back ? PromptKeyFocus.back : PromptKeyFocus.unfocus;
  },
});

const wordHooks: MakeNavHooks<MetaWord> = (word) => ({
  enter: () => {
    word.focus = true;
    word.status = WordStatus.pending;
  },
  exit: () => {
    word.focus = false;
    word.status = WordStatus.over;
  },
});
export type Paragraph = DLinkedList<NavMeta<MetaWord>>;
export type Paragraphs = DLinkedList<Paragraph>;

export type ContentData = {
  paragraphs: Paragraphs;
  iterator: ContentIterator<DLinkedList<NavMeta<MetaKey>>>;
  keySet: Set<string>;
};

// TODO: on doit linker la key au word
const makeSeparator = (key: string): NavMeta<MetaWord> => {
  const metaWord = hookWrapper(
    {
      focus: false,
      status: WordStatus.unstart,
      isSeparator: true,
      wasCorrect: false,
      wpm: 0,
      keys: List.makeDLinkedList(
        hookWrapper(
          {
            key: key,
            status: PromptKeyStatus.unstart,
            focus: PromptKeyFocus.unset,
          },
          keyHooks,
        ),
        null,
        null,
      ),
    },
    wordHooks,
  );

  /* side effect */
  // appendParentHooks(metaWord, metaWord.value.keys);
  /* *** */
  return metaWord;
};

const parseWord =
  (keySet: Set<string>) =>
  (word: string): NavMeta<MetaWord> => {
    if (word.length === 0) throw new Error("Unexpected empty keys");
    const keys = word.split("");
    const [headKeys, _] = List.makeDLinkedListFromArray(
      [keys.shift() as string, keys],
      (key) => {
        /* Side effect */
        keySet.add(key);
        const metaKey = {
          key,
          status: PromptKeyStatus.unstart,
          focus: PromptKeyFocus.unset,
        };
        return hookWrapper(metaKey, keyHooks);
      },
    );

    // don't forget headKeys
    const keyIterator = metaIterator(headKeys);

    const metaWord = hookWrapper(
      {
        focus: false,
        status: WordStatus.unstart,
        wasCorrect: false,
        wpm: 0,
        isSeparator: word.trim() === "",
      },
      wordHooks,
    );

    const stuff = wrapParentHooks(metaWord, [headKeys, tailKeys]);

    /* side effect */
    // appendParentHooks(metaWord, keys);
    /* *** */
    return metaWord;
  };

const parseWords = (source: Array<string>): ContentData => {
  const keySet = new Set<string>();
  const wordParser = parseWord(keySet);
  const words = List.makeDLinkedListFromArrayWithExtra(source, wordParser, {
    condition: (array, index) => index < array.length - 1,
    value: () => makeSeparator(" "),
  });
  if (!words) throw new Error("Unexpected empty words");
  const paragraphs = List.makeDLinkedList(words, null, null);
  // nested iterator, from root, to paragraphs, to words, to keys

  return { paragraphs, iterator, keySet };
};

const parseParagraph =
  (keySet: Set<string>) =>
  (source: string): Paragraph => {
    const wordParser = parseWord(keySet);
    const words = source.split(/\s+/).filter((word) => word.length > 0);
    if (words.length === 0) throw new Error("Unexpected empty paragraph");
    const paragraph = List.makeDLinkedListFromArray(
      [words.shift() as string, words],
      wordParser,
    );
    return paragraph;
  };

const parse = (source: string): ContentData => {
  const keySet = new Set<string>();
  const paragraphParser = parseParagraph(keySet);
  const paragraphs = List.makeDLinkedListFromArrayWithExtra(
    source.split("\n"),
    paragraphParser,
    {
      condition: (array, index) => index < array.length - 1,
      value: () => List.makeDLinkedList(makeSeparator("Enter"), null, null),
    },
  );
  if (!paragraphs) throw new Error("Unexpected empty paragraphs");
  return { paragraphs, iterator, keySet };
};

const deepCopy = (source: ContentData): ContentData => {
  return {
    ...source,
    paragraphs: List.copyDLinkedList(
      (words) =>
        List.copyDLinkedList((word) => {
          return Object.assign({}, word, {
            keys: List.copyDLinkedList(
              (key) => Object.assign({}, key),
              word.keys,
            ),
          });
        }, words),
      source.paragraphs,
    ),
  };
};

export default { parse, parseWords, deepCopy };
