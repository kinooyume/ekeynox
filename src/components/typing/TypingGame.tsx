import { css } from "solid-styled";
import {
  Show,
  createComputed,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
} from "solid-js";
import { createStore } from "solid-js/store";

import Content, { type Paragraphs } from "../content/Content.ts";
import { type HigherKeyboard } from "../keyboard/KeyboardLayout.ts";

import TypingEngine, {
  type TypingStatus,
  TypingStatusKind,
  type Position,
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
import { type GameOptions } from "../gameMode/GameOptions.ts";
import { createTimerEffect, type TimerEffect } from "../metrics/Timer.ts";
import type { Translator } from "../App.tsx";
import type { Metrics } from "../metrics/Metrics.ts";
import type { GameModeContent } from "../content/TypingGameSource.ts";
import { GameModeKind } from "../gameMode/GameMode.ts";
import { KeyFocus } from "../metrics/KeyMetrics.ts";

type TypingGameProps = {
  t: Translator;
  content: GameModeContent;
  gameOptions: GameOptions;
  kbLayout: HigherKeyboard;
  onOver: (metrics: Metrics, content: GameModeContent) => void;
  onExit: () => void;
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

  /* timer stuff */
  const cleanParagraphs = (
    paragraphs: Paragraphs,
    [pIndex, wIndex]: [number, number, number],
  ): Paragraphs => {
    const cleanParagraphs = paragraphs.slice(0, pIndex + 1);
    cleanParagraphs[pIndex] = paragraphs[pIndex].slice(0, wIndex + 1);
    return cleanParagraphs;
  };

  let getPosition: () => Position;

  const over = () => {
    const position = getPosition();
    setStatus({ kind: TypingStatusKind.over });
    props.onOver(
      {
        paragraphs: cleanParagraphs(paraStore, position),
        gameOptions: props.gameOptions,
        typing: typingMetrics(),
        keys: keyMetrics(),
      },
      props.content,
    );
  };

  /* Metrics */

  const [stat, setStat] = createSignal(KeypressMetrics.createStatProjection());
  const [typingMetrics, setTypingMetrics] = createSignal(createTypingMetrics());

  let cleanupMetrics = () => {};
  const updateMetrics = createTypingMetricsState(
    setStat,
    setTypingMetrics,
    (cleanup) => {
      cleanupMetrics = cleanup;
    },
  );
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
    setParaStore(Content.deepClone(content().paragraphs));
    setStatus({ kind: TypingStatusKind.unstart });
    resetInput();
    focus!();
  };

  let resetInput: () => void;
  let focus: () => void;
  let pause: () => void;
  let keyboard: TypingKeyboardRef;
  let navHandler: TypingKeyboardRef;

  let onKeyDown = (key: string) => {
    keyboard!.keyDown(key);
    navHandler.keyDown(key);
  };

  let onKeyUp = (key: string) => {
    keyboard!.keyUp(key);
    navHandler.keyUp(key);
  };
  /* ***  */

  /* Timer */

  // NOTE: should not exist without timer
  const [timeCounter, setTimeCounter] = createSignal(
    props.content.kind === GameModeKind.timer
      ? props.content.time.toFixed(0)
      : "",
  );

  let cleanupTimer = () => {};

  // NOTE: no reactivity on duration
  if (props.content.kind === GameModeKind.timer) {
    const timerEffect = createTimerEffect({
      duration: props.content.time,
      onOver: over,
      setCleanup: (cleanup) => (cleanupTimer = cleanup),
      updateCounter: setTimeCounter,
    });
    createEffect((timer: TimerEffect) => {
      return timer({ status: status() });
    }, timerEffect);
  }

  onCleanup(() => {
    cleanupTimer();
    cleanupMetrics();
    setStatus({ kind: TypingStatusKind.unstart });
  });

  /* *** */

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
        setGetPosition={(p) => (getPosition = p)}
        setCurrentPromptKey={setCurrentPromptKey}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
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
        keyboard={(k) => (navHandler = k)}
        onPause={() => pause()}
        onReset={reset}
        onExit={props.onExit}
      >
        <Show when={props.content.kind === GameModeKind.timer}>
          <p>{timeCounter()}</p>
        </Show>
      </TypingNav>
    </div>
  );
};

export default TypingGame;
