import { describe, it, expect } from "vitest";
import keyboardLayout from "./keyboardLayout";

describe("keyboardLayout", () => {
  it("creates a qwerty layout builder", () => {
    expect(keyboardLayout("qwerty")).toBeTypeOf("function");
  });

  it("creates an azerty layout builder", () => {
    expect(keyboardLayout("azerty")).toBeTypeOf("function");
  });

  it("throws for invalid layout name", () => {
    expect(() => keyboardLayout("dvorak")).toThrow(
      "Invalid keyboard layout: dvorak",
    );
  });

  it("marks matching keys as used", () => {
    const builder = keyboardLayout("qwerty");
    const result = builder(new Set(["a", "s", "d"]));
    const aKey = result.layoutFlat.find((k) => k.primary === "a");
    expect(aKey?.used).toBe(true);
  });

  it("marks non-matching keys as unused", () => {
    const builder = keyboardLayout("qwerty");
    const result = builder(new Set(["a"]));
    const zKey = result.layoutFlat.find((k) => k.primary === "z");
    expect(zKey?.used).toBe(false);
  });

  it("puts unknown keys into extra array", () => {
    const builder = keyboardLayout("qwerty");
    const result = builder(new Set(["a", "\u00e9"]));
    expect(result.extra).toHaveLength(1);
    expect(result.extra[0].primary).toBe("\u00e9");
  });

  it("resets used state between calls", () => {
    const builder = keyboardLayout("qwerty");
    builder(new Set(["a"]));
    const result = builder(new Set(["z"]));
    const aKey = result.layoutFlat.find((k) => k.primary === "a");
    expect(aKey?.used).toBe(false);
    const zKey = result.layoutFlat.find((k) => k.primary === "z");
    expect(zKey?.used).toBe(true);
  });

  it("handles empty keySet", () => {
    const builder = keyboardLayout("qwerty");
    const result = builder(new Set());
    expect(result.layoutFlat.every((k) => !k.used)).toBe(true);
    expect(result.extra).toHaveLength(0);
  });

  it("finds keys by secondary characters", () => {
    const builder = keyboardLayout("qwerty");
    const result = builder(new Set(["Q"]));
    const qKey = result.layoutFlat.find((k) => k.primary === "q");
    expect(qKey?.used).toBe(true);
  });
});
