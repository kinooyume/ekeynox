import { css } from "solid-styled";
import { Match, Switch, createEffect } from "solid-js";
import { createStore, type SetStoreFunction } from "solid-js/store";

import GameRandomParams from "./GameRandomParams";
import {
  type GameOptions,
  type ContentGeneration,
  GameModeKind,
} from "./GameOptions";
import GameTimerParams from "./GameTimerParams";
import Bunny from "../svgs/bunny";
import { Transition } from "solid-transition-group";
import CustomInput, { type CustomInputRef } from "../ui/CustomInput";
import GameModeSelection from "./GameModeSelection";
import type { Translator } from "../App";
// Gsap animation
// https://codepen.io/dev_loop/pen/MWKbJmO
// Store like this
// https://codemyui.com/ecommerce-grid-full-screen-product-click/
// select
//https://uiverse.io/3bdel3ziz-T/gentle-vampirebat-46
//
// Bouncing radio
// https://uiverse.io/it12uw/sour-mayfly-77
//
// Clean avec notif
// https://uiverse.io/Pradeepsaranbishnoi/heavy-dragonfly-92
//
// et celui la
// https://uiverse.io/Yaya12085/lucky-fox-35

// https://uiverse.io/Yaya12085/silent-liger-85
//
// take a list and make cards

type GameModeKindMenuProps = {
  t: Translator;
  gameOptions: GameOptions;
  setContentGeneration: (type: ContentGeneration) => void;
  start: (opts: GameOptions, customSource: string) => void;
};

const customRef: CustomInputRef = {
  ref: undefined,
};

const GameModeKindMenu = (props: GameModeKindMenuProps) => {
  const [gameOptions, setGameOptions] = createStore<GameOptions>(
    Object.assign({}, props.gameOptions),
  );

  createEffect(() => {
    props.setContentGeneration({
      language: gameOptions.generation.language,
      category: gameOptions.generation.category,
    });
  });

  const start = () => {
    props.start(gameOptions, customRef.ref ? customRef.ref.value : "");
  };

  css`
    .main-view {
      position: relative;
    }

    /* .main-view:before { */
    /*   display: block; */
    /*   content: ""; */
    /*   width: 100%; */
    /*   height: 100%; */
    /*   padding-top: calc(106/203 * 100%); */
    /**/
    /* } */
    .cliped {
      clip-path: url(#choose-clip);
      object-fit: cover;
      background-size: cover;
      background-color: var(--color-surface-alt);
    }

    .cliped,
    .hud {
      display: flex;
      display: grid;
      aspect-ratio: 203/106;
      /* position: absolute; */
      /* top: 0; */
      /* left: 0; */
      /* right: 0; */
      /* bottom: 0; */
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr;
      grid-column-gap: 0px;
      grid-row-gap: 0px;
      overflow: hidden;
    }

    .hud {
      position: absolute;
      height: 100%;
      display: grid;
      grid-template-rows: 1.2fr 8fr 2fr;
      grid-template-columns: 1fr 1fr 1fr;
      grid-column-gap: 0px;
      grid-row-gap: 0px;
    }
    .title {
      grid-area: 1 / 1 / 2 / 2;
      display: flex;
      flex-direction: column;
      padding-left: 64px;
    }

    .selection {
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      padding-right: 20px;
      grid-area: 3 / 3 / 4 / 4;
    }
    .illustration {
      padding-top: 91px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .illustration-container {
      height: 300px;
      width: 300px;
    }

    .option {
      display: flex;
      flex-direction: column;
      gap: 40px;
      align-items: flex-start;
      justify-content: flex-start;
    }
    .title span {
      margin: 0;
      color: var(--text-secondary-color);
      font-size: 1.1rem;
    }
    .title h1 {
      margin: 0;
      font-weight: 200;
      font-size: 2.8rem;
    }
    h2 {
      font-size: 3.8rem;
      margin-bottom: 0;
      text-transform: capitalize;
      font-weight: 100;
    }
    h3 {
      font-size: 1.1em;
      margin-top: 8px;
      margin-bottom: 46px;
      font-weight: 200;
      color: var(--text-secondary-color);
    }
    .description {
      max-width: 80%;
    }

    button {
      margin-top: 64px;
    }
  `;

  return (
    <div class="menu">
      <div class="main-view">
        <div class="hud">
          <div class="title">
            <div class="title-content">
              <span>{props.t("chooseYour")}</span>
              <h1>{props.t("playingMode")}</h1>
            </div>
          </div>
          <div class="selection">
            <GameModeSelection
              t={props.t}
              modes={props.t("gameMode")}
              selected={gameOptions.mode}
              setSelected={(mode: GameModeKind) => setGameOptions("mode", mode)}
            />
          </div>
        </div>
        <div class="cliped">
          <div class="illustration">
            <div class="illustration-container">
              <Switch>
                <Match when={gameOptions.mode === GameModeKind.monkey}>
                  <Bunny />
                </Match>
                <Match when={gameOptions.mode === GameModeKind.rabbit}>
                  <Bunny />
                </Match>
              </Switch>
            </div>
          </div>
          <div class="game-optons">
            <Switch>
              <Match when={gameOptions.mode === GameModeKind.monkey}>
                <div class="option">
                  <div class="text">
                    <h2>{props.t("gameMode.monkey.title")}</h2>
                    <h3>{props.t("gameMode.monkey.subtitle")}</h3>
                    <p class="description">
                      {props.t("gameMode.monkey.hugeDescription")}
                    </p>
                  </div>
                  <GameRandomParams
                    t={props.t}
                    gameOptions={gameOptions}
                    setGameOptions={setGameOptions}
                  >
                    <CustomInput
                      value={customRef.ref ? customRef?.ref.value : ""}
                      customInput={customRef}
                    />
                  </GameRandomParams>
                </div>
              </Match>
              <Match when={gameOptions.mode === GameModeKind.rabbit}>
                <div class="option">
                  <div class="text">
                    <h2>{props.t("gameMode.rabbit.title")}</h2>
                    <h3>{props.t("gameMode.rabbit.subtitle")}</h3>
                    <p class="description">
                      {props.t("gameMode.rabbit.hugeDescription")}
                    </p>
                  </div>
                  <GameTimerParams
                    t={props.t}
                    gameOptions={gameOptions}
                    setGameOptions={setGameOptions}
                  >
                    <CustomInput
                      value={customRef.ref ? customRef?.ref.value : ""}
                      customInput={customRef}
                    />
                  </GameTimerParams>
                </div>
              </Match>
            </Switch>
            <button class="primary" onClick={start}>
              {props.t("letsGo")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModeKindMenu;
