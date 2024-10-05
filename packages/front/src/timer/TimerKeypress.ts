import { TimedKey } from "~/typingStatistics/timedKey";
import type { CreateNewTimer, TimerPause, TimerPending } from "./Timer";

// NOTE: il me semble qu'on veut jarter ça
export type SetCleanup = (cleanup: () => void) => void;

type TimerKeypressProps<T> = {
  init: () => void;
  sequence: Array<T>;
  apply: (key: T) => void;
  setCleanup: SetCleanup;
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
  ({ sequence, apply, setCleanup, init }) =>
  () => {
    let index = 0;
    let lastPress = 0;
    const resume = (props: PendingProps<TimedKey>): TimerPending => {
      let pauseProps: PauseProps<TimedKey> = {
        ...props,
        timeout: null,
      };

      // NOTE: check if we really need timeout
      const nodeTimeout = () => {
        lastPress = performance.now();
        pauseProps.timeout = setTimeout(() => {
          if (!props.sequence[index]) return;
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
      resume: () => {
        init();
        return resume({ sequence, timeLeft: 0 });
      },
    };
  };

export default { create };
