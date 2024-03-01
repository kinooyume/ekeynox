import { css } from "solid-styled";
import {
  Show,
  createComputed,
  createEffect,
  createMemo,
  createSignal,
} from "solid-js";
import { createStore } from "solid-js/store";


import Content from "./Content.ts";
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

type TypingGameProps = { source: string, i18n: I18nContext, kb: string, timer?: number  }

const TypingGame = (props: TypingGameProps) => {
  const [paragraphs, keySet] = Content.parse(props.source);
  const [paraStore, setParaStore] = createStore(Content.deepClone(paragraphs));

  const [currentPromptKey, setCurrentPromptKey] = createSignal("");
  const [status, setStatus] = createSignal<TypingStatus>({
    kind: TypingStatusKind.unstart,
  });

  const [kbLayout, setKbLayout] = createSignal(KeyboardLayout.getDefault());

  createComputed(() => {
    const layout = KeyboardLayout.create(props.kb, keySet);
    if (layout !== null) setKbLayout(layout);
    // TODO: manage error
  });

  /* Timer */
  createEffect(() => {
    if (props.timer) {
      const timer = setTimeout(() => {
        setStatus({ kind: TypingStatusKind.over });
      }, props.timer);
      return () => clearTimeout(timer);
    }
  })

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
        />
        <Prompt paragraphs={paraStore} setParagraphs={setParaStore} />
        <TypingNav
          isPaused={status().kind !== TypingStatusKind.pending}
          stat={stat()}
          onPause={pause!}
          onReset={reset}
        />
        <Keyboard
          metrics={keyMetrics()}
          currentKey={currentPromptKey()}
          layout={kbLayout()}
          ref={(k) => (keyboard = k)}
        />
      </div>
    </Show>
  );
};

export default TypingGame;
