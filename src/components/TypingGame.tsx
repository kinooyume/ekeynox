import { css } from "solid-styled";
import {
  Show,
  createComputed,
  createEffect,
  createMemo,
  createSignal,
} from "solid-js";
import { createStore } from "solid-js/store";

import Content, { type ContentData } from "./Content.ts";
import KeyboardLayout from "./KeyboardLayout.ts";

import TypingEngine, {
  type TypingStatus,
  TypingStatusKind,
} from "./TypingEngine";
import Prompt from "./Prompt.tsx";
import TypingNav from "./TypingNav.tsx";
import Keyboard, { type TypingKeyboardRef } from "./TypingKeyboard.tsx";
import {
  createTypingMetrics,
  createTypingMetricsState,
  type TypingMetricsState,
} from "./TypingMetrics.ts";
import TypingMetricsResume from "./TypingMetricsResume";

import { updateKeyProjection, type KeysProjection } from "./KeysProjection.ts";
import KeypressMetrics from "./KeypressMetrics.ts";
import type { I18nContext } from "./App.tsx";
import { createTimerEffect, type TimerEffect } from "./Timer.ts";

type TypingGameProps = {
  getContent: () => ContentData;
  i18n: I18nContext;
  kb: string;
  timer?: number;
};

const TypingGame = (props: TypingGameProps) => {
  const [content, setContent] = createSignal(props.getContent());
  const [paraStore, setParaStore] = createStore(
    Content.deepClone(content().paragraphs),
  );

  const [currentPromptKey, setCurrentPromptKey] = createSignal("");
  const [status, setStatus] = createSignal<TypingStatus>({
    kind: TypingStatusKind.unstart,
  });

  const [kbLayout, setKbLayout] = createSignal(KeyboardLayout.getDefault());

  createComputed(() => {
    const layout = KeyboardLayout.create(props.kb, content().keySet);
    if (layout !== null) setKbLayout(layout);
    // TODO: manage error
  });

  const over = () => setStatus({ kind: TypingStatusKind.over });
  /* Timer */

  // NOTE: should not exist without timer
  const [timeCounter, setTimeCounter] = createSignal(
    props.timer?.toFixed(0) || "",
  );

  // NOTE: no reactivity on timer
  if (props.timer) {
    const timerEffect = createTimerEffect({
      duration: props.timer,
      onOver: over,
      updateCounter: setTimeCounter,
    });
    createEffect((timer: TimerEffect) => {
      return timer({ status: status() });
    }, timerEffect);
  }

  /* *** */

  /* Metrics */

  const [stat, setStat] = createSignal(KeypressMetrics.createStatProjection());
  const [typingMetrics, setTypingMetrics] = createSignal(createTypingMetrics());
  const updateMetrics = createTypingMetricsState(setStat, setTypingMetrics);
  createEffect(
    (typingMetricsState: TypingMetricsState) =>
      typingMetricsState({ status: status() }),
    updateMetrics,
  );

  createEffect(() => {});

  const keyMetrics = createMemo(
    (projection: KeysProjection) =>
      updateKeyProjection({ projection, status: status() }),
    {},
  );

  const reset = () => {
    setParaStore(Content.deepClone(content().paragraphs));
    setStatus({ kind: TypingStatusKind.unstart });
    resetInput();
    focus!();
  };

  let resetInput: () => void;
  let focus: () => void;
  let pause: () => void;
  let keyboard: TypingKeyboardRef;

  /* ***  */

  css`
    .mega {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }
  `;
  return (
    <Show
      when={status().kind !== TypingStatusKind.over}
      fallback={
        <TypingMetricsResume
          keyMetrics={keyMetrics()}
          paragraphs={paraStore}
          setParagraphs={setParaStore}
          layout={kbLayout()}
          metrics={typingMetrics()}
          onReset={reset}
          i18n={props.i18n}
        />
      }
    >
      <div class="mega" onClick={() => focus()}>
        <TypingEngine
          paragraphs={paraStore}
          setParagraphs={setParaStore}
          status={status()}
          setStatus={setStatus}
          setFocus={(f) => (focus = f)}
          setReset={(r) => (resetInput = r)}
          setPause={(p) => (pause = p)}
          setCurrentPromptKey={setCurrentPromptKey}
          onKeyDown={keyboard!?.keyDown}
          onKeyUp={keyboard!?.keyUp}
          onOver={over}
        />
        <Prompt paragraphs={paraStore} setParagraphs={setParaStore} />
        <Keyboard
          metrics={keyMetrics()}
          currentKey={currentPromptKey()}
          layout={kbLayout()}
          ref={(k) => (keyboard = k)}
        />
        <TypingNav
          isPaused={status().kind !== TypingStatusKind.pending}
          stat={stat()}
          onPause={pause!}
          onReset={reset}
        >
          <Show when={props.timer}>{timeCounter()}</Show>
        </TypingNav>
      </div>
    </Show>
  );
};

export default TypingGame;
