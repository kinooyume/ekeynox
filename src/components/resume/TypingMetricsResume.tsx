import { css } from "solid-styled";
import type { HigherKeyboard } from "../keyboard/KeyboardLayout";
import SpeedChart from "./charts/SpeedChart";
import DataMetricsResume from "./DataMetricsResume";
import Prompt from "./PromptResume";
import type { Translator } from "../App";
import {
  createMetricsResume,
  type Metrics,
  type MetricsResume,
} from "../metrics/Metrics";
import { createComputed, createSignal, Show, type JSXElement } from "solid-js";
import TypingKeyboardResume from "./TypingKeyboardResume";
import WordMetricsResume from "./charts/WordsChart";
import TabContainer from "../ui/TabContainer";
import CharacterChart from "./charts/CharacterChart";
import GameOptionsTitle from "../gameMode/GameOptionsTitle";

type TypingMetricsProps = {
  t: Translator;
  kbLayout: HigherKeyboard;
  metrics: Metrics;
  children: (n: MetricsResume) => JSXElement;
};

const TypingMetricsResume = (props: TypingMetricsProps) => {
  const keysSet = new Set(Object.keys(props.metrics.keys));
  const [kbLayout, setKbLayout] = createSignal(props.kbLayout(keysSet));

  const [metricIndex, setMetricIndex] = createSignal(0);
  const metricsResume = createMetricsResume(props.metrics);

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
      overflow: hidden;
      max-height: 100%;
    }

    .keyboard {
      margin-top: 64px;
    }
    .reset {
      margin: 64px;
    }
    .content-wrapper {
      position: relative;
      grid-column: 2;
      overflow-y: scroll;
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

    .action-title {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      margin: 16px 0;
    }

    .action-title span {
      color: var(--text-secondary-color);
      margin: 0;
      font-size: 1rem;
    }

    .action-title p {
      color: var(--text-color);
      margin: 0;
      font-size: 1.4rem;
      text-transform: capitalize;
    }

    .stat-title {
      margin: 16px 0;
      font-size: 2.4rem;
      font-weight: 200;
    }
  `;
  return (
    <div class="metrics full-bleed">
      <div class="content-wrapper">
        <div class="content">
          <GameOptionsTitle t={props.t} gameOptions={props.metrics.gameOptions} />
          <div class="chart">
            <SpeedChart metrics={metricsResume.chart} />
          </div>
          <div>
            <h2 class="stat-title">{props.t("statistics")}</h2>
            <TabContainer
              onTabChange={setMetricIndex}
              isChecked={metricIndex()}
              elems={[props.t("words"), props.t("characters")]}
            />
          </div>
          <Show when={metricIndex() === 0}>
            <div class="words-metrics">
              <WordMetricsResume words={metricsResume.words} />
              <Prompt paragraphs={props.metrics.paragraphs} />
            </div>
          </Show>
          <Show when={metricIndex() === 1}>
            <div class="characters-metrics">
              <div class="keyboard">
                <TypingKeyboardResume
                  layout={kbLayout()}
                  metrics={props.metrics.keys}
                />
                <CharacterChart keys={metricsResume.keys} />
              </div>
            </div>
          </Show>
        </div>
      </div>
      <div class="sidebar-wrapper">
        <div class="sidebar">
          <DataMetricsResume
            t={props.t}
            currentGameOptions={props.metrics.gameOptions}
            projection={props.metrics.typing.logs!.value}
          />
          <div class="actions-wrapper">
            <div class="action-title">
              <p>
                {props.t("newGame.one")} {props.t("newGame.two")}
              </p>
            </div>
            <div class="actions">{props.children(metricsResume)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingMetricsResume;
