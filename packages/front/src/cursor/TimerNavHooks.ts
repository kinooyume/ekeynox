import { KeyFocus } from "~/typingMetrics/KeyMetrics";
import type { CursorNavHooks } from "./CursorNavHooks";

const TimerNavHooks: CursorNavHooks = {
  paragraph: {
    next: {
      enter: (cursor) => {
        cursor.set.ghostFocus(KeyFocus.focus);
      },
      leave: (cursor) => {
        cursor.set.ghostFocus(KeyFocus.unfocus);
      },
    },
    prev: {
      enter: (cursor) => {
        cursor.set.ghostFocus(KeyFocus.focus);
      },
      leave: (cursor) => {
        cursor.set.ghostFocus(KeyFocus.unfocus);
      },
    },
  },
  word: {
    next: {
      enter: (cursor) => {
        cursor.set.ghostFocus(KeyFocus.focus);
      },
      leave: (cursor) => {
        cursor.set.ghostFocus(KeyFocus.unfocus);
      },
    },
    prev: {
      enter: (cursor) => {
        cursor.set.ghostFocus(KeyFocus.focus);
      },
      leave: (cursor) => {
        cursor.set.ghostFocus(KeyFocus.unfocus);
      },
    },
  },
  key: {
    next: {
      enter: (cursor) => {
        cursor.set.ghostFocus(KeyFocus.focus);
      },
      leave: (cursor) => {
        cursor.set.ghostFocus(KeyFocus.unfocus);
      },
    },
    prev: {
      enter: (cursor) => {
        cursor.set.ghostFocus(KeyFocus.focus);
      },
      leave: (cursor) => {
        cursor.set.ghostFocus(KeyFocus.unfocus);
      },
    },
  },
};
export default TimerNavHooks;
