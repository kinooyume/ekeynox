import {
  type JSX,
  Match,
  Switch,
  createComputed,
  createSignal,
  on,
} from "solid-js";
import { createStore } from "solid-js/store";
import type { CustomInputRef } from "../ui/CustomInput";
import CustomInput from "../ui/CustomInput";
import Dropdown from "../ui/Dropdown";
import { gameModesArray } from "./GameMode";
import SpeedParamsMedium from "./SpeedParamsMedium";
import TimerParamsMedium from "./TimerParamsMedium";
import { css } from "solid-styled";
import { useI18n } from "~/settings/i18nProvider";
import { CategoryKind, GameOptions, deepCopy } from "~/gameOptions/gameOptions";
import { GameModeKind } from "~/gameOptions/gameModeKind";
import VerticalRadioBox from "../ui/VerticalRadioBox";
import HugeRadioLabel from "../ui/HugeRadioLabel";
import { useGameOptions } from "~/gameOptions/GameOptionsProvider";

type GameModeDropdownProps = {
  reverse?: boolean;
  gameOptions: GameOptions;
  start: (opts: GameOptions) => void;

  children: (isOpen: () => boolean, hover: () => boolean) => JSX.Element;
};

const GameModeDropdown = (props: GameModeDropdownProps) => {
  const t = useI18n();

  const { fetchSourcesGen } = useGameOptions();
  const [isReady, setIsReady] = createSignal(false);
  const [customValue, setCustomValue] = createSignal("");

  css`
    .mode-radio {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      height: 48px;
    }

    .mode-picto {
      width: 52px;
      border-radius: 12px;
      padding: 6px;
    }
    .modes {
      width: 250px;
      margin-right: 20px;
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
      font-size: 16px;
      margin: 0;
    }

    .subtitle {
      margin: 0;
      color: var(--text-secondary-color);
      text-transform: capitalize;
      font-size: 14px;
      font-weight: 500;
    }

    .mode-description {
      display: flex;
      flex-direction: column;
      gap: 2px;
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
      width: 500px;
    }
    .content {
      display: flex;
      height: 260px;
      margin-top: 16px;
    }
  `;
  const [gameOptions, setGameOptions] = createStore<GameOptions>(
    deepCopy(props.gameOptions),
  );

  createComputed(
    () => {
      fetchSourcesGen({
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

  createComputed(
    on(
      () => props.gameOptions,
      () => {
        setCustomValue(props.gameOptions.custom);
      },
    ),
  );
  createComputed(() => {
    if (gameOptions.categorySelected.kind !== CategoryKind.custom)
      setIsReady(true);
    else {
      setIsReady(customValue().length > 0);
    }
  });
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
          <div class="modes">
            <VerticalRadioBox
              name="game-mode-dropdown"
              each={gameModesArray}
              onChange={([modeKind]) => {
                setGameOptions("modeSelected", modeKind);
              }}
              selected={
                gameModesArray.find(
                  ([modeKind]) => modeKind === gameOptions.modeSelected,
                ) || gameModesArray[0]
              }
            >
              {(id, checked, [modeKind, gameMode]) => (
                <HugeRadioLabel id={id} checked={checked}>
                  {(checked) => (
                    <div classList={{ checked }} class="mode-radio">
                      <div class="mode-picto">{gameMode.head()}</div>
                      <div class="mode-description">
                        <p class="title">{t("gameMode")[modeKind].subtitle}</p>
                        <p class="subtitle">{t("gameMode")[modeKind].title}</p>
                      </div>
                    </div>
                  )}
                </HugeRadioLabel>
              )}
            </VerticalRadioBox>
          </div>
          <div class="options-wrapper">
            <div class="elem options">
              <Switch>
                <Match when={gameOptions.modeSelected === GameModeKind.speed}>
                  <SpeedParamsMedium
                    gameOptions={gameOptions}
                    setGameOptions={setGameOptions}
                  >
                    <CustomInput
                      value={customValue()}
                      customInput={customRef}
                      onInput={setCustomValue}
                    />
                  </SpeedParamsMedium>
                </Match>
                <Match when={gameOptions.modeSelected === GameModeKind.timer}>
                  <TimerParamsMedium
                    gameOptions={gameOptions}
                    setGameOptions={setGameOptions}
                  >
                    <CustomInput
                      value={customValue()}
                      customInput={customRef}
                      onInput={setCustomValue}
                    />
                  </TimerParamsMedium>
                </Match>
              </Switch>
            </div>
            <div class="elem actions">
              <button
                disabled={!isReady()}
                onClick={() => start(setIsOpen)}
                class="primary"
              >
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
