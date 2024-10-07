import { css } from "solid-styled";
import { For, Show, createEffect, createSignal, on } from "solid-js";

import { MetaWord, WordStatus } from "~/typingContent/word/types";
import PromptCharacter from "./PromptCharacter.tsx";

type WordProps = {
  observer: IntersectionObserver | null;
  showGhost?: boolean;
} & MetaWord;

const Word = (props: WordProps) => {
  const [isObserved, setIsObserved] = createSignal(false);
  const [toAnimate, setToAnimate] = createSignal(false);

  const createObserver = (ref: Element) => {
    if (props.observer?.observe(ref)) {
      setToAnimate(true);
    }
    createEffect(
      on(
        () => props.focus,
        (isFocus) => {
          if (isFocus && !isObserved()) {
            props.observer?.observe(ref);
            setIsObserved(true);
          } else if (
            props.status === WordStatus.over ||
            props.status === WordStatus.unstart ||
            props.status === WordStatus.unfocus
          ) {
            props.observer?.unobserve(ref);
            setIsObserved(false);
          }
        },
      ),
    );
  };

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
    <div classList={{ animate: toAnimate() }} class="word" ref={createObserver}>
      <div class={`${props.status}  ${props.focus ? "focus" : ""} keys`}>
        <For each={props.characters}>
          {(key) => <PromptCharacter {...key} showGhost={props.showGhost} />}
        </For>
      </div>
      <Show
        when={props.isCorrect && props.characters.length > 4 && props.wpm > 0 }
      >
        <span class="wpm">{Math.trunc(props.wpm)}</span>
      </Show>
    </div>
  );
};

export default Word;
