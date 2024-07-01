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
  untrack,
} from "solid-js";
import type { Metrics } from "../metrics/Metrics";
import TypingGame from "./TypingGame";
import type { ContentHandler } from "../content/TypingGameSource";
import { createStore } from "solid-js/store";
import Content, { type Paragraphs } from "../content/Content";
import makeCursor, { type Cursor, type Position } from "../cursor/Cursor";
import { TypingEventKind, type TypingEventType } from "./TypingEvent";
import UserNavHooks from "../cursor/UserNavHooks";
import type { CursorNavType, ExtraWordHooks } from "../cursor/CursorNav";
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
import TimerInput from "../seqInput/TimerInput";
import type { TimerEffectStatus } from "../timer/Timer";
import {
  createWordMetricsState,
  type WordMetrics,
} from "../metrics/PromptWordMetrics";
import { PendingKind, PendingMode, PendingStatus } from "~/appState/appState";
import { ContentGeneration, GameOptions } from "~/gameOptions/gameOptions";
import { HigherKeyboard } from "~/settings/keyboardLayout";
import { GameModeKind } from "~/gameOptions/gameModeKind";
import { useI18n } from "~/settings/i18nProvider";
import TypingHeaderNav, { LeavingFn } from "./TypingHeaderNav";

type TypingGameManagerProps = {
  status: PendingStatus;
  gameOptions: GameOptions;
  start: (options: GameOptions) => void;
  kbLayout: HigherKeyboard;
  showKb: boolean;
  onOver: (metrics: Metrics, mode: PendingMode) => void;
  onExit: () => void;
};

const TypingGameManager = (props: TypingGameManagerProps) => {
  const [contentHandler, setContentHandler] = createSignal<ContentHandler>(
    props.status.mode.getContent(),
  );

  const t = useI18n();
  const [paraStore, setParaStore] = createStore<Paragraphs>(
    Content.deepClone(contentHandler().data.paragraphs),
  );

  /* Cursor */

  const [cursor, setCursor] = createSignal<Cursor>(
    makeCursor({
      setParagraphs: setParaStore,
      paragraphs: paraStore,
    }),
  );

  /* *** */

  // NOTE: wordsCount should be in Metrics ?

  /* KeyPress: from input to Typing Event + promptKey */
  const [promptKey, setPromptKey] = createSignal<string>("");
  const [wordsCount, setWordsCount] = createSignal<number>(0);

  // Also trigger appendContent, at the half content
  const [totalWordsCount, setTotalWordsCount] = createSignal(
    contentHandler().data.wordsCount,
  );

  const incrementWordsCount = () => setWordsCount(wordsCount() + 1); // next
  const decrementWordsCount = () => setWordsCount(wordsCount() - 1); // prev

  let setWpm = ({ wpm, duration }: { wpm: number; duration: number }) => {
    const { paragraph, word, key } = cursor().positions.get();
    setParaStore(paragraph, word, "wpm", wpm);
    setParaStore(paragraph, word, "spentTime", duration);
  };

  // By Word WPM
  let wordWpmTimer: undefined | WordMetrics = undefined;

  const newWordWpmTimer = () => {
    wordWpmTimer = createWordMetricsState({
      word: cursor().get.word(),
      setWpm,
    })({
      status: WordStatus.pending,
    });
  };

  // NOTE: On peut surement faire mieux, réagir au mot actuel
  const nextWordHooks: ExtraWordHooks = {
    enter: (word) => {
      if (!wordWpmTimer) return;
      wordWpmTimer = createWordMetricsState({ word, setWpm })({
        status: WordStatus.pending,
      });
    },
    leave: () => {
      if (!wordWpmTimer) return;
      wordWpmTimer = wordWpmTimer({ status: WordStatus.over });

      // setWordsCount(wordsCount() + 1);
    },
  };

  const prevWordHooks: ExtraWordHooks = {
    enter: (word) => {
      if (!wordWpmTimer) return;
      wordWpmTimer = createWordMetricsState({ word, setWpm })({
        status: WordStatus.pending,
      });
    },
    leave: () => {
      if (!wordWpmTimer) return;
      wordWpmTimer = wordWpmTimer({ status: WordStatus.over });
      //setWordsCount(wordsCount() - 1);
    },
  };
  const [cursorNav, setCursorNav] = createSignal<CursorNavType>(
    CursorNav({
      cursor: cursor(),
      hooks: UserNavHooks,
      nextWordHooks,
      prevWordHooks,
    }),
  );

  // pour le counter, on veut just enter/leave
  const [keypressHandler, setKeypressHandler] = createSignal(
    TypingKeypress(
      cursor(),
      cursorNav(),
      incrementWordsCount,
      decrementWordsCount,
    ),
  );

  createComputed(
    () => {
      setCursor(
        makeCursor({
          setParagraphs: setParaStore,
          paragraphs: paraStore,
        }),
      );
      setCursorNav(
        CursorNav({
          cursor: untrack(cursor),
          hooks: UserNavHooks,
          nextWordHooks,
          prevWordHooks,
        }),
      );

      setKeypressHandler(
        TypingKeypress(
          untrack(cursor),
          untrack(cursorNav),
          incrementWordsCount,
          decrementWordsCount,
        ),
      );
    },
    { defer: true },
  );

  /* Typing */
  const [typingEvent, setTypingEvent] = createSignal<TypingEventType>({
    kind: TypingEventKind.unstart,
  });

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
  };

  /* Typing Event management */

  const pause = () => {
    cursor().set.wordStatus(WordStatus.pause, false);
    if (wordWpmTimer) wordWpmTimer = wordWpmTimer({ status: WordStatus.pause });
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

  let headerLeavingAnimate: () => anime.AnimeTimelineInstance;
  const over = () => {
    // NOTE: peut etre le faire en mode "leave"
    //
    cursor().set.wordStatus(WordStatus.over, false);
    if (wordWpmTimer) wordWpmTimer({ status: WordStatus.over });
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

  const typingOver = () => {
    setTypingEvent({ kind: TypingEventKind.over });
    headerLeavingAnimate().finished.then(() => {
      over();
    });
  };

  createComputed(
    on(typingEvent, (event) => {
      switch (event.kind) {
        case TypingEventKind.unstart:
          if (wordWpmTimer) wordWpmTimer({ status: WordStatus.unstart });
          cursor().positions.reset();
          setPromptKey(cursor().get.key().key);
          break;
        case TypingEventKind.pending:
          if (!wordWpmTimer) {
            newWordWpmTimer();
          } else {
            wordWpmTimer = wordWpmTimer({ status: WordStatus.pending });
          }
          if (!event.next) {
            overMetrics();
            return typingOver();
          }
          setPromptKey(cursor().get.key().key);
          cursor().focus();
          break;
      }
    }),
  );

  /* Typing Actions (Header) */

  const resetGhost = () => {
    const cursor = ghostCursor();
    if (!cursor) return;
    cursor.positions.set.paragraph(0);
    cursor.positions.set.word(0);
    cursor.positions.set.key(0);
  };

  const reset = () => {
    wordWpmTimer && wordWpmTimer({ status: WordStatus.over });
    wordWpmTimer = undefined;
    resetGhost();

    setWordsCount(0);
    setParaStore(Content.deepClone(contentHandler().data.paragraphs));
    setTypingEvent({ kind: TypingEventKind.unstart });
  };

  /* Metrics */

  const [stat, setStat] = createSignal(KeypressMetrics.createStatProjection());
  const [typingMetrics, setTypingMetrics] = createSignal(createTypingMetrics());

  let cleanupMetrics = () => {};
  let overMetrics = () => {};
  const updateMetrics = createTypingMetricsState(
    setStat,
    setTypingMetrics,
    (cleanup) => (cleanupMetrics = cleanup),
    (over) => (overMetrics = over),
  );

  createComputed((typingMetricsState: TypingMetricsState) => {
    const metrics = typingMetricsState({ event: typingEvent() });
    return metrics;
  }, updateMetrics);

  const keyMetrics = createMemo(
    (projection: KeysProjection) =>
      updateKeyProjection({ projection, status: typingEvent() }),
    {},
  );

  /* NOTE: TIMER LOOP CONTENT */

  const appendContent = () => {
    const { data, next } = contentHandler();
    // TODO: add following option back
    const newContent = next();
    setTotalWordsCount(contentHandler().data.wordsCount);

    const newContentHandler = newContent(data);
    setContentHandler(newContentHandler);

    setParaStore(
      newContent({ ...data, paragraphs: paraStore }).data.paragraphs,
    );
  };

  createComputed(
    on(
      () => props.status.mode.kind,
      (gameMode) => {
        if (gameMode === GameModeKind.timer) {
          appendContent();
        }
      },
    ),
  );

  // should only be there at timer
  createComputed(
    on(wordsCount, () => {
      if (
        props.status.mode.kind === GameModeKind.timer &&
        wordsCount() >= totalWordsCount() / 2
      ) {
        appendContent();
      }
    }),
  );

  /* NOTE: TIMER LOOP CONTENT */

  /* Shuffle different from timer and speed */

  const shuffle = (loop: boolean) => {
    if (loop) {
      return () => {
        /* On devrait pouvoir lier ça au final */
        setContentHandler(contentHandler().new());
        appendContent();
        /* *** */
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
  /* **** */

  /* NOTE: REDO: GHOST MODE */

  // TODO: not good at all, should not be call when no redo needed
  // Donc on pourrait bien avoir une stratification, qui donne tout ça a un component en argument
  //
  const [ghostCursor, setGhostCursor] = createSignal<Cursor | undefined>(
    undefined,
  );
  const [cleanupGhost, setCleanupGhost] = createSignal(() => {});

  createComputed(
    on(
      () => props.status,
      (status) => {
        switch (status.kind) {
          case PendingKind.redo:
            const ghostCursor = makeCursor({
              paragraphs: paraStore,
              setParagraphs: setParaStore,
            });
            setGhostCursor(ghostCursor);
            const ghostInput = TimerInput({
              cursor: ghostCursor,
              sequence: status.prev.getSequence(),
              setCleanup: setCleanupGhost,
            });
            createEffect((timer: TimerEffectStatus) => {
              return timer({ status: typingEvent() });
            }, ghostInput);
            break;
          case PendingKind.new:
            cleanupGhost();
            setGhostCursor(undefined);
            break;
        }
      },
    ),
  );

  /* NOTE: REDO: GHOST MODE */

  onCleanup(() => {
    cursor().set.keyFocus(KeyFocus.unfocus);
    cursor().set.wordStatus(WordStatus.unstart, false);
    wordWpmTimer && wordWpmTimer({ status: WordStatus.unstart });
    cleanupMetrics();
    cleanupGhost();

    setTypingEvent({ kind: TypingEventKind.unstart });
  });

  return (
    <TypingGame
      t={t}
      typingEvent={typingEvent()}
      showKb={props.showKb}
      kbLayout={props.kbLayout}
      keySet={contentHandler().data.keySet}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onPause={pause}
      onAddKey={onAddKey}
      promptKey={promptKey()}
      paragraphs={paraStore}
      keyMetrics={keyMetrics()}
    >
      <Switch>
        <Match when={props.status.mode.kind === GameModeKind.speed} keyed>
          <TypingModeSpeed
            typingEvent={typingEvent()}
            stat={stat()}
            wordsCount={wordsCount()}
            totalWords={totalWordsCount()}
          >
            <TypingHelp
              t={t}
              keyboard={(k) => (onKeyboard = k)}
              isPaused={typingEvent().kind !== TypingEventKind.pending}
              onReset={reset}
            />
          </TypingModeSpeed>
        </Match>
        <Match when={props.status.mode.kind === GameModeKind.timer} keyed>
          <TypingModeTimer
            typingEvent={typingEvent()}
            stat={stat()}
            duration={(props.status.mode as any).time}
            onTimerEnd={typingOver}
          >
            <TypingHelp
              t={t}
              keyboard={(k) => (onKeyboard = k)}
              isPaused={typingEvent().kind !== TypingEventKind.pending}
              onReset={reset}
            />
          </TypingModeTimer>
        </Match>
      </Switch>
      <Portal mount={document.getElementById("header-nav-actions-portal")!}>
        <TypingHeaderNav
          start={props.start}
          gameOptions={props.gameOptions}
          setLeavingAnimate={(an) => (headerLeavingAnimate = an)}
        >
          <TypingHeaderActions
            paused={typingEvent().kind !== TypingEventKind.pending}
            isRedo={(props.status.kind as any) === PendingKind.redo}
            isGenerated={props.status.mode.isGenerated}
            onPause={pause}
            onReset={reset}
            onShuffle={shuffle(props.status.mode.kind === GameModeKind.timer)}
            onExit={props.onExit}
          />
        </TypingHeaderNav>
      </Portal>
    </TypingGame>
  );
};

export default TypingGameManager;
