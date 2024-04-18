import {
  createSignal,
  onCleanup,
  onMount,
  type Setter,
} from "solid-js";
import { WordStatus } from "../prompt/PromptWord.tsx";
import { type Paragraphs } from "../content/Content.ts";
import type { SetStoreFunction } from "solid-js/store";
import {
  KeyEventKind,
  type KeyTuple,
  getKeyMetrics,
  makeDeletedKeyMetrics,
  KeyFocus,
  getKeyDownMetrics,
} from "../metrics/KeyMetrics.ts";
import CursorNav from "../cursor/CursorNav.ts";
import makeCursor, { type Cursor } from "../cursor/Cursor.ts";
import UserNavHooks from "../cursor/UserNavHooks.ts";

export enum TypingWordKind {
  ignore,
  correct,
}

export type TypingWord =
  | { kind: TypingWordKind.ignore }
  | { kind: TypingWordKind.correct; length: number };

export enum TypingStatusKind {
  unstart,
  pending,
  deleted,
  pause,
  over,
}

export type TypingKey = {
  keyMetrics: KeyTuple;
  timestamp: number;
  focusIsSeparator: boolean;
};

export type TypingEvent = {
  key: TypingKey;
  word: TypingWord;
};

export type TypingStatus =
  | { kind: TypingStatusKind.unstart }
  | {
      kind: TypingStatusKind.pending;
      key: TypingKey;
      word: TypingWord;
    }
  | { kind: TypingStatusKind.pause }
  | { kind: TypingStatusKind.over };

export type Position = [number, number, number];
export type UserInputProps = {
  paragraphs: Paragraphs;
  setParagraphs: SetStoreFunction<Paragraphs>;
  onKeyDown: (key: string) => void;
  onKeyUp: (key: string) => void;
  setPromptKey: Setter<string>;
  setStatus: Setter<TypingStatus>;
  setPause: (pause: () => void) => void;
  setFocus: (focus: () => void) => void;
  setReset: (reset: () => void) => void;
  setGetPosition: (getPositions: () => Position) => void;
  setWordsCount: (wordsCount: number) => void;
  extraEnd?: [number, number];
  onOver: () => void;
};

const UserInput = (props: UserInputProps) => {
  // NOTE: should it be a computed ?
  const cursor = makeCursor({
    setParagraphs: props.setParagraphs,
    paragraphs: props.paragraphs,
  });

  const cursorNav = CursorNav({ cursor, hooks: UserNavHooks });

  let input: HTMLInputElement;
  const [wordsCount, setWordsCount] = createSignal(0);


  const reset = () => {
    input.value = "";

    cursor.positions.set.paragraph(0);
    cursor.positions.set.word(0);
    cursor.positions.set.key(0);
    cursor.focus();

    setWordsCount(0);
    props.setWordsCount(0);
    props.setPromptKey(cursor.get.key().key);
  };

  const pause = () => {
    cursor.set.wordStatus(WordStatus.pause, false);
    props.setStatus({ kind: TypingStatusKind.pause });
  };

  /* Key Handlers */

  const makeKeyMetrics = (typed: string) =>
    getKeyMetrics({
      typed,
      expected: cursor.get.key().key,
    });

  const handleInputEvent = (event: Event) => {
    const timestamp = performance.now();
    const input = event.target as HTMLInputElement;
    const value = input.value;
    input.value = "";
    return handleKeypress(value, timestamp);
  };

  type SetStatusProps = {
    key: TypingKey;
    word?: TypingWord;
  };

  const setStatus = (statusProps: SetStatusProps) =>
    props.setStatus({
      kind: TypingStatusKind.pending,
      word: { kind: TypingWordKind.ignore },
      ...statusProps,
    });

  const handleBackPress = (timestamp: number) => {
    if (!cursorNav.prev()) return;
    const deletedKeyMetrics = makeDeletedKeyMetrics({
      expected: cursor.get.key().key,
      status: cursor.get.key().status,
    });
    setStatus({
      key: {
        keyMetrics: deletedKeyMetrics,
        timestamp,
        focusIsSeparator: cursor.get.isSeparator(),
      },
    });
  };

  const incrementWordsCount = (c: Cursor) => {
    if (c.get.word().status !== WordStatus.unfocus && !c.get.isSeparator()) {
      setWordsCount((wordsCount) => wordsCount + 1);
      props.setWordsCount(wordsCount());
    }
  };

  const handleKeypress = (typed: string, timestamp: number) => {
    const keyMetrics = makeKeyMetrics(typed);
    if (keyMetrics[1].kind === KeyEventKind.ignore) {
      return;
    } else {
      if (cursor.get.word().status !== WordStatus.pending) {
        cursor.set.wordStatus(WordStatus.pending, true);
      }
      if (keyMetrics[1].kind === KeyEventKind.added) {
        cursor.set.keyStatus(keyMetrics[1].status.kind);
      }
      let [hasNext, typingWord] = cursorNav.next(incrementWordsCount);

      setStatus({
        key: {
          keyMetrics,
          timestamp,
          focusIsSeparator: cursor.get.isSeparator(),
        },
        word: typingWord || { kind: TypingWordKind.ignore },
      });
      // NOTE: hum.. extra ifs..
      if (
        props.extraEnd &&
        props.extraEnd[0] === cursor.positions.paragraph() &&
        props.extraEnd[1] === cursor.positions.word()
      ) {
        props.onOver();
      }
      if (!hasNext) {
        cursor.set.wordStatus(WordStatus.over, false);
        cursor.set.keyFocus(KeyFocus.unfocus);
        props.onOver();
      }
    }
    props.setPromptKey(cursor.get.key().key);
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    props.onKeyUp(event.key);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    props.onKeyDown(event.key);
    switch (getKeyDownMetrics(event.key)) {
      case KeyEventKind.added:
        return handleKeypress(event.key, performance.now());
      case KeyEventKind.back:
        return handleBackPress(performance.now());
    }
  };

  const getPositions = (): Position => [
    cursor.positions.paragraph(),
    cursor.positions.word(),
    cursor.positions.key(),
  ];

  /* *** */

  onMount(() => {
    /* NOTE: input event to handle android/chrome */
    input.addEventListener("input", handleInputEvent);
    input.addEventListener("keydown", handleKeyDown);
    input.addEventListener("keyup", handleKeyUp);
    cursor.focus();
    props.setPromptKey(cursor.get.key().key);
    props.setFocus(() => input.focus());
    props.setReset(reset);
    props.setPause(pause);
    props.setGetPosition(getPositions);
    input.focus();
  });

  onCleanup(() => {
    cursor.set.keyFocus(KeyFocus.unfocus);
    cursor.set.wordStatus(WordStatus.unstart, false);
    if (!input) return;
    input.removeEventListener("input", handleInputEvent);
    input.removeEventListener("keydown", handleKeyDown);
    input.removeEventListener("keyup", handleKeyUp);
  });
  /****/

  return (
    <input
      ref={input!}
      type="text"
      autofocus
      autocorrect="off"
      autocomplete="off"
      autocapitalize="none"
      spellcheck={false}
      aria-hidden
      data-gramm="false"
      data-gramm_editor="false"
      data-enable-grammarly="false"
      style="position: fixed; top: -100px"
    ></input>
  );
};

export default UserInput;
