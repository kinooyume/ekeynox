import { css } from "solid-styled";
import { For, Show, createSignal } from "solid-js";

import type { KeyProps } from "./PromptKey.tsx";
import Key from "./PromptKey.tsx";

export enum WordStatus { 
  unstart,
  pending,
  pause,
  over,
}

// TODO: check about the keypressed things
export type WordProps = {
  keys: Array<KeyProps>;
  status: WordStatus;
  focus: boolean;
};

const Word = (props: WordProps) => {
  const [wpm, setWpm] = createSignal(0);
  css`
    .keys {
      display: flex;
    }

    .word {
      margin-top: 24px;
      position: relative;
      color: grey;
    }
    .pending {
      background-color: lightgrey;
    }
    .focus {
      color: black;
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
