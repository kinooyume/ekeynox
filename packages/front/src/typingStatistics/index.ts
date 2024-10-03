import type { LinkedList } from "~/List";

import type { Paragraphs } from "~/typingContent/paragraphs/types";

import { type TypingOptions } from "~/typingOptions/typingOptions";

import type { KeypressMetricsProjection } from "./KeypressMetrics";
import type { KeysProjection } from "./KeysProjection";
import type { TypingMetrics } from "./TypingMetrics";

import {
  diffCharacterStatusProjections,
  type CharacterStatusProjection,
} from "./TypingProjection";
import { ChartMetrics, logsToChartMetrics } from "./charts";
import { getTimedKeySequence } from "./timedKey";
import averageWordWpm, { WordSpeed } from "./averageWordWpm";

export type TypingStatistics = {
  paragraphs: Paragraphs;
  typingOptions: TypingOptions;
  typing: TypingMetrics;
  keys: KeysProjection;
  wordsCount: number;
  // elapsedTime ?
};

export type KeyResume = Record<string, CharacterStatusProjection>;

export type MetricsResume = {
  chart: ChartMetrics;
  typingLogs: LinkedList<KeypressMetricsProjection>;
  words: Array<WordSpeed>;
  keys: [KeyResume, Map<string, number>];
};

// Duplicate blanckCharacters
const blankCharacters = [" ", "Enter"];

const makeKeysResume = (
  keys: KeysProjection,
): [KeyResume, Map<string, number>] => {
  const expected = new Map<string, number>();
  const result = Object.entries(keys).reduce((acc, [key, value]) => {
    // TODO: Keypress metrics, better handle separator
    if (blankCharacters.includes(key)) return acc;
    value.expected.forEach((e) => {
      expected.set(e, (expected.get(e) || 0) + 1);
    });
    return { ...acc, [key]: diffCharacterStatusProjections(value) };
  }, {});
  return [result, expected];
};

const sortKeys = (keys: KeysProjection): KeysProjection => {
  const sorted = Object.entries(keys).sort(
    ([, a], [, b]) => b.added.match - a.added.match,
  );
  return Object.fromEntries(sorted);
};

const createMetricsResume = (metrics: TypingStatistics): MetricsResume => ({
  chart: logsToChartMetrics(metrics.typing.logs),
  typingLogs: metrics.typing.logs,
  words: averageWordWpm(metrics.paragraphs.flat()).sort(
    (a, b) => b.averageWpm - a.averageWpm,
  ),
  keys: makeKeysResume(sortKeys(metrics.keys)),
});

export {
  createMetricsResume,
  // Tests
  averageWordWpm,
  getTimedKeySequence,
  makeKeysResume,
};
