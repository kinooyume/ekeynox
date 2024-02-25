import { css } from "solid-styled";
import type { TypingMetrics } from "./TypingMetrics";
import TypingKeyboardResume from "./TypingKeyboardResume";
import type { KeysProjection } from "./KeyMetrics";
import type { KeyboardLayout } from "./KeyboardLayout";
import MetricsChart from "./MetricsChart";
import type { StatProjection } from "./KeypressMetrics";

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
    .data {
      display: flex;
      position: fixed;
      right: 198px;
      flex-direction: column;
      align-items: center;
      max-width: 400px;
      margin: 24px auto;
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
    .speeds {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .wpm-data {
      font-size: 4em;
      margin: 0;
    }
    .accu-data {
      font-size: 3em;
      margin: 0;
    }
    .accu-data span {
      font-size: 1.5rem;
    }
  `;
  return (
    <div class="metrics">
      <div class="data">
        <div class="speeds">
          <p class="wpm-data">{props.stat.speed.byWord[0].toFixed(2)}</p>
          <p>WPM</p>
          <p class="speed">Raw: {props.stat.speed.byKeypress[1].toFixed(2)}</p>
        </div>
        <div class="accuracies">
          <p class="accu-data">
            {Math.trunc(props.stat.accuracies[0])}
            <span>%</span>
          </p>
          <p>Accuracy</p>
          <p class="card accuracy">
            Real : {props.stat.accuracies[1].toFixed(2)}%
          </p>
        </div>
      </div>

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
