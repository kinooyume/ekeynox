import { type TypingState, typingStatePending } from ".";

import { TypingWordKind, WordStatus } from "~/typingContent/word/types";
import { CharacterEventKind } from "~/typingContent/character/types";

import type { Cursor } from "~/cursor/Cursor";
import type { CursorNavType } from "~/cursor/CursorNav";

import {
  getKeyDownMetrics,
  getKeyMetrics,
  makeDeletedKeyMetrics,
} from "~/typingMetrics/KeyMetrics";



// NOTE: A priori, uniquement pour userInput
// Donc, a virer de typingGameManager

/* In a nutshell
 * 3 responsabilities:
 *  - bouger le curseur
 *  - information sur le mot d'apres (on verra si toujours le cas)
 *  - [ return] TypingState
 */

type KeypressHandler = {
  addKey: (typed: string, timestamp: number) => TypingState | undefined;
  keyDown: (key: string) => TypingState | undefined;
};

const makeKeypressHandler = (
  cursor: Cursor,
  cursorNav: CursorNavType,
): KeypressHandler => {
  const backKey = (timestamp: number) => {
    if (!cursorNav.prev()) return;
    const deletedKeyMetrics = makeDeletedKeyMetrics({
      expected: cursor.get.character().char,
      status: cursor.get.character().status,
    });

    return typingStatePending({
      key: {
        keyMetrics: deletedKeyMetrics,
        timestamp,
        focusIsSeparator: cursor.get.isSeparator(),
      },
      next: true,
    });
  };

  /* *** */

  const addKey = (typed: string, timestamp: number) => {
    // Donc, on veut faire ça
    // User Agent for firefox mobile and chrome mobile
    // if (typed.length === 0) return backKey(timestamp);
    const keyMetrics = getKeyMetrics({
      typed,
      expected: cursor.get.character().char,
    });
    if (keyMetrics[1].kind === CharacterEventKind.ignore) {
      return;
    } else {
      if (cursor.get.word().status !== WordStatus.pending) {
        cursor.set.wordStatus(WordStatus.pending, true);
      }
      if (keyMetrics[1].kind === CharacterEventKind.added) {
        cursor.set.keyStatus(keyMetrics[1].status.kind);
      }

      /* Tout ca on sait pas trop, surement pas ici */
      let [hasNext, typingWord] = cursorNav.next();

      const event = {
        key: {
          keyMetrics,
          timestamp,
          focusIsSeparator: cursor.get.isSeparator(),
        },
        word: typingWord || { kind: TypingWordKind.ignore },
        next: hasNext,
      };

      return typingStatePending(event);
    }
  };

  // NOTE: fallback to handle backspace
  const keyDown = (key: string) => {
    switch (getKeyDownMetrics(key)) {
      case CharacterEventKind.added:
        return addKey(key, performance.now());
      case CharacterEventKind.back:
        return backKey(performance.now());
    }
  };

  return { addKey, keyDown };
};

export default makeKeypressHandler;
