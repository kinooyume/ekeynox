import { css } from "solid-styled";
import { For, Show, createEffect, createSignal } from "solid-js";

import Key from "./PromptKey.tsx";
import type { MetaWord } from "./Content.ts";
import {
  createWordMetricsState,
  type WordMetrics,
} from "./PromptWordMetrics.ts";

export enum WordStatus {
  unstart = "unstart",
  pending = "pending",
  pause = "pause",
  over = "over",
}

type WordProps = { setWpm: (wpm: number) => void } & MetaWord;

const Word = (props: WordProps) => {
  // on va envoyer 
  const wordMetricsState = createWordMetricsState({
    setWpm: props.setWpm,
    keys: props.keys,
  });

  createEffect(
    (metrics: WordMetrics) => metrics({ status: props.status }),
    wordMetricsState,
  );

  css`
    .keys {
      display: flex;
    }
    .word {
      color: var(--text-color);
      margin-top: 24px;
      position: relative;
      display: inline-block;
    }
    .keys {
      opacity: 0.6;
      transform-origin: bottom center;
      overflow: hidden;
      z-index: 2;
    }
    .pending {
      opacity: 1;
      transform: scale(1.02);
      transform-origin: bottom center;
      z-index: 100;
    }
    .focus {
      opacity: 1;
    }
    .wpm {
      position: absolute;
      top: -20px;
      color: grey;
      font-size: 0.5em;
    }
  `;
  return (
    <div class="word">
      <div class={`${props.status}  ${props.focus ? "focus" : ""} keys`}>
        <For each={props.keys}>{(key) => <Key {...key} />}</For>
      </div>
      <Show when={props.wpm > 0 && props.keys.length > 4 && props.status === WordStatus.over}>
        <span class="wpm">{Math.trunc(props.wpm)}</span>
      </Show>
    </div>
  );
};

export default Word;
