import { describe, it, expect } from "vitest";
import content from "./index";

describe("parse", () => {
  it("parses single line into one paragraph", () => {
    const result = content.parse("hello world");
    expect(result.paragraphs).toHaveLength(1);
    expect(result.wordsCount).toBe(2);
  });

  it("builds keySet from all characters", () => {
    const result = content.parse("abc");
    expect(result.keySet.has("a")).toBe(true);
    expect(result.keySet.has("b")).toBe(true);
    expect(result.keySet.has("c")).toBe(true);
  });

  it("parses multi-line text into multiple paragraphs", () => {
    const result = content.parse("line1\nline2");
    expect(result.paragraphs).toHaveLength(2);
    const firstParagraph = result.paragraphs[0];
    const lastWord = firstParagraph[firstParagraph.length - 1];
    expect(lastWord.isSeparator).toBe(true);
    expect(lastWord.characters[0].char).toBe("Enter");
  });

  it("returns empty paragraphs for empty string", () => {
    const result = content.parse("");
    expect(result.paragraphs).toHaveLength(0);
    expect(result.wordsCount).toBe(0);
  });

  it("counts only non-whitespace words", () => {
    const result = content.parse("a b c");
    expect(result.wordsCount).toBe(3);
  });

  it("includes space separator between words", () => {
    const result = content.parse("a b");
    const paragraph = result.paragraphs[0];
    expect(paragraph.length).toBe(3);
    expect(paragraph[1].isSeparator).toBe(true);
  });

  it("does not add Enter separator for single paragraph", () => {
    const result = content.parse("hello world");
    const paragraph = result.paragraphs[0];
    const hasEnter = paragraph.some(
      (w) => w.characters[0].char === "Enter",
    );
    expect(hasEnter).toBe(false);
  });
});

describe("parseWords", () => {
  it("creates single paragraph from word array", () => {
    const result = content.parseWords(["hello", "world"]);
    expect(result.paragraphs).toHaveLength(1);
    expect(result.wordsCount).toBe(2);
  });

  it("interleaves words with space separators", () => {
    const result = content.parseWords(["a", "b", "c"]);
    const paragraph = result.paragraphs[0];
    expect(paragraph).toHaveLength(5);
    expect(paragraph[1].isSeparator).toBe(true);
    expect(paragraph[3].isSeparator).toBe(true);
  });

  it("single word has no trailing space", () => {
    const result = content.parseWords(["only"]);
    const paragraph = result.paragraphs[0];
    expect(paragraph).toHaveLength(1);
    expect(paragraph[0].isSeparator).toBe(false);
  });

  it("populates keySet from words", () => {
    const result = content.parseWords(["ab", "cd"]);
    expect(result.keySet.has("a")).toBe(true);
    expect(result.keySet.has("d")).toBe(true);
  });
});

describe("emptyContentData", () => {
  it("returns zero-initialized content data", () => {
    const result = content.emptyContentData();
    expect(result.paragraphs).toHaveLength(0);
    expect(result.keySet.size).toBe(0);
    expect(result.wordsCount).toBe(0);
  });
});
