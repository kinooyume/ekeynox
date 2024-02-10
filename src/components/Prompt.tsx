import { For } from "solid-js";
import Word from "./PromptWord.tsx";
import { css } from "solid-styled";
import { type MetaWord } from "./Content.ts";

export type PromptProps = { data: Array<MetaWord> };

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
        <For each={props.data}>
          {(word) => (
            <Word
              keys={word.keys.map((word) => word.props)}
              focus={word.focus}
              getKeypressed={() => word.keypressed}
              status={word.status}
            />
          )}
        </For>
      </div>
    </div>
  );
};

export default prompt;
