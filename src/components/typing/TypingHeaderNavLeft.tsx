import { Show, For, Switch, Match, createComputed } from "solid-js";
import type { Translator } from "../App";
import {
  deepCopy,
  type ContentGeneration,
  type GameOptions,
} from "../gameMode/GameOptions";
import { css } from "solid-styled";
import { createStore } from "solid-js/store";
import type { CustomInputRef } from "../ui/CustomInput";
import GameOptionsRecap from "../gameMode/GameOptionsRecap";
import { GameModeKind, gameModesArray } from "../gameMode/GameMode";
import SpeedParamsMedium from "../gameMode/SpeedParamsMedium";
import TimerParamsMedium from "../gameMode/TimerParamsMedium";
import CustomInput from "../ui/CustomInput";
import Dropdown from "../ui/Dropdown";

type HeaderNavLeftProps = {
  t: Translator;
  gameOptions: GameOptions;
  start: (opts: GameOptions, customSource: string) => void;
  setContentGeneration: (type: ContentGeneration) => void;
};

const HeaderNavLeft = (props: HeaderNavLeftProps) => {
  css`
    .cursor {
      corsor: pointer;
      position: absolute;
      right: 16px;
      top: 14px;
      pointer-events: none;
      color: var(--background-color);
      color: var(--text-secondary-color);
      transition: all 0.2s ease-in-out;
      z-index: 206;
    }

    .header-mode {
      height: 48px;
      display: flex;
      gap: 18px;
    }

    .options-recap {
      display: flex;
    }

    .modes {
      list-style-type: none;
      width: 180px;
      padding: 0;
      padding-left: 12px;
      margin: 8px 0;
      margin-right: 12px;
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

    label {
      width: 100%;
      height: 24px;
      border-radius: 12px;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 6px;
      user-select: none;
      transition: all 0.2s ease-in-out;

      cursor: pointer;
    }

    .selected label .title {
      font-weight: 800;
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

    .menu-title {
      display: flex;
      font-size: 18px;
      filter: grayscale(20%);
      opacity: 0.8;
      overflow: hidden;
      position: relative;
      width: 100%;
      height: 30px;
      max-height: 40px;
      padding: 8px;
      padding-left: 20px;
      align-items: center;
      cursor: pointer;
      content: attr(data-passive);
    }

    .menu-title:before {
      position: absolute;
      color: var(--text-color);

      color: var(--text-secondary-color);
      content: attr(data-passive);
      top: 50%;
      transform: translateY(-50%);
      transition: all 0.2s ease;
    }
    .menu-title:after {
      position: absolute;
      color: var(--text-color);
      color: var(--text-secondary-color);
      top: 150px;
      content: attr(data-active);
      transition: all 0.3s ease;
    }

    .menu-title.open {
      font-size: 19px;
      filter: none;
      opacity: 1;
    }

    menu-title.open:before {
      transition: none;
      display: none;
    }

    .menu-title.hover {
      filter: none;
      opacity: 1;
    }
    .menu-title.hover:before,
    .menu-title.open:before {
      top: -50%;
      transform: rotate(5deg);
    }
    .menu-title.hover:after,
    .menu-title.open:after {
      top: 50%;
      transform: translateY(-50%);
    }

    .bullet-wrapper {
      position: absolute;
      overflow: hidden;
      width: 14px;
      height: 14px;
    }

    .bullet-wrapper::after {
      content: "";
      display: flex;
      justify-self: center;
      border-radius: 50%;
      position: relative;
      background-color: var(--text-color);
      width: calc(100% / 2);
      height: calc(100% / 2);
      top: var(--y, 100%);

      transition: top 0.3s cubic-bezier(0.48, 1.97, 0.5, 0.63);
    }

    .selected .bullet-wrapper:after {
      --y: 18%;
      opacity: 1;
      animation: stretch-animate 0.3s ease-out 0.17s;
    }

    .selected + li .bullet-wrapper:after {
      --y: -100%;
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
  /*
   * HOVER
   */

  /* *** */
  /* doublon, manage temporal gameOptions */

  const [gameOptions, setGameOptions] = createStore<GameOptions>(
    deepCopy(props.gameOptions),
  );

  createComputed(
    () => {
      props.setContentGeneration({
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
    props.start(gameOptions, customRef.ref ? customRef.ref.value : "");
  };

  return (
    <div class="header-mode">
      <Dropdown
        id="header-game-selection"
        label={(isOpen, hover) => (
          <div
            class="menu-title"
            classList={{ hover: hover(), open: isOpen() }}
            data-passive={`${props.t("gameMode")[props.gameOptions.modeSelected].subtitle}`}
            data-active={`${props.t("newGame.one")} ${props.t("newGame.two")}`}
          >
            <Show when={!isOpen()}>
              <span class="cursor">▼</span>
            </Show>
          </div>
        )}
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
                      {/* <div class="icon"> {mode.head()}</div> */}
                      {/* <div class="description"> */}

                      <div class="bullet-wrapper"></div>
                      <p class="title">
                        {props.t("gameMode")[modeKind].subtitle}
                      </p>
                      {/* </div> */}
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
                      t={props.t}
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
                      t={props.t}
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
                  {props.t("letsGo")}
                </button>
              </div>
            </div>
          </div>
        )}
      </Dropdown>
      <div class="options-recap">
        <GameOptionsRecap gameOptions={props.gameOptions} t={props.t} />
      </div>
    </div>
  );
};

export default HeaderNavLeft;
