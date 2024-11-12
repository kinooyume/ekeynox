import {
  createComputed,
  createMemo,
  createSignal,
  Match,
  on,
  onCleanup,
  Switch,
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

import { type TypingStatistics } from "~/typingStatistics";
import KeypressMetrics from "~/typingStatistics/KeypressMetrics";
import {
  createTypingMetrics,
  createTypingMetricsState,
} from "~/typingStatistics/TypingMetrics";

import type { KeyboardHandler } from "../virtualKeyboard/TypingKeyboard";

import { PendingKind, type PendingStatus } from "~/states";

import { TypingGameOptions } from "~/typingOptions/typingGameOptions";
import { TypingModeKind } from "~/typingOptions/typingModeKind";
import { TypingOptions } from "~/typingOptions/typingOptions";

import { type HigherKeyboard } from "~/typingKeyboard/keyboardLayout";

import { useI18n } from "~/contexts/i18nProvider";

import {
  CharacterStats,
  updateCharacterStats,
} from "~/typingContent/character/stats";
import { CharacterFocus } from "~/typingContent/character/types";
import {
  clearParagraphs,
  deepCloneParagraphs,
} from "~/typingContent/paragraphs";
import { Paragraphs } from "~/typingContent/paragraphs/types";
import { WordStatus } from "~/typingContent/word/types";
import typingGameRedo from "~/typingGame/typingGameRedo";
import { TypingStateKind, type TypingState } from "~/typingState";
import makeKeypressHandler from "~/typingState/userKeypressHandler";
import UserInput from "../seqInput/UserInput";
import TypingGame from "./TypingGame";
import TypingHeaderActions from "./TypingHeaderActions";
import TypingHeaderNav from "./TypingHeaderNav";
import TypingHelp from "./TypingHelp";
import TypingModeSpeed from "./TypingModeSpeed";
import TypingModeTimer from "./TypingModeTimer";

type TypingGameManagerProps = {
  status: PendingStatus;
  typingOptions: TypingOptions;
  start: (options: TypingOptions) => void;
  kbLayout: HigherKeyboard;
  showKb: boolean;
  onOver: (metrics: TypingStatistics, mode: TypingGameOptions) => void;
  onExit: () => void;
};

const TypingGameManager = (props: TypingGameManagerProps) => {
  const t = useI18n();

  // NOTE: keep the signal as it can cause error if we give it to the next state
  const [typingOptions, setTypingOptions] = createSignal<TypingOptions>(
    props.typingOptions,
  );
  setTypingOptions(props.typingOptions);

  const [contentHandler, setContentHandler] = createSignal<ContentHandler>(
    props.status.mode.getContent(),
  );

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

  // NOTE: wordsCount should be in Metrics ? Or CursorNav.. hum..

  /* KeyPress: from input to Typing Event + promptKey */
  const [promptKey, setPromptKey] = createSignal<string>("");
  const [wordsCount, setWordsCount] = createSignal<number>(0);

  // Also trigger appendContent, at the half content
  const [totalWordsCount, setTotalWordsCount] = createSignal(
    contentHandler().data.wordsCount,
  );

  // TODO: better handler isSeparator
  const nextWordHooks: ExtraWordHooks = {
    enter: (word) => {},
    leave: (word) => {
      if (!word.isSeparator) setWordsCount(wordsCount() + 1);
    },
  };

  const prevWordHooks: ExtraWordHooks = {
    enter: (word) => {
      if (!word.isSeparator) setWordsCount(wordsCount() - 1);
    },
    leave: () => {},
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
  // TODO: ici, on a le liens userKeypress <-> cursor/nav
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

  /* Redo */
  if (props.status.kind === PendingKind.redo)
    typingGameRedo({
      paragraphs: paraStore,
      setParagraphs: setParaStore,
      status: props.status,
      typingState,
    });

  // Can be Signal
  let onKeyboard: KeyboardHandler = {
    keyDown: () => {},
    keyUp: () => {},
  };

  /* Keyboard Listener */
  // NOTE: Set TypingState from userKeypress

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

  const onKeyAdd = (key: string) => {
    const event = keypressHandler().addKey(key);
    if (!event) return;
    setTypingState(event);
  };

  /* Typing Event management */

  // TODO: remoé, wordWPM
  const setWordWpm = (cursor: Cursor) => {
    if (cursor.get.hasWpm()) {
      const timestamp = performance.now();
      const spentTime = timestamp - cursor.get.wordLastEnterTimestamp();
      const totalSpentTime = cursor.get.wordSpentTime() + spentTime;
      cursor.set.wordSpentTime(totalSpentTime);
      if (cursor.get.wordIsValid()) {
        const wpm = ((cursor.get.nbrKeys() / totalSpentTime) * 60000) / 5;
        cursor.set.wordWpm(wpm);
        cursor.set.wordIsCorrect(true);
      } else {
        cursor.set.wordIsCorrect(false);
      }
    }
  };

  const pause = () => {
    setWordWpm(cursor());
    cursor().set.wordStatus(WordStatus.pause, false);

    // TODO: stop le counter
    // if (wordWpmTimer) wordWpmTimer = wordWpmTimer({ status: WordStatus.pause });
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

  /* Metrics */

  // TODO: make  primitive
  // const { typingStats, updateTypingStats } = useTypingStats();
  // updateTypingStats({ event: typingState() });
  // NOTE: Faire le points entre stats & metrics
  // NOTE: normalement,  liée stat et typingMetrics
 
  const [stat, setStat] = createSignal(KeypressMetrics.createStatProjection());

  // NOTE: Donc en fait, c'est le "Timer" des stats
  // enfin genre.. la partie en dessous..
  const [typingMetrics, setTypingMetrics] = createSignal(createTypingMetrics());

  /* Metrics "State" */
  let cleanupMetrics = () => {};
  let metricsState = createTypingMetricsState(
    setStat,
    setTypingMetrics,
    (cleanup) => (cleanupMetrics = cleanup),
  );

  const updateMetrics = (typingState: TypingState) => {
    metricsState = metricsState({ event: typingState });
  };

  /* *** */
  /* Key Metrics */

  const keyMetrics = createMemo(
    (projection: CharacterStats) =>
      updateCharacterStats({ projection, status: typingState() }),
    {},
  );
  const over = (mode: TypingGameOptions) => {
    // NOTE: peut etre le faire en mode "leave"
    cursor().set.wordStatus(WordStatus.over, false);
    cursor().set.keyFocus(CharacterFocus.unfocus);
    const position = cursor().positions.get();

    // so, metrics before wesh
    props.onOver(
      {
        paragraphs: cleanParagraphs(paraStore, position),
        wordsCount: wordsCount(),
        typingOptions: typingOptions(),
        typing: typingMetrics(),
        characters: keyMetrics(),
      },
      mode,
    );
  };

  const typingOver = () => {
    // pour le timer, updateMetrics !
    setWordWpm(cursor());
    const mode = props.status.mode;
    setTypingState({ kind: TypingStateKind.over });
    headerLeavingAnimate().finished.then(() => {
      over(mode);
    });
  };

  createComputed(
    on(typingState, (event) => {
      // side effect
      updateMetrics(event);
      switch (event.kind) {
        case TypingStateKind.unstart:
          cursor().positions.reset();
          setPromptKey(cursor().get.character().char);
          break;
        case TypingStateKind.pending:
          if (!event.next) {
            // NOTE: we call it twice ? 🤔 Make sure it doesn't break anything..
            // overMetrics();

            return typingOver();
          }
          setPromptKey(cursor().get.character().char);
          cursor().focus();
          break;
      }
    }),
  );

  /* Typing Actions (Header) */

  const reset = () => {
    setWordsCount(0);
    setParaStore(clearParagraphs(contentHandler().data.paragraphs));
    setTypingState({ kind: TypingStateKind.unstart });
  };

  // TODO: On doit pouvoir lier metrics et cursor/nav
  // Genre que les metrics appelles le cursor/nav
  // Parce que la, cursor/nav s'occupe des statistiques du mots
  // Et récupère un timestamp, qui pourrait venir de userKeypress
  // ==> On doit pouvoir tout chainer plutot que de réagir à chaque truc

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

  onCleanup(() => {
    // NOTE: On devrait pas avoir le cleanup du timer ? 🤔
    cursor().set.keyFocus(CharacterFocus.unfocus);
    cursor().set.wordStatus(WordStatus.unstart, false);
    cleanupMetrics();

    setTypingState({ kind: TypingStateKind.unstart });
  });

  return (
    <TypingGame
      showKb={props.showKb}
      kbLayout={props.kbLayout}
      keySet={contentHandler().data.keySet}
      onPause={pause}
      promptKey={promptKey()}
      paragraphs={paraStore}
      keyMetrics={keyMetrics()}
      Input={(extendProps) => (
        <UserInput
          ref={extendProps.ref}
          typingState={typingState()}
          onKeyDown={(key) => {
            onKeyDown(key);
            extendProps.onKeyDown(key);
          }}
          onKeyUp={(key) => {
            onKeyUp(key);
            extendProps.onKeyUp(key);
          }}
          onKeyAdd={onKeyAdd}
        />
      )}
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
          typingOptions={props.typingOptions}
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
