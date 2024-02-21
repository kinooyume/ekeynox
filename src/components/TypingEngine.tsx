import { createSignal, onCleanup, onMount, type Setter } from "solid-js";
import { WordStatus } from "./PromptWord.tsx";
import { type Paragraphs } from "./Content.ts";
import type { SetStoreFunction } from "solid-js/store";
import {
  KeyStatus,
  PromptKeyStatus,
  type KeyTuple,
  getKeyMetrics,
  makeDeletedKeyMetrics,
} from "./KeyMetrics.ts";

/* Typing Engine

- React to key events
- navigate through paragraph
- Update the store status, used by the Prompt component
- Update Typing Status

*/

export type TypingEngineProps = {
  paragraphs: Paragraphs;
  setParagraphs: SetStoreFunction<Paragraphs>;
  onKeyDown: (key: string) => void;
  onKeyUp: (key: string) => void;
  status: TypingStatus;
  setStatus: Setter<TypingStatus>;
  setFocus: (focus: () => void) => void;
  setReset: (reset: () => void) => void;
};

export enum TypingStatusKind {
  unstart,
  pending,
  deleted,
  pause,
  over,
}

export enum KeyPressedKind {
  match,
  unmatch,
  deleted,
}

export type KeyPressed = [string, string];

export type TypingStatus =
  | { kind: TypingStatusKind.unstart }
  | { kind: TypingStatusKind.pending; keyMetrics: KeyTuple; timestamp: number }
  | { kind: TypingStatusKind.pause }
  | { kind: TypingStatusKind.over };

const TypingEngine = (props: TypingEngineProps) => {
  let input: HTMLInputElement;

  /* Navigation */
  const [currentParagraph, setCurrentParagraph] = createSignal(0);
  const [currentWord, setCurrentWord] = createSignal(0);
  const [currentKey, setCurrentKey] = createSignal(0);

  /* Store Management */
  const currentFocus = () => {
    props.setParagraphs(currentParagraph(), currentWord(), "focus", true);
    setCurrent.keyFocus(true);
  };

  const getCurrent = {
    paragraph: () => props.paragraphs[currentParagraph()],
    nbrParagraphs: () => props.paragraphs.length - 1,
    nbrWords: () => props.paragraphs[currentParagraph()].length - 1,
    word: () => props.paragraphs[currentParagraph()][currentWord()],
    nbrKeys: () =>
      props.paragraphs[currentParagraph()][currentWord()].keys.length - 1,
    key: () =>
      props.paragraphs[currentParagraph()][currentWord()].keys[currentKey()],
  };

  const setCurrent = {
    keyStatus: (status: PromptKeyStatus) => {
      props.setParagraphs(
        currentParagraph(),
        currentWord(),
        "keys",
        currentKey(),
        "status",
        status,
      );
    },
    keyFocus: (focus: boolean) => {
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
  };

  /* *** */

  const nextWord = () => {
    setCurrent.wordStatus(WordStatus.over, false);
    setCurrent.keyFocus(false);
    setCurrentWord(currentWord() + 1);
    setCurrentKey(0);
    setCurrent.wordStatus(WordStatus.pending, true);
    setCurrent.keyFocus(true);
  };

  const nextParagraph = () => {
    setCurrent.wordStatus(WordStatus.over, false);
    setCurrent.keyFocus(false);
    setCurrentParagraph(currentParagraph() + 1);
    setCurrentWord(0);
    setCurrentKey(0);
    setCurrent.wordStatus(WordStatus.pending, true);
    setCurrent.keyFocus(true);
  };

  const next = () => {
    if (currentKey() < getCurrent.nbrKeys()) {
      setCurrent.keyFocus(false);
      setCurrentKey(currentKey() + 1);
      setCurrent.keyFocus(true);
    } else if (currentWord() < getCurrent.nbrWords()) {
      nextWord();
    } else if (currentParagraph() < getCurrent.nbrParagraphs()) {
      nextParagraph();
    } else {
      props.setStatus({ kind: TypingStatusKind.over });
    }
  };

  /* Prev */
  const reset = () => {
    input.value = "";

    setCurrentParagraph(0);
    setCurrentWord(0);
    setCurrentKey(0);
    currentFocus();
  };

  const prevWord = () => {
    setCurrent.wordStatus(WordStatus.unstart, false);
    setCurrent.keyFocus(false);
    setCurrentWord(currentWord() - 1);
    setCurrentKey(getCurrent.nbrKeys());
    setCurrent.wordStatus(WordStatus.pending, true);
    setCurrent.keyFocus(true);
  };

  const prevParagraph = () => {
    setCurrent.wordStatus(WordStatus.unstart, false);
    setCurrent.keyFocus(false);
    setCurrentParagraph(currentParagraph() - 1);
    setCurrentWord(getCurrent.nbrWords());
    setCurrentKey(getCurrent.nbrKeys());
    setCurrent.wordStatus(WordStatus.pending, true);
    setCurrent.keyFocus(true);
  };

  const prev = () => {
    if (currentKey() > 0) {
      setCurrent.keyFocus(false);
      setCurrentKey(currentKey() - 1);
      setCurrent.keyFocus(true);
    } else if (currentWord() > 0) {
      prevWord();
    } else if (currentParagraph() > 0) {
      prevParagraph();
    } else {
      reset();
    }
  };
  /* *** */

  /* Key Handlers */

  const currentKeyMetrics = (typed: string) =>
    getKeyMetrics({
      typed,
      expected: getCurrent.key().key,
    });

  const setStatus = (timestamp: number, keyMetrics: KeyTuple) => {
    props.setStatus({
      kind: TypingStatusKind.pending,
      keyMetrics,
      timestamp,
    });
  };

  const handleKeypress = (event: KeyboardEvent) => {
    const timestamp = performance.now();
    const keyMetrics = currentKeyMetrics(event.key);
    props.onKeyDown(event.key);
    if (keyMetrics[1].kind === KeyStatus.ignore) {
      return;
    } else if (keyMetrics[1].kind === KeyStatus.back) {
      prev();
      const deletedKeyMetrics = makeDeletedKeyMetrics({
        expected: getCurrent.key().key,
        status: getCurrent.key().status,
      });
      setStatus(timestamp, deletedKeyMetrics); // deleted
    } else {
      setStatus(timestamp, keyMetrics);
      if (keyMetrics[1].kind === KeyStatus.match) {
        setCurrent.keyStatus(PromptKeyStatus.correct);
      } else {
        setCurrent.keyStatus(PromptKeyStatus.incorrect);
      }
      next();
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    props.onKeyUp(event.key);
  };

  /* *** */

  onMount(() => {
    input.addEventListener("keydown", handleKeypress);
    input.addEventListener("keyup", handleKeyUp);
    currentFocus();
    props.setFocus(() => input.focus());
    props.setReset(reset);
  });

  onCleanup(() => {
    input.removeEventListener("keydown", handleKeypress);
    input.addEventListener("keyup", handleKeyUp);
  });
  /****/

  return (
    <input
      ref={input!}
      autofocus
      autocomplete="off"
      autocorrect="off"
      autocapitalize="none"
      aria-hidden
      style="position: fixed; top: -100px"
    ></input>
  );
};

export default TypingEngine;
