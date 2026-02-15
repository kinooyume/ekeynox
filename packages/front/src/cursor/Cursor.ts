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

export type Position = {
  paragraph: number;
  word: number;
  character: number;
};

export type Cursor = {
  focus: () => void;
  get: {
    paragraph: () => Paragraph;
    nbrParagraphs: () => number;
    word: () => MetaWord;
    typingWord: () => TypingWord | null;
    nbrWords: () => number;
    isSeparator: () => boolean;
    hasWpm: () => boolean;
    wordIsCorrect: () => boolean;
    wordIsValid: () => boolean;
    wordLastEnterTimestamp: () => number;
    wordSpentTime: () => number;

    character: () => MetaCharacter;
    nbrKeys: () => number;
  };
  set: {
    /* Word */
    wordStatus: (status: WordStatus, focus: boolean) => void;

    wordIsCorrect: (correct: boolean) => void;
    wordLastEnterTimestamp: (timestamp: number) => void;
    wordLastLeaveTimestamp: (timestamp: number) => void;
    wordSpentTime: (time: number) => void;
    wordWpm: (wpm: number) => void;

    /* Key */
    keyStatus: (status: CharacterStatus) => void;
    keyWasInvalid: () => void;
    keyFocus: (focus: CharacterFocus) => void;
    ghostFocus: (focus: CharacterFocus) => void;
  };
  positions: {
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

    get: {
      paragraph: () => props.paragraphs[positions.paragraph()],
      nbrParagraphs: () => props.paragraphs.length - 1,
      nbrWords: () => props.paragraphs[positions.paragraph()].length - 1,
      typingWord: () => {
        if (cursor.get.wordIsValid()) {
          cursor.set.wordIsCorrect(true);
          return {
            kind: TypingWordKind.correct,
            length: cursor.get.word().characters.length,
          };
        } else {
          cursor.set.wordIsCorrect(false);
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
      wordIsCorrect: () => {
        return props.paragraphs[positions.paragraph()][positions.word()]
          .isCorrect;
      },
      hasWpm: () => !cursor.get.isSeparator() && cursor.get.nbrKeys() > 3,
      wordLastEnterTimestamp: () => {
        return props.paragraphs[positions.paragraph()][positions.word()]
          .lastEnterTimestamp;
      },
      wordSpentTime: () => {
        return props.paragraphs[positions.paragraph()][positions.word()]
          .spentTime;
      },
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
      wordIsCorrect: (correct: boolean) => {
        props.setParagraphs(
          positions.paragraph(),
          positions.word(),
          "isCorrect",
          correct,
        );
      },
      wordLastEnterTimestamp: (timestamp: number) => {
        props.setParagraphs(
          positions.paragraph(),
          positions.word(),
          "lastEnterTimestamp",
          timestamp,
        );
      },
      wordLastLeaveTimestamp: (timestamp: number) => {
        props.setParagraphs(
          positions.paragraph(),
          positions.word(),
          "lastLeaveTimestamp",
          timestamp,
        );
      },
      wordSpentTime: (time: number) => {
        props.setParagraphs(
          positions.paragraph(),
          positions.word(),
          "spentTime",
          time,
        );
      },
      wordWpm: (wpm: number) => {
        props.setParagraphs(
          positions.paragraph(),
          positions.word(),
          "wpm",
          wpm,
        );
      },
    },
  };

  return cursor;
};

export default makeCursor;
