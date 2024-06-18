import { css } from "solid-styled";
import { Switch, type JSXElement, Show, Match } from "solid-js";
import {
  CategoryKind,
  GameOptions,
  WordsGenerationCategory,
} from "~/gameOptions/gameOptions";
import { useI18n } from "~/settings/i18nProvider";
import { GameModeKind } from "~/gameOptions/gameModeKind";

// NOTE: make a data to link title + icons + params full/compact
//
type GameOptionsRecapProps = {
  gameOptions: GameOptions;
};

const GameOptionsRecap = (props: GameOptionsRecapProps) => {
  const t = useI18n();
  css`
    .options-recap {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .tag {
      background-color: var(--background-color);
      border-radius: 4px;
      display: flex;
      gap: 5px;
      padding: 5px 10px;
      height: 18px;
    }

    span {
      font-size: 14px;
      text-transform: capitalize;
      color: var(--text-secondary-color);
    }
  `;
  return (
    <div class="options-recap">
      <Show when={props.gameOptions.modeSelected === GameModeKind.timer}>
        <div class="tag animate">
          <span>{props.gameOptions.timer}s</span>
        </div>
      </Show>
      <Switch
        fallback={
          <div class="tag animate">
            <span>{t("custom")}</span>
          </div>
        }
      >
        <Match
          when={
            props.gameOptions.categorySelected.kind === CategoryKind.generation
          }
        >
          <Switch>
            <Match
              when={
                (props.gameOptions.categorySelected as any).category ===
                WordsGenerationCategory.quotes
              }
            >
              <div class="tag animate">
                <span>{t("quotes")}</span>
              </div>
            </Match>
            <Match
              when={
                (props.gameOptions.categorySelected as any).category ===
                  WordsGenerationCategory.words1k &&
                props.gameOptions.modeSelected !== GameModeKind.timer
              }
            >
              <div class="tag animate">
                <span>{`${props.gameOptions.random} ${t("words")}`}</span>
              </div>
            </Match>
          </Switch>

          <div class="tag animate">
            <span>{t(props.gameOptions.generation.language)}</span>
          </div>
        </Match>
      </Switch>
    </div>
  );
};

export default GameOptionsRecap;
