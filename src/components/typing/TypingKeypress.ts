import type { Cursor } from "../cursor/Cursor";
import type { CursorNavType } from "../cursor/CursorNav";
import {
  KeyEventKind,
  KeyFocus,
  getKeyDownMetrics,
  getKeyMetrics,
  makeDeletedKeyMetrics,
} from "../metrics/KeyMetrics";
import { WordStatus } from "../prompt/PromptWord";
import TypingEvent, {
  TypingWordKind,
  type TypingEventType,
} from "./TypingEvent";

/* In a nutshell
 * 3 responsabilities:
 *  - bouger le curseur
 *  - information sur le mot d'apres (on verra si toujours le cas)
 *  - [ return] TypingEvent
 */

type KeypressHandler = {
  addKey: (typed: string, timestamp: number) => TypingEventType | undefined;
  keyDown: (key: string) => TypingEventType | undefined;
};

const makeKeypressHandler = (
  cursor: Cursor,
  cursorNav: CursorNavType,
  incrementWordsCount: (cursor: Cursor) => void,
  decrementWordsCount: (cursor: Cursor) => void,
): KeypressHandler => {
  const backKey = (timestamp: number) => {
    if (!cursorNav.prev(decrementWordsCount)) return;
    const deletedKeyMetrics = makeDeletedKeyMetrics({
      expected: cursor.get.key().key,
      status: cursor.get.key().status,
    });

    // props.setStatus(
    return TypingEvent.make({
      key: {
        keyMetrics: deletedKeyMetrics,
        timestamp,
        focusIsSeparator: cursor.get.isSeparator(),
      },
      next: true,
    });
    //);
  };

  /* *** */

  const addKey = (typed: string, timestamp: number) => {
    const keyMetrics = getKeyMetrics({
      typed,
      expected: cursor.get.key().key,
    });
    if (keyMetrics[1].kind === KeyEventKind.ignore) {
      return;
    } else {
      if (cursor.get.word().status !== WordStatus.pending) {
        cursor.set.wordStatus(WordStatus.pending, true);
      }
      if (keyMetrics[1].kind === KeyEventKind.added) {
        cursor.set.keyStatus(keyMetrics[1].status.kind);
      }
      /* Tout ca on sait pas trop, surement pas ici */

      /* ca pourrait reagir a TypingStatus */
      // Donc en fait, si on reagis au typingStatus plutot pour faire next
      let [hasNext, typingWord] = cursorNav.next(incrementWordsCount);

      /* Typing Status */
      const event = {
        key: {
          keyMetrics,
          timestamp,
          focusIsSeparator: cursor.get.isSeparator(),
        },
        word: typingWord || { kind: TypingWordKind.ignore },
        next: hasNext,
      };

      return TypingEvent.make(event);

      /* *** */

      // TIMER LOOP ONLY: extraEnd

      // ==> peut reagir a TypingEvent
      // if (
      //   props.extraEnd &&
      //   props.extraEnd[0] === cursor.positions.paragraph() &&
      //   props.extraEnd[1] === cursor.positions.word()
      // ) {
      //   props.onOver();
      // }
      //
      
      // GameHandler ici ca pourrais etre de l'autre coté aussi */

      // // Peu reagir aussi si acces au hasNext
      // if (!hasNext) {
      //   cursor.set.wordStatus(WordStatus.over, false);
      //   cursor.set.keyFocus(KeyFocus.unfocus);
      //   props.onOver();
      // }
    }

    // C'est la next key
    // props.setPromptKey(cursor.get.key().key);
  };

  const keyDown = (key: string) => {
    switch (getKeyDownMetrics(key)) {
      case KeyEventKind.added:
        return addKey(key, performance.now());
      case KeyEventKind.back:
        return backKey(performance.now());
    }
  };

  return { addKey, keyDown };
};

export default makeKeypressHandler;
