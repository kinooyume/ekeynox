import { css } from "solid-styled";
import { Show, createComputed, createSignal } from "solid-js";

import { type Paragraphs } from "../content/Content.ts";

import UserInput from "../seqInput/UserInput";
import Prompt from "../prompt/Prompt.tsx";
import Keyboard, { type KeyboardHandler } from "../keyboard/TypingKeyboard.tsx";

import { type KeysProjection } from "../metrics/KeysProjection.ts";
import type { Translator } from "../App.tsx";
import type { Metrics } from "../metrics/Metrics.ts";
import { type PendingMode } from "../AppState.ts";
import { type TypingEventType } from "./TypingEvent.ts";
import type { SetStoreFunction } from "solid-js/store";
import type { HigherKeyboard } from "../keyboard/KeyboardLayout.ts";
import type { JSX } from "solid-js";

type TypingGameProps = {
  t: Translator;
  typingEvent: TypingEventType;

  kbLayout: HigherKeyboard;
  keySet: Set<string>;
  showKb: boolean;

  paragraphs: Paragraphs;
  // Uniquement prompt
  setParagraphs: SetStoreFunction<Paragraphs>;

  keyMetrics: KeysProjection;

  onKeyDown: (key: string) => void;
  onKeyUp: (key: string) => void;
  onAddKey: (key: string, timestamp: number) => void;

  promptKey: string;

  onOver: (metrics: Metrics, content: PendingMode) => void;
  onExit: () => void;

  children: JSX.Element;
};

const TypingGame = (props: TypingGameProps) => {
  /* *** */

  /* Ghost Mode */
  // ==> Disable at shuffle
  // ==> reset at reset

  // let ghostCursor: Cursor | undefined;
  // let cleanupGhost = () => {};
  //
  // if (props.status.kind === PendingKind.redo) {
  //   setShowGhost(true);
  //   ghostCursor = makeCursor({
  //     paragraphs: para,
  //     setParagraphs: setParaStore,
  //   });
  //
  //   const ghostInput = TimerInput({
  //     cursor: ghostCursor,
  //     sequence: props.status.prev.getSequence(),
  //     setCleanup: (cleanup) => (cleanupGhost = cleanup),
  //   });
  //
  //   createEffect((timer: TimerEffectStatus) => {
  //     if (!showGhost()) return timer;
  //     return timer({ status: status() });
  //   }, ghostInput);
  // }
  // /* *** */
  //
  /* Words count, Speed only - Apres c'est bien aussi en timer */

  // const [totalWordsCount, setTotalWordsCount] = createSignal<number>(0);

  // Dep: contentHandler/ data.wordsCount
  // createEffect(() => {
  //   setTotalWordsCount(contentHandler().data.wordsCount);
  // });

  /* Timer Only Stuff */

  // // NOTE: should not exist without timer
  // const [timeCounter, setTimeCounter] = createSignal<number | undefined>(
  //   props.status.mode.kind === GameModeKind.timer
  //     ? props.status.mode.time
  //     : undefined,
  // );

  /* Progress */

  //  const [progress, setProgress] = createSignal(0);

  // if (props.status.mode.kind === GameModeKind.timer) {
  //   // const totalProgress = props.status.mode.time;
  //   // createComputed(() => {
  //   //   setProgress(((timeCounter() || 0) / totalProgress) * 100);
  //   // });
  // } else {
  //   createComputed(() => {
  //     setProgress(100 - (wordsCount() / totalWordsCount()) * 100);
  //   });
  // }

  /* Keyboard */

  //   const [kbLayout, setKbLayout] = createSignal(
  //     props.kbLayout(contentHandler().data.keySet),
  //   );
  //
  //   createComputed(() => {
  //     const layout = props.kbLayout(contentHandler().data.keySet);
  //     setKbLayout(layout);
  //   });

  /* Over */

  //   const over = () => {
  //     const position = getPosition();
  //     setStatus({ kind: TypingEventKind.over });
  //     props.onOver(
  //       {
  //         // timer uniquement
  //         paragraphs: cleanParagraphs(paraStore, position),
  //         wordsCount: totalWordsCount(),
  //         gameOptions: props.gameOptions,
  //         typing: typingMetrics(),
  //         keys: keyMetrics(),
  //       },
  //       props.status.mode,
  //     );
  //   };

  /* Extra End: timer infinite, time to call the over fn */
  // NOTE: shitty way to handle that

  //Loop
  //
  // ==> Peut reagir au cursor ?
  // ==> au WordsCount ?
  // ==> Ouai on pourrait  avoir ça
  // le content va donner WordsLength du coup
  //  const [extraEnd, setExtraEnd] = createSignal<[number, number] | undefined>(
  //  undefined,
  // );

  /* *** */
  // NOTE:
  // ==> Timer Only
  // Et du coup ! Ca nous virerais ça
  // let onPromptEnd = over;

  // Infinite or Finite Paragraphs
  // if (
  //   props.status.mode.kind === GameModeKind.timer &&
  //   props.status.mode.behavior === ContentBehavior.loop
  // ) {
  //   updateContent();
  //   onPromptEnd = updateContent;
  // }

  /* *** */

  // // NOTE: no reactivity on duration
  // if (props.status.mode.kind === GameModeKind.timer) {
  //   // const timerOver = TimerOver.create({
  //   //   duration: props.status.mode.time,
  //   //   onOver: over,
  //   //   setCleanup: (cleanup) => (cleanupTimer = cleanup),
  //   //   updateCounter: setTimeCounter,
  //   // });
  //   // const timerEffect = Timer.createEffect(timerOver);
  //   //
  //   // createEffect((timer: TimerEffectStatus) => {
  //   //   return timer({ status: status() });
  //   // }, timerEffect);
  // }

  /* *** */

  // const [status, setStatus] = createSignal<TypingEventType>({
  //   kind: TypingEventKind.unstart,
  // });

  /* Metrics */

  // const [stat, setStat] = createSignal(KeypressMetrics.createStatProjection());
  // const [typingMetrics, setTypingMetrics] = createSignal(createTypingMetrics());
  //
  // let cleanupMetrics = () => {};
  // const updateMetrics = createTypingMetricsState(
  //   setStat,
  //   setTypingMetrics,
  //   (cleanup) => {
  //     cleanupMetrics = cleanup;
  //   },
  // );
  // createEffect(
  //   (typingMetricsState: TypingMetricsState) =>
  //     typingMetricsState({ event: status() }),
  //   updateMetrics,
  // );
  //
  // const keyMetrics = createMemo(
  //   (projection: KeysProjection) =>
  //     updateKeyProjection({ projection, status: status() }),
  //   {},
  // );

  /* *** */

  /* *** */
  // const resetGhost = () => {
  //   if (!ghostCursor) return;
  //   ghostCursor.positions.set.paragraph(0);
  //   ghostCursor.positions.set.word(0);
  //   ghostCursor.positions.set.key(0);
  // };

  let focus: () => void;

  let keyboard: KeyboardHandler;
  let navHandler: KeyboardHandler;

  let onKeyDown = (key: string) => {
    keyboard!.keyDown(key);
    // navHandler.keyDown(key);
    props.onKeyDown(key);
  };

  let onKeyUp = (key: string) => {
    keyboard!.keyUp(key);
    props.onKeyUp(key);
  };
  /* ***  */

  // onCleanup(() => {
  //   // cleanupGhost();
  //   // cleanupTimer();
  //   // cleanupMetrics();
  //   //setStatus({ kind: TypingEventKind.unstart });
  // });

  /* *** */

  /* Keyboard */
  // ==> TypingGame ?

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

      <Prompt
        paragraphs={props.paragraphs}
        setParagraphs={props.setParagraphs}
      />
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
