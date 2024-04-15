import { createSignal, onCleanup, onMount, type Setter } from "solid-js";
import { WordStatus } from "../prompt/PromptWord.tsx";
import { type Paragraphs } from "../content/Content.ts";
import type { SetStoreFunction } from "solid-js/store";
import {
  KeyEventKind,
  KeyStatus,
  type KeyTuple,
  getKeyMetrics,
  makeDeletedKeyMetrics,
  KeyFocus,
  getKeyDownMetrics,
} from "../metrics/KeyMetrics.ts";

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
export type TypingEngineProps = {
  paragraphs: Paragraphs;
  setParagraphs: SetStoreFunction<Paragraphs>;
  onKeyDown: (key: string) => void;
  onKeyUp: (key: string) => void;
  setCurrentPromptKey: Setter<string>;
  status: TypingStatus;
  setStatus: Setter<TypingStatus>;
  setPause: (pause: () => void) => void;
  setFocus: (focus: () => void) => void;
  setReset: (reset: () => void) => void;
  setGetPosition: (getPositions: () => Position) => void;
  extraEnd?: [number, number];
  onOver: () => void;
};

const TypingEngine = (props: TypingEngineProps) => {
  let input: HTMLInputElement;

  /* Navigation */
  const [currentParagraph, setCurrentParagraph] = createSignal(0);
  const [currentWord, setCurrentWord] = createSignal(0);
  const [currentKey, setCurrentKey] = createSignal(0);

  /* Store Management */
  const currentFocus = () => {
    props.setParagraphs(currentParagraph(), currentWord(), "focus", true);
    setCurrent.keyFocus(KeyFocus.focus);
  };

  const getCurrent = {
    paragraph: () => props.paragraphs[currentParagraph()],
    nbrParagraphs: () => props.paragraphs.length - 1,
    nbrWords: () => props.paragraphs[currentParagraph()].length - 1,
    word: () => props.paragraphs[currentParagraph()][currentWord()],
    wordIsValid: () => {
      const word = props.paragraphs[currentParagraph()][currentWord()];
      return word.keys.every((key) => key.status === KeyStatus.match);
    },
    wordValid: () =>
      props.paragraphs[currentParagraph()][currentWord()].wasCorrect,
    nbrKeys: () =>
      props.paragraphs[currentParagraph()][currentWord()].keys.length - 1,
    key: () =>
      props.paragraphs[currentParagraph()][currentWord()].keys[currentKey()],
    isSeparator: () =>
      props.paragraphs[currentParagraph()][currentWord()].isSeparator,
  };

  const setCurrent = {
    keyStatus: (status: KeyStatus) => {
      props.setParagraphs(
        currentParagraph(),
        currentWord(),
        "keys",
        currentKey(),
        "status",
        status,
      );
    },
    keyFocus: (focus: KeyFocus) => {
      props.setParagraphs(
        currentParagraph(),
        currentWord(),
        "keys",
        currentKey(),
        "focus",
        focus,
      );
    },
    wordStatus: (status: WordStatus, focus: boolean) => {
      props.setParagraphs(currentParagraph(), currentWord(), "status", status);
      props.setParagraphs(currentParagraph(), currentWord(), "focus", focus);
    },
    wordValid: (valid: boolean) => {
      props.setParagraphs(
        currentParagraph(),
        currentWord(),
        "wasCorrect",
        valid,
      );
    },
  };

  /* *** */

  const getTypingWord = () => {
    if (!getCurrent.wordValid() && getCurrent.wordIsValid()) {
      setCurrent.wordValid(true);
      return {
        kind: TypingWordKind.correct,
        length: getCurrent.word().keys.length,
      };
    } else {
      return null;
    }
  };

  const nextWord = () => {
    let typingWord = null;
    if (!getCurrent.wordValid() && getCurrent.wordIsValid()) {
      typingWord = getTypingWord();
    }
    setCurrent.wordStatus(WordStatus.over, false);
    setCurrent.keyFocus(KeyFocus.unfocus);
    setCurrentWord(currentWord() + 1);
    setCurrentKey(0);
    setCurrent.wordStatus(WordStatus.pending, true);
    setCurrent.keyFocus(KeyFocus.focus);
    return typingWord;
  };

  const nextParagraph = () => {
    setCurrent.wordStatus(WordStatus.over, false);
    setCurrent.keyFocus(KeyFocus.unfocus);
    setCurrentParagraph(currentParagraph() + 1);
    setCurrentWord(0);
    setCurrentKey(0);
    setCurrent.wordStatus(WordStatus.pending, true);
    setCurrent.keyFocus(KeyFocus.focus);
  };

  const next = (): [boolean, TypingWord | null] => {
    let typingWord = null;
    if (currentKey() < getCurrent.nbrKeys()) {
      setCurrent.keyFocus(KeyFocus.unfocus);
      setCurrentKey(currentKey() + 1);
      setCurrent.keyFocus(KeyFocus.focus);
    } else if (currentWord() < getCurrent.nbrWords()) {
      typingWord = nextWord();
    } else if (currentParagraph() < getCurrent.nbrParagraphs()) {
      nextParagraph();
    } else return [false, getTypingWord()];
    return [true, typingWord];
  };

  /* Prev */
  const reset = () => {
    input.value = "";

    setCurrentParagraph(0);
    setCurrentWord(0);
    setCurrentKey(0);
    currentFocus();

    props.setCurrentPromptKey(getCurrent.key().key);
  };

  const prevWord = () => {
    setCurrent.wordStatus(WordStatus.unstart, false);
    setCurrent.keyFocus(KeyFocus.back);
    setCurrentWord(currentWord() - 1);
    setCurrentKey(getCurrent.nbrKeys());
    setCurrent.wordStatus(WordStatus.pending, true);
    setCurrent.keyFocus(KeyFocus.focus);
  };

  const prevParagraph = () => {
    setCurrent.wordStatus(WordStatus.unstart, false);
    setCurrent.keyFocus(KeyFocus.back);
    setCurrentParagraph(currentParagraph() - 1);
    setCurrentWord(getCurrent.nbrWords());
    setCurrentKey(getCurrent.nbrKeys());
    setCurrent.wordStatus(WordStatus.pending, true);
    setCurrent.keyFocus(KeyFocus.focus);
  };

  const prev = (): boolean => {
    if (currentKey() > 0) {
      setCurrent.keyFocus(KeyFocus.back);
      setCurrentKey(currentKey() - 1);
      setCurrent.keyFocus(KeyFocus.focus);
    } else if (currentWord() > 0) {
      prevWord();
    } else if (currentParagraph() > 0) {
      prevParagraph();
    } else {
      return false;
    }
    return true;
  };
  /* *** */

  const pause = () => {
    setCurrent.wordStatus(WordStatus.pause, false);
    props.setStatus({ kind: TypingStatusKind.pause });
  };

  /* Key Handlers */

  const currentKeyMetrics = (typed: string) =>
    getKeyMetrics({
      typed,
      expected: getCurrent.key().key,
    });

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

  const handleInputEvent = (event: Event) => {
    const timestamp = performance.now();
    const input = event.target as HTMLInputElement;
    const value = input.value;
    input.value = "";
    return handleKeypress(value, timestamp);
  };

  const handleBackPress = (timestamp: number) => {
    if (!prev()) return;
    const deletedKeyMetrics = makeDeletedKeyMetrics({
      expected: getCurrent.key().key,
      status: getCurrent.key().status,
    });
    setStatus({
      key: {
        keyMetrics: deletedKeyMetrics,
        timestamp,
        focusIsSeparator: getCurrent.isSeparator(),
      },
    });
  };

  const handleKeypress = (typed: string, timestamp: number) => {
    const keyMetrics = currentKeyMetrics(typed);
    if (keyMetrics[1].kind === KeyEventKind.ignore) {
      return;
    } else {
      if (getCurrent.word().status !== WordStatus.pending) {
        setCurrent.wordStatus(WordStatus.pending, true);
      }
      if (keyMetrics[1].kind === KeyEventKind.added) {
        setCurrent.keyStatus(keyMetrics[1].status.kind);
      }
      let [hasNext, typingWord] = next();
      setStatus({
        key: {
          keyMetrics,
          timestamp,
          focusIsSeparator: getCurrent.isSeparator(),
        },
        word: typingWord || { kind: TypingWordKind.ignore },
      });
      // NOTE: hum.. extra ifs..
      if (
        props.extraEnd &&
        props.extraEnd[0] === currentParagraph() &&
        props.extraEnd[1] === currentWord()
      ) {
        props.onOver();
      }
      if (!hasNext) {
        setCurrent.wordStatus(WordStatus.over, false);
        setCurrent.keyFocus(KeyFocus.unfocus);
        props.onOver();
      }
    }
    props.setCurrentPromptKey(getCurrent.key().key);
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
    currentParagraph(),
    currentWord(),
    currentKey(),
  ];

  /* *** */

  onMount(() => {
    /* NOTE: input event to handle android/chrome */
    input.addEventListener("input", handleInputEvent);
    input.addEventListener("keydown", handleKeyDown);
    input.addEventListener("keyup", handleKeyUp);
    currentFocus();
    props.setFocus(() => input.focus());
    props.setReset(reset);
    props.setPause(pause);
    props.setGetPosition(getPositions);
    props.setCurrentPromptKey(getCurrent.key().key);
    input.focus();
  });

  onCleanup(() => {
    setCurrent.keyFocus(KeyFocus.unfocus);
    setCurrent.wordStatus(WordStatus.unstart, false);
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

export default TypingEngine;
