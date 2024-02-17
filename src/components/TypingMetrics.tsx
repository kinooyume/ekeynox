import { createEffect, createSignal, For } from "solid-js";
import {
  type KeyInfo,
  type Metrics,
} from "./TypingMetrics";
import { css } from "solid-styled";

type TypingMetricsProps = {
  wpm: number;
  raw: number;
  metrics: Metrics;
};

const pourcent = (info: KeyInfo) =>
  ((info.correct / info.total) * 100).toFixed(2);

const TypingMetrics = (props: TypingMetricsProps) => {
  console.log(props.metrics);
  css`
    .accuracyPack {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
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
    }
    .card.accuracy .title {
      font-size: 1.1em;
      box-shadow:
        inset 2px 2px 7px #bebebe,
        inset -2px -2px 7px #ffffff;
      border-radius: 8px;
      padding: 5px;
    }
  `;
  return (
    <div class="metrics">
      <div class="speed">
        <h2>Typing Speed</h2>
        <p class="card speed">WPM: {props.wpm.toFixed(2)}</p>
        <p class="card speed">Raw: {props.raw.toFixed(2)}</p>
        <h2>Typing Accurry</h2>
        <h3>Real Accuracy</h3>
        <h2>Success by key</h2>
        <div class="accuracyPack">
        </div>
      </div>
    </div>
  );
};

// https://github.com/kazzkiq/balloon.css
export default TypingMetrics;
