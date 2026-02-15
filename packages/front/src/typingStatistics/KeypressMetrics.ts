import type { LinkedList } from "~/List";
import List from "~/List";

import { TypingWord } from "~/typingContent/word/types";
import {
  createWordStat,
  createWordStatFromList,
  mergeWordStats,
  type WordStat,
} from "~/typingContent/word/stats";

import { type TypingCharacter } from "~/typingContent/character/types";

import type { TypingStatePending } from "~/typingState";

import {
  CharacterMetrics,
  createCharacterMetrics,
  createCharacterMetricsFromPendingList,
  pushCharacterMetrics,
} from "~/typingContent/character/stats/metrics";
import { diffCharacterScore } from "~/typingContent/character/stats/score";

export type StatCore = {
  projection: CharacterMetrics;
  wordStat: WordStat;
  duration: number;
};

export type StatMeta = {
  logs: LinkedList<TypingCharacter>;
  wordsLogs: LinkedList<TypingWord>;
  sectionProjection: CharacterMetrics;
  sectionWordStat: WordStat;
  start: number;
  stop: number;
};

export type StatSpeed = {
  kpm: number;
  wpm: number;
};

export type StatProjection = {
  speed: StatSpeed;
  accuracies: [corrected: number, real: number];
};

export type KeypressMetricsProjection = {
  core: StatCore;
  meta: StatMeta;
  stats: StatProjection;
};

const createCoreProjection = (): StatCore => ({
  projection: createCharacterMetrics(),
  wordStat: createWordStat(),
  duration: 0,
});

const createMetaCharacterpressProjection = (): StatMeta => ({
  logs: null,
  wordsLogs: null,
  sectionProjection: createCharacterMetrics(),
  sectionWordStat: createWordStat(),
  start: 0,
  stop: 0,
});

const createSpeedProjection = (): StatSpeed => ({
  kpm: 0,
  wpm: 0,
});

const createStatProjection = (): StatProjection => ({
  speed: createSpeedProjection(),
  accuracies: [0, 0],
});

const createKeypressProjection = (): KeypressMetricsProjection => ({
  core: createCoreProjection(),
  meta: createMetaCharacterpressProjection(),
  stats: createStatProjection(),
});

export type KeypressMetricsProps = {
  part: StatCore;
};

const keypressProjectionHandler = (props: KeypressMetricsProps) => {
  let projection = Object.assign({}, props.part.projection);
  let logs: LinkedList<TypingCharacter> = null;

  let wordProjection = Object.assign({}, props.part.wordStat);
  let wordsLogs: LinkedList<TypingWord> = null;

  const event = ({ key, word }: TypingStatePending) => {
    logs = List.make(logs, key);
    wordsLogs = List.make(wordsLogs, word);
  };

  const start = performance.now();

  const getProjection = (): KeypressMetricsProjection => {
    const stop = performance.now();
    let node = logs;
    let wordNode = wordsLogs;
    logs = null;
    wordsLogs = null;
    const duration = stop - start + props.part.duration;
    const [sectionProjection, sortedLogs] =
      createCharacterMetricsFromPendingList(node);
    const [sectionWordStat, sortedWordLogs] = createWordStatFromList(wordNode);
    pushCharacterMetrics(projection, sectionProjection);
    mergeWordStats(wordProjection, sectionWordStat);

    const projectionResult = diffCharacterScore(projection);

    const correct = projectionResult.match;

    const incorrect =
      projectionResult.unmatch +
      projectionResult.missed +
      projectionResult.extra;

    const statSpeed = {
      kpm: ((projectionResult.total / duration) * 60000) / 5,
      wpm: ((wordProjection.correct / duration) * 60000) / 5,
    };

    const accuracy = (correct / projectionResult.total) * 100 || 0;
    const rawAccuracy =
      (correct / (projectionResult.total + projection.deleted.total)) * 100 ||
      0;

    return {
      core: {
        projection: Object.assign({}, projection),
        wordStat: Object.assign({}, wordProjection),
        duration,
      },
      meta: {
        logs: sortedLogs,
        wordsLogs: sortedWordLogs,
        sectionProjection,
        sectionWordStat,
        start,
        stop,
      },
      stats: {
        speed: statSpeed,
        accuracies: [accuracy, rawAccuracy],
      },
    };
  };
  return { event, getProjection, start };
};

export default {
  keypressProjectionHandler,
  createCharacterMetrics,
  createKeypressProjection,
  createCoreProjection,
  createStatProjection,
};
