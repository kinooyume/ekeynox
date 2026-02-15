import { type TypingState, typingStatePending } from ".";

import { TypingWordKind, WordStatus } from "~/typingContent/word/types";
import { CharacterEventKind } from "~/typingContent/character/types";

import type { Cursor } from "~/cursor/Cursor";
import type { CursorNavType } from "~/cursor/CursorNav";

import {
  getKeyDownMetrics,
  getKeyMetrics,
  makeDeletedKeyMetrics,
} from "~/typingStatistics/KeyMetrics";

type KeypressHandler = {
  addKey: (typed: string) => TypingState | undefined;
  keyDown: (key: string) => TypingState | undefined;
};

const makeKeypressHandler = (
  cursor: Cursor,
  cursorNav: CursorNavType,
): KeypressHandler => {
  const backKey = () => {
    if (!cursorNav.prev()) return;
    const deletedKeyMetrics = makeDeletedKeyMetrics({
      expected: cursor.get.character().char,
      status: cursor.get.character().status,
    });

    return typingStatePending({
      key: {
        keyMetrics: deletedKeyMetrics,
        timestamp: performance.now(),
        focusIsSeparator: cursor.get.isSeparator(),
      },
      next: true,
    });
  };

  const addKey = (typed: string) => {
    const keyMetrics = getKeyMetrics({
      typed,
      expected: cursor.get.character().char,
    });

    if (keyMetrics[1].kind === CharacterEventKind.ignore) {
      return;
    } else {
      const status = cursor.get.word().status


      if (status === WordStatus.pause || status === WordStatus.unstart) {
          cursor.set.wordLastEnterTimestamp(performance.now());
      }
      if (cursor.get.word().status !== WordStatus.pending) {
        cursor.set.wordStatus(WordStatus.pending, true);
      }
      if (keyMetrics[1].kind === CharacterEventKind.added) {
        cursor.set.keyStatus(keyMetrics[1].status.kind);
      }

      let [hasNext, typingWord] = cursorNav.next();

      const event = {
        key: {
          keyMetrics,
          timestamp: performance.now(),
          focusIsSeparator: cursor.get.isSeparator(),
        },
        word: typingWord || { kind: TypingWordKind.ignore },
        next: hasNext,
      };

      return typingStatePending(event);
    }
  };

  const keyDown = (key: string) => {
    switch (getKeyDownMetrics(key)) {
      case CharacterEventKind.added:
        return addKey(key);
      case CharacterEventKind.back:
        return backKey();
    }
  };

  return { addKey, keyDown };
};

export default makeKeypressHandler;
