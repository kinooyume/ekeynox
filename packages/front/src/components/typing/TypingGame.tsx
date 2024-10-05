import type { JSXElement } from "solid-js";
import { Show, createComputed, createSignal, on } from "solid-js";
import { css } from "solid-styled";

import { FocusType, useFocus } from "~/contexts/FocusProvider.tsx";

import { type Paragraphs } from "~/typingContent/paragraphs/types";
import { type HigherKeyboard } from "~/typingKeyboard/keyboardLayout";
import { type CharacterStats } from "~/typingContent/character/stats";
import { type UserInputExtends } from "../seqInput/UserInput";

import Prompt from "../prompt/Prompt.tsx";
import Keyboard, {
  type KeyboardHandler,
} from "../virtualKeyboard/TypingKeyboard.tsx";

type TypingGameProps = {
  kbLayout: HigherKeyboard;
  keySet: Set<string>;
  showKb: boolean;

  paragraphs: Paragraphs;
  keyMetrics: CharacterStats;

  // TODO: can be remove
  onPause: () => void;

  Input: (props: UserInputExtends) => JSXElement;
  promptKey: string;

  children: JSXElement;
};

// TODO: better handle no keyboard on keyDown/UP

const TypingGame = (props: TypingGameProps) => {
  const [inputRef, setInputRef] = createSignal<HTMLInputElement>();
  let keyboard: KeyboardHandler;

  let onKeyDown = (key: string) => {
    keyboard?.keyDown(key);
  };

  let onKeyUp = (key: string) => {
    keyboard?.keyUp(key);
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

  // TODO: Go back to Manager
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
      <props.Input
        onKeyDown={props.showKb ? onKeyDown : () => {}}
        onKeyUp={props.showKb ? onKeyUp : () => {}}
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
