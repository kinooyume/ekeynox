import { css } from "solid-styled";
import type { TypingMetrics } from "./TypingMetrics";
import TypingKeyboardResume from "./TypingKeyboardResume";
import type { KeysProjection } from "./KeysProjection";
import type { KeyboardLayout } from "./KeyboardLayout";
import MetricsChart from "./MetricsChart";
import type { StatProjection } from "./KeypressMetrics";
import DataMetricsResume from "./DataMetricsResume";

type TypingMetricsProps = {
  stat: StatProjection;
  metrics: TypingMetrics;
  layout: KeyboardLayout;
  keyMetrics: KeysProjection;
  onReset: () => void;
};

const TypingMetricsResume = (props: TypingMetricsProps) => {
  css`
    .metrics {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }

    .keyboard {
      margin-top: 64px;
    }
    .reset {
      margin: 64px;
    }
    .details {
      max-width: 1200px;
      margin-right: 198px;
    }
  `;
  return (
    <div class="metrics">
      <DataMetricsResume stat={props.stat} />
      <div class="details">
        <div class="chart">
          <MetricsChart metrics={props.metrics} />
        </div>
        <div class="keyboard">
          <TypingKeyboardResume
            layout={props.layout}
            metrics={props.keyMetrics}
          />
        </div>
        <button class="reset" onClick={props.onReset}>
          Restart
        </button>
      </div>
    </div>
  );
};

export default TypingMetricsResume;
