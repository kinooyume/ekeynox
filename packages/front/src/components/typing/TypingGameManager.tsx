import {
  Match,
  Switch,
  createComputed,
  createEffect,
  createMemo,
  createSignal,
  on,
  onCleanup,
  untrack,
} from "solid-js";
import { createStore } from "solid-js/store";
import { Portal } from "solid-js/web";

import type { ContentHandler } from "~/typingContent/TypingGameSource";

import makeCursor, { type Cursor, type Position } from "~/cursor/Cursor";
import CursorNav, {
  type CursorNavType,
  type ExtraWordHooks,
} from "~/cursor/CursorNav";
import UserNavHooks from "~/cursor/UserNavHooks";

import type { Metrics } from "~/typingMetrics/Metrics";
import KeypressMetrics from "~/typingMetrics/KeypressMetrics";
import {
  createTypingMetrics,
  createTypingMetricsState,
  type TypingMetricsState,
} from "~/typingMetrics/TypingMetrics";
import {
  updateKeyProjection,
  type KeysProjection,
} from "~/typingMetrics/KeysProjection";
import {
  createWordMetricsState,
  type WordMetrics,
} from "~/typingMetrics/PromptWordMetrics";

import type { KeyboardHandler } from "../keyboard/TypingKeyboard";

import TimerInput from "../seqInput/TimerInput";
import type { TypingTimer } from "~/timer/Timer";

import { type PendingStatus, PendingKind  } from "~/states";

import { TypingModeKind } from "~/typingOptions/typingModeKind";
import { TypingOptions } from "~/typingOptions/typingOptions";
import { TypingGameOptions } from "~/typingOptions/typingGameOptions";

import { HigherKeyboard } from "~/settings/keyboardLayout";

import { useI18n } from "~/contexts/i18nProvider";

import TypingModeTimer from "./TypingModeTimer";
import TypingModeSpeed from "./TypingModeSpeed";
import TypingHelp from "./TypingHelp";
import TypingHeaderActions from "./TypingHeaderActions";
import TypingGame from "./TypingGame";
import TypingHeaderNav from "./TypingHeaderNav";
import { TypingStateKind, type TypingState } from "~/typingState";
import makeKeypressHandler from "~/typingState/userKeypressHandler";
import { CharacterFocus } from "~/typingContent/character/types";
import { WordStatus } from "../resume/PromptWordResume";
import { Paragraphs } from "~/typingContent/paragraphs/types";
import { deepCloneParagraphs } from "~/typingContent/paragraphs";

type TypingGameManagerProps = {
  status: PendingStatus;
  gameOptions: TypingOptions;
  start: (options: TypingOptions) => void;
  kbLayout: HigherKeyboard;
  showKb: boolean;
  onOver: (metrics: Metrics, mode: TypingGameOptions) => void;
  onExit: () => void;
};

const TypingGameManager = (props: TypingGameManagerProps) => {
  const [contentHandler, setContentHandler] = createSignal<ContentHandler>(
    props.status.mode.getContent(),
  );

  const t = useI18n();
  const [paraStore, setParaStore] = createStore<Paragraphs>(
    deepCloneParagraphs(contentHandler().data.paragraphs!),
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

  let setWpm = ({ wpm, duration }: { wpm: number; duration: number }) => {
    const { paragraph, word, character: key } = cursor().positions.get();
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
    leave: (word) => {
      if (!word.isSeparator) setWordsCount(wordsCount() + 1);

      if (!wordWpmTimer) return;
      wordWpmTimer = wordWpmTimer({ status: WordStatus.over });
    },
  };

  const prevWordHooks: ExtraWordHooks = {
    enter: (word) => {
      if (!word.isSeparator) setWordsCount(wordsCount() - 1);

      if (!wordWpmTimer) return;
      wordWpmTimer = createWordMetricsState({ word, setWpm })({
        status: WordStatus.pending,
      });
    },
    leave: () => {
      if (!wordWpmTimer) return;
      wordWpmTimer = wordWpmTimer({ status: WordStatus.over });
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
  // NOTE: Peut etre des soucis ici, avec le truc de backspace et tout ça
  const [keypressHandler, setKeypressHandler] = createSignal(
    makeKeypressHandler(cursor(), cursorNav()),
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
        makeKeypressHandler(untrack(cursor), untrack(cursorNav)),
      );
    },
    { defer: true },
  );

  /* Typing */
  const [typingState, setTypingState] = createSignal<TypingState>({
    kind: TypingStateKind.unstart,
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
    setTypingState(event);
  };

  const onKeyUp = (key: string) => {
    onKeyboard.keyUp(key);
  };

  const onAddKey = (key: string, timestamp: number) => {
    const event = keypressHandler().addKey(key, timestamp);
    if (!event) return;
    setTypingState(event);
  };

  /* Typing Event management */

  const pause = () => {
    cursor().set.wordStatus(WordStatus.pause, false);
    if (wordWpmTimer) wordWpmTimer = wordWpmTimer({ status: WordStatus.pause });
    setTypingState({ kind: TypingStateKind.pause });
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
    cursor().set.keyFocus(CharacterFocus.unfocus);
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
    setTypingState({ kind: TypingStateKind.over });
    headerLeavingAnimate().finished.then(() => {
      over();
    });
  };

  createComputed(
    on(typingState, (event) => {
      switch (event.kind) {
        case TypingStateKind.unstart:
          if (wordWpmTimer) wordWpmTimer({ status: WordStatus.unstart });
          cursor().positions.reset();
          setPromptKey(cursor().get.character().char);
          break;
        case TypingStateKind.pending:
          if (!wordWpmTimer) {
            newWordWpmTimer();
          } else {
            wordWpmTimer = wordWpmTimer({ status: WordStatus.pending });
          }
          if (!event.next) {
            overMetrics();
            return typingOver();
          }
          setPromptKey(cursor().get.character().char);
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
    cursor.positions.set.character(0);
  };

  const reset = () => {
    wordWpmTimer && wordWpmTimer({ status: WordStatus.over });
    wordWpmTimer = undefined;
    resetGhost();

    setWordsCount(0);
    setParaStore(deepCloneParagraphs(contentHandler().data.paragraphs));
    setTypingState({ kind: TypingStateKind.unstart });
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
    const metrics = typingMetricsState({ event: typingState() });
    return metrics;
  }, updateMetrics);

  const keyMetrics = createMemo(
    (projection: KeysProjection) =>
      updateKeyProjection({ projection, status: typingState() }),
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
      (typingMode) => {
        if (typingMode === TypingModeKind.timer) {
          appendContent();
        }
      },
    ),
  );

  // should only be there at timer
  // WordsCount a la fin d'un mot, sauf si c'est un operator
  createComputed(
    on(wordsCount, () => {
      if (
        props.status.mode.kind === TypingModeKind.timer &&
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
        setParaStore(deepCloneParagraphs(contentHandler().data.paragraphs));
        reset();
      };
    }
    return () => {
      setContentHandler(contentHandler().new());
      setParaStore(deepCloneParagraphs(contentHandler().data.paragraphs));
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
            createEffect((timer: TypingTimer) => {
              return timer({ state: typingState() });
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
    cursor().set.keyFocus(CharacterFocus.unfocus);
    cursor().set.wordStatus(WordStatus.unstart, false);
    wordWpmTimer && wordWpmTimer({ status: WordStatus.unstart });
    cleanupMetrics();
    cleanupGhost();

    setTypingState({ kind: TypingStateKind.unstart });
  });

  return (
    <TypingGame
      t={t}
      typingState={typingState()}
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
        <Match when={props.status.mode.kind === TypingModeKind.speed} keyed>
          <TypingModeSpeed
            typingState={typingState()}
            stat={stat()}
            wordsCount={wordsCount()}
            totalWords={totalWordsCount()}
          >
            <TypingHelp
              t={t}
              keyboard={(k) => (onKeyboard = k)}
              isPaused={typingState().kind !== TypingStateKind.pending}
              onReset={reset}
            />
          </TypingModeSpeed>
        </Match>
        <Match when={props.status.mode.kind === TypingModeKind.timer} keyed>
          <TypingModeTimer
            typingState={typingState()}
            stat={stat()}
            duration={(props.status.mode as any).time}
            onTimerEnd={typingOver}
          >
            <TypingHelp
              t={t}
              keyboard={(k) => (onKeyboard = k)}
              isPaused={typingState().kind !== TypingStateKind.pending}
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
            paused={typingState().kind !== TypingStateKind.pending}
            isRedo={(props.status.kind as any) === PendingKind.redo}
            isGenerated={props.status.mode.isGenerated}
            onPause={pause}
            onReset={reset}
            onShuffle={shuffle(props.status.mode.kind === TypingModeKind.timer)}
            onExit={props.onExit}
          />
        </TypingHeaderNav>
      </Portal>
    </TypingGame>
  );
};

export default TypingGameManager;
