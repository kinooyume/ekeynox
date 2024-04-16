import { TypingStatusKind, type TypingStatus } from "../typing/TypingEngine";

type CreateProps = {
  duration: number;
  onOver: () => void;
  setCleanup: (cleanup: () => void) => void;
  updateCounter: (timeLeft: number) => void;
};

type TimerPending = { pause: () => TimerPause };
type TimerPause = { resume: () => TimerPending };

type CreateTimerPending = (timeLeft: number) => TimerPending;

type CreateTimerPause = (props: {
  timeLeft: number;
  timer: NodeJS.Timeout;
  interval: NodeJS.Timeout;
}) => TimerPause;

const create = ({
  duration,
  onOver,
  updateCounter,
  setCleanup,
}: CreateProps) => {
  const resume: CreateTimerPending = (timeLeft) => {
    const start = performance.now();
    let remainingTime = 0;
    const timer = setTimeout(() => {
      clearInterval(interval);
      onOver();
    }, timeLeft);
    const interval = setInterval(() => {
      const now = performance.now();
      const elapsed = now - start;
      remainingTime = timeLeft - elapsed;
      updateCounter(remainingTime);
    }, 10);
    setCleanup(() => {
      clearTimeout(timer);
      clearInterval(interval);
    });
    return { pause: () => pause({ timeLeft: remainingTime, timer, interval }) };
  };

  const pause: CreateTimerPause = ({ timeLeft, timer, interval }) => {
    clearTimeout(timer);
    clearInterval(interval);
    return { resume: () => resume(timeLeft) };
  };

  updateCounter(duration);
  return {
    resume: () => resume(duration),
  };
};

type CreateEffectProps = {
  status: TypingStatus;
};

export type TimerEffect = (props: CreateEffectProps) => TimerEffect;

const createTimerEffect = (createProps: CreateProps): TimerEffect => {
  const paused =
    (timer: TimerPause): TimerEffect =>
    ({ status }: CreateEffectProps) => {
      switch (status.kind) {
        case TypingStatusKind.pending:
          return pending(timer.resume());
        case TypingStatusKind.unstart:
          return paused(create(createProps));
      }
      return paused(timer);
    };
  const pending =
    (timer: TimerPending): TimerEffect =>
    ({ status }: CreateEffectProps) => {
      switch (status.kind) {
        case TypingStatusKind.pause:
          return paused(timer.pause());
        case TypingStatusKind.unstart:
          timer.pause();
          return paused(create(createProps));
      }
      return pending(timer);
    };
  return paused(create(createProps));
};

export { createTimerEffect };
