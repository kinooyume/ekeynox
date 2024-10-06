import type { LinkedList } from "~/List";

import type { Paragraphs } from "~/typingContent/paragraphs/types";

import { type TypingOptions } from "~/typingOptions/typingOptions";

import type { KeypressMetricsProjection } from "./KeypressMetrics";
import type { TypingMetrics } from "./TypingMetrics";

import { ChartMetrics, logsToChartMetrics } from "./charts";
import averageWordWpm, { WordSpeed } from "./averageWordWpm";
import {
  CharacterStats,
  CharacterStatsResult,
  createCharacterStatsResult,
  sortKeysAlpha,
} from "~/typingContent/character/stats";

export type TypingStatistics = {
  paragraphs: Paragraphs;
  typingOptions: TypingOptions;
  typing: TypingMetrics;
  characters: CharacterStats;
  wordsCount: number;
  // elapsedTime ?
};

export type TypingStatisticsResult = {
  chart: ChartMetrics;
  typingLogs: LinkedList<KeypressMetricsProjection>;
  words: Array<WordSpeed>;
  characters: CharacterStatsResult;
};

const createTypingStatisticsResult = (metrics: TypingStatistics): TypingStatisticsResult => ({
  chart: logsToChartMetrics(metrics.typing.logs),
  typingLogs: metrics.typing.logs,
  words: averageWordWpm(metrics.paragraphs.flat()).sort(
    (a, b) => b.averageWpm - a.averageWpm,
  ),
  characters: createCharacterStatsResult(sortKeysAlpha(metrics.characters)),
});

export { createTypingStatisticsResult };
