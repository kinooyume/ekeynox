import { describe, it, expect } from "vitest";
import {
  createCharacterScore,
  updateCharacterScore,
  pushCharacterScore,
  diffCharacterScore,
  mergeCharacterScore,
} from "./score";
import { CharacterStatus } from "../types";

describe("createCharacterScore", () => {
  it("returns all-zero score", () => {
    expect(createCharacterScore()).toEqual({
      match: 0,
      unmatch: 0,
      extra: 0,
      missed: 0,
      total: 0,
    });
  });
});

describe("diffCharacterScore", () => {
  it("subtracts deleted from added", () => {
    const result = diffCharacterScore({
      added: { match: 5, unmatch: 3, extra: 2, missed: 1, total: 11 },
      deleted: { match: 1, unmatch: 1, extra: 1, missed: 1, total: 4 },
    });
    expect(result).toEqual({
      match: 4,
      unmatch: 2,
      extra: 1,
      missed: 0,
      total: 7,
    });
  });
});

describe("mergeCharacterScore", () => {
  it("adds deleted to added", () => {
    const result = mergeCharacterScore({
      added: { match: 5, unmatch: 3, extra: 2, missed: 1, total: 11 },
      deleted: { match: 1, unmatch: 1, extra: 1, missed: 1, total: 4 },
    });
    expect(result).toEqual({
      match: 6,
      unmatch: 4,
      extra: 3,
      missed: 2,
      total: 15,
    });
  });
});

describe("updateCharacterScore", () => {
  it("increments match on add", () => {
    const score = createCharacterScore();
    updateCharacterScore(score).add({ kind: CharacterStatus.match }, []);
    expect(score.match).toBe(1);
    expect(score.total).toBe(1);
  });

  it("increments unmatch and pushes typed on add", () => {
    const score = createCharacterScore();
    const expected: string[] = [];
    updateCharacterScore(score).add(
      { kind: CharacterStatus.unmatch, typed: "x" },
      expected,
    );
    expect(score.unmatch).toBe(1);
    expect(expected).toContain("x");
  });

  it("increments extra on add", () => {
    const score = createCharacterScore();
    updateCharacterScore(score).add({ kind: CharacterStatus.extra }, []);
    expect(score.extra).toBe(1);
  });

  it("increments missed and pushes typed on add", () => {
    const score = createCharacterScore();
    const expected: string[] = [];
    updateCharacterScore(score).add(
      { kind: CharacterStatus.missed, typed: "y" },
      expected,
    );
    expect(score.missed).toBe(1);
    expect(expected).toContain("y");
  });

  it("increments match on delete", () => {
    const score = createCharacterScore();
    updateCharacterScore(score).delete(CharacterStatus.match);
    expect(score.match).toBe(1);
    expect(score.total).toBe(1);
  });

  it("increments unmatch on delete", () => {
    const score = createCharacterScore();
    updateCharacterScore(score).delete(CharacterStatus.unmatch);
    expect(score.unmatch).toBe(1);
  });
});

describe("pushCharacterScore", () => {
  it("accumulates source into target", () => {
    const target = { match: 1, unmatch: 0, extra: 0, missed: 0, total: 1 };
    const source = { match: 2, unmatch: 1, extra: 3, missed: 0, total: 6 };
    pushCharacterScore(target, source);
    expect(target).toEqual({
      match: 3,
      unmatch: 1,
      extra: 3,
      missed: 0,
      total: 7,
    });
  });
});
