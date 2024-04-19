import { css } from "solid-styled";
import { Switch, type JSXElement, Show, Match } from "solid-js";
import type { Translator } from "../App";
import {
  ContentTypeKind,
  WordsGenerationCategory,
  type GameOptions,
} from "./GameOptions";
import { GameModeKind } from "./GameMode";

// NOTE: make a data to link title + icons + params full/compact
//
type GameOptionsRecapProps = {
  t: Translator;
  gameOptions: GameOptions;
};

const GameOptionsRecap = (props: GameOptionsRecapProps) => {
  css`
    .options-recap {
      display: flex;
      justify-content: center;
      align-items: center;

      gap: 10px;
    }

    .tag:hover {
      filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.25));
    }
    .tag {
      background-color: var(--color-primary-400);
      filter: grayscale(60%);
      border-radius: 4px;
      display: flex;
      gap: 5px;
      padding: 4px 8px;
      height: 16px;
    }

    span {
      font-size: 12px;
      color: black;
    }
  `;
  return (
    <div class="options-recap">
      <Show when={props.gameOptions.mode === GameModeKind.timer}>
        <div class="tag">
          <span>{props.gameOptions.timer.value}"</span>
        </div>
      </Show>
      <Switch
        fallback={
          <div class="tag">
            <span>{props.t("custom")}</span>
          </div>
        }
      >
        <Match
          when={
            props.gameOptions.contentType.kind === ContentTypeKind.generation
          }
        >
          <Switch>
            <Match
              when={
                (props.gameOptions.contentType as any).category ===
                WordsGenerationCategory.quotes
              }
            >
              <div class="tag">
                <span>{props.t("quotes")}</span>
              </div>
            </Match>
            <Match
              when={
                (props.gameOptions.contentType as any).category ===
                WordsGenerationCategory.words1k
              }
            >
              <div class="tag">
                <span>
                  {`${props.gameOptions.random.value} ${props.t("words")}`}
                </span>
              </div>
            </Match>
          </Switch>

          <div class="tag">
            <span>{props.gameOptions.generation.language}</span>
          </div>
        </Match>
      </Switch>
    </div>
  );
};

export default GameOptionsRecap;
