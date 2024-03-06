import { css } from "solid-styled";
import { Match, Switch, createSignal } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";

import GameRandomParams from "./GameRandomParams";
import GameModeCard from "./GameModeCard";
import {
  GameMode,
  WordsCategory,
  type GameOptions,
  type Translator,
} from "./App";
import GameTimerParams from "./GameTimerParams";
import GameModeSelection from "./GameModeSelection";
import Bunny from "./ui/bunny";
import { Transition } from "solid-transition-group";
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
type GameModeMenuProps = {
  t: Translator;
  setGameMode: (mode: GameMode) => void;
  setContent: (content: string) => void;
  gameOptions: GameOptions;
  setGameOptions: SetStoreFunction<GameOptions>;
};

const GameModeMenu = (props: GameModeMenuProps) => {
  const setMonkey = (content?: string) => {
    if (props.gameOptions.wordsCategory === WordsCategory.custom) {
      props.setContent(content || "");
    }
    props.setGameMode(GameMode.monkey);
  };

  const setRabbit = (content?: string) => {
    if (props.gameOptions.wordsCategory === WordsCategory.custom) {
      props.setContent(content || "");
    }
    props.setGameMode(GameMode.rabbit);
  };
  css`
    .main-view {
      position: relative;
    }
    .cliped {
      clip-path: url(#choose-clip);
      object-fit: cover;
      background-size: cover;
      background-color: var(--color-surface-alt);
      width: 100%;
      height: calc(100vw - 122px);
      max-height: 800px;
      display: flex;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr;
      grid-column-gap: 0px;
      grid-row-gap: 0px;
      overflow: hidden;
    }
    .title {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      width: 360px;
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
      color: var(--color-primary-600);
      font-size: 1.1rem;
    }
    .title h1 {
      margin: 0;
      font-weight: 200;
      font-size: 3rem;
    }
    .selection {
      position: absolute;
      bottom: 0;
      right: 32px;
    }
    h2 {
      font-size: 4rem;
      margin-bottom: 0;
      text-transform: capitalize;
      font-weight: 100;
    }
    h3 {
      margin-top: 8px;
      margin-bottom: 46px;
      font-weight: 200;
      color: var(--color-primary-600);
    }
    .description {
      max-width: 80%;
    }
  `;
  return (
    <div class="menu">
      <div class="main-view">
        <div class="title">
          <div class="title-content">
            <span>{props.t("chooseYour")}</span>
            <h1>{props.t("playingMode")}</h1>
          </div>
        </div>
        <div class="cliped">
          <div class="illustration">
            <div class="illustration-container">
              <Switch>
                <Match
                  when={props.gameOptions.lastGameMode === GameMode.monkey}
                >
                  <Bunny />
                </Match>
                <Match
                  when={props.gameOptions.lastGameMode === GameMode.rabbit}
                >
                  <Bunny />
                </Match>
              </Switch>
            </div>
          </div>
          <Switch>
            <Match when={props.gameOptions.lastGameMode === GameMode.monkey}>
              <div class="option">
                <div class="text">
                  <h2>{props.t("gameMode.monkey.title")}</h2>
                  <h3>{props.t("gameMode.monkey.subtitle")}</h3>
                  <p class="description">
                    {props.t("gameMode.monkey.hugeDescription")}
                  </p>
                </div>
                <GameRandomParams
                  start={setMonkey}
                  words={props.gameOptions.wordNumber}
                  language={props.gameOptions.language}
                  wordsCategory={props.gameOptions.wordsCategory}
                  setWords={(words) =>
                    props.setGameOptions("wordNumber", words)
                  }
                  setLanguage={(language) =>
                    props.setGameOptions("language", language)
                  }
                  setWordsCategory={(wordsCategory) =>
                    props.setGameOptions("wordsCategory", wordsCategory)
                  }
                  t={props.t}
                />
              </div>
            </Match>
            <Match when={props.gameOptions.lastGameMode === GameMode.rabbit}>
              <div class="option">
                <div class="text">
                  <h2>{props.t("gameMode.rabbit.title")}</h2>
                  <h3>{props.t("gameMode.rabbit.subtitle")}</h3>
                  <p class="description">
                    {props.t("gameMode.rabbit.hugeDescription")}
                  </p>
                </div>
                <GameTimerParams
                  start={setRabbit}
                  time={props.gameOptions.time}
                  language={props.gameOptions.language}
                  wordsCategory={props.gameOptions.wordsCategory}
                  setTime={(time) => props.setGameOptions("time", time)}
                  setLanguage={(language) =>
                    props.setGameOptions("language", language)
                  }
                  setWordsCategory={(wordsCategory) =>
                    props.setGameOptions("wordsCategory", wordsCategory)
                  }
                  t={props.t}
                />
              </div>
            </Match>
          </Switch>
        </div>
        <div class="selection">
          <GameModeSelection
            t={props.t}
            modes={{
              rabbit: props.t("gameMode.rabbit"),
              monkey: props.t("gameMode.monkey"),
            }}
            selected={props.gameOptions.lastGameMode}
            setSelected={(mode) => props.setGameOptions("lastGameMode", mode)}
          />
        </div>
      </div>
    </div>
  );
};

export default GameModeMenu;
