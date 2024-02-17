import { createSignal, onCleanup, onMount, type Setter } from "solid-js";
import { WordStatus } from "./PromptWord.tsx";
import { KeyStatus } from "./PromptKey.tsx";
import { type Paragraphs } from "./Content.ts";
import type { SetStoreFunction } from "solid-js/store";

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

type KeyVariant =
  | { kind: KeyPressedKind.match; key: string }
  | { kind: KeyPressedKind.unmatch; key: string; pressed: string }
  | { kind: KeyPressedKind.deleted; key: string; wasCorrect: boolean };

export type TypingStatus =
  | { kind: TypingStatusKind.unstart }
  | { kind: TypingStatusKind.pending; keyPressed: KeyVariant }
  | { kind: TypingStatusKind.deleted; wasOn: string; wasCorrect: boolean }
  | { kind: TypingStatusKind.pause }
  | { kind: TypingStatusKind.over };

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
    nbrParagraphs: () => props.paragraphs.length - 1,
    nbrWords: () => props.paragraphs[currentParagraph()].length - 1,
    word: () => props.paragraphs[currentParagraph()][currentWord()],
    nbrKeys: () =>
      props.paragraphs[currentParagraph()][currentWord()].keys.length - 1,
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
    },
  };

  const nextWord = () => {
    setCurrent.wordStatus(WordStatus.over, false);
    setCurrentWord(currentWord() + 1);
    setCurrentKey(0);
    setCurrent.wordStatus(WordStatus.pending, true);
    setCurrent.keyStatus(KeyStatus.current);
  };

  const nextParagraph = () => {
    setCurrent.wordStatus(WordStatus.over, false);
    setCurrentParagraph(currentParagraph() + 1);
    setCurrentWord(0);
    setCurrentKey(0);
    setCurrent.wordStatus(WordStatus.pending, true);
    setCurrent.keyStatus(KeyStatus.current);
  };

  const next = () => {
    if (currentKey() < getCurrent.nbrKeys()) {
      setCurrentKey(currentKey() + 1);
      setCurrent.keyStatus(KeyStatus.current);
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
    setCurrent.keyStatus(KeyStatus.unset);
    setCurrentWord(currentWord() - 1);
    setCurrentKey(getCurrent.nbrKeys());
    setCurrent.wordStatus(WordStatus.pending, true);
    setCurrent.keyStatus(KeyStatus.current);
  };

  const prevParagraph = () => {
    setCurrent.wordStatus(WordStatus.unstart, false);
    setCurrent.keyStatus(KeyStatus.unset);
    setCurrentParagraph(currentParagraph() - 1);
    setCurrentWord(getCurrent.nbrWords());
    setCurrentKey(getCurrent.nbrKeys());
    setCurrent.wordStatus(WordStatus.pending, true);
    setCurrent.keyStatus(KeyStatus.current);
  };

  const prev = () => {
    if (currentKey() > 0) {
      setCurrent.keyStatus(KeyStatus.unset);
      setCurrentKey(currentKey() - 1);
      setCurrent.keyStatus(KeyStatus.current);
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

  // side effect, setCurrentKeyStatus
  const getKeyPressed = (key: string): KeyVariant => {
    const expected = getCurrent.key();
    if (key === expected.key) {
      setCurrent.keyStatus(KeyStatus.valid);
      return {
        kind: KeyPressedKind.match,
        key: expected.key,
      };
      // props.data[currentWord()].keyPressed(true); // word
    } else {
      setCurrent.keyStatus(KeyStatus.invalid);
      return {
        kind: KeyPressedKind.unmatch,
        key: expected.key,
        pressed: key,
      };
    }
  };

  const handleKeypress = (event: KeyboardEvent) => {
    props.onKeyDown(event.key);
    if (event.key === "Backspace") {
      props.setStatus({
        kind: TypingStatusKind.pending,
        keyPressed: {
          kind: KeyPressedKind.deleted,
          key: getCurrent.key().key,
          wasCorrect: getCurrent.key().status === KeyStatus.valid,
        },
      });
      prev();
    } else if (event.key.length === 1 || event.key === "Enter") {
      props.setStatus({
        kind: TypingStatusKind.pending,
        keyPressed: getKeyPressed(event.key),
      });
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
