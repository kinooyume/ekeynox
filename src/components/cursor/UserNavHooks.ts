import { KeyFocus } from "../metrics/KeyMetrics";
import { WordStatus } from "../prompt/PromptWord";
import type { CursorNavHooks } from "./CursorNavHooks";

const UserNavHooks: CursorNavHooks = {
  paragraph: {
    next: {
      enter: (cursor) => {
        cursor.set.wordStatus(WordStatus.pending, true);
        cursor.set.keyFocus(KeyFocus.focus);
      },
      leave: (cursor) => {
        cursor.set.wordStatus(WordStatus.over, false);
        cursor.set.keyFocus(KeyFocus.unfocus);
      },
    },
    prev: {
      enter: (cursor) => {
        cursor.set.wordStatus(WordStatus.pending, true);
        cursor.set.keyFocus(KeyFocus.focus);
      },
      leave: (cursor) => {
        cursor.set.wordStatus(WordStatus.unfocus, false);
        cursor.set.keyFocus(KeyFocus.back);
      },
    },
  },
  word: {
    next: {
      enter: (cursor) => {
        cursor.set.wordStatus(WordStatus.pending, true);
        cursor.set.keyFocus(KeyFocus.focus);
      },
      leave: (cursor) => {
        cursor.set.wordStatus(WordStatus.over, false);
        cursor.set.keyFocus(KeyFocus.unfocus);
      },
    },
    prev: {
      enter: (cursor) => {
        cursor.set.wordStatus(WordStatus.pending, true);
        cursor.set.keyFocus(KeyFocus.focus);
      },
      leave: (cursor) => {
        cursor.set.wordStatus(WordStatus.unfocus, false);
        cursor.set.keyFocus(KeyFocus.back);
      },
    },
  },
  key: {
    next: {
      enter: (cursor) => {
        cursor.set.keyFocus(KeyFocus.focus);
      },
      leave: (cursor) => {
        cursor.set.keyFocus(KeyFocus.unfocus);
      },
    },
    prev: {
      enter: (cursor) => {
        cursor.set.keyFocus(KeyFocus.focus);
      },
      leave: (cursor) => {
        cursor.set.keyFocus(KeyFocus.back);
      },
    },
  },
};

export default UserNavHooks;
