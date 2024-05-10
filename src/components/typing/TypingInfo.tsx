import { css } from "solid-styled";
import type { StatProjection } from "../metrics/KeypressMetrics.ts";
import {
  Show,
  type JSXElement,
  createSignal,
  onMount,
  onCleanup,
  createEffect,
} from "solid-js";
import Nav from "../svgs/nav-abs.tsx";
import Gauge from "../svgs/gauge.tsx";
import Accuracy from "../svgs/accuracy.tsx";
import anime from "animejs";
import ProgressBar from "../svgs/progressBar.tsx";
import MetricPreview from "../ui/MetricPreview.tsx";

type TypingNavProps = {
  stat: StatProjection;
  progress: number;
  typingHelp: JSXElement;
  children?: JSXElement;
};

const TypingInfo = (props: TypingNavProps) => {
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

  // TODO: refacto wpm/accuracy and others in a proper component
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

  onMount(() => {
    window.addEventListener("resize", resize);
  });

  onCleanup(() => {
    window.removeEventListener("resize", resize);
  });

  css`
    .stats {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .stat {
      font-size: 16px;
      font-weight: 600;
    }

    .wpm {
      width: 20px;
      padding-top: 0px;
      text-align: right;
    }
    .pourcent {
      width: 36px;
      text-align: right;
      color: var(--text-secondary-color);
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
      max-width: 830px;
      width: calc(100vw - 262px);
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .clickable {
      cursor: pointer;
    }

    span {
      color: var(--text-secondary-color);
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
          {props.typingHelp}
          <div class="stats">
            <Show when={props.children}>
              <div class="child">{props.children}</div>
            </Show>
            <MetricPreview picto={<Gauge speed={props.stat.speed.byWord[0]} />}>
              <span class="stat wpm" ref={wpmElem!}>
                0
              </span>
            </MetricPreview>
            <MetricPreview
              picto={<Accuracy correct={props.stat.accuracies[1] === 100} />}
            >
              <p class="pourcent">
                <span class="stat" ref={accuracyElem!}>
                  0
                </span>
                %
              </p>
            </MetricPreview>
          </div>
        </div>
      </nav>
      <div class="progress-bar">
        <ProgressBar progress={props.progress} />
      </div>
    </div>
  );
};

export default TypingInfo;

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
