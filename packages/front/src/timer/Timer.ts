import { TypingStateKind, type TypingState } from "~/typingState";

interface Timer {
  over: () => void;
}

export interface TimerPause extends Timer {
  resume: () => TimerPending;
}

export interface TimerPending extends Timer {
  pause: () => TimerPause;
}

export type NewTimer = () => TimerPause;

export type CreateNewTimer<T> = (t: T) => NewTimer;

export type CreateTimerEffect<U> = (newTimer: NewTimer) => TimerEffect<U>;
export type TimerEffect<U> = (u: U) => TimerEffect<U>;

export type TypingTimerProps = {
  state: TypingState;
};

export type TypingTimer = TimerEffect<TypingTimerProps>;

const createTypingTimer: CreateTimerEffect<TypingTimerProps> = (
  newTimer: NewTimer,
) => {
  const paused =
    (timer: TimerPause): TimerEffect<TypingTimerProps> =>
    ({ state: status }: TypingTimerProps) => {
      switch (status.kind) {
        case TypingStateKind.pending:
          return pending(timer.resume());
        case TypingStateKind.unstart:
          return paused(newTimer());
        case TypingStateKind.over:
          timer.over();
          break;
      }
      return paused(timer);
    };
  const pending =
    (timer: TimerPending): TimerEffect<TypingTimerProps> =>
    ({ state: status }: TypingTimerProps) => {
      switch (status.kind) {
        case TypingStateKind.pause:
          return paused(timer.pause());
        case TypingStateKind.unstart:
          timer.pause();
          return paused(newTimer());
        case TypingStateKind.over:
          timer.over();
          break;
      }
      return pending(timer);
    };
  return paused(newTimer());
};

export default createTypingTimer;
