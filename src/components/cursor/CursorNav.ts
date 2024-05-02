import type { TypingWord } from "../typing/TypingEvent";
import type { Cursor } from "./Cursor";
import type { CursorNavHooks } from "./CursorNavHooks";

type CursorNavProps = {
  hooks: CursorNavHooks;
  cursor: Cursor;
};

export type CursorNavType = {
  next: (
    nextWordHook?: (cursor: Cursor) => void,
  ) => [boolean, TypingWord | null];
  prev: (prevWordHook?: (cursor: Cursor) => void) => boolean;
};

let makeCursorNav = ({ cursor, hooks }: CursorNavProps): CursorNavType => {
  const nextWord = () => {
    let typingWord = null;
    if (!cursor.get.wordValid() && cursor.get.wordIsValid()) {
      typingWord = cursor.get.typingWord();
    }
    hooks.word.next.leave(cursor);
    cursor.positions.set.word(cursor.positions.word() + 1);
    cursor.positions.set.key(0);
    hooks.word.next.enter(cursor);
    return typingWord;
  };

  const nextParagraph = () => {
    hooks.paragraph.next.leave(cursor);
    cursor.positions.set.word(0);
    cursor.positions.set.key(0);
    cursor.positions.set.paragraph(cursor.positions.paragraph() + 1);
    hooks.paragraph.next.enter(cursor);
  };

  const prevWord = () => {
    hooks.word.prev.leave(cursor);
    cursor.positions.set.word(cursor.positions.word() - 1);
    cursor.positions.set.key(cursor.get.nbrKeys());
    hooks.word.prev.enter(cursor);
  };

  const prevParagraph = () => {
    hooks.paragraph.prev.leave(cursor);
    cursor.positions.set.paragraph(cursor.positions.paragraph() - 1);
    cursor.positions.set.word(cursor.get.nbrWords());
    cursor.positions.set.key(cursor.get.nbrKeys());
    hooks.paragraph.prev.enter(cursor);
  };

  return {
    next: (nextWordHook) => {
      let typingWord = null;
      if (cursor.positions.key() < cursor.get.nbrKeys()) {
        hooks.key.next.leave(cursor);
        cursor.positions.set.key(cursor.positions.key() + 1);
        hooks.key.next.enter(cursor);
      } else if (cursor.positions.word() < cursor.get.nbrWords()) {
        typingWord = nextWord();
        !cursor.get.word().isSeparator && nextWordHook && nextWordHook(cursor);
      } else if (cursor.positions.paragraph() < cursor.get.nbrParagraphs()) {
        nextParagraph();
      } else return [false, cursor.get.typingWord()];
      return [true, typingWord];
    },

    /* Prev */

    prev: (prevWordHook): boolean => {
      if (cursor.positions.key() > 0) {
        hooks.key.prev.leave(cursor);
        cursor.positions.set.key(cursor.positions.key() - 1);
        hooks.key.prev.enter(cursor);
      } else if (cursor.positions.word() > 0) {
        prevWord();
        prevWordHook && prevWordHook(cursor);
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
