import { KeyFocus } from "../metrics/KeyMetrics";
import { WordStatus } from "../prompt/PromptWord";
import { TypingWordKind, type TypingWord } from "../typing/TypingEngine";
import type { Cursor } from "./Cursor";

type CursorNavProps = {
  cursor: Cursor;
};

type CursorNav = {
  getTypingWord: () => TypingWord | null;
  next: (nextWordHook: (cursor: Cursor) => void) => [boolean, TypingWord | null];

  prev: () => boolean;
};

let makeCursorNav = ({ cursor }: CursorNavProps): CursorNav => {
  const getTypingWord = () => {
    if (!cursor.get.wordValid() && cursor.get.wordIsValid()) {
      cursor.set.wordValid(true);
      return {
        kind: TypingWordKind.correct,
        length: cursor.get.word().keys.length,
      };
    } else {
      return null;
    }
  };

  /* Next */
  const nextWord = () => {
    let typingWord = null;
    if (!cursor.get.wordValid() && cursor.get.wordIsValid()) {
      typingWord = getTypingWord();
    }
    cursor.set.wordStatus(WordStatus.over, false);
    cursor.set.keyFocus(KeyFocus.unfocus);
    cursor.positions.set.word(cursor.positions.word() + 1);
    cursor.positions.set.key(0);
    cursor.set.wordStatus(WordStatus.pending, true);
    cursor.set.keyFocus(KeyFocus.focus);
    return typingWord;
  };

  const nextParagraph = () => {
    /* Prev */
    cursor.set.wordStatus(WordStatus.over, false);
    cursor.set.keyFocus(KeyFocus.unfocus);
    /* Switch */
    cursor.positions.set.paragraph(cursor.positions.paragraph() + 1);
    /* Next */
    cursor.positions.set.word(0);
    cursor.positions.set.key(0);
    cursor.set.wordStatus(WordStatus.pending, true);
    cursor.set.keyFocus(KeyFocus.focus);
  };

  /* Prev */

  const prevWord = () => {
    /* Prev */
    cursor.set.wordStatus(WordStatus.unfocus, false);
    cursor.set.keyFocus(KeyFocus.back);
    /* Switch */
    cursor.positions.set.word(cursor.positions.word() - 1);
    cursor.positions.set.key(cursor.get.nbrKeys());
    /* NeXT */
    cursor.set.wordStatus(WordStatus.pending, true);
    cursor.set.keyFocus(KeyFocus.focus);
  };

  const prevParagraph = () => {
    cursor.set.wordStatus(WordStatus.unfocus, false);
    cursor.set.keyFocus(KeyFocus.back);
    cursor.positions.set.paragraph(cursor.positions.paragraph() - 1);
    cursor.positions.set.word(cursor.get.nbrWords());
    cursor.positions.set.key(cursor.get.nbrKeys());
    cursor.set.wordStatus(WordStatus.pending, true);
    cursor.set.keyFocus(KeyFocus.focus);
  };

  return {
    getTypingWord,

    next: (nextWordHook) => {
      let typingWord = null;
      if (cursor.positions.key() < cursor.get.nbrKeys()) {
        cursor.set.keyFocus(KeyFocus.unfocus);
        cursor.positions.set.key(cursor.positions.key() + 1);
        cursor.set.keyFocus(KeyFocus.focus);
      } else if (cursor.positions.word() < cursor.get.nbrWords()) {
        typingWord = nextWord();
        nextWordHook(cursor);
      } else if (cursor.positions.paragraph() < cursor.get.nbrParagraphs()) {
        nextParagraph();
      } else return [false, getTypingWord()];
      return [true, typingWord];
    },

    /* Prev */

    prev: (): boolean => {
      if (cursor.positions.key() > 0) {
        cursor.set.keyFocus(KeyFocus.back);
        cursor.positions.set.key(cursor.positions.key() - 1);
        cursor.set.keyFocus(KeyFocus.focus);
      } else if (cursor.positions.word() > 0) {
        prevWord();
      } else if (cursor.positions.paragraph() > 0) {
        prevParagraph();
      } else {
        return false;
      }
      return true;
    },
  };
};

export default makeCursorNav;
