import { css } from "solid-styled";
import { For, Show } from "solid-js";

import Key from "../prompt/PromptKey.tsx";
import type { MetaWord } from "../content/Content.ts";

export enum WordStatus {
  unstart = "unstart",
  pending = "pending",
  pause = "pause",
  over = "over",
}

const Word = (props: MetaWord) => {
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
      <Show
        when={
          props.wpm > 0 &&
          props.keys.length > 4 &&
          props.status === WordStatus.over
        }
      >
        <span class="wpm">{Math.trunc(props.wpm)}</span>
      </Show>
    </div>
  );
};

export default Word;
