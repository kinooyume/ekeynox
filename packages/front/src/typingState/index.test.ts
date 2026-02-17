import { describe, it, expect } from "vitest";
import { typingStatePending, TypingStateKind } from "./index";
import {
  CharacterEventKind,
  CharacterStatus,
} from "~/typingContent/character/types";
import { TypingWordKind } from "~/typingContent/word/types";

const makeKey = () => ({
  keyMetrics: [
    "a",
    {
      kind: CharacterEventKind.added as const,
      status: { kind: CharacterStatus.match as const },
    },
  ] as [string, { kind: CharacterEventKind.added; status: { kind: CharacterStatus.match } }],
  timestamp: 100,
  focusIsSeparator: false,
});

describe("typingStatePending", () => {
  it("creates pending state with correct kind", () => {
    const state = typingStatePending({ key: makeKey(), next: true });
    expect(state.kind).toBe(TypingStateKind.pending);
  });

  it("defaults word to ignore", () => {
    const state = typingStatePending({ key: makeKey(), next: false });
    if (state.kind === TypingStateKind.pending) {
      expect(state.word).toEqual({ kind: TypingWordKind.ignore });
    }
  });

  it("allows overriding word", () => {
    const word = { kind: TypingWordKind.correct as const, length: 5 };
    const state = typingStatePending({ key: makeKey(), next: true, word });
    if (state.kind === TypingStateKind.pending) {
      expect(state.word).toEqual(word);
    }
  });

  it("preserves key and next from event", () => {
    const key = makeKey();
    const state = typingStatePending({ key, next: false });
    if (state.kind === TypingStateKind.pending) {
      expect(state.key).toBe(key);
      expect(state.next).toBe(false);
    }
  });
});
