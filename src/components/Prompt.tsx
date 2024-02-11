import { For } from "solid-js";
import Word from "./PromptWord.tsx";
import { css } from "solid-styled";
import { type Paragraphs } from "./Content.ts";

export type PromptProps = { paragraphs: Paragraphs };

const prompt = (props: PromptProps) => {
  css`
    .board {
      display: flex;
      flex-wrap: wrap;
      min-height: 180px;
      height: 300px;
      max-width: 900px;
      align-items: center;
      font-size: 2em;
    }
    .game {
      display: flex;
      flex-direction: column;
      width: 100%;
      align-items: center;
    }
  `;
  return (
    <div class="prompt">
      <div class="game"></div>
      <div class="board">
        <For each={props.paragraphs}>
          {(paragraphs) => (
            <For each={paragraphs}>
              {(word) => (
                <Word
                  keys={word.keys}
                  focus={word.focus}
                  status={word.status}
                />
              )}
            </For>
          )}
        </For>
      </div>
    </div>
  );
};

export default prompt;
