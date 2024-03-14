import { css } from "solid-styled";
import TypingKeyboardResume from "../resume/TypingKeyboardResume";
import type {
  HigherKeyboard,
  KeyboardLayout,
} from "../keyboard/KeyboardLayout";
import MetricsChart from "./charts/MetricsChart";
import DataMetricsResume from "./DataMetricsResume";
import Prompt from "./PromptResume";
import type { Translator } from "../App";
import type { Metrics } from "../metrics/Metrics";
import { createComputed, createSignal } from "solid-js";

type TypingMetricsProps = {
  t: Translator;
  kbLayout: HigherKeyboard;
  metrics: Metrics;
};

const TypingMetricsResume = (props: TypingMetricsProps) => {
  const [kbLayout, setKbLayout] = createSignal(
    props.kbLayout(props.metrics.content.keySet),
  );

  createComputed(() => {
    const layout = props.kbLayout(props.metrics.content.keySet);
    setKbLayout(layout);
  });
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
          <MetricsChart metrics={props.metrics.typing} />
        </div>
        <div class="keyboard">
          <TypingKeyboardResume
            layout={kbLayout()}
            metrics={props.metrics.keys}
          />
        </div>
        {/* <WordMetricsResume paragraphs={props.paragraphs} /> */}
        <Prompt paragraphs={props.metrics.content.paragraphs} />
      </div>
      <div class="sidebar-wrapper">
        <div class="sidebar">
          <DataMetricsResume
            currentGameOptions={props.metrics.gameOptions}
            t={props.t}
            projection={props.metrics.typing.projection}
          />
        </div>
      </div>
    </div>
  );
};

export default TypingMetricsResume;
