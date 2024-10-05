import { createSignal } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";

import {
  MetaWord,
  TypingWord,
  TypingWordKind,
  WordStatus,
} from "~/typingContent/word/types";
import {
  CharacterFocus,
  CharacterStatus,
  MetaCharacter,
} from "~/typingContent/character/types";
import { Paragraphs, Paragraph } from "~/typingContent/paragraphs/types";

type CursorProps = {
  paragraphs: Paragraphs;
  setParagraphs: SetStoreFunction<Paragraphs>;
};

// Pourquoi c'est pas des variables direct ? est-ce souhaitable ?

// NOTE: State

export type Position = {
  paragraph: number;
  word: number;
  character: number;
};

// NOTE:
export type Cursor = {
  focus: () => void;
  // NOTE: Signal or store
  get: {
    paragraph: () => Paragraph; // MetaWord[], [Ref]
    nbrParagraphs: () => number; // paragraphs.length

    word: () => MetaWord; // current word  [Ref]
    typingWord: () => TypingWord | null; // TypingWord | null
    nbrWords: () => number; // words.length
    wordValid: () => boolean; // MetaWord - wasCorrect  *
    isSeparator: () => boolean; // MetaWord *
    wordIsValid: () => boolean; // valid keys === word valid #fn#

    character: () => MetaCharacter;
    nbrKeys: () => number; // keys length
  };
  set: {
    /* Word */
    wordStatus: (status: WordStatus, focus: boolean) => void;
    wordValid: (valid: boolean) => void;

    /* Key */
    keyStatus: (status: CharacterStatus) => void;
    keyWasInvalid: () => void;
    keyFocus: (focus: CharacterFocus) => void;
    ghostFocus: (focus: CharacterFocus) => void;
  };
  // NOTE: can be a store
  positions: {
    // Index  []
    paragraph: () => number;
    word: () => number;
    character: () => number;
    get: () => Position;
    reset: () => void;
    set: {
      paragraph: (n: number) => void;
      word: (n: number) => void;
      character: (n: number) => void;
    };
  };
};

const makeCursor = (props: CursorProps) => {
  /* NOTE: could be replace by nested linked list */
  /* Keep paragraph/word/key-letter index */
  const [paragraph, setCurrentParagraph] = createSignal(0);
  const [word, setCurrentWord] = createSignal(0);
  const [key, setCurrentKey] = createSignal(0);

  const positions = {
    paragraph,
    word,
    character: key,
    get: () => ({ paragraph: paragraph(), word: word(), character: key() }),
    reset: () => {
      cursor.positions.set.paragraph(0);
      cursor.positions.set.word(0);
      cursor.positions.set.character(0);
      cursor.focus();
    },
    set: {
      paragraph: setCurrentParagraph,
      word: setCurrentWord,
      character: setCurrentKey,
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
      cursor.set.keyFocus(CharacterFocus.focus);
    },

    /* NOTE: Paragraphs Data Getter */

    get: {
      paragraph: () => props.paragraphs[positions.paragraph()],
      nbrParagraphs: () => props.paragraphs.length - 1,
      nbrWords: () => props.paragraphs[positions.paragraph()].length - 1,
      typingWord: () => {
        if (!cursor.get.wordValid() && cursor.get.wordIsValid()) {
          cursor.set.wordValid(true);
          return {
            kind: TypingWordKind.correct,
            length: cursor.get.word().characters.length,
          };
        } else {
          return null;
        }
      },
      word: () => props.paragraphs[positions.paragraph()][positions.word()],
      wordIsValid: () => {
        const word = props.paragraphs[positions.paragraph()][positions.word()];
        return word.characters.every(
          (key) => key.status === CharacterStatus.match,
        );
      },
      wordValid: () =>
        props.paragraphs[positions.paragraph()][positions.word()].wasCorrect,
      nbrKeys: () =>
        props.paragraphs[positions.paragraph()][positions.word()].characters
          .length - 1,
      character: () =>
        props.paragraphs[positions.paragraph()][positions.word()].characters[
          positions.character()
        ],
      isSeparator: () =>
        props.paragraphs[positions.paragraph()][positions.word()].isSeparator,
    },

    /* NOTE: Paragraphs Data Setter */

    set: {
      /* key */
      keyStatus: (status: CharacterStatus) => {
        props.setParagraphs(
          positions.paragraph(),
          positions.word(),
          "characters",
          positions.character(),
          "status",
          status,
        );
      },
      keyWasInvalid: () => {
        props.setParagraphs(
          positions.paragraph(),
          positions.word(),
          "characters",
          positions.character(),
          "wasInvalid",
          true,
        );
      },
      keyFocus: (focus: CharacterFocus) => {
        props.setParagraphs(
          positions.paragraph(),
          positions.word(),
          "characters",
          positions.character(),
          "focus",
          focus,
        );
      },
      ghostFocus: (focus: CharacterFocus) => {
        props.setParagraphs(
          positions.paragraph(),
          positions.word(),
          "characters",
          positions.character(),
          "ghostFocus",
          focus,
        );
      },
      /* Word */
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
