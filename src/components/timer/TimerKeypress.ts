import type { TimedKey } from "../metrics/Metrics";
import type { CreateNewTimer, TimerPause, TimerPending } from "./Timer";

// NOTE: on a le pattern de:
// - resumeProps
// - pauseProps: timeout(s) + resumeProps
//

export type SetCleanup = (cleanup: () => void) => void;

type TimerKeypressProps<T> = {
  sequence: Array<T>;
  setCleanup: SetCleanup;
  apply: (key: T) => void;
};

type PendingProps<T> = {
  timeLeft: number;
  sequence: Array<T>;
};

type PauseProps<T> = {
  sequence: Array<T>;
  timeout: NodeJS.Timeout | null;
};

const create: CreateNewTimer<TimerKeypressProps<TimedKey>> =
  ({ sequence, apply, setCleanup }) =>
  () => {
    let index = 0;
    let lastPress = 0;
    const resume = (props: PendingProps<TimedKey>): TimerPending => {
      let pauseProps: PauseProps<TimedKey> = {
        ...props,
        timeout: null,
      };
      const nodeTimeout = () => {
        lastPress = performance.now();
        pauseProps.timeout = setTimeout(() => {
          apply(props.sequence[index]);
          index++;
          if (index < props.sequence.length) nodeTimeout();
        }, props.sequence[index].duration);
      };

      setCleanup(() => pauseProps.timeout && clearTimeout(pauseProps.timeout));

      // side effect
      nodeTimeout();

      return {
        pause: () => pause(pauseProps),
      };
    };
    const pause = (props: PauseProps<TimedKey>): TimerPause => {
      const pause = performance.now();
      const timeLeft = props.sequence[index]
        ? props.sequence[index].duration - (pause - lastPress)
        : 0;
      props.timeout && clearTimeout(props.timeout);
      return { resume: () => resume({ ...props, timeLeft }) };
    };

    return {
      resume: () => resume({ sequence, timeLeft: 0 }),
    };
  };

export default { create };
