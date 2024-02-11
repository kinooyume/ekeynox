import { createSignal, onCleanup, onMount, type Setter } from "solid-js";
import { WordStatus } from "./PromptWord.tsx";
import { KeyStatus } from "./PromptKey.tsx";
import {
  type Paragraphs,
} from "./Content.ts";
import type { SetStoreFunction } from "solid-js/store";

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
  pause,
  over,
}

export type TypingStatus =
  | { kind: TypingStatusKind.unstart }
  | { kind: TypingStatusKind.pending; keyPressed: KeyPressed }
  | { kind: TypingStatusKind.pause }
  | { kind: TypingStatusKind.over };

export type KeyPressed = [string, string];

const TypingEngine = (props: TypingEngineProps) => {
  let input: HTMLInputElement;

  /* Navigation */
  const [currentParagraph, setCurrentParagraph] = createSignal(0);
  const [currentWord, setCurrentWord] = createSignal(0);
  const [currentKey, setCurrentKey] = createSignal(0);

  const currentFocus = () => {
    props.setParagraphs(currentParagraph(), currentWord(), "focus", true);
    props.setParagraphs(
      currentParagraph(),
      currentWord(),
      "keys",
      currentKey(),
      "status",
      KeyStatus.current,
    );
  };

  const getCurrent = {
    paragraph: () => props.paragraphs[currentParagraph()],
    nbrWords: () => props.paragraphs[currentParagraph()].length - 1,
    word: () => props.paragraphs[currentParagraph()][currentWord()],
    nbrKeys: () => props.paragraphs[currentParagraph()][currentWord()].keys.length - 1,
    key: () =>
      props.paragraphs[currentParagraph()][currentWord()].keys[currentKey()],
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
    wordStatus: (status: WordStatus, focus: boolean) => {
      props.setParagraphs(currentParagraph(), currentWord(), "status", status);
      props.setParagraphs(currentParagraph(), currentWord(), "focus", focus);
    }
  };

  const next = () => {
    // next Char
    const nbrKeys = getCurrent.nbrKeys();
    if (currentKey() < nbrKeys) {
      setCurrentKey(currentKey() + 1);
      setCurrent.keyStatus(KeyStatus.current);
      // next Word
    } else if (
      currentKey() >= nbrKeys &&
      currentWord() < getCurrent.nbrWords()
    ) {
      setCurrent.wordStatus(WordStatus.over, false);
      setCurrentWord(currentWord() + 1);
      setCurrentKey(0);
      setCurrent.wordStatus(WordStatus.pending, true);
      setCurrent.keyStatus(KeyStatus.current);
    } else {
      props.setStatus({ kind: TypingStatusKind.over });
    }
  };

  const prev = () => {
    // prev Key
    if (currentKey() > 0) {
      setCurrent.keyStatus(KeyStatus.unset);
      setCurrentKey(currentKey() - 1);
      setCurrent.keyStatus(KeyStatus.current);
      // prev word
    } else if (currentKey() <= 0 && currentWord() > 0) {
      setCurrent.wordStatus(WordStatus.unstart, false);
      setCurrent.keyStatus(KeyStatus.unset);
      setCurrentWord(currentWord() - 1);
      setCurrentKey(getCurrent.nbrKeys());
      setCurrent.wordStatus(WordStatus.pending, true);
      setCurrent.keyStatus(KeyStatus.current);
    } else { // prev Paragraph
      reset();
    }
  };
  /* *** */

  /* Key Handlers */

  const handleKeypress = (event: KeyboardEvent) => {
    props.onKeyDown(event.key);
    if (event.key === "Backspace") {
      prev();
    } else if (event.key.length === 1 || event.key === "Enter") {
      const expected = getCurrent.key();
      props.setStatus({
        kind: TypingStatusKind.pending,
        keyPressed: [event.key, expected.key],
      });
      /* Should be moved ? */
      if (event.key === expected.key) {
        setCurrent.keyStatus(KeyStatus.valid);
        // props.data[currentWord()].keyPressed(true); // word
      } else {
        setCurrent.keyStatus(KeyStatus.invalid);
      }
      /* *** */
      next();
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    props.onKeyUp(event.key);
  };

  /* *** */

  /* State Control */

  const reset = () => {
    input.value = "";

    setCurrentParagraph(0);
    setCurrentWord(0);
    setCurrentKey(0);
    currentFocus();
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
