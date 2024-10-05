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
        cursor.set.wordStatus(WordStatus.pending, true);
        cursor.set.keyFocus(CharacterFocus.focus);
      },
      leave: (cursor) => {
        cursor.set.wordStatus(WordStatus.over, false);
        cursor.set.keyFocus(CharacterFocus.unfocus);
      },
    },
    prev: {
      enter: (cursor) => {
        cursor.set.wordStatus(WordStatus.pending, true);
        cursor.set.keyFocus(CharacterFocus.focus);
        if (
          cursor.get.character().status !== CharacterStatus.match &&
          cursor.get.character().status !== CharacterStatus.unset
        ) {
          cursor.set.keyWasInvalid();
        }
      },
      leave: (cursor) => {
        cursor.set.wordStatus(WordStatus.unfocus, false);
        cursor.set.keyFocus(CharacterFocus.back);
      },
    },
  },
  word: {
    next: {
      enter: (cursor) => {
        cursor.set.wordStatus(WordStatus.pending, true);
        cursor.set.keyFocus(CharacterFocus.focus);
      },
      leave: (cursor) => {
        cursor.set.wordStatus(WordStatus.over, false);
        cursor.set.keyFocus(CharacterFocus.unfocus);
      },
    },
    prev: {
      enter: (cursor) => {
        cursor.set.wordStatus(WordStatus.pending, true);
        cursor.set.keyFocus(CharacterFocus.focus);
        if (
          cursor.get.character().status !== CharacterStatus.match &&
          cursor.get.character().status !== CharacterStatus.unset
        ) {
          cursor.set.keyWasInvalid();
        }
      },
      leave: (cursor) => {
        cursor.set.wordStatus(WordStatus.unfocus, false);
        cursor.set.keyFocus(CharacterFocus.back);
      },
    },
  },
  key: {
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
