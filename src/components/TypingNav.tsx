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
      <div onClick={props.onPause}>
        <Play pause={props.isPaused} />
      </div>
      <div onclick={props.onReset}>
        <Reset />
      </div>
      <br />
      <span class="wpm">WPM: {Math.trunc(props.stat.speed.byWord[0])}</span>
      <span class="wpm">Raw: {Math.trunc(props.stat.speed.byKeypress[1])}</span>
      <span class="wpm">
        Accurracy: {Math.trunc(props.stat.accuracies[0])}%
      </span>
      <span class="wpm">
        Real Accuracy: {Math.trunc(props.stat.accuracies[1])}%
      </span>
    </nav>
  );
};

export default TypingNav;

// <span class="wpm">WPM: {Math.trunc(wpm())}</span>
