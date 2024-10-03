import { describe, it } from "vitest";

import Timer, { TimerPause, TimerPending, TypingTimerProps } from "./Timer.ts";

import {
  TypingStateKind,
  TypingWordKind,
  type TypingState,
} from "~/typingState";

describe("Typing Timer", () => {
  const timerPause: TimerPause = {
    resume: () => timerPending,
  };

  const timerPending: TimerPending = {
    pause: () => timerPause,
  };

  const newTimer = Timer(() => timerPause);

  it("should create a new timer", () => {
    expect(newTimer).toBeDefined();
  });

  it("should start the timer", () => {

    // TODO: Mockup TypingState
    const props: TypingTimerProps = {
      state: {
        kind: TypingStateKind.pending,
        key: {
          keyMetrics: { key: "a", duration: 1 },
          timestamp: 1,
          focusIsSeparator: false,
        },
        word: { kind: TypingWordKind.ignore },
        next: true,
      },
    };
    // const pending = timerEffect(props);
    expect(pending).toBeDefined();
  });

  it("should pause and resume the timer", () => {
    const timerPause: TimerPause = {
      resume: () => timerPending,
    };

    const timerPending: TimerPending = {
      pause: () => timerPause,
    };

    const newTimer = Timer(() => timerPause);

    const timerEffect = newTimer();

    const props: Props = {
      status: {
        kind: TypingStateKind.pending,
        key: {
          keyMetrics: { key: "a", duration: 1 },
          timestamp: 1,
          focusIsSeparator: false,
        },
        word: { kind: TypingWordKind.ignore },
        next: true,
      },
    };

    const paused = timerEffect({ state: { kind: TypingStateKind.pause } });
    expect(paused).toBeDefined();

    const pending = timerEffect(props);
    expect(pending).toBeDefined();
  });
});
