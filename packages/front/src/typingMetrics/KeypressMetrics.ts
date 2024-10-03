import type { LinkedList } from "~/List";
import List from "~/List";

import { TypingWord } from "~/typingContent/word/types";
import { type TypingCharacter } from "~/typingContent/character/types";

import type { TypingState  } from "~/typingState";

import {
  createTypingProjection,
  type TypingProjection,
  mergeTypingProjections,
  createTypingProjectionFromPendingList,
  diffCharacterStatusProjections,
} from "./TypingProjection";

import {
  createWordProjection,
  createWordProjectionFromList,
  mergeWordProjections,
  type WordProjection,
} from "./KpWordMetrics";

export type CoreProjection = {
  projection: TypingProjection;
  wordProjection: WordProjection;
  duration: number;
};

const createCoreProjection = (): CoreProjection => ({
  projection: createTypingProjection(),
  wordProjection: createWordProjection(),
  duration: 0,
});

export type MetaProjection = {
  logs: LinkedList<TypingCharacter>;
  wordsLogs: LinkedList<TypingWord>;
  sectionProjection: TypingProjection;
  sectionWordProjection: WordProjection;
  start: number;
  stop: number;
};

const createMetaCharacterpressProjection = (): MetaProjection => ({
  logs: null,
  wordsLogs: null,
  sectionProjection: createTypingProjection(),
  sectionWordProjection: createWordProjection(),
  start: 0,
  stop: 0,
});

export type SpeedProjection = {
  byKeypress: [valid: number, all: number];
  byWord: [valid: number, all: number];
};

const createSpeedProjection = (): SpeedProjection => ({
  byKeypress: [0, 0],
  byWord: [0, 0],
});

export type StatProjection = {
  speed: SpeedProjection;
  accuracies: [corrected: number, real: number];
  consistency: number;
};

const createStatProjection = (): StatProjection => ({
  speed: createSpeedProjection(),
  accuracies: [0, 0],
  consistency: 0,
});

export type KeypressMetricsProjection = {
  core: CoreProjection;
  meta: MetaProjection;
  stats: StatProjection;
};

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

  let wordProjection = Object.assign({}, props.part.wordProjection);
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
      createTypingProjectionFromPendingList(node);
    const [sectionWordProjection, sortedWordLogs] =
      createWordProjectionFromList(wordNode);
    /*  Side effect */
    mergeTypingProjections(projection, sectionProjection);
    mergeWordProjections(wordProjection, sectionWordProjection);
    /* *** */

    const projectionResult = diffCharacterStatusProjections(projection);

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
        wordProjection: Object.assign({}, wordProjection),
        duration,
      },
      meta: {
        logs: sortedLogs,
        wordsLogs: sortedWordLogs,
        sectionProjection,
        sectionWordProjection,
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
  createTypingProjection,
  createKeypressProjection,
  createCoreProjection,
  createStatProjection,
};
