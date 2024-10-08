import type { LinkedList } from "~/List";

import type { Paragraphs } from "~/typingContent/paragraphs/types";

import { type TypingOptions } from "~/typingOptions/typingOptions";

import type { KeypressMetricsProjection, StatSpeed } from "./KeypressMetrics";
import type { TypingMetrics } from "./TypingMetrics";

import { ChartMetrics, logsToChartStatistics } from "./charts";
import averageWordWpm, { WordSpeed } from "./averageWordWpm";
import {
  CharacterStats,
  CharacterStatsResult,
  createCharacterStatsResult,
  sortKeysAlpha,
} from "~/typingContent/character/stats";
import { consistency } from "./consistency";

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
  speed: StatSpeed;
  consistency: number;
};

const createTypingStatisticsResult = (
  typingStatistics: TypingStatistics,
): TypingStatisticsResult => {
  // NOTE: On devrait plutot, décompiler en tableau, puis convertir en chart
  const chartStatistics = logsToChartStatistics(typingStatistics.typing.logs);
  return {
    chart: chartStatistics,
    typingLogs: typingStatistics.typing.logs,
    words: averageWordWpm(typingStatistics.paragraphs.flat()).sort(
      (a, b) => b.averageWpm - a.averageWpm,
    ),
    characters: createCharacterStatsResult(
      sortKeysAlpha(typingStatistics.characters),
    ),
    speed: typingStatistics.typing.logs!.value.stats.speed,
    consistency: consistency(chartStatistics.raw.map((v) => v.y)),
  };
};

export { createTypingStatisticsResult };
