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
import {
  ContentTypeKind,
  WordsGenerationCategory,
  type GameOptions,
} from "../gameMode/GameOptions.ts";
import TimerOver from "../timer/TimerOver.ts";
import Timer, { type TimerEffectStatus } from "../timer/Timer.ts";
import type { Translator } from "../App.tsx";
import type { Metrics } from "../metrics/Metrics.ts";
import {
  type GameModeContent,
  type ContentHandler,
} from "../content/TypingGameSource.ts";
import { GameModeKind } from "../gameMode/GameMode.ts";

type TypingGameProps = {
  t: Translator;
  content: GameModeContent;
  gameOptions: GameOptions;
  prevMetrics?: Metrics;
  kbLayout: HigherKeyboard;
  onOver: (metrics: Metrics, content: GameModeContent) => void;
  onExit: () => void;
};

const TypingGame = (props: TypingGameProps) => {
  const [contentHandler, setContentHandler] = createSignal<ContentHandler>(
    props.content.getContent(),
  );

  const [totalWordsCount, setTotalWordsCount] = createSignal<number>(0);
  const [wordsCount, setWordsCount] = createSignal<number>(0);

  createEffect(() => {
    setTotalWordsCount(contentHandler().data.wordsCount);
  });

  const [paraStore, setParaStore] = createStore<Paragraphs>(
    Content.deepClone(contentHandler().data.paragraphs),
  );

  // NOTE: shitty way to handle that
  const [extraEnd, setExtraEnd] = createSignal<[number, number] | undefined>(
    undefined,
  );

  const updateContent = () => {
    const { data, next } = contentHandler();
    const newContent = next();
    const lastParagraph = paraStore.length - 1;
    const lastWord = paraStore[lastParagraph].length - 1;
    setExtraEnd([lastParagraph, lastWord]);
    // NOTE: create two keysets for the same content
    setContentHandler(newContent(data));
    setParaStore(
      newContent({ ...data, paragraphs: paraStore }).data.paragraphs,
    );
  };

  const newContent = () => {
    setContentHandler(props.content.getContent());
    // duplicate dettect if multiple content or not
    if (
      props.gameOptions.mode === GameModeKind.timer &&
      (props.gameOptions.generation.category ===
        WordsGenerationCategory.words1k ||
        props.gameOptions.generation.infinite)
    ) {
      updateContent();
    }
    setParaStore(Content.deepClone(contentHandler().data.paragraphs));
    reset();
  };

  const over = () => {
    const position = getPosition();
    setStatus({ kind: TypingStatusKind.over });
    props.onOver(
      {
        paragraphs: cleanParagraphs(paraStore, position),
        wordsCount: totalWordsCount(),
        gameOptions: props.gameOptions,
        typing: typingMetrics(),
        keys: keyMetrics(),
      },
      props.content,
    );
  };

  let onPromptEnd = over;

  /* timer stuff */
  // NOTE: probably too much condition
  if (
    props.gameOptions.mode === GameModeKind.timer &&
    (props.gameOptions.generation.category ===
      WordsGenerationCategory.words1k ||
      props.gameOptions.generation.infinite)
  ) {
    updateContent();
    onPromptEnd = updateContent;
  }
  /* *** */

  const [currentPromptKey, setCurrentPromptKey] = createSignal("");
  const [status, setStatus] = createSignal<TypingStatus>({
    kind: TypingStatusKind.unstart,
  });

  const [kbLayout, setKbLayout] = createSignal(
    props.kbLayout(contentHandler().data.keySet),
  );

  createComputed(() => {
    const layout = props.kbLayout(contentHandler().data.keySet);
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
    setParaStore(Content.deepClone(contentHandler().data.paragraphs));
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
  const [timeCounter, setTimeCounter] = createSignal<number | undefined>(
    props.content.kind === GameModeKind.timer ? props.content.time : undefined,
  );

  let cleanupTimer = () => {};

  // NOTE: no reactivity on duration
  if (props.content.kind === GameModeKind.timer) {
    const timerOver = TimerOver.create({
      duration: props.content.time,
      onOver: over,
      setCleanup: (cleanup) => (cleanupTimer = cleanup),
      updateCounter: setTimeCounter,
    });
    const timerEffect = Timer.createEffect(timerOver);

    createEffect((timer: TimerEffectStatus) => {
      return timer({ status: status() });
    }, timerEffect);
  }

  /* Progress */

  const [progress, setProgress] = createSignal(0);

  if (props.content.kind === GameModeKind.timer) {
    const totalProgress = props.content.time;
    createComputed(() => {
      setProgress((timeCounter() || 0) / totalProgress * 100);
    });
  } else {
    createComputed(() => {
      setProgress(100 - (wordsCount() / totalWordsCount()) * 100);
    });
  }

  /* *** */
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
        setStatus={setStatus}
        setFocus={(f) => (focus = f)}
        setReset={(r) => (resetInput = r)}
        setPause={(p) => (pause = p)}
        setGetPosition={(p) => (getPosition = p)}
        extraEnd={extraEnd()}
        setPromptKey={setCurrentPromptKey}
        setWordsCount={setWordsCount}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onOver={onPromptEnd}
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
        isGenerated={
          props.gameOptions.contentType.kind === ContentTypeKind.generation
        }
        isPaused={status().kind !== TypingStatusKind.pending}
        stat={stat()}
        keyboard={(k) => (navHandler = k)}
        onPause={() => pause()}
        onReset={reset}
        progress={progress()}
        onShuffle={newContent}
        onExit={props.onExit}
      >
        <Show when={props.content.kind === GameModeKind.timer}>
          <p>{Math.ceil((timeCounter() || 0) / 10)}</p>
        </Show>
      </TypingNav>
    </div>
  );
};

export default TypingGame;
