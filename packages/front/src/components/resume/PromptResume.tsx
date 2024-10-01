import { For, createSignal, onCleanup, onMount } from "solid-js";
import { css } from "solid-styled";
import Word from "./PromptWordResume.tsx";

import { type Paragraphs } from "../content/Content.ts";

export type PromptProps = {
  paragraphs: Paragraphs;
};

const prompt = (props: PromptProps) => {
  css`
    .prompt {
      margin-bottom: 2rem;
      max-width: 900px;
      overflow: hidden;
    }
    .paragraph-resume {
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
      .paragraph-resume {
        font-size: 1.2em;
      }
    }
  `;

  return (
    <div class="prompt">
      <div class="board">
        <For each={props.paragraphs}>
          {(paragraphs) => (
            <div class="paragraph-resume">
              <For each={paragraphs}>{(word) => <Word {...word} />}</For>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default prompt;
