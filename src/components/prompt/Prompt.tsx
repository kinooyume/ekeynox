import { For, createSignal, onCleanup, onMount } from "solid-js";
import Word from "./PromptWord.tsx";
import { css } from "solid-styled";
import anime from "animejs/lib/anime.es.js";

import { type Paragraphs } from "../content/Content.ts";
import type { SetStoreFunction } from "solid-js/store";

export type PromptProps = {
  paragraphs: Paragraphs;
  setParagraphs: SetStoreFunction<Paragraphs>;
};

const prompt = (props: PromptProps) => {
  const [observer, setObserver] = createSignal<IntersectionObserver | null>(
    null,
  );

  css`
    .prompt {
      height: 230px;
      margin-bottom: 2rem;
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
  `;

  onMount(() => {
    anime
      .timeline()
      .add({
        targets: ".paragraph .word .prompt-key",
        translateY: ["1.1em", 0],
        translateX: ["0.55em", 0],
        translateZ: 0,
        rotateZ: [180, 0],
        duration: 750,
        easing: "easeOutExpo",
        delay: (el, i) => 6 * i,
      })
      .finished.then(() => {
        document
          .querySelectorAll(".paragraph .word .prompt-key")
          ?.forEach((el) => el.removeAttribute("style"));
      });
  });

  const createIntersectionObserver = (root: HTMLElement) => {
    const options = { root, rootMargin: "-30px", threshold: 0.5 };
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting === false) {
        entries[0].target.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, options);
    onCleanup(() => observer.disconnect());
    setObserver(observer);
  };

  return (
    <div class="prompt" ref={createIntersectionObserver}>
      <div class="board">
        <For each={props.paragraphs}>
          {(paragraphs, pIncdex) => (
            <div class="paragraph">
              <For each={paragraphs}>
                {(word, wIndex) => (
                  <Word
                    {...word}
                    observer={observer()}
                    setWpm={(wpm) => {
                      props.setParagraphs(pIncdex(), wIndex(), "wpm", wpm);
                    }}
                  />
                )}
              </For>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default prompt;
