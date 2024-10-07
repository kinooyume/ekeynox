import { CharacterFocus } from "~/typingContent/character/types";
import type { CursorNavHooks } from "./CursorNavHooks";

const TimerNavHooks: CursorNavHooks = {
  paragraph: {
    next: {
      enter: (cursor) => {
        cursor.set.ghostFocus(CharacterFocus.focus);
      },
      leave: (cursor) => {
        cursor.set.ghostFocus(CharacterFocus.unfocus);
      },
    },
    prev: {
      enter: (cursor) => {
        cursor.set.ghostFocus(CharacterFocus.focus);
      },
      leave: (cursor) => {
        cursor.set.ghostFocus(CharacterFocus.unfocus);
      },
    },
  },
  word: {
    next: {
      enter: (cursor) => {
        cursor.set.ghostFocus(CharacterFocus.focus);
      },
      leave: (cursor) => {
        cursor.set.ghostFocus(CharacterFocus.unfocus);
      },
    },
    prev: {
      enter: (cursor) => {
        cursor.set.ghostFocus(CharacterFocus.focus);
      },
      leave: (cursor) => {
        cursor.set.ghostFocus(CharacterFocus.unfocus);
      },
    },
  },
  character: {
    next: {
      enter: (cursor) => {
        cursor.set.ghostFocus(CharacterFocus.focus);
      },
      leave: (cursor) => {
        cursor.set.ghostFocus(CharacterFocus.unfocus);
      },
    },
    prev: {
      enter: (cursor) => {
        cursor.set.ghostFocus(CharacterFocus.focus);
      },
      leave: (cursor) => {
        cursor.set.ghostFocus(CharacterFocus.unfocus);
      },
    },
  },
};
export default TimerNavHooks;
