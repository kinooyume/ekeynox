import { Paragraphs, Paragraph } from "./types";
import { NonEmptyArray } from "../word/types";
import { MetaCharacter } from "../character/types";

import { createCharacter } from "../character";
import { createWordFromKeys } from "../word";

const deepCloneParagraphs = (paragraphs: Paragraphs): Paragraphs =>
  paragraphs.map((paragraph) =>
    paragraph.map((word) => ({
      ...word,
      keys: word.characters.map((key) => ({ ...key })),
    })),
  );

const clearParagraphs = (paragraphs: Paragraphs): Paragraphs => {
  return paragraphs.map(
    (paragraph) =>
      paragraph
        .map((word) => {
          const keys = word.characters.map((key) =>
            createCharacter(`${key.char}`),
          );
          if (keys.length === 0) return;
          return createWordFromKeys(
            keys as NonEmptyArray<MetaCharacter>,
            word.isSeparator,
          );
        })
        .filter((word) => word) as Paragraph,
  );
};

export { deepCloneParagraphs, clearParagraphs };
