import { css } from "solid-styled";
import Play from "../svgs/play.tsx";
import Reset from "../svgs/reset.tsx";
import type { StatProjection } from "../metrics/KeypressMetrics.ts";
import {
  Show,
  type JSXElement,
  createSignal,
  onMount,
  onCleanup,
  Switch,
  Match,
  createEffect,
} from "solid-js";
import Nav from "../svgs/nav-abs.tsx";
import Gauge from "../svgs/gauge.tsx";
import Accuracy from "../svgs/accuracy.tsx";
import Cross from "../svgs/cross.tsx";
import Shuffle from "../svgs/shuffle.tsx";
import type { Translator } from "../App.tsx";
import anime from "animejs";
import ProgressBar from "../svgs/progressBar.tsx";

/* Doublon */
export type KeyboardHandler = {
  keyUp: (key: string) => void;
  keyDown: (key: string) => void;
};
/* *** */

type TypingNavProps = {
  t: Translator;
  isGenerated: boolean;
  isPaused: boolean;
  stat: StatProjection;
  children?: JSXElement;
  progress: number;
  keyboard?: (kbHandler: KeyboardHandler) => void;
  onPause: () => void;
  onReset: () => void;
  onShuffle: () => void;
  onExit: () => void;
};

const TypingNav = (props: TypingNavProps) => {
  const getVw = () =>
    Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

  const getNavWidth = (vw: number) => {
    const dynamic = vw - 232;
    return dynamic > 900 ? 900 : dynamic;
  };
  const [navWidth, setNavWidth] = createSignal(getNavWidth(getVw()));

  const getNavBorder = (vw: number) => {
    return Math.floor((vw - navWidth() - 231) / 2);
  };
  const [navBorder, setNavBorder] = createSignal(getNavBorder(getVw()));

  const resize = () => {
    const vw = getVw();
    setNavWidth(getNavWidth(vw));
    setNavBorder(getNavBorder(vw));
  };

  let wpmElem: HTMLSpanElement;
  let accuracyElem: HTMLSpanElement;

  createEffect((prevAnim: anime.AnimeInstance | undefined) => {
    const wpm = Math.trunc(props.stat.speed.byWord[0]);
    const wpmFromElem = parseInt(wpmElem.innerHTML);

    if (wpm === 0) anime.remove(wpmElem);
    const duration = wpm === 0 ? 100 : wpmFromElem === 0 ? 200 : 960;

    return anime({
      targets: wpmElem,
      innerHTML: [wpmFromElem, wpm],
      easing: "easeInExpo",
      duration,
      round: 1,
    });
  });

  createEffect(() => {
    const acc = Math.trunc(props.stat.accuracies[1]);
    const accFromElem = parseInt(accuracyElem.innerHTML);

    if (acc === 0) anime.remove(accuracyElem);
    const duration = acc === 0 ? 100 : accFromElem === 0 ? 200 : 960;

    return anime({
      targets: accuracyElem,
      innerHTML: [accFromElem, acc],
      easing: "easeInExpo",
      duration,
      round: 1,
    });
  });

  type PauseKeys = {
    ctrl: boolean;
    shift: boolean;
    space: boolean;
  };

  let [pauseKeys, setPauseKeys] = createSignal<PauseKeys>({
    ctrl: false,
    shift: false,
    space: false,
  });

  const keyDown = (key: string) => {
    if (key === "Control") setPauseKeys({ ...pauseKeys(), ctrl: true });
    else if (key === "Shift") setPauseKeys({ ...pauseKeys(), shift: true });
    else if (key === " ") setPauseKeys({ ...pauseKeys(), space: true });
  };

  const keyUp = (key: string) => {
    if (key === "Control") setPauseKeys({ ...pauseKeys(), ctrl: false });
    else if (key === "Shift") setPauseKeys({ ...pauseKeys(), shift: false });
    else if (key === " ") setPauseKeys({ ...pauseKeys(), space: false });
  };

  createEffect(() => {
    if (pauseKeys().ctrl && pauseKeys().shift && pauseKeys().space) {
      props.onPause();
    }
  });

  onMount(() => {
    window.addEventListener("resize", resize);
    props.keyboard?.({ keyUp, keyDown });
  });

  onCleanup(() => {
    window.removeEventListener("resize", resize);
  });

  css`
    .remote,
    .stats {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .stat {
      display: flex;
      align-items: center;
      gap: 2px;
      color: var(--text-secondary-color);
    }
    .stat span,
    .pourcent {
      padding-top: 6px;
      text-align: right;
      font-size: 18px;
      font-weight: 400;
      color: var(--text-secondary-color);
      min-width: 23px;
    }
    .accuracy .pourcent {
      min-width: 36px;
    }

    .wpm span,
    .accuracy .pourcent {
      margin-right: 2px;
    }

    .pourcent {
      font-size: 14px;
      font-weight: 800;
    }

    .typing-nav {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .progress-bar {
      height: 8px;
      display: flex;
    }

    nav {
      height: 63.593px;
      display: flex;
      justify-content: center;
    }
    .svg-wrapper {
      position: absolute;
      left: 0;
      right: 0;
      top: 1px;
      height: 63.593px;
      z-index: -1;
    }
    .content {
      display: flex;
      max-width: 900px;
      width: calc(100vw - 232px);
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .clickable {
      cursor: pointer;
    }
    .cross {
      padding-top: 2px;
    }

    span {
      color: var(--text-secondary-color);
    }

    .help {
      font-size: 17px;
      font-weight: 200;
    }
    .help-content {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .help .key {
      border-radius: 6px;
      background-color: var(--text-secondary-color);
      color: var(--color-surface-alt);
      font-size: 12px;
      padding: 6px 6px;
      font-weight: 600;
    }
  `;

  // pitetre interessant: https://codepen.io/juliangarnier/pen/XvjWvx
  // https://codepen.io/AlikinVV/pen/OrmJxj

  return (
    <div class="typing-nav">
      <nav>
        <div class="svg-wrapper">
          <Nav width={navWidth()} borderWidth={navBorder()} />
        </div>
        <div class="content">
          <div class="remote">
            <div class="" onClick={props.onPause}>
              <Play paused={props.isPaused} />
            </div>
            <div class="clickable" onclick={props.onReset}>
              <Reset />
            </div>
            <Show when={props.isGenerated}>
              <div class="clickable" onClick={props.onShuffle}>
                <Shuffle />
              </div>
            </Show>
            <Show when={props.children}>
              <div class="child">{props.children}</div>
            </Show>
          </div>
          <div class="help">
            <Switch>
              <Match when={props.isPaused}>
                <div class="help-content">
                  <span>{props.t("typingGame.typeToPlay")}</span>
                </div>
              </Match>
              <Match when={!props.isPaused}>
                <div class="help-content">
                  <span class="key">Ctrl</span>
                  <span>+</span>
                  <span class="key">Shift</span>
                  <span>+</span>
                  <span class="key">{props.t("space")}</span>
                  <span> {props.t("typingGame.toPause")}</span>
                </div>
              </Match>
            </Switch>
          </div>
          <div class="stats">
            <div class="stat wpm">
              <span ref={wpmElem!}>0</span>
              <Gauge speed={props.stat.speed.byWord[0]} />
            </div>
            <div class="stat accuracy">
              <p class="pourcent">
                <span ref={accuracyElem!}>0</span>%
              </p>
              <Accuracy correct={props.stat.accuracies[1] === 100} />
            </div>
            <div class="cross clickable" onClick={props.onExit}>
              <Cross />
            </div>
          </div>
        </div>
      </nav>
      <div class="progress-bar">
        <ProgressBar progress={props.progress} />
      </div>
    </div>
  );
};

export default TypingNav;

// <span class="wpm">WPM: {Math.trunc(wpm())}</span>
//
// UI Stuff
// preview on hover
// https://uiverse.io/PriyanshuGupta28/massive-ape-73
//
// splash
// https://uiverse.io/Shoh2008/big-deer-80
//
// cool todo bar, with spash
// https://uiverse.io/JkHuger/warm-panther-74
//
// THE play button
//https://uiverse.io/catraco/wet-rabbit-81
//
//
// StopWatch animejs
// https://codepen.io/MrSung/pen/xaRdjN
