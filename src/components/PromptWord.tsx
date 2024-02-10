import { css } from "solid-styled";
import { For, Show, createEffect, createSignal, on } from "solid-js";
import type { Accessor } from "solid-js";
import WpmCounter, { CounterStatus, type Counter } from "./WpmCounter.ts";

import type { KeyProps } from "./PromptKey.tsx";
import Key from "./PromptKey.tsx";

export enum WordStatus {
  unset,
  pending,
  corrected,
  done,
  /* to implement */
  correct,
  incorrect,
}

// TODO: check about the keypressed things
export type WordProps = {
  keys: Array<KeyProps>;
  status: Accessor<WordStatus>;
  getKeypressed: () => number; // should be replace
  focus: Accessor<boolean>;
};

const Word = ({ keys, status, getKeypressed, focus }: WordProps) => {
  const [wpm, setWpm] = createSignal(0);

  createEffect((counter: Counter | void) => {
    if (counter === undefined) return;
    if (status() === WordStatus.unset) {
      setWpm(0);
      return WpmCounter.create;
    } else if (status() === WordStatus.pending) {
      if (counter.kind === CounterStatus.paused) {
        return counter.action.resume();
      }
    } else if (status() === WordStatus.done) {
      if (counter.kind === CounterStatus.pending) {
        counter.action.addKeypress(getKeypressed());
        const c = counter.action.pause();
        setWpm(c.action.getWpm());
        return c;
      }
    }
    return counter;
  }, WpmCounter.create);

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
      <div class={`${status()}  ${focus() ? "focus" : ""} keys`}>
        <For each={keys}>
          {(key) => <Key key={key.key} status={key.status} />}
        </For>
      </div>
      <Show when={keys.length > 5 && status() === WordStatus.done}>
        <span class="wpm">{Math.trunc(wpm())}</span>
      </Show>
    </div>
  );
};

export default Word;
