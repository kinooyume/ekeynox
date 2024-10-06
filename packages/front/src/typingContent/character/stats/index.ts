import { TypingState, TypingStateKind } from "~/typingState";
import {
  createCharacterMetrics,
  CharacterMetrics,
  updateCharacterMetrics,
} from "./metrics";
import {
  CharacterScoreFull,
  CharacterScores,
  diffCharacterScore,
} from "./score";

export type CharacterStats = Record<string, CharacterMetrics>;

type CharacterStatsProps = { projection: CharacterStats; status: TypingState };
const updateCharacterStats = ({
  projection,
  status,
}: CharacterStatsProps): CharacterStats => {
  if (status.kind === TypingStateKind.unstart) {
    return {};
  } else if (status.kind !== TypingStateKind.pending) {
    return projection;
  }
  const [key, metrics] = status.key.keyMetrics;
  if (projection[key] === undefined) {
    projection[key] = createCharacterMetrics();
  }
  /* Side effect */
  updateCharacterMetrics(projection[key])(metrics);

  return projection;
};

export type CharacterExpected = Map<string, number>;
export type CharacterStatsResult = [
  scores: CharacterScores,
  expected: CharacterExpected,
];

// Duplicate blanckCharacters
const blankCharacters = [" ", "Enter"];

const createCharacterStatsResult = (
  keys: CharacterStats,
): CharacterStatsResult => {
  const expected = new Map<string, number>();
  const result: CharacterScores = Object.entries(keys).reduce(
    (acc, [key, value]) => {
      // TODO: Keypress metrics, better handle separator
      if (blankCharacters.includes(key)) return acc;
      value.expected.forEach((e) => {
        expected.set(e, (expected.get(e) || 0) + 1);
      });
      return { ...acc, [key]: value };
      /*
       * NOTE: typescript doesn't complain.. why ?
       * return { ...acc, [key]: diffCharacterScore(value) };
       */
    },
    {},
  );
  return [result, expected];
};

const sortKeys = (keys: CharacterStats): CharacterStats => {
  const sorted = Object.entries(keys).sort(
    ([, a], [, b]) => b.added.match - a.added.match,
  );
  return Object.fromEntries(sorted);
};

const sortKeysAlpha = (keys: CharacterStats): CharacterStats => {
const sorted = Object.entries(keys).sort(([a], [b]) => a.localeCompare(b));
return Object.fromEntries(sorted);
}

export { sortKeys, sortKeysAlpha, updateCharacterStats, createCharacterStatsResult };
