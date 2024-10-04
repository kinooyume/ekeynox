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

import type { TypingState } from "~/typingState";
import {
  CharacterMetrics,
  createCharacterMetrics,
  createCharacterMetricsFromPendingList,
  pushCharacterMetrics,
} from "~/typingContent/character/stats/metrics";
import { diffCharacterScore } from "~/typingContent/character/stats/score";

export type CoreProjection = {
  projection: CharacterMetrics;
  wordStat: WordStat;
  duration: number;
};

export type MetaProjection = {
  logs: LinkedList<TypingCharacter>;
  wordsLogs: LinkedList<TypingWord>;
  sectionProjection: CharacterMetrics;
  sectionWordStat: WordStat;
  start: number;
  stop: number;
};

export type SpeedProjection = {
  byKeypress: [valid: number, all: number];
  byWord: [valid: number, all: number];
};

export type StatProjection = {
  speed: SpeedProjection;
  accuracies: [corrected: number, real: number];
  consistency: number;
};

export type KeypressMetricsProjection = {
  core: CoreProjection;
  meta: MetaProjection;
  stats: StatProjection;
};

const createCoreProjection = (): CoreProjection => ({
  projection: createCharacterMetrics(),
  wordStat: createWordStat(),
  duration: 0,
});

const createMetaCharacterpressProjection = (): MetaProjection => ({
  logs: null,
  wordsLogs: null,
  sectionProjection: createCharacterMetrics(),
  sectionWordStat: createWordStat(),
  start: 0,
  stop: 0,
});

const createSpeedProjection = (): SpeedProjection => ({
  byKeypress: [0, 0],
  byWord: [0, 0],
});

const createStatProjection = (): StatProjection => ({
  speed: createSpeedProjection(),
  accuracies: [0, 0],
  consistency: 0,
});

const createKeypressProjection = (): KeypressMetricsProjection => ({
  core: createCoreProjection(),
  meta: createMetaCharacterpressProjection(),
  stats: createStatProjection(),
});

export type KeypressMetricsProps = {
  part: CoreProjection;
};

const keypressProjectionHandler = (props: KeypressMetricsProps) => {
  let projection = Object.assign({}, props.part.projection);
  let logs: LinkedList<TypingCharacter> = null;

  let wordProjection = Object.assign({}, props.part.wordStat);
  let wordsLogs: LinkedList<TypingWord> = null;

  const event = ({ key, word }: TypingState) => {
    logs = List.make(logs, key);
    wordsLogs = List.make(wordsLogs, word);
  };

  const start = performance.now();

  // TODO: refacto key/words
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
    /*  Side effect */
    pushCharacterMetrics(projection, sectionProjection);
    mergeWordStats(wordProjection, sectionWordStat);
    /* *** */

    const projectionResult = diffCharacterScore(projection);

    const correct = projectionResult.match;

    const incorrect =
      projectionResult.unmatch +
      projectionResult.missed +
      projectionResult.extra;

    const total = correct + incorrect;

    const byKeypress: [number, number] = [
      ((correct / duration) * 60000) / 5,
      ((projection.total / duration) * 60000) / 5,
    ];
    const byWord: [number, number] = [
      ((wordProjection.correct / duration) * 60000) / 5,
      ((wordProjection.correct / duration) * 60000) / 5,
    ];

    const accuracy = (correct / total) * 100 || 0;
    const rawAccuracy =
      (correct / (total + projection.deleted.total)) * 100 || 0;

    // NOTE: pas sur que consistency doit etre ici
    // TODO: stats dans section projection, donc pour quoi pas
    // un section avec projection et stats.. ?
    const consistency = byWord[1] / byKeypress[0];

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
        speed: {
          byKeypress,
          byWord,
        },
        accuracies: [accuracy, rawAccuracy],
        consistency: consistency,
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
