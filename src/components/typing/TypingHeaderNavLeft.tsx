import {
  createSignal,
  Show,
  For,
  on,
  Switch,
  Match,
  createComputed,
} from "solid-js";
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

type HeaderNavLeftProps = {
  t: Translator;
  gameOptions: GameOptions;
  start: (opts: GameOptions, customSource: string) => void;
  setContentGeneration: (type: ContentGeneration) => void;
};

// Dropdown like animation with anime.js
// https://codepen.io/NielsVoogt/pen/dyGpNOx
const HeaderNavLeft = (props: HeaderNavLeftProps) => {
  css`
    .cursor {
      opacity: 0;
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

    .dropdown-wrapper {
      position: relative;
      margin-left: 12px;
      width: 200px;
      z-index: 205;
      height: 60px;

      opacity: 0.8;
    }

    .dropdown-wrapper:hover {
      opacity: 1;
      filter: none;
    }

    .dropdown-wrapper:hover .cursor {
      opacity: 1;
    }

    .dropdown-wrapper.open {
    }

    .dropdown {
      height: 50px;
      width: 200px;
      overflow: hidden;
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      border: 1px solid transparent;
      background-color: var(--color-surface-100);
      transition-duration: 0.5s;
      transition-timing-function: cubic-bezier(0.48, 1.08, 0.5, 0.63);
      transition-property: opacity, transform;
    }

    .dropdown:hover {
      border-radius: 12px;
      border: 1px solid var(--background-color);
    }

    .dropdown-wrapper.open .dropdown {
      height: 400px;
      padding: 40px;
      padding-top: 20px;
      width: 800px;
      max-width: 1200px;
      top: -20px;

      border: 1px solid var(--background-color);
      transform: scale(1.01);
      box-shadow:
        0.6px 1.8px 2.2px rgba(0, 0, 0, 0.02),
        1.5px 4.3px 5.3px rgba(0, 0, 0, 0.028),
        2.9px 8px 10px rgba(0, 0, 0, 0.035),
        5.1px 14.3px 17.9px rgba(0, 0, 0, 0.042),
        9.6px 26.7px 33.4px rgba(0, 0, 0, 0.05),
        23px 64px 80px rgba(0, 0, 0, 0.07);
    }

    .dropdown-wrapper.open .dropdown label {
      background-color: var(--color-surface-100);
    }
    .dropdown-wrapper.open .dropdown label:hover {
      background-color: var(--background-color);
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

    .menu-title-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 60px;
    }
    .menu-title {
      display: flex;
      font-size: 18px;
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
    .dropdown-wrapper.open .menu-title {
      border: 0;
      font-weight: 300;
      font-size: 20px;
      max-height: 80px;
      margin-bottom: 12px;
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

    .dropdown-wrapper.open .menu-title:before,
    .dropdown-wrapper:hover .menu-title:before {
      top: -50%;
      transform: rotate(5deg);
    }
    .dropdown-wrapper.open .menu-title:after,
    .dropdown-wrapper:hover .menu-title:after {
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
    .menu-game {
      display: flex;
    }
    .options-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-left: 1px solid var(--border-color);
      padding: 0 26px 26px;
      margin-bottom: 26px;
      width: 500px;
      height: 300px;
    }
  `;

  enum DropdownState {
    none = "",
    open = "open",
    selected = "selected",
  }

  // NOTE: convert it to type variant, and make an article about making it

  const [downState, setDownState] = createSignal<DropdownState>(
    DropdownState.none,
  );

  const [edited, setEdited] = createSignal(false);

  const clickHandler = () => {
    if (downState() === DropdownState.open) {
      setDownState(DropdownState.selected);
    } else {
      setDownState(DropdownState.open);
    }
  };

  /* doublon, manage temporal gameOptions */

  const [gameOptions, setGameOptions] = createStore<GameOptions>(
    deepCopy(props.gameOptions),
  );

  // const resetOptions = () => {
  //   setGameOptions(deepCopy(props.gameOptions));
  //   setEdited(false);
  // };

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

  const start = () => {
    props.start(gameOptions, customRef.ref ? customRef.ref.value : "");
  };

  return (
    <div class="header-mode">
      <div class={`dropdown-wrapper ${downState()}`}>
        <div
          class="dropdown"
          ref={(el) => {
            el.addEventListener("mouseleave", () =>
              setDownState(DropdownState.none),
            );
          }}
        >
          <div class="menu-title-wrapper">
            <div
              class="menu-title"
              onClick={clickHandler}
              data-passive={`${props.t("gameMode")[gameOptions.modeSelected].subtitle}`}
              data-active={`${props.t("newGame.one")} ${props.t("newGame.two")}`}
            >
              <Show when={downState() !== DropdownState.open}>
                <span class="cursor">▼</span>
              </Show>
            </div>
          </div>
          <div class="menu-game">
            <ul class="modes">
              <For each={gameModesArray}>
                {([modeKind, mode]) => (
                  <li
                    class={`radio ${modeKind}`}
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
              <div class="options">
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
              <div class="actions">
                <button onClick={start} class="primary">
                  {props.t("letsGo")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="options-recap">
        <GameOptionsRecap gameOptions={props.gameOptions} t={props.t} />
      </div>
    </div>
  );
};

export default HeaderNavLeft;
