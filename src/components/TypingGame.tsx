import Content from "./Content.ts";
import TypingEngine, {
  type TypingStatus,
  TypingStatusKind,
} from "./TypingEngine";
import Prompt from "./Prompt.tsx";
import TypingNav from "./TypingNav.tsx";
import Keyboard, { type TypingKeyboardRef } from "./TypingKeyboard.tsx";
import {
  createTypingMetrics,
  createTypingMetricsPreview,
  createTypingMetricsState,
  type TypingMetricsState,
} from "./TypingMetrics.ts";
import TypingMetricsResume from "./TypingMetricsResume.tsx";

import { css } from "solid-styled";
import { Show, createEffect, createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { updateKeyProjection, type KeysProjection } from "./KeyMetrics.ts";
import KeypressMetrics from "./KeypressMetrics.ts";

type TypingGameProps = { source: string };

// https://icon-sets.iconify.design/line-md/?query=play

const TypingGame = ({ source }: TypingGameProps) => {
  const paragraphs = Content.parse(source);
  const [paraStore, setParaStore] = createStore(Content.deepClone(paragraphs));

  const [currentPromptKey, setCurrentPromptKey] = createSignal("");
  const [status, setStatus] = createSignal<TypingStatus>({
    kind: TypingStatusKind.unstart,
  });

  const pause = () => setStatus({ kind: TypingStatusKind.pause });

  /* Metrics */

  const [preview, setPreview] = createSignal(createTypingMetricsPreview());
  const [typingMetrics, setTypingMetrics] = createSignal(createTypingMetrics());
  const updateMetrics = createTypingMetricsState(setPreview, setTypingMetrics);
  createEffect(
    (typingMetricsState: TypingMetricsState) =>
      typingMetricsState({ status: status() }),
    updateMetrics,
  );

  const keyMetrics = createMemo(
    (projection: KeysProjection) =>
      updateKeyProjection({ projection, status: status() }),
    {},
  );

  const reset = () => {
    setParaStore(Content.deepClone(paragraphs));
    setStatus({ kind: TypingStatusKind.unstart });
    resetInput();
    focus!();
  };

  let resetInput: () => void;
  let focus: () => void;
  let keyboard: TypingKeyboardRef;

  /* ***  */

  css`
    .mega {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  `;
  return (
    <Show
      when={status().kind !== TypingStatusKind.over}
      fallback={<TypingMetricsResume preview={preview()} metrics={typingMetrics()} />}
    >
      <div class="mega" onClick={() => focus()}>
        <TypingEngine
          paragraphs={paraStore}
          setParagraphs={setParaStore}
          status={status()}
          setStatus={setStatus}
          setFocus={(f) => (focus = f)}
          setReset={(r) => (resetInput = r)}
          setCurrentPromptKey={setCurrentPromptKey}
          onKeyDown={keyboard!?.keyDown}
          onKeyUp={keyboard!?.keyUp}
        />
        <Prompt paragraphs={paraStore} />
        <TypingNav
          isPaused={status().kind !== TypingStatusKind.pending}
          preview={preview()}
          onPause={pause}
          onReset={reset}
        />
        <Keyboard
          metrics={keyMetrics()}
          currentKey={currentPromptKey()}
          layout="qwerty"
          ref={(k) => (keyboard = k)}
        />
      </div>
    </Show>
  );
};

export default TypingGame;
