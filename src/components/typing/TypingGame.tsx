import { css } from "solid-styled";
import { Show, createComputed, createSignal } from "solid-js";

import { type Paragraphs } from "../content/Content.ts";

import UserInput from "../seqInput/UserInput";
import Prompt from "../prompt/Prompt.tsx";
import Keyboard, { type KeyboardHandler } from "../keyboard/TypingKeyboard.tsx";

import { type KeysProjection } from "../metrics/KeysProjection.ts";
import { type TypingEventType } from "./TypingEvent.ts";
import type { JSX } from "solid-js";
import { Translator } from "~/settings/i18nProvider.tsx";
import { HigherKeyboard } from "~/settings/keyboardLayout.ts";
import useClickOutside from "solid-click-outside";

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
  let focus: () => void;
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

  const [typingPrompt, setTypingPrompt] = createSignal<HTMLElement>();

  useClickOutside(typingPrompt, props.onPause);
  return (
    <div class="typing-game" onClick={() => focus()}>
      <UserInput
        typingEvent={props.typingEvent}
        onKeyDown={props.showKb ? onKeyDown : props.onKeyDown}
        onKeyUp={props.showKb ? onKeyUp : props.onKeyUp}
        onKeyAdd={props.onAddKey}
        setFocus={(f) => (focus = f)}
      />

      {/* TODO: Le prompt ne devrais pas setParaphs */}
      {/* actuellement utilisé pour les words wpm */}

      <div ref={setTypingPrompt}>
        <Prompt paragraphs={props.paragraphs} />
      </div>
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
