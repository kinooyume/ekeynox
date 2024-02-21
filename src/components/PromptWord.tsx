import { css } from "solid-styled";
import { For, Show, createSignal } from "solid-js";

import type { KeyProps } from "./PromptKey.tsx";
import Key from "./PromptKey.tsx";
import type { PromptKeyFocus } from "./KeyMetrics.ts";

export enum WordStatus {
  unstart = "unstart",
  pending = "pending",
  pause = "pause",
  over = "over",
}

// TODO: check about the keypressed things
export type WordProps = {
  keys: Array<KeyProps>;
  status: WordStatus;
  focus: PromptKeyFocus;
};

const Word = (props: WordProps) => {
  const [wpm, setWpm] = createSignal(0);
  css`
    .keys {
      display: flex;
    }

    .word {
      color: rgb(0, 31, 63);
      margin-top: 24px;
      position: relative;
    }
    .keys {
      color: rgb(0, 31, 63);
      opacity: 0.6;
    }
    .pending {
      opacity: 1;
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
