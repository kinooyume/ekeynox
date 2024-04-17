import type { LinkedList } from "../List";
import type { TypingKey } from "../typing/TypingEngine";
import type { CreateNewTimer, TimerPause, TimerPending } from "./Timer";

// NOTE: on a le pattern de:
// - resumeProps
// - pauseProps: timeout(s) + resumeProps
//

/// NOTE: SequentialTimer

export type SetCleanup = (cleanup: () => void) => void;

type TimerKeypressProps<T> = {
  start: number;
  list: LinkedList<T>;
  setCleanup: SetCleanup;
  apply: (key: T) => void;
};

type PendingProps<T> = {
  lastPress: number;
  node: LinkedList<T>;
};

type PauseProps<T> = {
  lastPress: number;
  node: LinkedList<T>;
  timeout: NodeJS.Timeout | null;
};

const create: CreateNewTimer<TimerKeypressProps<TypingKey>> =
  ({ start, list, apply, setCleanup }) =>
  () => {
    const resume = (props: PendingProps<TypingKey>): TimerPending => {
      let pauseProps: PauseProps<TypingKey> = {
        ...props,
        timeout: null,
      };

      const nodeTimeout = (lastPress: number, node: LinkedList<TypingKey>) => {
        if (!node) return;
        const timestamp = node.value.timestamp;
        const timing = timestamp - lastPress;
        pauseProps.timeout = setTimeout(() => {
          apply(node.value);
          nodeTimeout(timestamp, node.next);
        }, timing);
      };

      setCleanup(() => pauseProps.timeout && clearTimeout(pauseProps.timeout));

      // side effect
      nodeTimeout(start, list);

      return {
        pause: () => pause(pauseProps),
      };
    };
    const pause = (props: PauseProps<TypingKey>): TimerPause => {
      props.timeout && clearTimeout(props.timeout);
      return { resume: () => resume(props) };
    };

    return {
      resume: () => resume({ lastPress: start, node: list }),
    };
  };

export default { create };
