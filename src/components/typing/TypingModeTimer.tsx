import { type JSX, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import TimerOver from "../timer/TimerStopwatch.ts";
import Timer, { type TimerEffectStatus } from "../timer/Timer.ts";
import { TypingEventKind, type TypingEventType } from "./TypingEvent.ts";
import ProgressBar from "../svgs/progressBar.tsx";
import type { StatProjection } from "../metrics/KeypressMetrics.ts";
import TypingInfo from "./TypingInfo.tsx";

// [x] ajout timer
// [x] progress

/* Loop */

// Pitetre ? [ ] changer le comportement au extraEnd
// Plus tard: [ ] changer le comportement getContent

/* *** */

type TypingModeTimerProps = {
  typingEvent: TypingEventType;
  stat: StatProjection;
  children: JSX.Element;

  duration: number;
  onTimerEnd: () => void;
};

const TypingModeTimer = (props: TypingModeTimerProps) => {
  const [elapsed, setElapsed] = createSignal(0);
  const [progress, setProgress] = createSignal(100.0);

  let cleanupTimer = () => {};

  const timerOver = TimerOver.create({
    duration: props.duration,
    onOver: props.onTimerEnd,
    setCleanup: (cleanup) => (cleanupTimer = cleanup),
    updateCounter: (elapsed) => {
      setElapsed(elapsed);
      setProgress((elapsed / props.duration) * 100);
    },
  });

  const timerEffect = Timer.createEffect(timerOver);

  createEffect((timer: TimerEffectStatus) => {
    return timer({ status: props.typingEvent });
  }, timerEffect);

  onCleanup(() => {
    cleanupTimer();
  });

  return (
    <TypingInfo
      typingHelp={props.children}
      stat={props.stat}
      progress={progress()}
    >
      <p>Elapsed: {elapsed()}s</p>
    </TypingInfo>
  );
};

export default TypingModeTimer;
