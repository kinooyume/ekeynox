// NOTE: peut etre separer l'input, navigation, etc
// de la verification
import { createEffect, createSignal, onCleanup, onMount, type Setter } from "solid-js";
import { WordStatus } from "./PromptWord.tsx";
import { KeyStatus } from "./PromptKey.tsx";
import { type MetaWord, type Metakey } from "./Content.ts";
import { type TypingMetrics } from "./TypingMetrics.ts";
import WpmCounter, { CounterStatus } from "./WpmCounter.ts";

export type TypingEngineRemoteControl = {
  reset: () => void;
  focus: () => void;
  pause: () => void;
};

export type TypingEngineProps = {
  data: Array<MetaWord>;
  onKeyDown: (key: string) => void;
  onKeyUp: (key: string) => void;
  status: TypingStatus;
  setStatus: Setter<TypingStatus>;
  metrics?: TypingMetrics;
};

export enum TypingStatus {
  unstart,
  pending,
  pause,
  over,
}

export type KeyPressed = [string, string];

const TypingEngine = (props: TypingEngineProps) => {
  let input: HTMLInputElement;
  const [keyPressed, setKeyPressed] = createSignal<KeyPressed>(["", ""]);

  /* Navigation */
  const [currentParagraph, setCurrentParagraph] = createSignal(0);
  const [currentWord, setCurrentWord] = createSignal(0);
  const [currentChar, setCurrentChar] = createSignal(0);

  const moveCursor = (source: Metakey, target: Metakey) => {
    source.set(KeyStatus.unset);
    target.set(KeyStatus.current);
  };

  const moveWord = (source: MetaWord, target: MetaWord) => {
    source.setStatus(WordStatus.done);
    source.setFocus(false);
    props.data[currentWord()].keypressed = 0;
    target.setStatus(WordStatus.pending);
    target.setFocus(true);
  };

  const next = () => {
    // next Char
    if (currentChar() < props.data[currentWord()].keys.length - 1) {
      //
      let nextChar = currentChar() + 1;
      setCurrentChar(nextChar);
      props.data[currentWord()].keys[nextChar].set(KeyStatus.current);
      // next Word
    } else if (
      currentChar() >= props.data[currentWord()].keys.length - 1 &&
      currentWord() < props.data.length - 1
    ) {
      let nextWord = currentWord() + 1;
      moveWord(props.data[currentWord()], props.data[nextWord]);
      setCurrentWord(nextWord);
      setCurrentChar(0);
      props.data[nextWord].keys[0].set(KeyStatus.current);
    } else {
      props.setStatus(TypingStatus.over);
    }
  };

  const prev = () => {
    const current = props.data[currentWord()].keys[currentChar()];
    // prev Char
    if (currentChar() > 0) {
      const prevChar = currentChar() - 1;
      const prev = props.data[currentWord()].keys[prevChar];
      setCurrentChar(prevChar);
      moveCursor(current, prev);
      // prev word
    } else if (currentChar() <= 0 && currentWord() > 0) {
      moveWord(props.data[currentWord()], props.data[currentWord() - 1]);
      setCurrentWord(currentWord() - 1);
      setCurrentChar(props.data[currentWord()].keys.length - 1);
      const prev = props.data[currentWord()].keys[currentChar()];
      moveCursor(current, prev);
    } else {
      reset();
    }
  };
  /* *** */

  /* Key Handlers */
  const compareKey = (key: string) => {
    const current = props.data[currentWord()].keys[currentChar()];
    if (key === current.props.key) {
      current.set(current.wasInvalid ? KeyStatus.corrected : KeyStatus.valid);
    } else {
      current.wasInvalid = true;
      current.set(KeyStatus.invalid);
    }
  };

  const handleKeypress = (event: KeyboardEvent) => {
    props.onKeyDown(event.key);
    if (event.key === "Backspace") {
      prev();
    } else if (event.key.length === 1 || event.key === "Enter") {
      console.log(props.status)
      if (props.status !== TypingStatus.pending) setPending();
      const expected = props.data[currentWord()].keys[currentChar()];
      setKeyPressed([expected.props.key, event.key]);
      props.data[currentWord()].keypressed++;
      // Metrics
      // if (counter.kind === CounterStatus.pending) {
      //   props.data[currentWord()].keypressed++;
      //   counter.action.strokeKey();
      // }
      compareKey(event.key);
      next();
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    props.onKeyUp(event.key);
  };

  /* *** */

  /* State Control */

  const setPending = () => {
    if (props.status === TypingStatus.pending) return;
    props.setStatus(TypingStatus.pending);
    props.data[0].setStatus(WordStatus.pending);
  };

  const reset = () => {
    props.setStatus(TypingStatus.unstart);
    props.data.forEach((word) => {
      word.setStatus(WordStatus.unset);
      word.setFocus(false);
      word.keys.forEach((char) => {
        char.wasInvalid = false;
        char.set(KeyStatus.unset);
      });
    });
    setCurrentWord(0);
    setCurrentChar(0);
    props.data[0].setFocus(true);
    props.data[0].keys[0].set(KeyStatus.current);
  };

  /* *** */

  onMount(() => {
    input.addEventListener("keydown", handleKeypress);
    input.addEventListener("keyup", handleKeyUp);
    props.data[0].setFocus(true);
    props.data[0].keys[0].set(KeyStatus.current);
    console.log(props)
    const metricProps = { status: props.status, keyPressed: keyPressed() }
    props.metrics?.(metricProps)
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
