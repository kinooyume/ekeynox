import { css } from "solid-styled";
import Play from "./ui/play.tsx";
import Reset from "./ui/reset.tsx";
import type { TypingMetricsPreview } from "./TypingMetrics.ts";

type TypingNavProps = {
  isPaused: boolean;
  preview: TypingMetricsPreview;
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
      <span class="wpm">WPM: {Math.trunc(props.preview.wpms[0])}</span>
      <span class="raw">RAW: {Math.trunc(props.preview.wpms[1])}</span>
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
