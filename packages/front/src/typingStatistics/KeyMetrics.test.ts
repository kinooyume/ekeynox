import { describe, it, expect } from "vitest";
import {
  getKeyMetrics,
  getKeyDownMetrics,
  makeDeletedKeyMetrics,
} from "./KeyMetrics";
import {
  CharacterEventKind,
  CharacterStatus,
} from "~/typingContent/character/types";

describe("getKeyMetrics", () => {
  it("classifies matching character as match", () => {
    const [key, event] = getKeyMetrics({ typed: "a", expected: "a" });
    expect(key).toBe("a");
    expect(event.kind).toBe(CharacterEventKind.added);
    if (event.kind === CharacterEventKind.added) {
      expect(event.status.kind).toBe(CharacterStatus.match);
    }
  });

  it("classifies mismatching character as unmatch", () => {
    const [key, event] = getKeyMetrics({ typed: "b", expected: "a" });
    expect(key).toBe("a");
    expect(event.kind).toBe(CharacterEventKind.added);
    if (event.kind === CharacterEventKind.added) {
      expect(event.status.kind).toBe(CharacterStatus.unmatch);
    }
  });

  it("classifies typed space when letter expected as missed", () => {
    const [key, event] = getKeyMetrics({ typed: " ", expected: "a" });
    expect(key).toBe("a");
    if (event.kind === CharacterEventKind.added) {
      expect(event.status.kind).toBe(CharacterStatus.missed);
    }
  });

  it("classifies typed letter when space expected as extra", () => {
    const [key, event] = getKeyMetrics({ typed: "a", expected: " " });
    expect(key).toBe("a");
    if (event.kind === CharacterEventKind.added) {
      expect(event.status.kind).toBe(CharacterStatus.extra);
    }
  });

  it("classifies typed letter when Enter expected as extra", () => {
    const [key, event] = getKeyMetrics({ typed: "a", expected: "Enter" });
    expect(key).toBe("a");
    if (event.kind === CharacterEventKind.added) {
      expect(event.status.kind).toBe(CharacterStatus.extra);
    }
  });

  it("classifies typed Enter when letter expected as missed", () => {
    const [key, event] = getKeyMetrics({ typed: "Enter", expected: "a" });
    expect(key).toBe("a");
    if (event.kind === CharacterEventKind.added) {
      expect(event.status.kind).toBe(CharacterStatus.missed);
    }
  });

  it("returns back event for Backspace", () => {
    const [key, event] = getKeyMetrics({ typed: "Backspace", expected: "a" });
    expect(key).toBe("Backspace");
    expect(event.kind).toBe(CharacterEventKind.back);
  });

  it("returns ignore for multi-char non-special keys", () => {
    const [key, event] = getKeyMetrics({ typed: "Shift", expected: "a" });
    expect(key).toBe("Shift");
    expect(event.kind).toBe(CharacterEventKind.ignore);
  });

  it("classifies matching space as match", () => {
    const [key, event] = getKeyMetrics({ typed: " ", expected: " " });
    expect(key).toBe(" ");
    if (event.kind === CharacterEventKind.added) {
      expect(event.status.kind).toBe(CharacterStatus.match);
    }
  });

  it("classifies matching Enter as match", () => {
    const [key, event] = getKeyMetrics({ typed: "Enter", expected: "Enter" });
    expect(key).toBe("Enter");
    if (event.kind === CharacterEventKind.added) {
      expect(event.status.kind).toBe(CharacterStatus.match);
    }
  });
});

describe("getKeyDownMetrics", () => {
  it("returns back for Backspace", () => {
    expect(getKeyDownMetrics("Backspace")).toBe(CharacterEventKind.back);
  });

  it("returns added for Enter", () => {
    expect(getKeyDownMetrics("Enter")).toBe(CharacterEventKind.added);
  });

  it("returns added for Tab", () => {
    expect(getKeyDownMetrics("Tab")).toBe(CharacterEventKind.added);
  });

  it("returns ignore for regular keys", () => {
    expect(getKeyDownMetrics("a")).toBe(CharacterEventKind.ignore);
  });

  it("returns ignore for modifier keys", () => {
    expect(getKeyDownMetrics("Shift")).toBe(CharacterEventKind.ignore);
  });
});

describe("makeDeletedKeyMetrics", () => {
  it("creates deleted event with match status", () => {
    const [key, event] = makeDeletedKeyMetrics({
      status: CharacterStatus.match,
      expected: "a",
    });
    expect(key).toBe("a");
    expect(event.kind).toBe(CharacterEventKind.deleted);
  });

  it("creates deleted event with unmatch status", () => {
    const [key, event] = makeDeletedKeyMetrics({
      status: CharacterStatus.unmatch,
      expected: "b",
    });
    expect(key).toBe("b");
    if (event.kind === CharacterEventKind.deleted) {
      expect(event.status).toBe(CharacterStatus.unmatch);
    }
  });

  it("creates deleted event with extra status", () => {
    const [, event] = makeDeletedKeyMetrics({
      status: CharacterStatus.extra,
      expected: "c",
    });
    if (event.kind === CharacterEventKind.deleted) {
      expect(event.status).toBe(CharacterStatus.extra);
    }
  });
});
