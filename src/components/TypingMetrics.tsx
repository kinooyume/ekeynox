import { createEffect, createSignal, For } from "solid-js";
import {
  calculateKeyAccuracy,
  createKeyInfo,
  type KeyInfo,
  type KeyInfoPack,
  type KeyMetrics,
} from "./TypingMetrics";
import { css } from "solid-styled";

type TypingMetricsProps = {
  wpm: number;
  raw: number;
  keyMetrics: KeyMetrics;
};

const pourcent = (info: KeyInfo) =>
  ((info.correct / info.total) * 100).toFixed(2);

const TypingMetrics = (props: TypingMetricsProps) => {
  const [keyInfos, setKeyInfos] = createSignal<KeyInfoPack>([
    createKeyInfo(),
    {},
  ]);

  createEffect(() => {
    setKeyInfos(calculateKeyAccuracy(props.keyMetrics));
  });
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
        <p class="card">{pourcent(keyInfos()[0])}%</p>
        <h2>Success by key</h2>
        <div class="accuracyPack">
          <For each={Object.keys(keyInfos()[1])}>
            {(key) => (
              <div class="card accuracy">
                <span class="title">{key === " " ? "Space" : key}</span>
                <span class="value">{pourcent(keyInfos()[1][key])}%</span>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

// https://github.com/kazzkiq/balloon.css
export default TypingMetrics;
