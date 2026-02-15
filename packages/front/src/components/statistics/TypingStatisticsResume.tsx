import {
  Show,
  createComputed,
  createSignal,
  onCleanup,
  onMount,
  type JSXElement,
} from "solid-js";
import { useWindowSize } from "@solid-primitives/resize-observer";

import { css } from "solid-styled";
import anime from "animejs";

import { useI18n } from "~/contexts/i18nProvider";

import {
  createTypingStatisticsResult,
  type TypingStatistics,
  type TypingStatisticsResult,
} from "~/typingStatistics";

import AccuracyDoughnut from "./charts/AccuracyDoughnut";
import CharacterChart from "./charts/CharacterChart";
import SpeedChart from "./charts/SpeedChart";
import WordTypingStatisticsResult from "./charts/WordsChart";
import Prompt from "../prompt/Prompt";

import TypingOptionsTitle from "../typingMode/TypingOptionsTitle";
import { HigherKeyboard } from "~/typingKeyboard/keyboardLayout";
import StatisticsKeyboard from "../virtualKeyboard/StatisticsKeyboard";
import { timeStringFromNumber } from "~/utils/timeFromNumber";

type TypingMetricsProps = {
  kbLayout: HigherKeyboard;
  typingStatistics: TypingStatistics;
  children: (n: TypingStatisticsResult) => JSXElement;
};

const TypingStatisticsResult = (props: TypingMetricsProps) => {
  const t = useI18n();
  const keysSet = new Set(Object.keys(props.typingStatistics.characters));
  const [kbLayout, setKbLayout] = createSignal(props.kbLayout(keysSet));

  const typingStatisticsResult = createTypingStatisticsResult(
    props.typingStatistics,
  );

  createComputed(() => {
    const layout = props.kbLayout(keysSet);
    setKbLayout(layout);
  });

  css`
    .metrics {
      display: grid;
      grid-template-columns: 1fr min(1100px, 100%) max(400px) 1fr;
      grid-template-rows: 1fr;
      grid-column-gap: 32px;
      position: absolute;
      left: 0;
    }

    .reset {
      margin: 64px;
    }

    .resume-header,
    .sticky,
    .statistics {
      grid-column: 2;
    }

    .sidebar-wrapper {
      grid-row: 1;
      grid-column: 3;
      position: relative;
    }

    .sidebar {
      display: flex;
      width: 100%;
      flex-direction: column;
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
      padding-bottom: 0;
      padding-top: 58px;
    }

    .aligned {
      align-items: center;
    }

    .flexed {
      display: flex;
    }
    .sticky {
      position: sticky;
      background-color: var(--color-surface-100);
      top: 0;
      z-index: 41;
    }

    .resume-menu {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 48px;
      height: 140px;
      z-index: 41;
      background-color: var(--color-surface-alt);
      border-radius: 0 0 36px 36px;
      border-bottom: 4px solid var(--color-surface-200);
    }

    .chart {
      padding: 46px 32px 16px 32px;
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

    .cards-wrapper.tiny {
      padding: 4px;
      width: 100%;
    }

    .stat-card {
      background-color: var(--stat-background-color);

      padding: 24px;
      border-radius: 18px;
    }

    .stat-card + .stat-card {
      margin-top: 32px;
    }

    .stat-card .stat-title-wrapper {
      margin: 22px 12px;
      margin-top: 4px;
      opacity: 0.9;
    }

    .stat-title-wrapper h3 {
      text-transform: capitalize;
      margin: 0;
      font-size: 15px;
    }

    .stat-title-wrapper span {
      font-size: 14px;
      color: var(--text-secondary-color);
    }

    p.main-data {
      font-size: 2em;
      margin: 0;
    }
    p.main-data-tiny {
      font-size: 2em;
      margin: 0;
    }

    .stat-card .subtitle {
      color: grey;
      margin: 0;
    }
    .main-data span {
      font-size: 1.3rem;
      margin-left: 8px;
      opacity: 0.6;
    }

    .report {
      justify-content: center;
    }

    .raw-data {
      margin: 0;
    }
    .raw-data span {
      margin-left: 4px;
    }

    .sub-data {
      display: flex;
      justify-content: space-between;
    }

    .sidebar-wrapper .cards-wrapper {
      margin: 8px;
      margin-top: 0;
    }

    @media screen and (min-width: 1600px) {
      .sidebar {
        position: fixed;
        max-width: 400px;
      }
    }
    @media screen and (max-width: 1600px) {
      .metrics {
        grid-template-columns: 1fr 100% 1fr;
        display: flex;
        flex-direction: column;
        padding: 0 32px;
        width: calc(100vw - 64px);
        max-width: 1100px;
        margin: 0 auto;
        position: relative !important;
      }
      .sidebar-wrapper {
        margin-top: 32px;
        grid-column: 2;
        grid-row: unset;
      }
    }
    @media screen and (max-width: 860px) {
      .metrics {
        padding: 0 16px;
        width: calc(100vw - 32px);
      }
      .resume-header {
        padding: 16px;
        padding-top: 32px;
      }
      .resume-menu {
        flex-direction: column;
        padding: 16px;
      }
      .actions {
        flex-wrap: wrap;
      }
      .chart {
        padding: 0;
      }
    }
    @media screen and (max-width: 760px) {
      .metrics {
        margin-bottom: 64px;
      }
      .resume-menu {
        align-items: flex-start;
      }
      .actions {
        position: fixed;
        align-self: center;
        border: 1px solid var(--background-color);
        bottom: 8px;
        background-color: var(--color-surface-alt);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        border-radius: 16px;
      }
    }
  `;

  let resumeMenu: HTMLDivElement;
  let resumeHeader: HTMLDivElement;

  const [resumeHeaderHeight, setResumeHeaderHeight] = createSignal(0);

  const updateHeaderHeight = () => {
    setResumeHeaderHeight(resumeHeader.offsetHeight);
  };

  onMount(() => {
    updateHeaderHeight();
    resumeHeader.addEventListener("resize", updateHeaderHeight);
    const blockAnimation = anime({
      targets: resumeMenu,
      autoplay: false,
      height: 54,
      elasticity: 200,
      borderBottomLeftRadius: 22,
      borderBottomRightRadius: 22,
      easing: "easeInCubic",
      paddingLeft: 16,
      paddingRight: 16,
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

    const headerHeight = 104;

    window.onscroll = () => {
      const top = resumeMenu.getBoundingClientRect().top;
      const pourcent = 1.0 - top / (headerHeight + resumeHeaderHeight());
      blockAnimation.seek(pourcent * blockAnimation.duration);
      pictoAnimation.seek(pourcent * pictoAnimation.duration);
      titleAnimation.seek(pourcent * titleAnimation.duration);
    };
  });

  onCleanup(() => {
    window.onscroll = null;
    resumeHeader.removeEventListener("resize", updateHeaderHeight);
  });

  const size = useWindowSize();

  const Accuracy = () => {
    return (
      <AccuracyDoughnut stats={props.typingStatistics.typing.logs!.value.stats}>
        <p class="wpm-data main-data">
          {Math.trunc(
            props.typingStatistics.typing.logs!.value.stats.speed.wpm,
          )}
          <span>WPM</span>
        </p>
        <p class="raw-data">
          {typingStatisticsResult.speed.kpm.toFixed(2)}
          <span>Raw</span>
        </p>
      </AccuracyDoughnut>
    );
  };

  const Chart = () => {
    return (
      <Show when={typingStatisticsResult.chart.wpm.length > 1}>
        <div class="chart">
          <SpeedChart metrics={typingStatisticsResult.chart} />
        </div>
      </Show>
    );
  };

  return (
    <div class="metrics full-bleed">
      <div
        class="resume-header"
        classList={{ aligned: size.width < 860 }}
        ref={resumeHeader!}
      >
        <Show fallback={<Accuracy />} when={size.width > 860}>
          <Chart />
        </Show>
      </div>
      <div class="sticky">
        <div ref={resumeMenu!} class="resume-menu">
          <TypingOptionsTitle
            typingOptions={props.typingStatistics.typingOptions}
          />
          <div class="actions">{props.children(typingStatisticsResult)}</div>
        </div>
      </div>
      <div class="sidebar-wrapper">
        <div class="sidebar">
          <div class="cards-wrapper">
            <h2 class="stat-title">{t("statistics.gameReport")}</h2>
            <div
              class="stat-card report"
              classList={{
                flexed: size.width > 860,
              }}
            >
              <Show fallback={<Chart />} when={size.width > 860}>
                <Accuracy />
              </Show>
            </div>
          </div>
          <div class="sub-data">
            <div class="cards-wrapper tiny">
              <div class="stat-card">
                <p class="main-data main-data-tiny">
                  {timeStringFromNumber(typingStatisticsResult.elapsedTime)}
                </p>
                <p class="subtitle">{t("elapsedTime")}</p>
              </div>
            </div>
            <div class="cards-wrapper tiny">
              <div class="stat-card">
                <p class="main-data main-data-tiny">
                  {typingStatisticsResult.consistency.toFixed(0)}
                  <span>%</span>
                </p>
                <p class="subtitle">{t("consistency")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="statistics">
        <div class="cards-wrapper">
          <h2 class="stat-title">{t("statistics.contentResumeTitle")}</h2>
          <div class="stat-card">
            <Prompt paragraphs={props.typingStatistics.paragraphs} />
          </div>
        </div>
        <div class="cards-wrapper">
          <div class="stat-header">
            <div class="stat-header-content">
              <h2 class="stat-title">{t("statistics.title")}</h2>
            </div>
          </div>
          <div class="stat-content">
            <Show when={size.width > 1111}>
              <div class="stat-card">
                <div class="stat-title-wrapper">
                  <h3>{t("statistics.keysResumeTitle")}</h3>
                </div>
                <StatisticsKeyboard
                  layout={kbLayout()}
                  metrics={props.typingStatistics.characters}
                />
              </div>
            </Show>
            <div class="stat-card">
              <div class="stat-title-wrapper">
                <h3>{t("statistics.charactersTyped")}</h3>
              </div>
              <CharacterChart keys={typingStatisticsResult.characters} />
            </div>
            <Show when={typingStatisticsResult.words.length > 1}>
              <div class="stat-card">
                <div class="stat-title-wrapper">
                  <h3>{t("statistics.wordsSpeedTitle")}</h3>
                  <span>{t("statistics.wordsSpeedSubtitle")}</span>
                </div>
                <WordTypingStatisticsResult
                  words={typingStatisticsResult.words}
                />
              </div>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingStatisticsResult;
