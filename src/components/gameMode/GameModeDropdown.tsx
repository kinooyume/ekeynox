import { For, type JSX, Match, Switch, createComputed } from "solid-js";
import { createStore } from "solid-js/store";
import type { CustomInputRef } from "../ui/CustomInput";
import CustomInput from "../ui/CustomInput";
import Dropdown from "../ui/Dropdown";
import { gameModesArray } from "./GameMode";
import SpeedParamsMedium from "./SpeedParamsMedium";
import TimerParamsMedium from "./TimerParamsMedium";
import { css } from "solid-styled";
import { useI18n } from "~/settings/i18nProvider";
import {
    CategoryKind,
  ContentGeneration,
  GameOptions,
  deepCopy,
} from "~/gameOptions/gameOptions";
import { GameModeKind } from "~/gameOptions/gameModeKind";

type GameModeDropdownProps = {
  reverse?: boolean;
  gameOptions: GameOptions;
  start: (opts: GameOptions) => void;
  fetchSourcesGen: (opts: ContentGeneration) => Promise<Array<string>>;

  children: (isOpen: () => boolean, hover: () => boolean) => JSX.Element;
};

const GameModeDropdown = (props: GameModeDropdownProps) => {
  const t = useI18n();
  css`
    .modes {
    }

    .modes li {
      display: flex;
      padding: 0;
      margin: 0;
    }

    .modes .selected label:before {
      max-width: 20px;

      opacity: 1;
    }
    .select {
      display: none;
    }

    .title {
      font-size: 14px;
      font-weight: 400;
      margin: 0;
      margin-left: 16px;
      color: var(--text-color);
    }

    .description {
      margin: 0;
      font-size: 1rem;
      color: var(--text-secondary-color);
    }

    .icon {
      display: flex;
      border-radius: 50%;
      height: 60px;
      padding: 4px;
      width: 70px;
      margin: 8px;
      cursor: pointer;
      transition: all 100ms linear;
    }

    .options-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-left: 1px solid var(--border-color);
      padding: 0 26px 26px;
      margin-bottom: 26px;
      width: 500px;
    }
    .content {
      display: flex;
    }
  `;
  const [gameOptions, setGameOptions] = createStore<GameOptions>(
    deepCopy(props.gameOptions),
  );

  createComputed(
    () => {
      props.fetchSourcesGen({
        language: gameOptions.generation.language,
        category: gameOptions.generation.category,
      });
    },
    { defer: true },
  );

  const customRef: CustomInputRef = {
    ref: undefined,
  };

  /* *** */

  const start = (setIsOpen: (o: boolean) => void) => {
    setIsOpen(false);
    if (gameOptions.categorySelected.kind === CategoryKind.custom) {
      setGameOptions("custom", customRef.ref ? customRef.ref.value : "");
    }
    props.start(gameOptions);
  };

  return (
    <Dropdown
      id="header-game-selection"
      reverse={props.reverse}
      label={props.children}
    >
      {(setIsOpen) => (
        <div class="content">
          <ul class="modes">
            <For each={gameModesArray}>
              {([modeKind, mode]) => (
                <li
                  class={`elem radio ${modeKind}`}
                  classList={{
                    selected: gameOptions.modeSelected === modeKind,
                  }}
                >
                  <input
                    type="radio"
                    name="mode"
                    class="select"
                    id={modeKind}
                    checked={gameOptions.modeSelected === modeKind}
                    onChange={() => setGameOptions("modeSelected", modeKind)}
                  />
                  <label for={modeKind}>
                    <div class="bullet-wrapper"></div>
                    <p class="title">{t("gameMode")[modeKind].subtitle}</p>
                  </label>
                </li>
              )}
            </For>
          </ul>
          <div class="options-wrapper">
            <div class="elem options">
              <Switch>
                <Match when={gameOptions.modeSelected === GameModeKind.speed}>
                  <SpeedParamsMedium
                    gameOptions={gameOptions}
                    setGameOptions={setGameOptions}
                  >
                    <CustomInput
                      value={customRef.ref ? customRef?.ref.value : ""}
                      customInput={customRef}
                    />
                  </SpeedParamsMedium>
                </Match>
                <Match when={gameOptions.modeSelected === GameModeKind.timer}>
                  <TimerParamsMedium
                    gameOptions={gameOptions}
                    setGameOptions={setGameOptions}
                  >
                    <CustomInput
                      value={customRef.ref ? customRef?.ref.value : ""}
                      customInput={customRef}
                    />
                  </TimerParamsMedium>
                </Match>
              </Switch>
            </div>
            <div class="elem actions">
              <button onClick={() => start(setIsOpen)} class="primary">
                {t("letsGo")}
              </button>
            </div>
          </div>
        </div>
      )}
    </Dropdown>
  );
};

export default GameModeDropdown;
