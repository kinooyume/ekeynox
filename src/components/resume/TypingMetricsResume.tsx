import { css } from "solid-styled";
import type { TypingMetrics } from "../metrics/TypingMetrics";
import TypingKeyboardResume from "../resume/TypingKeyboardResume";
import type { KeysProjection } from "../metrics/KeysProjection";
import type { KeyboardLayout } from "../keyboard/KeyboardLayout";
import MetricsChart from "./charts/MetricsChart";
import DataMetricsResume from "./DataMetricsResume";
import type { ContentData, Paragraphs } from "../content/Content";
import Prompt from "../prompt/Prompt";
import type { SetStoreFunction } from "solid-js/store";
import type { GameOptions, Translator } from "../App";

type TypingMetricsProps = {
  metrics: TypingMetrics;
  layout: KeyboardLayout;
  keyMetrics: KeysProjection;
  paragraphs: Paragraphs;
  setParagraphs: SetStoreFunction<Paragraphs>;
  onReset: () => void;
  t: Translator;
  currentGameOptions: GameOptions;
  setGameOptions: (options: GameOptions) => void;
  setContent: (content: ContentData) => void;
};

const TypingMetricsResume = (props: TypingMetricsProps) => {
  css`
    .metrics {
      display: grid;
      grid-template-columns: 1fr min(1200px, 100%) max(400px) 1fr;
      grid-template-rows: 1fr;
      grid-column-gap: 10px;
      overflow: hidden;
    }

    .keyboard {
      margin-top: 64px;
    }
    .reset {
      margin: 64px;
    }
    .content {
      grid-column: 2;
      overflow-y: scroll;
      padding: 32px;
    }
    .sidebar-wrapper {
      grid-column: 3;
      position: relative;
    }

    .sidebar {
      position: fixed;
    }
  `;
  return (
    <div class="metrics full-bleed">
      <div class="content">
        <div class="chart">
          <MetricsChart metrics={props.metrics} />
        </div>
        <div class="keyboard">
          <TypingKeyboardResume
            layout={props.layout}
            metrics={props.keyMetrics}
          />
        </div>
        {/* <WordMetricsResume paragraphs={props.paragraphs} /> */}
        <Prompt
          paragraphs={props.paragraphs}
          setParagraphs={props.setParagraphs}
        />
      </div>
      <div class="sidebar-wrapper">
        <div class="sidebar">
          <DataMetricsResume
            currentGameOptions={props.currentGameOptions}
            setGameOptions={props.setGameOptions}
            setContent={props.setContent}
            t={props.t}
            projection={props.metrics.projection}
            onReset={props.onReset}
          />
        </div>
      </div>
    </div>
  );
};

export default TypingMetricsResume;
