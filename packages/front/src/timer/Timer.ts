import { TypingEventKind, type TypingEventType } from "~/components/typing/TypingEvent";

export type TimerPause = { resume: () => TimerPending };
export type TimerPending = { pause: () => TimerPause };

export type NewTimer = () => TimerPause;
export type CreateNewTimer<T> = (t: T) => NewTimer;

export type CreateTimerEffect<U> = (newTimer: NewTimer) => TimerEffect<U>;
export type TimerEffect<U> = (u: U) => TimerEffect<U>;

type Props = {
  status: TypingEventType;
};

export type TimerEffectStatus = TimerEffect<Props>

const createTimer: CreateTimerEffect<Props> = (
  newTimer: NewTimer,
) => {
  const paused =
    (timer: TimerPause): TimerEffect<Props> =>
    ({ status }: Props) => {
      switch (status.kind) {
        case TypingEventKind.pending:
          return pending(timer.resume());
        case TypingEventKind.unstart:
          return paused(newTimer());
      }
      return paused(timer);
    };
  const pending =
    (timer: TimerPending): TimerEffect<Props> =>
    ({ status }: Props) => {
      switch (status.kind) {
        case TypingEventKind.pause:
          return paused(timer.pause());
        case TypingEventKind.unstart:
          timer.pause();
          return paused(newTimer());
      }
      return pending(timer);
    };
  return paused(newTimer());
};

export default createTimer;

// Correct proto stopwatch !
// https://codingtorque.com/simple-stopwatch-using-javascript/
