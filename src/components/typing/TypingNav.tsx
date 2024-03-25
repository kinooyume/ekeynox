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
} from "solid-js";
import Nav from "../svgs/nav-abs.tsx";
import Gauge from "../svgs/gauge.tsx";
import Accuracy from "../svgs/accuracy.tsx";
import Cross from "../svgs/cross.tsx";
import type { Translator } from "../App.tsx";

type TypingNavProps = {
  t: Translator;
  isPaused: boolean;
  stat: StatProjection;
  children?: JSXElement;
  onPause: () => void;
  onReset: () => void;
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
  onMount(() => {
    window.addEventListener("resize", resize);
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
      color: grey;
    }
    .stat span {
      padding-top: 2px;
      font-size: 16px;
      color: grey;
      min-width: 23px;
    }
    .accuracy span {
      min-width: 36px;
    }
    nav {
      height: 63.593px;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
    }
    .svg-wrapper {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
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
    .cross {
      cursor: pointer;
      padding-top: 2px;
    }
    .help {
      opacity: 0.6;
    }
    .help,
    .help span {
      color: grey;
    }

    .help .key {
      background-color: grey;
      color: var(--color-surface-alt);
      font-size: 12px;
      padding: 4px;
    }
  `;

  return (
    <nav>
      <div class="svg-wrapper">
        <Nav width={navWidth()} borderWidth={navBorder()} />
      </div>
      <div class="content">
        <div class="remote">
          <div onClick={props.onPause}>
            <Play paused={props.isPaused} />
          </div>
          <div onclick={props.onReset}>
            <Reset />
          </div>
          <Show when={props.children}>
            <div class="child">{props.children}</div>
          </Show>
        </div>
        <div class="help">
          <Switch>
            <Match when={props.isPaused}>
              <span>{props.t("typingGame.typeToPlay")}</span>
            </Match>
            <Match when={!props.isPaused}>
              <div>
                <span class="key">Ctrl</span> +<span class="key">Shift</span> +
                <span class="key">{props.t("space")}</span>
                <span> {props.t("typingGame.toPause")}</span>
              </div>
            </Match>
          </Switch>
        </div>
        <div class="stats">
          <div class="stat wpm">
            <Gauge speed={props.stat.speed.byWord[0]} />
            <span>{Math.trunc(props.stat.speed.byWord[0])}</span>
          </div>
          <div class="stat accuracy">
            <Accuracy correct={props.stat.accuracies[1] === 100} />
            <span>{Math.trunc(props.stat.accuracies[1])}%</span>{" "}
          </div>
          <div class="cross">
            <Cross />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TypingNav;

// <span class="wpm">WPM: {Math.trunc(wpm())}</span>
