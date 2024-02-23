import { For, onMount } from "solid-js";
import Word from "./PromptWord.tsx";
import { css } from "solid-styled";
import anime from "animejs/lib/anime.es.js";

import { type Paragraphs } from "./Content.ts";

export type PromptProps = { paragraphs: Paragraphs };

const prompt = (props: PromptProps) => {
  css`
    .board {
      min-height: 180px;
      height: 300px;
      max-width: 900px;
    }
    .paragraph {
      display: flex;
      position: relative;
      flex-wrap: wrap;
      align-items: center;
      font-size: 1.6em;
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

  return (
    <div class="prompt">
      <div class="game"></div>
      <div class="board">
        <For each={props.paragraphs}>
          {(paragraphs) => (
            <div class="paragraph">
              <For each={paragraphs}>
                {(word) => (
                  <Word
                    keys={word.keys}
                    focus={word.focus}
                    status={word.status}
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
