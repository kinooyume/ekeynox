import { css } from "solid-styled";
import Play from "./ui/play.tsx";
import Reset from "./ui/reset.tsx";
import type { StatProjection } from "./KeypressMetrics.ts";

type TypingNavProps = {
  isPaused: boolean;
  stat: StatProjection;
  onPause: () => void;
  onReset: () => void;
};

const TypingNav = (props: TypingNavProps) => {
  css`
    .wpm {
      color: grey;
      margin-right: 16px;
    }
    nav {
      display: flex;
      justify-content: space-between;
      padding: 16px;
    }
  `;
  return (
    <nav>
      <span class="wpm">WPM: {props.stat.speed.byWord[0].toFixed(2)}</span>
      <span class="wpm">Raw: {props.stat.speed.byKeypress[1].toFixed(2)}</span>
      <span class="wpm">Accurracy: {props.stat.accuracies[0].toFixed(2)}%</span>
      <span class="wpm">
        Real Accuracy: {props.stat.accuracies[1].toFixed(2)}%
      </span>
      <div onClick={props.onPause}>
        <Play pause={props.isPaused} />
      </div>
      <div onclick={props.onReset}>
        <Reset />
      </div>
    </nav>
  );
};

export default TypingNav;

// <span class="wpm">WPM: {Math.trunc(wpm())}</span>
