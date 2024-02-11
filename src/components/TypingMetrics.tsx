import { For } from "solid-js";
import type { KeyMetrics } from "./TypingMetrics";

type TypingMetricsProps = {
  wpm: number;
  raw: number;
  keyMetrics: KeyMetrics;
};

const TypingMetrics = (props: TypingMetricsProps) => {
  return (
    <div class="metrics">
      <div class="speed">
        <h2>Typing Speed</h2>
        <p>WPM: {props.wpm}</p>
        <p>Raw: {props.raw}</p>
        <h2>Typing Accurry</h2>
        <h2>Success by key</h2>
        <For each={Array.from(props.keyMetrics.entries())}>
          {([key, value]) => (
            <p>
              {key} : {JSON.stringify(value)}
            </p>
          )}
        </For>
      </div>
    </div>
  );
};

export default TypingMetrics;
