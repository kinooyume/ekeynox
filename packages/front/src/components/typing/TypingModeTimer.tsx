import { type JSX, createEffect, createSignal, onCleanup } from "solid-js";
import { css } from "solid-styled";

import TimerOver from "~/timer/TimerStopwatch.ts";
import Timer, { type TypingTimer } from "~/timer/Timer.ts";

import type { StatProjection } from "~/typingStatistics/KeypressMetrics.ts";

import TypingInfo from "./TypingInfo.tsx";

import MetricPreview from "../ui/MetricPreview.tsx";
import Stopwatch from "~/svgs/stopwatch.tsx";
import { TypingState } from "~/typingState/index.ts";

type TypingModeTimerProps = {
  // Common
  typingState: TypingState;
  stat: StatProjection;
  children: JSX.Element;
  //
  duration: number;
  onTimerEnd: () => void;
};

const TypingModeTimer = (props: TypingModeTimerProps) => {
  const [elapsed, setElapsed] = createSignal("");
  const [progress, setProgress] = createSignal(100.0);

  let cleanupTimer = () => {};

  const timerOver = TimerOver.create({
    duration: props.duration,
    onOver: props.onTimerEnd,
    setCleanup: (cleanup) => (cleanupTimer = cleanup),
    updateCounter: (elapsed) => {
      // milliseconds to seconds and minutes
      setElapsed((elapsed / 1000).toFixed(1));
      setProgress((elapsed / props.duration) * 100);
    },
  });

  const timerEffect = Timer(timerOver);

  createEffect((timer: TypingTimer) => {
    return timer({ state: props.typingState });
  }, timerEffect);

  onCleanup(() => {
    cleanupTimer();
  });

  css`
    span {
      width: 20px;
      color: var(--text-secondary-color);
      font-size: 16px;
      font-weight: 600;
      padding-top: 0px;
      text-align: right;
      margin-right: 8px;
    }
  `;
  return (
    <TypingInfo
      typingHelp={props.children}
      stat={props.stat}
      progress={progress()}
    >
      <MetricPreview
        picto={<Stopwatch size="20px" color="var(--text-secondary-color)" />}
      >
        <span>{elapsed()}s</span>
      </MetricPreview>
    </TypingInfo>
  );
};

export default TypingModeTimer;
