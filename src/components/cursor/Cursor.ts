import { createSignal } from "solid-js";
import type { MetaWord, Paragraph, Paragraphs } from "../content/Content";
import { KeyFocus, KeyStatus } from "../metrics/KeyMetrics";
import type { SetStoreFunction } from "solid-js/store";
import type { WordStatus } from "../prompt/PromptWord";

type CursorProps = {
  setParagraphs: SetStoreFunction<Paragraphs>;
  paragraphs: Paragraphs;
};

// Pourquoi c'est pas des variables direct ? est-ce souhaitable ?

// NOTE: State

export type Position = {
  paragraph: number;
  word: number;
  key: number;
};

// NOTE: 
export type Cursor = {
  focus: () => void;
  // NOTE: Signal or store
  get: {
    paragraph: () => Paragraph; // MetaWord[], [Ref]
    nbrParagraphs: () => number; // paragraphs.length
    
    word: () => MetaWord; // current word  [Ref]
    nbrWords: () => number; // words.length
    wordValid: () => boolean; // MetaWord - wasCorrect  *
    isSeparator: () => boolean; // MetaWord *
    wordIsValid: () => boolean; // valid keys === word valid #fn#

    key: () => { // Current meta key [Ref]
      key: string;
      status: KeyStatus;
      focus: KeyFocus;
    };
    nbrKeys: () => number; // keys length
  };
  set: {
    /* Word */
    wordStatus: (status: WordStatus, focus: boolean) => void;
    wordValid: (valid: boolean) => void;

    /* Key */
    keyStatus: (status: KeyStatus) => void;
    keyFocus: (focus: KeyFocus) => void;
  };
  // NOTE: can be a store
  positions: { // Index  []
    paragraph: () => number;
    word: () => number;
    key: () => number;
    get: () => Position;
    set: {
      paragraph: (n: number) => void;
      word: (n: number) => void;
      key: (n: number) => void;
    };
  };
};

const makeCursor = (props: CursorProps) => {
  /* NOTE: could be replace by nested linked list */
  /* Keep paragraph/word/key index */
  const [paragraph, setCurrentParagraph] = createSignal(0);
  const [word, setCurrentWord] = createSignal(0);
  const [key, setCurrentKey] = createSignal(0);

  const positions = {
    paragraph,
    word,
    key,
    get: () => ({ paragraph: paragraph(), word: word(), key: key() }),
    set: {
      paragraph: setCurrentParagraph,
      word: setCurrentWord,
      key: setCurrentKey,
    },
  };

  /* *** */
  const cursor: Cursor = {
    positions,
    focus: () => {
      props.setParagraphs(
        positions.paragraph(),
        positions.word(),
        "focus",
        true,
      );
      cursor.set.keyFocus(KeyFocus.focus);
    },

    /* NOTE: Paragraphs Data Getter */

    get: {
      paragraph: () => props.paragraphs[positions.paragraph()],
      nbrParagraphs: () => props.paragraphs.length - 1,
      nbrWords: () => props.paragraphs[positions.paragraph()].length - 1,
      word: () => props.paragraphs[positions.paragraph()][positions.word()],
      wordIsValid: () => {
        const word = props.paragraphs[positions.paragraph()][positions.word()];
        return word.keys.every((key) => key.status === KeyStatus.match);
      },
      wordValid: () =>
        props.paragraphs[positions.paragraph()][positions.word()].wasCorrect,
      nbrKeys: () =>
        props.paragraphs[positions.paragraph()][positions.word()].keys.length -
        1,
      key: () =>
        props.paragraphs[positions.paragraph()][positions.word()].keys[
          positions.key()
        ],
      isSeparator: () =>
        props.paragraphs[positions.paragraph()][positions.word()].isSeparator,
    },

    /* NOTE: Paragraphs Data Setter */

    set: {
      keyStatus: (status: KeyStatus) => {
        props.setParagraphs(
          positions.paragraph(),
          positions.word(),
          "keys",
          positions.key(),
          "status",
          status,
        );
      },
      keyFocus: (focus: KeyFocus) => {
        props.setParagraphs(
          positions.paragraph(),
          positions.word(),
          "keys",
          positions.key(),
          "focus",
          focus,
        );
      },
      wordStatus: (status: WordStatus, focus: boolean) => {
        props.setParagraphs(
          positions.paragraph(),
          positions.word(),
          "status",
          status,
        );
        props.setParagraphs(
          positions.paragraph(),
          positions.word(),
          "focus",
          focus,
        );
      },
      wordValid: (valid: boolean) => {
        props.setParagraphs(
          positions.paragraph(),
          positions.word(),
          "wasCorrect",
          valid,
        );
      },
    },
  };

  return cursor;
};

export default makeCursor;
