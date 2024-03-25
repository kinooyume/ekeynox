import { css } from "solid-styled";
import {
  Show,
  createComputed,
  createEffect,
  createMemo,
  createSignal,
} from "solid-js";
import { createStore } from "solid-js/store";

import Content from "../content/Content.ts";
import { type HigherKeyboard } from "../keyboard/KeyboardLayout.ts";

import TypingEngine, {
  type TypingStatus,
  TypingStatusKind,
} from "./TypingEngine";
import Prompt from "../prompt/Prompt.tsx";
import TypingNav from "./TypingNav.tsx";
import Keyboard, {
  type TypingKeyboardRef,
} from "../keyboard/TypingKeyboard.tsx";
import {
  createTypingMetrics,
  createTypingMetricsState,
  type TypingMetricsState,
} from "../metrics/TypingMetrics.ts";

import {
  updateKeyProjection,
  type KeysProjection,
} from "../metrics/KeysProjection.ts";
import KeypressMetrics from "../metrics/KeypressMetrics.ts";
import {
  GameModeKind,
  type GameModeContent,
  type GameOptions,
} from "../gameSelection/GameOptions";
import { createTimerEffect, type TimerEffect } from "../metrics/Timer.ts";
import type { Translator } from "../App.tsx";
import type { Metrics } from "../metrics/Metrics.ts";

type TypingGameProps = {
  t: Translator;
  content: GameModeContent;
  gameOptions: GameOptions;
  kbLayout: HigherKeyboard;
  onOver: (metrics: Metrics, content: GameModeContent) => void;
};

const TypingGame = (props: TypingGameProps) => {
  const [content, setContent] = createSignal(props.content.getContent());
  const [paraStore, setParaStore] = createStore(
    Content.deepClone(content().paragraphs),
  );

  const [currentPromptKey, setCurrentPromptKey] = createSignal("");
  const [status, setStatus] = createSignal<TypingStatus>({
    kind: TypingStatusKind.unstart,
  });

  const [kbLayout, setKbLayout] = createSignal(
    props.kbLayout(content().keySet),
  );

  createComputed(() => {
    const layout = props.kbLayout(content().keySet);
    setKbLayout(layout);
  });

  const over = () => {
    setStatus({ kind: TypingStatusKind.over });
    props.onOver(
      {
        content: { ...content(), paragraphs: paraStore },
        gameOptions: props.gameOptions,
        typing: typingMetrics(),
        keys: keyMetrics(),
      },
      props.content,
    );
  };

  /* Timer */

  // NOTE: should not exist without timer
  const [timeCounter, setTimeCounter] = createSignal(
    props.content.kind === GameModeKind.rabbit
      ? props.content.time.toFixed(0)
      : "",
  );

  // NOTE: no reactivity on timer
  if (props.content.kind === GameModeKind.rabbit) {
    const timerEffect = createTimerEffect({
      duration: props.content.time,
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
        t={props.t}
        isPaused={status().kind !== TypingStatusKind.pending}
        stat={stat()}
        onPause={() => pause()}
        onReset={reset}
      >
        <Show when={props.content.kind === GameModeKind.rabbit}>
          <p>{timeCounter()}</p>
        </Show>
      </TypingNav>
    </div>
  );
};

export default TypingGame;
