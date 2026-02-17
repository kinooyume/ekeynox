import { describe, it, expect } from "vitest";
import { getDefaultTypingOptions, deepCopy } from "./typingOptions";
import { TypingModeKind } from "./typingModeKind";
import { CategoryKind, GenerationCategory } from "./typingModeCategory";

describe("getDefaultTypingOptions", () => {
  it("returns speed mode as default", () => {
    expect(getDefaultTypingOptions().modeSelected).toBe(TypingModeKind.speed);
  });

  it("returns words1k as default category", () => {
    const opts = getDefaultTypingOptions();
    expect(opts.categorySelected.kind).toBe(CategoryKind.generation);
    if (opts.categorySelected.kind === CategoryKind.generation) {
      expect(opts.categorySelected.category).toBe(
        GenerationCategory.words1k,
      );
    }
  });

  it("returns fresh object on each call", () => {
    const a = getDefaultTypingOptions();
    const b = getDefaultTypingOptions();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });
});

describe("deepCopy", () => {
  it("creates an independent copy", () => {
    const original = getDefaultTypingOptions();
    const copy = deepCopy(original);
    expect(copy).toEqual(original);
    expect(copy).not.toBe(original);
  });

  it("deep copies nested categorySelected", () => {
    const original = getDefaultTypingOptions();
    const copy = deepCopy(original);
    expect(copy.categorySelected).not.toBe(original.categorySelected);
  });

  it("deep copies nested generation", () => {
    const original = getDefaultTypingOptions();
    const copy = deepCopy(original);
    expect(copy.generation).not.toBe(original.generation);
  });

  it("does not propagate mutations", () => {
    const original = getDefaultTypingOptions();
    const copy = deepCopy(original);
    copy.wordCount = 999;
    expect(original.wordCount).toBe(10);
  });
});
