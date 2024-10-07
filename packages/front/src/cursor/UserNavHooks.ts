import { WordStatus } from "~/typingContent/word/types";
import {
  CharacterFocus,
  CharacterStatus,
} from "~/typingContent/character/types";

import type { CursorNavHooks } from "./CursorNavHooks";

const UserNavHooks: CursorNavHooks = {
  paragraph: {
    next: {
      enter: (cursor) => {
        UserNavHooks.word.next.enter(cursor);
      },
      leave: (cursor) => {
        UserNavHooks.word.next.leave(cursor);
      },
    },
    prev: {
      enter: (cursor) => {
        UserNavHooks.word.prev.enter(cursor);
      },
      leave: (cursor) => {
        UserNavHooks.word.prev.leave(cursor);
      },
    },
  },
  word: {
    next: {
      enter: (cursor) => {
        if (cursor.get.hasWpm()) {
          cursor.set.wordLastEnterTimestamp(performance.now());
        }
        cursor.set.wordStatus(WordStatus.pending, true);
        UserNavHooks.character.next.enter(cursor);
      },
      leave: (cursor) => {
        if (cursor.get.hasWpm()) {
          const timestamp = performance.now();
          //cursor.set.wordLastLeaveTimestamp(timestamp);
          const spentTime = timestamp - cursor.get.wordLastEnterTimestamp();

          const totalSpentTime = cursor.get.wordSpentTime() + spentTime;
          cursor.set.wordSpentTime(totalSpentTime);
          if (cursor.get.wordIsValid()) {
            const wpm = ((cursor.get.nbrKeys() / totalSpentTime) * 60000) / 5;
            cursor.set.wordWpm(wpm);
            cursor.set.wordIsCorrect(true);
          } else {
            cursor.set.wordIsCorrect(false);
          }
        }
        cursor.set.wordStatus(WordStatus.over, false);
        UserNavHooks.character.next.leave(cursor);
      },
    },
    prev: {
      enter: (cursor) => {
        if (cursor.get.hasWpm()) {
          cursor.set.wordLastEnterTimestamp(performance.now());
        }
        cursor.set.wordStatus(WordStatus.pending, true);
        UserNavHooks.character.prev.enter(cursor);
      },
      leave: (cursor) => {
        // NOTE: we can optimize it by keeping the key performance.now
        if (cursor.get.hasWpm()) {
          const timestamp = performance.now();
          //cursor.set.wordLastLeaveTimestamp(timestamp);
          const spentTime = timestamp - cursor.get.wordLastEnterTimestamp();
          const totalSpentTime = cursor.get.wordSpentTime() + spentTime;
          cursor.set.wordSpentTime(totalSpentTime);
          if (cursor.get.wordIsValid()) {
            const wpm = ((cursor.get.nbrKeys() / totalSpentTime) * 60000) / 5;
            cursor.set.wordWpm(wpm);
            cursor.set.wordIsCorrect(true);
          } else {
            cursor.set.wordIsCorrect(false);
          }
        }
        cursor.set.wordStatus(WordStatus.unfocus, false);
        UserNavHooks.character.prev.leave(cursor);
      },
    },
  },
  character: {
    next: {
      enter: (cursor) => {
        cursor.set.keyFocus(CharacterFocus.focus);
      },
      leave: (cursor) => {
        cursor.set.keyFocus(CharacterFocus.unfocus);
      },
    },
    prev: {
      enter: (cursor) => {
        cursor.set.keyFocus(CharacterFocus.focus);
        if (
          cursor.get.character().status !== CharacterStatus.match &&
          cursor.get.character().status !== CharacterStatus.unset
        ) {
          cursor.set.keyWasInvalid();
        }
      },
      leave: (cursor) => {
        cursor.set.keyFocus(CharacterFocus.back);
      },
    },
  },
};

export default UserNavHooks;
