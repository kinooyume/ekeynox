import {
  Match,
  Switch,
  createComputed,
  createSignal,
  on,
  onMount,
} from "solid-js";
import { makeEventListener } from "@solid-primitives/event-listener";
import { createStore } from "solid-js/store";
import { useNavigate, usePreloadRoute } from "@solidjs/router";
import { css } from "solid-styled";

import { useI18n } from "~/contexts/i18nProvider";

import { TypingModeKind } from "~/typingOptions/typingModeKind";

import {
  CategoryKind,
  deepCopy,
  type ContentGeneration,
  type TypingOptions,
} from "~/typingOptions/typingOptions";

import TypingModeSelection from "./TypingModeSelection";
import SpeedParams from "./SpeedParams";
import TimerParams from "./TimerParams";

import CustomInput, { type CustomInputRef } from "../ui/CustomInput";

import Bunny from "~/svgs/bunny";
import Monkey from "~/svgs/monkey";

// SELECTION de Personnage: ABSOLUMENT PARFAIT
// MOBILE:  https://www.linkedin.com/posts/hammadx02_flutter-appdevelopment-activity-7241460889885851648-eW69?utm_source=share&utm_medium=member_android

// Le gars a fait pleins de menu de selection stylax
// https://in.pinterest.com/pin/12525705207244555/
//
//Et eux ils font des trucs de malade en mode qui pourrait bien allez à des jeux et tout
// https://dribbble.com/studiovor
//
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

type TypingModeKindMenuProps = {
  typingOptions: TypingOptions;
  fetchSourcesGen: (opts: ContentGeneration) => Promise<Array<string>>;
  start: (opts: TypingOptions) => void;
};

const customRef: CustomInputRef = {
  ref: undefined,
};

const TypingModeKindMenu = (props: TypingModeKindMenuProps) => {
  const t = useI18n();

  const navigate = useNavigate();

  // useBeforeLeave((e) => {
  //   start();
  // });

  const [isReady, setIsReady] = createSignal(false);
  const [customValue, setCustomValue] = createSignal("");

  createComputed(
    on(
      () => props.typingOptions,
      () => {
        setCustomValue(props.typingOptions.custom);
      },
    ),
  );

  const [typingOptions, setTypingOptions] = createStore<TypingOptions>(
    deepCopy(props.typingOptions),
  );

  createComputed(
    () => {
      setTypingOptions(deepCopy(props.typingOptions));
    },
    { defer: true },
  );

  createComputed(() => {
    props.fetchSourcesGen({
      language: typingOptions.generation.language,
      category: typingOptions.generation.category,
    });
  });

  createComputed(() => {
    if (typingOptions.categorySelected.kind !== CategoryKind.custom)
      setIsReady(true);
    else {
      setIsReady(customValue().length > 1);
    }
  });

  const start = () => {
    if (typingOptions.categorySelected.kind === CategoryKind.custom) {
      setTypingOptions("custom", customRef.ref ? customRef.ref.value : "");
    }
    props.start(typingOptions);
    navigate("/typing");
  };

  const [vh, setVh] = createSignal<string>("1vh");
  css`
    .main-view {
      position: relative;
      --vh: ${vh()};
    }

    .cliped {
      clip-path: url(#choose-clip);
      object-fit: cover;
      background-size: cover;
      background-color: var(--color-surface-alt);
    }

    .cliped,
    .hud {
      display: grid;
      aspect-ratio: 203/106;
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
      font-size: 3.3rem;
      margin-bottom: 0;
      font-weight: 100;
    }

    h3 {
      color: var(--text-secondary-color);
      font-size: 1.3rem;
      text-transform: capitalize;
      margin-top: 6px;
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
    .options {
      max-width: 560px;
    }

    .button-wrapper {
      display: flex;
      margin-top: auto;
    }
    @media screen and (max-width: 1400px) {
      .illustration-container {
        height: 280px;
        width: 320px;
      }

      .title {
        padding-left: 36px;
      }
      .title span {
        font-size: 1rem;
      }
      .title h1 {
        font-size: 2.2rem;
      }

      h2 {
        font-size: 2.8rem;
      }

      h3 {
        font-size: 1.2rem;
      }
      .title-mode {
        margin-top: 80px;
      }
      .description {
        margin-top: 24px;
      }

      .game-description {
        height: 80%;
      }
    }
    @media screen and (max-width: 1200px) {
      .illustration-container {
        height: 240px;
        width: 280px;
      }

      .title h1 {
        font-size: 2rem;
      }

      h2 {
        font-size: 2.4rem;
      }

      h3 {
        font-size: 1.1rem;
        margin-top: 0;
      }
      .title-mode {
        margin-top: 64px;
      }
      .description {
        display: none;
      }
    }

    @media screen and (max-width: 1000px) {
      .illustration-container {
        height: 200px;
        width: 240px;
      }
      .title-mode {
        margin-top: 36px;
      }
    }
    @media screen and (max-width: 900px) {
      .title h1 {
        font-size: 1.7rem;
      }
    }
    @media screen and (max-width: 860px) {
      h2 {
        font-size: 2rem;
      }
    }
    @media screen and (max-width: 860px) {
      .cliped {
        clip-path: none;
        border-radius: 20px;
        margin: 0 12px;
        margin-top: 64px;
        padding: 32px 0;
        height: calc(var(--vh) * 100 - 284px);
      }
      .hud {
        flex-direction: row !important;
        align-items: flex-start;
        width: 100%;
        justify-content: space-between;
        top: -64px;
        height: 64px;
        margin-bottom: 0;
      }
      .cliped,
      .hud {
        display: flex;
        flex-direction: column;
        aspect-ratio: unset;
        margin-bottom: 82px;
      }
      .selection {
        align-items: flex-start;
      }

      .illustration-container {
        width: calc(var(--vh) * 55 - 284px);
        height: auto;
      }

      .button-wrapper {
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 16px 0;
        position: fixed;
        bottom: 0;
        left: 0;
        background-color: var(--color-surface-100);
      }
      .title-mode {
        margin-top: 16px;
      }

      .game-description {
        margin: 0 32px;
        height: unset;
      }
      .primary {
        margin-right: unset;
      }
    }

    @media screen and (max-width: 860px) and (max-height: 680px) {
      .illustration-container {
        display: none;
      }
      .title h1 {
        font-size: 1.4rem;
      }
      .title-mode {
        margin-top: 0;
      }
      .cliped {
        overflow: scroll;
      }
    }
    @media screen and (max-width: 370px) {
      .title h1 {
        font-size: 1.4rem;
      }
    }
  `;

  const appHeight = () => {
    const vh = window.innerHeight * 0.01;
    setVh(`${vh}px`);
  };

  onMount(() => {
    const preload = usePreloadRoute();
    appHeight();
    const clearWindowEvent = makeEventListener(window, "resize", appHeight);
    // document?.addEventListener("resize", appHeight);
    preload(new URL(`${import.meta.env.VITE_BASE_URL}/typing`), {
      preloadData: true,
    });
    //   anime.timeline().add({
    //     targets: ".menu .title-content *",
    //     translateY: [-80, 0],
    //     opacity: [0, 1],
    //     easing: "easeOutElastic(1, 0.9)",
    //     duration: 800,
    //     delay: (el, i) => 100 * i,
    //   });
    //
  });
  return (
    <div class="menu">
      <form class="main-view">
        <div class="hud">
          <div class="title">
            <div class="title-content">
              <span>{t("chooseYour")}</span>
              <h1>{t("playingMode")}</h1>
            </div>
          </div>
          <div class="selection">
            <TypingModeSelection
              selected={typingOptions.modeSelected}
              setSelected={(mode: TypingModeKind) =>
                setTypingOptions("modeSelected", mode)
              }
            />
          </div>
        </div>
        <div class="cliped">
          <div class="illustration">
            <div class="illustration-container">
              <Switch>
                <Match
                  when={typingOptions.modeSelected === TypingModeKind.speed}
                >
                  <Monkey />
                </Match>
                <Match
                  when={typingOptions.modeSelected === TypingModeKind.timer}
                >
                  <Bunny />
                </Match>
              </Switch>
            </div>
          </div>
          <div class="game-description">
            <Switch>
              <Match
                when={typingOptions.modeSelected === TypingModeKind.speed}
                keyed
              >
                <div class="text">
                  <h2 class="title-mode">{t("typingMode.speed.subtitle")}</h2>
                  <h3>{t("typingMode.speed.title")}</h3>
                  <p class="description">
                    {t("typingMode.speed.hugeDescription")}
                  </p>
                </div>

                <div class="options">
                  {/* <h2 class="options-title">{t("options")}</h2> */}
                  <SpeedParams
                    typingOptions={typingOptions}
                    setTypingOptions={setTypingOptions}
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
                when={typingOptions.modeSelected === TypingModeKind.timer}
                keyed
              >
                <div class="text">
                  <h2 class="title-mode">{t("typingMode.timer.subtitle")}</h2>
                  <h3>{t("typingMode.timer.title")}</h3>
                  <p class="description">
                    {t("typingMode.timer.hugeDescription")}
                  </p>
                </div>
                <div class="options">
                  {/* <h2 class="options-title">{t("options")}</h2> */}
                  <TimerParams
                    typingOptions={typingOptions}
                    setTypingOptions={setTypingOptions}
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
            <div class="button-wrapper">
              <button
                class="primary"
                type="submit"
                classList={{ locked: !isReady() }}
                onClick={(e) => {
                  e.preventDefault();
                  start();
                }}
              >
                {t("letsGo")}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TypingModeKindMenu;
