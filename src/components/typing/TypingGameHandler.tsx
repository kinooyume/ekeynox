import {
  Match,
  Switch,
  createComputed,
  createEffect,
  createMemo,
  createSignal,
  on,
  onCleanup,
  onMount,
} from "solid-js";
import type { Translator } from "../App";
import {
  ContentBehavior,
  PendingKind,
  type PendingMode,
  type PendingStatus,
} from "../AppState";
import { GameModeKind } from "../gameMode/GameMode";
import { type GameOptions } from "../gameMode/GameOptions";
import type { HigherKeyboard } from "../keyboard/KeyboardLayout";
import type { Metrics } from "../metrics/Metrics";
import TypingGame from "./TypingGame";
import type { ContentHandler } from "../content/TypingGameSource";
import { createStore } from "solid-js/store";
import Content, { type Paragraphs } from "../content/Content";
import makeCursor, { type Cursor, type Position } from "../cursor/Cursor";
import { TypingEventKind, type TypingEventType } from "./TypingEvent";
import UserNavHooks from "../cursor/UserNavHooks";
import type { CursorNavType } from "../cursor/CursorNav";
import CursorNav from "../cursor/CursorNav";
import { WordStatus } from "../prompt/PromptWord";
import { Portal } from "solid-js/web";
import { KeyFocus } from "../metrics/KeyMetrics";
import TypingKeypress from "./TypingKeypress";
import KeypressMetrics from "../metrics/KeypressMetrics";
import {
  createTypingMetrics,
  createTypingMetricsState,
  type TypingMetricsState,
} from "../metrics/TypingMetrics";
import {
  updateKeyProjection,
  type KeysProjection,
} from "../metrics/KeysProjection";
import type { KeyboardHandler } from "../keyboard/TypingKeyboard";
import TypingModeTimer from "./TypingModeTimer";
import TypingHelp from "./TypingHelp";
import TypingModeSpeed from "./TypingModeSpeed";
import TypingHeaderActions from "./TypingHeaderActions";

type TypingGameHandlerProps = {
  t: Translator;
  status: PendingStatus;
  setPending: (status: PendingStatus) => void;
  gameOptions: GameOptions;
  kbLayout: HigherKeyboard;
  showKb: boolean;
  onOver: (metrics: Metrics, mode: PendingMode) => void;
  onExit: () => void;
};

const TypingGameHandler = (props: TypingGameHandlerProps) => {
  const [contentHandler, setContentHandler] = createSignal<ContentHandler>(
    props.status.mode.getContent(),
  );

  const [paraStore, setParaStore] = createStore<Paragraphs>(
    Content.deepClone(contentHandler().data.paragraphs),
  );

  /* loop */

  // const [extraEnd, setExtraEnd] = createSignal<[number, number] | undefined>(
  //   undefined,
  // );

  // Side effect
  const onWordsLimit = () => {
    const { data, next } = contentHandler();
    // NOTE: CountentHandler
    const newContent = next();
    const lastParagraph = paraStore.length - 1;
    /*
    const lastWord = paraStore[lastParagraph].length - 1;
    // update 
    //setExtraEnd([lastParagraph, lastWord]);
    */
    // NOTE: create two keysets for the same content
    setContentHandler(newContent(data));
    setParaStore(
      newContent({ ...data, paragraphs: paraStore }).data.paragraphs,
    );
  };

  /* *** */

  /* Typing */

  /* Typing Event, cursor, cursorNav */

  const [typingEvent, setTypingEvent] = createSignal<TypingEventType>({
    kind: TypingEventKind.unstart,
  });

  const [cursor, setCursor] = createSignal<Cursor>(
    makeCursor({
      setParagraphs: setParaStore,
      paragraphs: paraStore,
    }),
  );

  createComputed(
    () =>
      setCursor(
        makeCursor({
          setParagraphs: setParaStore,
          paragraphs: paraStore,
        }),
      ),
    { defer: true },
  );

  const [cursorNav, setCursorNav] = createSignal<CursorNavType>(
    CursorNav({ cursor: cursor(), hooks: UserNavHooks }),
  );

  createComputed(
    () => setCursorNav(CursorNav({ cursor: cursor(), hooks: UserNavHooks })),
    { defer: true },
  );

  /* *** */

  // NOTE: wordsCount should be in Metrics

  /* KeyPress: from input to Typing Event + promptKey */
  const [promptKey, setPromptKey] = createSignal<string>("");
  const [wordsCount, setWordsCount] = createSignal<number>(0);

  const incrementWordsCount = () => setWordsCount(wordsCount() + 1);
  const decrementWordsCount = () => setWordsCount(wordsCount() - 1);

  const [keypressHandler, setKeypressHandler] = createSignal(
    TypingKeypress(
      cursor(),
      cursorNav(),
      incrementWordsCount,
      decrementWordsCount,
    ),
  );

  // Double call because of cursor/cursorNav
  createComputed(
    () =>
      setKeypressHandler(
        TypingKeypress(
          cursor(),
          cursorNav(),
          incrementWordsCount,
          decrementWordsCount,
        ),
      ),
    { defer: true },
  );

  // Can be Signal
  let onKeyboard: KeyboardHandler = {
    keyDown: () => {},
    keyUp: () => {},
  };

  /* Keyboard Listener */

  /* *** */
  const onKeyDown = (key: string) => {
    onKeyboard.keyDown(key);

    const event = keypressHandler().keyDown(key);
    if (!event) return;
    setTypingEvent(event);
  };

  const onKeyUp = (key: string) => {
    onKeyboard.keyUp(key);
  };

  const onAddKey = (key: string, timestamp: number) => {
    const event = keypressHandler().addKey(key, timestamp);
    if (!event) return;
    setTypingEvent(event);
    /* Timer Loop */
  };

  /* Typing Event management */

  const pause = () => {
    cursor().set.wordStatus(WordStatus.pause, false);
    setTypingEvent({ kind: TypingEventKind.pause });
  };

  // NOTE: ==> Timer Only
  const cleanParagraphs = (
    paragraphs: Paragraphs,
    { paragraph: pIndex, word: wIndex }: Position,
  ): Paragraphs => {
    const cleanParagraphs = paragraphs.slice(0, pIndex + 1);
    cleanParagraphs[pIndex] = paragraphs[pIndex].slice(0, wIndex + 1);
    return cleanParagraphs;
  };

  const typingOver = () => setTypingEvent({ kind: TypingEventKind.over });

  const over = () => {
    cursor().set.wordStatus(WordStatus.over, false);
    cursor().set.keyFocus(KeyFocus.unfocus);
    const position = cursor().positions.get();
    props.onOver(
      {
        paragraphs: cleanParagraphs(paraStore, position),
        wordsCount: wordsCount(),
        gameOptions: props.gameOptions,
        typing: typingMetrics(),
        keys: keyMetrics(),
      },
      props.status.mode,
    );
  };

  createComputed(
    on(typingEvent, (event) => {
      switch (event.kind) {
        case TypingEventKind.unstart:
          cursor().positions.reset();
          setPromptKey(cursor().get.key().key);
          break;
        case TypingEventKind.pending:
          if (!event.next) {
            setTypingEvent({ kind: TypingEventKind.over });
          }
          setPromptKey(cursor().get.key().key);
          cursor().focus();
          break;
        // case TypingEventKind.over:
        //   //console.log("yo?")
        //   // over();
        //   break;
      }
    }),
  );

  let focus = () => {};

  //  const reset = () => {
  // setParaStore(Content.deepClone(contentHandler().data.paragraphs));
  // setStatus({ kind: TypingStatusKind.unstart });
  //resetInput();
  // resetGhost();
  // focus!();
  //  };

  const reset = () => {
    // resetInput();
    setParaStore(Content.deepClone(contentHandler().data.paragraphs));
    setTypingEvent({ kind: TypingEventKind.unstart });
    focus!();
  };

  /* Typing Actions (Header) */

  const shuffle = (loop: boolean) => {
    if (loop) {
      return () => {
        setContentHandler(contentHandler().new());
        onWordsLimit();
        setParaStore(Content.deepClone(contentHandler().data.paragraphs));
        reset();
      };
    }
    return () => {
      setContentHandler(contentHandler().new());
      setParaStore(Content.deepClone(contentHandler().data.paragraphs));
      reset();
    };
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

  // NOTE: mixed metrics & over on typingEvent, to be sure of the order
  // ==> maybe we should merge all computed around typingEvent
  createComputed((typingMetricsState: TypingMetricsState) => {
    const metrics = typingMetricsState({ event: typingEvent() });
    /* intern */
    if (typingEvent().kind === TypingEventKind.over) {
      over();
    }
    return metrics;
  }, updateMetrics);

  const keyMetrics = createMemo(
    (projection: KeysProjection) =>
      updateKeyProjection({ projection, status: typingEvent() }),
    {},
  );

  /* *** */
  /* *** */

  onMount(() => {
    // cursor().focus();
  });

  onCleanup(() => {
    cursor().set.keyFocus(KeyFocus.unfocus);
    cursor().set.wordStatus(WordStatus.unstart, false);
    cleanupMetrics();

    setTypingEvent({ kind: TypingEventKind.unstart });
  });

  return (
    <TypingGame
      t={props.t}
      typingEvent={typingEvent()}
      showKb={props.showKb}
      kbLayout={props.kbLayout}
      keySet={contentHandler().data.keySet}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onAddKey={onAddKey}
      promptKey={promptKey()}
      paragraphs={paraStore}
      setParagraphs={setParaStore}
      keyMetrics={keyMetrics()}
      onOver={over}
      onExit={props.onExit}
    >
      <Switch>
        <Match when={props.status.mode.kind === GameModeKind.speed}>
          <TypingModeSpeed
            typingEvent={typingEvent()}
            stat={stat()}
            cursor={cursor()}
            wordsCount={wordsCount()}
            totalWords={contentHandler().data.wordsCount}
          >
            <TypingHelp
              t={props.t}
              keyboard={(k) => (onKeyboard = k)}
              isPaused={typingEvent().kind !== TypingEventKind.pending}
              onPause={() => pause()}
            />
          </TypingModeSpeed>
        </Match>
        <Match when={props.status.mode.kind === GameModeKind.timer}>
          <TypingModeTimer
            typingEvent={typingEvent()}
            stat={stat()}
            duration={(props.status.mode as any).time}
            onTimerEnd={typingOver}
          >
            <TypingHelp
              t={props.t}
              keyboard={(k) => (onKeyboard = k)}
              isPaused={typingEvent().kind !== TypingEventKind.pending}
              onPause={() => pause()}
            />
          </TypingModeTimer>
        </Match>
      </Switch>
      <Portal mount={document.getElementById("header-nav-actions-portal")!}>
        <TypingHeaderActions
          paused={typingEvent().kind !== TypingEventKind.pending}
          isRedo={(props.status.kind as any) === PendingKind.redo}
          isLoop={(props.status.mode as any).behavior === ContentBehavior.loop}
          isGenerated={props.status.mode.isGenerated}
          onPause={pause}
          onReset={reset}
          onShuffle={shuffle}
          onExit={props.onExit}
        />
      </Portal>
    </TypingGame>
  );
};

//   Diff entre new et redo
//   - Redo:  ghost option in actions, so more actions & multiple inputs

// Timer, add timer
// ==> new on over
//

// Content: et entre infinite ou pas (auto-shuffle)
//
export default TypingGameHandler;
