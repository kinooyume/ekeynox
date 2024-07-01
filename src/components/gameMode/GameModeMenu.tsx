import { Match, Switch, createComputed, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { css } from "solid-styled";

import { GameModeKind } from "../../gameOptions/gameModeKind.ts";
import {
  CategoryKind,
  deepCopy,
  type ContentGeneration,
  type GameOptions,
} from "../../gameOptions/gameOptions";
import { useI18n } from "../../settings/i18nProvider";
import Bunny from "../svgs/bunny";
import Monkey from "../svgs/monkey";
import CustomInput, { type CustomInputRef } from "../ui/CustomInput";
import GameModeSelection from "./GameModeSelection";
import SpeedParams from "./SpeedParams";
import TimerParams from "./TimerParams";
import { A, useBeforeLeave } from "@solidjs/router";
import { Portal } from "solid-js/web";
import anime from "animejs";

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
  gameOptions: GameOptions;
  fetchSourcesGen: (opts: ContentGeneration) => Promise<Array<string>>;
  start: (opts: GameOptions) => void;
};

const customRef: CustomInputRef = {
  ref: undefined,
};

const GameModeKindMenu = (props: GameModeKindMenuProps) => {
  const t = useI18n();

  useBeforeLeave((e) => {
    start();
  });

  const [isReady, setIsReady] = createSignal(false);
  const [customValue, setCustomValue] = createSignal("");

  const [gameOptions, setGameOptions] = createStore<GameOptions>(
    deepCopy(props.gameOptions),
  );

  createComputed(
    () => {
      setGameOptions(deepCopy(props.gameOptions));
    },
    { defer: true },
  );

  createComputed(() => {
    props.fetchSourcesGen({
      language: gameOptions.generation.language,
      category: gameOptions.generation.category,
    });
  });

  createComputed(() => {
    if (gameOptions.categorySelected.kind !== CategoryKind.custom)
      setIsReady(true);
    else {
      setIsReady(customValue().length > 0);
    }
  });

  const start = () => {
    if (gameOptions.categorySelected.kind === CategoryKind.custom) {
      setGameOptions("custom", customRef.ref ? customRef.ref.value : "");
    }
    props.start(gameOptions);
  };

  css`
    .version {
      font-weight: 200;
      color: var(--text-secondary-color);
    }
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
      grid-template-columns: 1fr 1.2fr;
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
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .illustration-container {
      height: 340px;
      width: 380px;
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
      font-size: 4rem;
      margin-bottom: 0;
      font-weight: 100;
      text-transform: capitalize;
    }

    h3 {
      color: var(--text-secondary-color);
      font-size: 1.1rem;
      margin-top: 2px;
      font-weight: 500;
    }

    .title-mode {
      margin-top: 100px;
    }
    .game-description {
      max-width: 90%;
      margin-bottom: 0;
    }

    .game-description {
      display: flex;
      flex-direction: column;
      gap: 12px;
      height: 75%;
    }

    .description {
      margin-top: 46px;
      max-width: 500px;
    }

    .primary {
      height: 48px;
      margin-top: auto;
      margin-right: auto;
    }

    .options-title {
      font-size: 26px;
      font-weight: 300;
      margin-top: 22px;
      text-transform: capitalize;
      margin-bottom: 22px;
    }
  `;

  // onMount(() => {
  //   anime.timeline().add({
  //     targets: ".menu .title-content *",
  //     translateY: [-80, 0],
  //     opacity: [0, 1],
  //     easing: "easeOutElastic(1, 0.9)",
  //     duration: 800,
  //     delay: (el, i) => 100 * i,
  //   });
  //
  // })

  return (
    <div class="menu">
      <div class="main-view">
        <div class="hud">
          <div class="title">
            <div class="title-content">
              <span>{t("chooseYour")}</span>
              <h1>{t("playingMode")}</h1>
            </div>
          </div>
          <div class="selection">
            <GameModeSelection
              selected={gameOptions.modeSelected}
              setSelected={(mode: GameModeKind) =>
                setGameOptions("modeSelected", mode)
              }
            />
          </div>
        </div>
        <div class="cliped">
          <div class="illustration">
            <div class="illustration-container">
              <Switch>
                <Match when={gameOptions.modeSelected === GameModeKind.speed}>
                  <Monkey />
                </Match>
                <Match when={gameOptions.modeSelected === GameModeKind.timer}>
                  <Bunny />
                </Match>
              </Switch>
            </div>
          </div>
          <div class="game-description">
            <Switch>
              <Match
                when={gameOptions.modeSelected === GameModeKind.speed}
                keyed
              >
                <div class="text">
                  <h2 class="title-mode">{t("gameMode.speed.title")}</h2>
                  <h3>{t("gameMode.speed.subtitle")}</h3>
                  <p class="description">
                    {t("gameMode.speed.hugeDescription")}
                  </p>
                </div>

                <div class="options">
                  {/* <h2 class="options-title">{t("options")}</h2> */}
                  <SpeedParams
                    gameOptions={gameOptions}
                    setGameOptions={setGameOptions}
                  >
                    <CustomInput
                      value={customValue()}
                      customInput={customRef}
                      onInput={setCustomValue}
                    />
                  </SpeedParams>
                </div>
              </Match>
              <Match
                when={gameOptions.modeSelected === GameModeKind.timer}
                keyed
              >
                <div class="text">
                  <h2 class="title-mode">{t("gameMode.timer.title")}</h2>
                  <h3>{t("gameMode.timer.subtitle")}</h3>
                  <p class="description">
                    {t("gameMode.timer.hugeDescription")}
                  </p>
                </div>
                <div class="options">
                  {/* <h2 class="options-title">{t("options")}</h2> */}
                  <TimerParams
                    gameOptions={gameOptions}
                    setGameOptions={setGameOptions}
                  >
                    <CustomInput
                      value={customValue()}
                      customInput={customRef}
                      onInput={setCustomValue}
                    />
                  </TimerParams>
                </div>
              </Match>
            </Switch>

            <a
              class="primary"
              classList={{ locked: !isReady() }}
              href="/typing"
            >
              {t("letsGo")}
            </a>
          </div>
        </div>
      </div>
      <Portal mount={document.getElementById("header-nav-actions-portal")!}>
        <span class="version">Alpha 0.13-0</span>
      </Portal>
    </div>
  );
};

export default GameModeKindMenu;
