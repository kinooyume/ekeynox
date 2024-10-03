import {
  For,
  Show,
  createComputed,
  createSignal,
  on,
  onCleanup,
  onMount,
} from "solid-js";
import Word from "./PromptWord.tsx";
import { css } from "solid-styled";
import anime from "animejs";

import { type Paragraphs } from "~/typingContent/index.ts";

export type PromptProps = {
  paragraphs: Paragraphs;
};

const prompt = (props: PromptProps) => {
  css`
    .prompt {
      height: 180px;
      margin-bottom: auto;
      max-width: 900px;
      overflow: hidden;
    }
    .paragraph {
      display: flex;
      position: relative;
      flex-wrap: wrap;
      align-items: center;
      font-size: 1.4em;
    }
    .game {
      display: flex;
      flex-direction: column;
      width: 100%;
      align-items: center;
    }

    @media screen and (max-width: 860px) {
      .prompt {
        height: 160px;
        margin: 0 16px auto 16px;
        margin-left: 32px;
      }
      .paragraph {
        font-size: 1.2em;
      }
    }
  `;

  const [observer, setObserver] = createSignal<IntersectionObserver | null>(
    null,
  );

  const [promptElem, setPromptElem] = createSignal<HTMLElement | null>(null);

  createComputed(
    on(promptElem, (prompt) => {
      if (!prompt) return;
      prompt.scrollTo({ top: 0, behavior: "instant" });
      setObserver((oldObs) => {
        if (oldObs) oldObs.disconnect();
        return createIntersectionObserver(prompt);
      });
    }),
  );

  const createIntersectionObserver = (root: HTMLElement) => {
    const options = { root, rootMargin: "-30px", threshold: 0.5 };
    return new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting === false) {
        entries[0].target.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, options);
  };

  onCleanup(() => {
    let obs = observer();
    if (obs) obs.disconnect();
  });

  onMount(() => {
    const getKeys = () =>
      [...document.querySelectorAll(".paragraph .word .prompt-key")].slice(
        0,
        280,
      );
    const keys = getKeys();
    anime
      .timeline()
      .add({
        targets: keys,
        translateY: ["1.1em", 0],
        translateX: ["0.55em", 0],
        translateZ: 0,
        rotateZ: [180, 0],
        duration: 750,
        easing: "easeOutExpo",
        delay: (el, i) => {
          return 6 * i;
        },
      })
      .finished.then(() => {
        document
          .querySelectorAll(".paragraph .word .prompt-key")
          ?.forEach((el) => el.removeAttribute("style"));
      });
  });

  return (
    <div class="prompt" ref={setPromptElem}>
      <div class="board">
        <Show when={props.paragraphs} keyed>
          <For each={props.paragraphs}>
            {(paragraphs) => (
              <div class="paragraph">
                <For each={paragraphs}>
                  {(word) => <Word {...word} observer={observer()} />}
                </For>
              </div>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
};

export default prompt;
