import { describe, it, expect } from "vitest";
import { consistency } from "./consistency";

describe("consistency", () => {
  it("returns 100 for identical values", () => {
    expect(consistency([50, 50, 50, 50])).toBe(100);
  });

  it("returns 100 for a single value", () => {
    expect(consistency([42])).toBe(100);
  });

  it("returns high consistency for low variance", () => {
    const result = consistency([100, 101, 99, 100]);
    expect(result).toBeGreaterThan(95);
  });

  it("returns low consistency for high variance", () => {
    const result = consistency([1, 100, 1, 100]);
    expect(result).toBeLessThan(30);
  });

  it("returns NaN for empty array", () => {
    expect(consistency([])).toBeNaN();
  });

  it("returns 100 for two identical values", () => {
    expect(consistency([5, 5])).toBe(100);
  });
});
