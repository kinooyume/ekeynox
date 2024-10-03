import { createCharacter } from "../character";
import { MetaCharacter } from "../character/types";
import { MetaWord, NonEmptyArray, WordStatus } from "./types";

const createWordFromKeys = (
  characters: NonEmptyArray<MetaCharacter>,
  isSeparator = false,
): MetaWord => ({
  characters,
  isSeparator,
  status: WordStatus.unstart,
  focus: false,
  wasCorrect: false,
  spentTime: 0,
  wpm: 0,
});

const createWordOneKey = (key: string, isSeparator = false): MetaWord =>
  createWordFromKeys([createCharacter(key)], isSeparator);

const createWordFromString = (
  word: string,
  keyCallback?: (key: string) => void,
): MetaWord | null => {
  const keys = word.split("").map((key) => {
    keyCallback && keyCallback(key);
    return createCharacter(key);
  });

  return keys.length > 0
    ? createWordFromKeys(
        keys as NonEmptyArray<MetaCharacter>,
        word.trim() === "",
      )
    : null;
};

const createEnter = (): MetaWord => createWordOneKey("Enter", true);
const createSpace = (): MetaWord => createWordOneKey(" ", true);

const parseWord = (keySet: Set<string>) => (word: string) =>
  createWordFromString(word, (key) => keySet.add(key));

export {
  createWordFromKeys,
  createWordOneKey,
  createWordFromString,
  createEnter,
  createSpace,
  parseWord,
};
