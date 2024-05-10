import { css } from "solid-styled";
import { Show, createComputed, createSignal } from "solid-js";

import { type Paragraphs } from "../content/Content.ts";

import UserInput from "../seqInput/UserInput";
import Prompt from "../prompt/Prompt.tsx";
import Keyboard, { type KeyboardHandler } from "../keyboard/TypingKeyboard.tsx";

import { type KeysProjection } from "../metrics/KeysProjection.ts";
import type { Translator } from "../App.tsx";
import { type TypingEventType } from "./TypingEvent.ts";
import type { HigherKeyboard } from "../keyboard/KeyboardLayout.ts";
import type { JSX } from "solid-js";

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

  promptKey: string;

  onExit: () => void;

  children: JSX.Element;
};

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
    }
  `;

  return (
    <div class="typing-game" onClick={() => focus()}>
      <UserInput
        typingEvent={props.typingEvent}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onKeyAdd={props.onAddKey}
        setFocus={(f) => (focus = f)}
      />

      {/* TODO: Le prompt ne devrais pas setParaphs */}
      {/* actuellement utilisé pour les words wpm */}

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
