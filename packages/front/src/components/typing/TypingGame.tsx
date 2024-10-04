import type { JSX } from "solid-js";
import { Show, createComputed, createSignal, on } from "solid-js";
import { css } from "solid-styled";

import { Translator } from "~/contexts/i18nProvider.tsx";
import { FocusType, useFocus } from "~/contexts/FocusProvider.tsx";

import { type Paragraphs } from "~/typingContent/paragraphs/types";
import { type HigherKeyboard } from "~/typingKeyboard/keyboardLayout";

import { type TypingState } from "~/typingState";

import { type CharacterStats } from "~/typingStatistics/CharacterStats.ts";

import UserInput from "../seqInput/UserInput";
import Prompt from "../prompt/Prompt.tsx";
import Keyboard, { type KeyboardHandler } from "../virtualKeyboard/TypingKeyboard.tsx";

type TypingGameProps = {
  t: Translator;
  typingState: TypingState;

  kbLayout: HigherKeyboard;
  keySet: Set<string>;
  showKb: boolean;

  paragraphs: Paragraphs;

  keyMetrics: CharacterStats;

  onKeyDown: (key: string) => void;
  onKeyUp: (key: string) => void;
  onAddKey: (key: string, timestamp: number) => void;
  onPause: () => void;

  promptKey: string;

  children: JSX.Element;
};

// TODO: better handle no keyboard on keyDown/UP

const TypingGame = (props: TypingGameProps) => {
  const [inputRef, setInputRef] = createSignal<HTMLInputElement>();
  let keyboard: KeyboardHandler;

  let onKeyDown = (key: string) => {
    keyboard?.keyDown(key);
    props.onKeyDown(key);
  };

  let onKeyUp = (key: string) => {
    keyboard?.keyUp(key);
    props.onKeyUp(key);
  };

  const [kbLayout, setKbLayout] = createSignal(props.kbLayout(props.keySet));

  createComputed(() => {
    const layout = props.kbLayout(props.keySet);
    setKbLayout(layout);
  });

  css`
    .typing-game {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      height: calc(100% - 70px);
    }
  `;

  const { focus: globalFocus } = useFocus();

  createComputed(
    on(
      globalFocus,
      (gFocus) => {
        if (gFocus === FocusType.Hud) {
          // console.log("unfocus")
          inputRef()!.blur();
          props.onPause();
        } else {
          // console.log("focus")
          inputRef()?.focus();
        }
      },
      { defer: true },
    ),
  );
  return (
    <div class="typing-game">
      <UserInput
        typingState={props.typingState}
        onKeyDown={props.showKb ? onKeyDown : props.onKeyDown}
        onKeyUp={props.showKb ? onKeyUp : props.onKeyUp}
        onKeyAdd={props.onAddKey}
        ref={setInputRef}
      />
      <Prompt paragraphs={props.paragraphs} />
      <Show when={props.showKb}>
        <Keyboard
          metrics={props.keyMetrics} // keyProjections, typingProjections
          currentKey={props.promptKey} // peut etre lu
          layout={kbLayout()}
          ref={(k) => (keyboard = k)}
        />
      </Show>
      {props.children}
    </div>
  );
};

export default TypingGame;
