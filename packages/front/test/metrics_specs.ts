import { expect } from "chai";
import { describe, it } from "mocha";
import { averageWordWpm } from "~/components/metrics/Metrics";

// create a mockup of MetaWord

describe("Metrics", () => {
  describe("averageWordWpm", () => {
    it("should return an array of WordSpeed", () => {
      const words = [
        {
          wpm: 10,
          keys: [{ key: "a" }, { key: "b" }, { key: "c" }],
        },
        {
          wpm: 20,
          keys: [{ key: "d" }, { key: "e" }, { key: "f" }],
        },
        {
          wpm: 30,
          keys: [{ key: "g" }, { key: "h" }, { key: "i" }],
        },
      ];
      const result = averageWordWpm(words);
      expect(result).to.deep.equal([
        { word: "abc", wpm: [10], averageWpm: 10 },
        { word: "def", wpm: [20], averageWpm: 20 },
        { word: "ghi", wpm: [30], averageWpm: 30 },
      ]);
    });
  });
});
