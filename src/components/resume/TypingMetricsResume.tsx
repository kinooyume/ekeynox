import anime from "animejs";
import {
  createComputed,
  createSignal,
  onCleanup,
  onMount,
  type JSXElement
} from "solid-js";
import { css } from "solid-styled";
import { useI18n } from "~/settings/i18nProvider";
import { HigherKeyboard } from "~/settings/keyboardLayout";
import GameOptionsTitle from "../gameMode/GameOptionsTitle";
import {
  createMetricsResume,
  type Metrics,
  type MetricsResume,
} from "../metrics/Metrics";
import AccuracyDoughnut from "./charts/AccuracyDoughnut";
import CharacterChart from "./charts/CharacterChart";
import SpeedChart from "./charts/SpeedChart";
import WordMetricsResume from "./charts/WordsChart";
import Prompt from "./PromptResume";
import TypingKeyboardResume from "./TypingKeyboardResume";

type TypingMetricsProps = {
  kbLayout: HigherKeyboard;
  metrics: Metrics;
  children: (n: MetricsResume) => JSXElement;
};

// Cool mobile version
// https://x.com/slavakornilov/status/1787408908069515499
//
const TypingMetricsResume = (props: TypingMetricsProps) => {
  const t = useI18n();
  const keysSet = new Set(Object.keys(props.metrics.keys));
  const [kbLayout, setKbLayout] = createSignal(props.kbLayout(keysSet));

  const [metricIndex, setMetricIndex] = createSignal(0);
  const metricsResume = createMetricsResume(props.metrics);

  const getTime = (duration: number) => {
    // from miliseconds to minutes and seconds
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);
    const secString = `${seconds}s`;
    if (minutes === 0) return secString;
    return `${minutes}m${secString}`;
  };

  createComputed(() => {
    const layout = props.kbLayout(keysSet);
    setKbLayout(layout);
  });

  css`
    .metrics {
      display: grid;
      grid-template-columns: 1fr min(1200px, 100%) max(400px) 1fr;
      grid-template-rows: 1fr;
      grid-column-gap: 10px;
    }

    .reset {
      margin: 64px;
    }
    .content-wrapper {
      position: relative;
      grid-column: 2;
      padding: 32px;
      height: 100%;
    }

    .content {
    }

    .sidebar-wrapper {
      grid-column: 3;
      position: relative;
    }

    .sidebar {
      position: fixed;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
    }
    .content-wrapper::-webkit-scrollbar {
      display: none;
    }

    .resume-header {
      display: flex;
      flex-direction: column;
      gap: 32px;
      background-color: var(--color-surface-alt);
      border-radius: 36px 36px 0 0;
      padding: 32px;
      padding-top: 58px;
    }

    .sticky {
      position: sticky;
      background-color: var(--color-surface-100);
      top: 0;
      z-index: 900;
    }

    .resume-menu {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 32px;
      height: 140px;
      z-index: 900;
      background-color: var(--color-surface-alt);
      border-radius: 0 0 36px 36px;
      border-bottom: 4px solid var(--color-surface-200);
    }

    .chart {
      padding: 46px 32px;
      border-radius: 16px;
    }

    .stat-header-content {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
    }

    .stat-title {
      font-size: 20px;
      text-transform: capitalize;
      margin: 16px 8px;
      margin-top: 8px;
      font-weight: 400;
    }

    .cards-wrapper {
      background-color: var(--color-surface-600);
      border: 1px solid var(--color-surface-mixed-600);
      padding: 12px;
      margin: 32px 0;
      border-radius: 18px;
    }

    .stat-card {
      background-color: var(--color-surface-100);
      background-color: white;

      border: 1px solid var(--color-surface-500);
      padding: 24px;
      border-radius: 18px;
    }

    .stat-card + .stat-card {
      margin-top: 32px;
    }

    .stat-card p {
      margin: 22px 12px;
      text-transform: capitalize;
      margin-top: 4px;
      font-size: 17px;
      opacity: 0.9;
    }

    .stat-card p.main-data {
      font-size: 3em;
      margin: 0;
    }
    .stat-card p.main-data-tiny {
      font-size: 2em;
      margin: 0;
    }

    .stat-card .subtitle {
      color: grey;
      margin: 0;
    }
    .stat-card .main-data span {
      font-size: 1.3rem;
      margin-left: 8px;
      opacity: 0.6;
    }
    .report .raw-data {
      opacity: 0.6;
      margin: 0;
    }
    .report .raw-data span {
      margin-left: 4px;
    }

    .sub-data {
      display: flex;
      gap: 16px;
    }

    .sidebar-wrapper .cards-wrapper {
      margin: 8px;
    }
  `;

  let resumeMenu: HTMLDivElement;

  onMount(() => {
    const initTop = resumeMenu.getBoundingClientRect().top;
    const blockAnimation = anime({
      targets: resumeMenu,
      autoplay: false,
      height: 54,
      elasticity: 200,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      easing: "easeInCubic",
      padding: 16,
    });

    const pictoAnimation = anime({
      targets: ".game-title .picto",
      width: 80,
      autoplay: false,
      elasticity: 200,
      easing: "easeInCubic",
    });

    const titleAnimation = anime({
      targets: ".game-title h1",
      "font-size": 20,
      autoplay: false,
      elasticity: 200,
      easing: "easeInCubic",
    });

    window.onscroll = () => {
      const top = resumeMenu.getBoundingClientRect().top;
      const pourcent = 1.0 - top / initTop;
      // NOTE: on peut avoir le pourcent reactive
      // et du coup gérer les animations dans chaque component
      blockAnimation.seek(pourcent * blockAnimation.duration);
      pictoAnimation.seek(pourcent * pictoAnimation.duration);
      titleAnimation.seek(pourcent * titleAnimation.duration);
    };
  });

  // window.onscroll = () => {
  //   const bodyST = document.body.scrollTop;
  //   const docST = document.documentElement.scrollTop;
  //   const docSH = document.documentElement.scrollHeight;
  //   const docCH = document.documentElement.clientHeight;
  //   // console.log everything
  //   // console.log("bodySt", bodyST);
  //   console.log("docST", docST);
  // };

  onCleanup(() => {
    window.onscroll = null;
  });

  return (
    <div class="metrics full-bleed">
      <div class="content-wrapper">
        <div class="content">
          <div class="resume-header">
            <div class="chart">
              <SpeedChart metrics={metricsResume.chart} />
            </div>
          </div>
          <div class="sticky">
            <div ref={resumeMenu!} class="resume-menu">
              <GameOptionsTitle
                t={t}
                gameOptions={props.metrics.gameOptions}
              />
              <div class="actions">{props.children(metricsResume)}</div>
            </div>
          </div>
          <div class="cards-wrapper">
            <h2 class="stat-title">
              {t("statistics.contentResumeTitle")}
            </h2>
            <div class="stat-card">
              <Prompt paragraphs={props.metrics.paragraphs} />
            </div>
          </div>
          <div class="cards-wrapper">
            <div class="stat-header">
              <div class="stat-header-content">
                <h2 class="stat-title">{t("statistics.title")}</h2>
              </div>
            </div>
            <div class="stat-content">
              <div class="stat-card">
                <p>{t("statistics.keysResumeTitle")}</p>
                <TypingKeyboardResume
                  layout={kbLayout()}
                  metrics={props.metrics.keys}
                />
              </div>
              <div class="stat-card">
                <p>{t("statistics.charactersTyped")}</p>
                <CharacterChart keys={metricsResume.keys} />
              </div>
              <div class="stat-card">
                <p>{t("statistics.wordsSpeedTitle")}</p>
                <WordMetricsResume words={metricsResume.words} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="sidebar-wrapper">
        <div class="sidebar">
          <div class="cards-wrapper">
            <h2 class="stat-title">{t("statistics.gameReport")}</h2>
            <div class="stat-card report">
              <AccuracyDoughnut stats={props.metrics.typing.logs!.value.stats}>
                <p class="wpm-data main-data">
                  {Math.trunc(
                    props.metrics.typing.logs!.value.stats.speed.byWord[0],
                  )}
                  <span>WPM</span>
                </p>
                <p class="raw-data">
                  {props.metrics.typing.logs!.value.stats.speed.byKeypress[1].toFixed(
                    2,
                  )}
                  <span>Raw</span>
                </p>
              </AccuracyDoughnut>
            </div>
          </div>
          <div class="sub-data">
            <div class="cards-wrapper">
              <div class="stat-card">
                <p class="main-data main-data-tiny">
                  {getTime(props.metrics.typing.logs!.value.core.duration)}
                </p>
                <p class="subtitle">{t("elapsedTime")}</p>
              </div>
            </div>
          </div>
          <div class="cards-wrapper">
            <div class="stat-card">
              <p class="main-data main-data-tiny">
                {(
                  props.metrics.typing.logs!.value.stats.consistency * 100
                ).toFixed(0)}
                <span>%</span>
              </p>
              <p class="subtitle">{t("consistency")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingMetricsResume;
