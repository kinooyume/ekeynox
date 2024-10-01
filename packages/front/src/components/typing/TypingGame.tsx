import { css } from "solid-styled";
import { Show, createComputed, createSignal, on } from "solid-js";

import { type Paragraphs } from "../content/Content.ts";

import UserInput, { UserInputRef } from "../seqInput/UserInput";
import Prompt from "../prompt/Prompt.tsx";
import Keyboard, { type KeyboardHandler } from "../keyboard/TypingKeyboard.tsx";

import { type KeysProjection } from "../metrics/KeysProjection.ts";
import { type TypingEventType } from "./TypingEvent.ts";
import type { JSX } from "solid-js";
import { Translator } from "~/contexts/i18nProvider.tsx";
import { HigherKeyboard } from "~/settings/keyboardLayout.ts";
import { FocusType, useFocus } from "~/contexts/FocusProvider.tsx";

type TypingGameProps = {
  t: Translator;
  typingEvent: TypingEventType;

  kbLayout: HigherKeyboard;
  keySet: Set<string>;
  showKb: boolean;

  paragraphs: Paragraphs;

  keyMetrics: KeysProjection;

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
    keyboard!.keyDown(key);
    props.onKeyDown(key);
  };

  let onKeyUp = (key: string) => {
    keyboard!.keyUp(key);
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
        typingEvent={props.typingEvent}
        onKeyDown={props.showKb ? onKeyDown : props.onKeyDown}
        onKeyUp={props.showKb ? onKeyUp : props.onKeyUp}
        onKeyAdd={props.onAddKey}
        ref={setInputRef}
      />
      <Prompt paragraphs={props.paragraphs} />
      <Show when={props.showKb}>
        <Keyboard
          metrics={props.keyMetrics}
          currentKey={props.promptKey}
          layout={kbLayout()}
          ref={(k) => (keyboard = k)}
        />
      </Show>
      {props.children}
    </div>
  );
};

export default TypingGame;
