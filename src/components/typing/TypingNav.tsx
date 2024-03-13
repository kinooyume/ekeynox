import { css } from "solid-styled";
import Play from "./svgs/play.tsx";
import Reset from "./svgs/reset.tsx";
import type { StatProjection } from "./KeypressMetrics.ts";
import { Show, type JSXElement } from "solid-js";
import NavLeft from "./svgs/navLeft.tsx";
import NavRight from "./svgs/navRight.tsx";

type TypingNavProps = {
  isPaused: boolean;
  stat: StatProjection;
  children?: JSXElement;
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
      bottom: 0;
      position: fixed;
      display: flex;
      justify-content: center;
      padding: 0 16px;
    }
    .content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-width: 600px;
      gap: 16px;
      background-color: var(--color-surface-alt);
    }
    nav svg path {
      fill: var(--color-surface-alt);
      stroke: var(--color-surface-alt);
    }

    .remote {
      display: flex;
      align-items: center;
    }
  `;
  return (
    <nav>
      <NavLeft />
      <div class="content">
        <div class="remote">
          <div onClick={props.onPause}>
            <Play pause={props.isPaused} />
          </div>
          <div onclick={props.onReset}>
            <Reset />
          </div>
        </div>
        <div class="stat">
          <span class="wpm">WPM: {Math.trunc(props.stat.speed.byWord[0])}</span>
          <span class="wpm">
            Raw: {Math.trunc(props.stat.speed.byKeypress[1])}
          </span>
          <span class="wpm">
            Accurracy: {Math.trunc(props.stat.accuracies[0])}%
          </span>
          <span class="wpm">
            Real Accuracy: {Math.trunc(props.stat.accuracies[1])}%
          </span>
        </div>
        <Show when={props.children}>
          <div class="child">{props.children}</div>
        </Show>
      </div>
      <NavRight />
    </nav>
  );
};

export default TypingNav;

// <span class="wpm">WPM: {Math.trunc(wpm())}</span>
