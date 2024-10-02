import type { CreateNewTimer, TimerPause, TimerPending } from "./Timer";

// NOTE: CounterTimer

type CreateProps = {
  duration: number;
  onOver: () => void;
  setCleanup: (cleanup: () => void) => void;
  updateCounter: (timeLeft: number) => void;
};

type CreateTimerPending = (timeLeft: number) => TimerPending;

type CreateTimerPause = (props: {
  timeLeft: number;
  timer: NodeJS.Timeout;
  interval: NodeJS.Timeout;
}) => TimerPause;

const create : CreateNewTimer<CreateProps> =
  ({
    duration,
    onOver,
    updateCounter,
    setCleanup,
  }) =>
  () => {
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
      return {
        pause: () => pause({ timeLeft: remainingTime, timer, interval }),
      };
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

export default { create };
