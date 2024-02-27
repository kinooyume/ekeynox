import {
  createTypingProjection,
  type TypingProjection,
  mergeTypingProjections,
  createTypingProjectionFromPendingList,
} from "./TypingProjection";
import { updateWordProjection } from "./KpWordMetrics";
import type { LinkedList } from "./List";
import List from "./List";
import type { TypingPending } from "./TypingEngine";

export type CoreProjection = {
  projection: TypingProjection;
  duration: number;
};

const createCoreProjection = (): CoreProjection => ({
  projection: createTypingProjection(),
  duration: 0,
});

export type MetaProjection = {
  logs: LinkedList<TypingPending>;
  sectionProjection: TypingProjection;
  start: number;
  stop: number;
};

const createMetaKeypressProjection = (): MetaProjection => ({
  logs: null,
  sectionProjection: createTypingProjection(),
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

export type KpWordsMetrics = {
  word: LinkedList<TypingPending>;
  projection: TypingProjection;
};

const createKpWordsMetrics = (): KpWordsMetrics => ({
  word: null,
  projection: createTypingProjection(),
});

export type KeypressMetricsProjection = {
  core: CoreProjection;
  words: KpWordsMetrics;
  meta: MetaProjection;
  stats: StatProjection;
};

const createKeypressProjection = (): KeypressMetricsProjection => ({
  core: createCoreProjection(),
  words: createKpWordsMetrics(),
  meta: createMetaKeypressProjection(),
  stats: createStatProjection(),
});

export type KeypressMetricsProps = {
  part: CoreProjection;
  words: KpWordsMetrics;
};

const keypressProjectionHandler = (props: KeypressMetricsProps) => {
  let projection = Object.assign({}, props.part.projection);
  let logs: LinkedList<TypingPending> = null;

  const event = (key: TypingPending) => {
    logs = List.make(logs, key);
  };

  const start = performance.now();

  const getProjection = (isOver: boolean): KeypressMetricsProjection => {
    const stop = performance.now();
    let node = logs;
    logs = null;
    const duration = stop - start + props.part.duration;
    const [sectionProjection, sortedLogs] =
      createTypingProjectionFromPendingList(node);
    /*  Side effect */
    mergeTypingProjections(projection, sectionProjection);
    updateWordProjection(props.words)(node, isOver);
    /* *** */

    const correct = projection.correct - projection.deletedCorrect;
    const correctWord =
      props.words.projection.correct - props.words.projection.deletedCorrect;

    const incorrect =
      projection.incorrect +
      projection.extra +
      projection.missed -
      projection.deletedIncorrect;

    const total = correct + incorrect;

    const byKeypress: [number, number] = [
      ((correct / duration) * 60000) / 5,
      ((projection.total / duration) * 60000) / 5,
    ];
    const byWord: [number, number] = [
      ((correctWord / duration) * 60000) / 5,
      ((props.words.projection.total / duration) * 60000) / 5,
    ];

    const accuracy = (correct / total) * 100 || 0;
    const rawAccuracy =
      (correct / (total + projection.deletedIncorrect)) * 100 || 0;

    // NOTE: pas sur que consistency doit etre ici
    // TODO: stats dans section projection, donc pour quoi pas
    // un section avec projection et stats.. ?
    const consistency = byWord[1] / byKeypress[0];

    return {
      core: { projection: Object.assign({}, projection), duration },
      words: props.words,
      meta: { logs: sortedLogs, sectionProjection, start, stop },
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
  createKpWordsMetrics,
};
