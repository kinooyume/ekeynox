import { describe, it, expect, vi } from "vitest";
import createTypingTimer, {
  TimerPause,
  TimerPending,
  TypingTimerProps,
} from "./Timer";
import { TypingStateKind } from "~/typingState";
import { TypingWordKind } from "~/typingContent/word/types";
import {
  CharacterEventKind,
  CharacterStatus,
} from "~/typingContent/character/types";

const makePendingProps = (): TypingTimerProps => ({
  state: {
    kind: TypingStateKind.pending,
    key: {
      keyMetrics: [
        "a",
        {
          kind: CharacterEventKind.added,
          status: { kind: CharacterStatus.match },
        },
      ],
      timestamp: 1,
      focusIsSeparator: false,
    },
    word: { kind: TypingWordKind.ignore },
    next: true,
  },
});

const makeTimerMocks = () => {
  const over = vi.fn();
  const timerPause: TimerPause = {
    resume: () => timerPending,
    over,
  };
  const timerPending: TimerPending = {
    pause: () => timerPause,
    over,
  };
  const newTimer = vi.fn(() => timerPause);
  return { timerPause, timerPending, newTimer, over };
};

describe("createTypingTimer", () => {
  it("creates a timer effect", () => {
    const { newTimer } = makeTimerMocks();
    const effect = createTypingTimer(newTimer);
    expect(effect).toBeTypeOf("function");
  });

  it("transitions from paused to pending on pending event", () => {
    const { newTimer } = makeTimerMocks();
    const effect = createTypingTimer(newTimer);
    const next = effect(makePendingProps());
    expect(next).toBeTypeOf("function");
  });

  it("transitions from pending to paused on pause event", () => {
    const { newTimer } = makeTimerMocks();
    let effect = createTypingTimer(newTimer);
    effect = effect(makePendingProps());
    const afterPause = effect({ state: { kind: TypingStateKind.pause } });
    expect(afterPause).toBeTypeOf("function");
  });

  it("calls over when receiving over event while paused", () => {
    const { newTimer, over } = makeTimerMocks();
    const effect = createTypingTimer(newTimer);
    effect({ state: { kind: TypingStateKind.over } });
    expect(over).toHaveBeenCalled();
  });

  it("calls over when receiving over event while pending", () => {
    const { newTimer, over } = makeTimerMocks();
    let effect = createTypingTimer(newTimer);
    effect = effect(makePendingProps());
    effect({ state: { kind: TypingStateKind.over } });
    expect(over).toHaveBeenCalled();
  });

  it("creates new timer on unstart while paused", () => {
    const { newTimer } = makeTimerMocks();
    const effect = createTypingTimer(newTimer);
    effect({ state: { kind: TypingStateKind.unstart } });
    expect(newTimer).toHaveBeenCalledTimes(2);
  });

  it("pauses and creates new timer on unstart while pending", () => {
    const { newTimer } = makeTimerMocks();
    let effect = createTypingTimer(newTimer);
    effect = effect(makePendingProps());
    effect({ state: { kind: TypingStateKind.unstart } });
    expect(newTimer).toHaveBeenCalledTimes(2);
  });
});
