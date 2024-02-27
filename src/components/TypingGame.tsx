import { css } from "solid-styled";
import {
  Show,
  createComputed,
  createEffect,
  createMemo,
  createResource,
  createSignal,
} from "solid-js";
import { createStore } from "solid-js/store";
import * as i18n from "@solid-primitives/i18n";

// use `type` to not include the actual dictionary in the bundle
import type * as en from "../../public/i18n/en.json";

export type Locale = "en" | "fr";
export type RawDictionary = typeof en;

export type Dictionary = i18n.Flatten<RawDictionary>;

async function fetchDictionary(locale: Locale): Promise<Dictionary> {
  const dict: RawDictionary = (await import(`../../public/i18n/${locale}.ts`))
    .dict;
  return i18n.flatten(dict); // flatten the dictionary to make all nested keys available top-level
}

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

type TypingGameProps = { source: string };

// https://icon-sets.iconify.design/bi/keyboard-fill/
// https://icon-sets.iconify.design/line-md/?query=play

const TypingGame = ({ source }: TypingGameProps) => {
  const [locale, setLocale] = createSignal<Locale>("en");

  // https://www.solidjs.com/tutorial/stores_context
  const [dict] = createResource(locale, fetchDictionary);

  dict(); // => Dictionary
  const [paragraphs, keySet] = Content.parse(source);
  const [paraStore, setParaStore] = createStore(Content.deepClone(paragraphs));

  const [currentPromptKey, setCurrentPromptKey] = createSignal("");
  const [status, setStatus] = createSignal<TypingStatus>({
    kind: TypingStatusKind.unstart,
  });

  const [kbLayout, setKbLayout] = createSignal(KeyboardLayout.getDefault());

  createComputed(() => {
    const layout = KeyboardLayout.create("qwerty", keySet);
    if (layout !== null) setKbLayout(layout);
    // TODO: manage error
  });

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
          layout={kbLayout()}
          metrics={typingMetrics()}
          onReset={reset}
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
