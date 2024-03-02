import { TypingStatusKind, type TypingStatus } from "./TypingEngine";

type CreateProps = {
  duration: number;
  onOver: () => void;
  updateCounter: (timeLeft: string) => void;
};

type TimerPending = { pause: () => TimerPause };
type TimerPause = { resume: () => TimerPending };

type CreateTimerPending = (timeLeft: number) => TimerPending;

type CreateTimerPause = (props: {
  start: number;
  timer: NodeJS.Timeout;
  interval: NodeJS.Timeout;
}) => TimerPause;

const create = ({ duration, onOver, updateCounter }: CreateProps) => {
  const resume: CreateTimerPending = (timeLeft) => {
    const start = performance.now();
    const timer = setTimeout(() => {
      clearInterval(interval);
      onOver();
    }, timeLeft);
    const interval = setInterval(() => {
      const now = performance.now();
      const elapsed = now - start;
      updateCounter(((timeLeft - elapsed) / 1000).toFixed(0));
    }, 1000);
    return { pause: () => pause({ start, timer, interval }) };
  };

  const pause: CreateTimerPause = ({ start, timer, interval }) => {
    clearTimeout(timer);
    clearInterval(interval);
    const stop = performance.now();
    const elapsed = stop - start;
    return { resume: () => resume(elapsed) };
  };

  updateCounter((duration / 1000).toFixed(0));
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
