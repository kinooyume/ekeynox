import { TypingEventKind, type TypingEventType } from "~/components/typing/TypingEvent";

export type TimerPause = { resume: () => TimerPending };
export type TimerPending = { pause: () => TimerPause };

export type NewTimer = () => TimerPause;
export type CreateNewTimer<T> = (t: T) => NewTimer;

export type CreateTimerEffect<U> = (newTimer: NewTimer) => TimerEffect<U>;
export type TimerEffect<U> = (u: U) => TimerEffect<U>;

// TODO: rename
type CreateEffectProps = {
  status: TypingEventType;
};

export type TimerEffectStatus = TimerEffect<CreateEffectProps>

const createEffect: CreateTimerEffect<CreateEffectProps> = (
  newTimer: NewTimer,
) => {
  const paused =
    (timer: TimerPause): TimerEffect<CreateEffectProps> =>
    ({ status }: CreateEffectProps) => {
      switch (status.kind) {
        case TypingEventKind.pending:
          return pending(timer.resume());
        case TypingEventKind.unstart:
          return paused(newTimer());
      }
      return paused(timer);
    };
  const pending =
    (timer: TimerPending): TimerEffect<CreateEffectProps> =>
    ({ status }: CreateEffectProps) => {
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

export default { createEffect };

// Correct proto stopwatch !
// https://codingtorque.com/simple-stopwatch-using-javascript/
