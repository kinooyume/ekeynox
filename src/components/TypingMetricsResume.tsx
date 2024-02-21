import { css } from "solid-styled";
import type { TypingMetricsPreview, TypingMetrics } from "./TypingMetrics";
import TypingKeyboardResume from "./TypingKeyboardResume";
import type { KeysProjection } from "./KeyMetrics";

type TypingMetricsProps = {
  preview: TypingMetricsPreview;
  metrics: TypingMetrics;
  keyMetrics: KeysProjection;
};

const TypingMetricsResume = (props: TypingMetricsProps) => {
  console.log(props.metrics);
  css`
    .preview {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      max-width: 400px;
      margin: 0 auto;
    }
    .card {
      display: flex;
      flex-direction: column;
      gap: 5px;
      padding: 10px;
      border-radius: 8px;
      background: #e0e0e0;
      box-shadow:
        2px 2px 7px #bebebe,
        -2px -2px 7px #ffffff;
    }
    .card.speed {
      max-width: 100px;
    }
    .card.accuracy {
      text-align: center;
      max-width: 200px;
    }
    .card.accuracy .title {
      font-size: 1.1em;
      box-shadow:
        inset 2px 2px 7px #bebebe,
        inset -2px -2px 7px #ffffff;
      border-radius: 8px;
      padding: 5px;
    }

    .keyboard {
      margin-top: 64px;
    }
  `;
  return (
    <div class="metrics">
      <div class="preview">
        <div class="speeds">
          <h2>Speed</h2>
          <p class="card speed">WPM: {props.preview.wpms[0].toFixed(2)}</p>
          <p class="card speed">Raw: {props.preview.wpms[1].toFixed(2)}</p>
        </div>
        <div class="accuracies">
          <h2>Accurracies</h2>
          <p class="card accuracy">
            Accurracy: {props.preview.accuracies[0].toFixed(2)}%
          </p>
          <p class="card accuracy">
            Real Accuracy: {props.preview.accuracies[1].toFixed(2)}%
          </p>
        </div>
      </div>
      <div class="keyboard">
        <TypingKeyboardResume layout="qwerty" metrics={props.keyMetrics} />
      </div>
    </div>
  );
};

export default TypingMetricsResume;
