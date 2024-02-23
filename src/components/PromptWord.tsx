import { css } from "solid-styled";
import { For, Show, createSignal } from "solid-js";

import Key from "./PromptKey.tsx";
import type { MetaWord } from "./Content.ts";

export enum WordStatus {
  unstart = "unstart",
  pending = "pending",
  pause = "pause",
  over = "over",
}

const Word = (props: MetaWord) => {
  const [wpm, setWpm] = createSignal(0);
  css`
    .keys {
      display: flex;
    }

    .word {
      color: var(--text-color);
      margin-top: 24px;
      position: relative;
      display: inline-block;
      overflow: hidden;
    }
    .keys {
      opacity: 0.6;
      transform-origin: bottom center;
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
        <For each={props.keys}>
          {(key) => <Key key={key.key} status={key.status} focus={key.focus} />}
        </For>
      </div>
      <Show when={props.keys.length > 5 && props.status === WordStatus.over}>
        <span class="wpm">{Math.trunc(wpm())}</span>
      </Show>
    </div>
  );
};

export default Word;
