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
  PromptKeyFocus,
} from "./KeyMetrics.ts";

export enum TypingStatusKind {
  unstart,
  pending,
  deleted,
  pause,
  over,
}

export type TypingPending = {
  keyMetrics: KeyTuple;
  timestamp: number;
  focusIsSeparator: boolean;
};

export type TypingStatus =
  | { kind: TypingStatusKind.unstart }
  | { kind: TypingStatusKind.pending; event: TypingPending }
  | { kind: TypingStatusKind.pause }
  | { kind: TypingStatusKind.over };

export type TypingEngineProps = {
  paragraphs: Paragraphs;
  setParagraphs: SetStoreFunction<Paragraphs>;
  onKeyDown: (key: string) => void;
  onKeyUp: (key: string) => void;
  setCurrentPromptKey: Setter<string>;
  status: TypingStatus;
  setStatus: Setter<TypingStatus>;
  setFocus: (focus: () => void) => void;
  setReset: (reset: () => void) => void;
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
    setCurrent.keyFocus(PromptKeyFocus.focus);
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
    isSeparator: () =>
      props.paragraphs[currentParagraph()][currentWord()].isSeparator,
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
    keyFocus: (focus: PromptKeyFocus) => {
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
    setCurrent.keyFocus(PromptKeyFocus.unfocus);
    setCurrentWord(currentWord() + 1);
    setCurrentKey(0);
    setCurrent.wordStatus(WordStatus.pending, true);
    setCurrent.keyFocus(PromptKeyFocus.focus);
  };

  const nextParagraph = () => {
    setCurrent.wordStatus(WordStatus.over, false);
    setCurrent.keyFocus(PromptKeyFocus.unfocus);
    setCurrentParagraph(currentParagraph() + 1);
    setCurrentWord(0);
    setCurrentKey(0);
    setCurrent.wordStatus(WordStatus.pending, true);
    setCurrent.keyFocus(PromptKeyFocus.focus);
  };

  const next = () => {
    if (currentKey() < getCurrent.nbrKeys()) {
      setCurrent.keyFocus(PromptKeyFocus.unfocus);
      setCurrentKey(currentKey() + 1);
      setCurrent.keyFocus(PromptKeyFocus.focus);
    } else if (currentWord() < getCurrent.nbrWords()) {
      nextWord();
    } else if (currentParagraph() < getCurrent.nbrParagraphs()) {
      nextParagraph();
    } else return false;
    return true;
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
    setCurrent.keyFocus(PromptKeyFocus.back);
    setCurrentWord(currentWord() - 1);
    setCurrentKey(getCurrent.nbrKeys());
    setCurrent.wordStatus(WordStatus.pending, true);
    setCurrent.keyFocus(PromptKeyFocus.focus);
  };

  const prevParagraph = () => {
    setCurrent.wordStatus(WordStatus.unstart, false);
    setCurrent.keyFocus(PromptKeyFocus.back);
    setCurrentParagraph(currentParagraph() - 1);
    setCurrentWord(getCurrent.nbrWords());
    setCurrentKey(getCurrent.nbrKeys());
    setCurrent.wordStatus(WordStatus.pending, true);
    setCurrent.keyFocus(PromptKeyFocus.focus);
  };

  const prev = (): boolean => {
    if (currentKey() > 0) {
      setCurrent.keyFocus(PromptKeyFocus.back);
      setCurrentKey(currentKey() - 1);
      setCurrent.keyFocus(PromptKeyFocus.focus);
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

  /* Key Handlers */

  const currentKeyMetrics = (typed: string) =>
    getKeyMetrics({
      typed,
      expected: getCurrent.key().key,
    });

  const setStatus = (event: TypingPending) =>
    props.setStatus({
      kind: TypingStatusKind.pending,
      event,
    });

  const handleKeypress = (event: KeyboardEvent) => {
    const timestamp = performance.now();
    const keyMetrics = currentKeyMetrics(event.key);
    props.onKeyDown(event.key);
    if (keyMetrics[1].kind === KeyStatus.ignore) {
      return;
    } else if (keyMetrics[1].kind === KeyStatus.back) {
      if (!prev()) return;
      const deletedKeyMetrics = makeDeletedKeyMetrics({
        expected: getCurrent.key().key,
        status: getCurrent.key().status,
      });
      setStatus({
        keyMetrics: deletedKeyMetrics,
        timestamp,
        focusIsSeparator: getCurrent.isSeparator(),
      });
    } else {
      if (keyMetrics[1].kind === KeyStatus.match) {
        setCurrent.keyStatus(PromptKeyStatus.correct);
      } else {
        setCurrent.keyStatus(PromptKeyStatus.incorrect);
      }
      let hasNext = next();
      setStatus({
        keyMetrics,
        timestamp,
        focusIsSeparator: getCurrent.isSeparator(),
      });
      if (!hasNext) {
        props.setStatus({ kind: TypingStatusKind.over });
      }
    }
    props.setCurrentPromptKey(getCurrent.key().key);
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
    props.setCurrentPromptKey(getCurrent.key().key);
  });

  onCleanup(() => {
    if (!input) return;
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
