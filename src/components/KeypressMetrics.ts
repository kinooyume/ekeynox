import { KeyStatus, PromptKeyStatus, type KeyTimedTuple } from "./KeyMetrics";
import type { LinkedList } from "./List";
import List from "./List";

export type TypingProjection = {
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
  deletedCorrect: number;
  deletedIncorrect: number;
  total: number;
};

const createTypingProjection = () => ({
  correct: 0,
  incorrect: 0,
  deletedCorrect: 0,
  deletedIncorrect: 0,
  extra: 0,
  missed: 0,
  total: 0,
});

export type CoreProjection = {
  projection: TypingProjection;
  duration: number;
};

const createCoreProjection = (): CoreProjection => ({
  projection: createTypingProjection(),
  duration: 0,
});

export type MetaProjection = {
  logs: LinkedList<KeyTimedTuple> | null;
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
};

const createStatProjection = (): StatProjection => ({
  speed: createSpeedProjection(),
  accuracies: [0, 0],
});

export type KeypressMetricsProjection = {
  core: CoreProjection;
  meta: MetaProjection;
  stats: StatProjection;
};

const createKeypressProjection = (): KeypressMetricsProjection => ({
  core: createCoreProjection(),
  meta: createMetaKeypressProjection(),
  stats: createStatProjection(),
});

const mergeTypingProjections = (
  target: TypingProjection,
  source: TypingProjection,
) => {
  target.correct += source.correct;
  target.incorrect += source.incorrect;
  target.extra += source.extra;
  target.missed += source.missed;
  target.deletedCorrect += source.deletedCorrect;
  target.deletedIncorrect += source.deletedIncorrect;
  target.total += source.total;
  return target;
};

const keypressProjectionHandler = (part: CoreProjection) => {
  let projection = Object.assign({}, part.projection);
  let logs: LinkedList<KeyTimedTuple> | null = null;

  const event = (key: KeyTimedTuple) => {
    logs = List.make(logs, key);
  };

  const start = performance.now();

  const getProjection = (): KeypressMetricsProjection => {
    const stop = performance.now();
    let node = logs;
    logs = null;
    const duration = stop - start + part.duration;
    let sortedLogs = null;
    const sectionProjection = createTypingProjection();
    while (node !== null) {
      const [_, metrics] = node.value;
      if (metrics.kind === KeyStatus.deleted) {
        if (metrics.status === PromptKeyStatus.correct)
          sectionProjection.deletedCorrect++;
        else if (metrics.status === PromptKeyStatus.incorrect)
          sectionProjection.deletedIncorrect++;
        else break;
      } else {
        switch (metrics.kind) {
          case KeyStatus.match:
            sectionProjection.correct++;
            break;
          case KeyStatus.unmatch:
            sectionProjection.incorrect++;
            break;
          case KeyStatus.extra:
            sectionProjection.extra++;
            break;
          case KeyStatus.missed:
            sectionProjection.missed++;
            break;
        }
      }
      sectionProjection.total++;
      sortedLogs = List.make(sortedLogs, node.value);
      node = node.next;
    }
    projection = mergeTypingProjections(projection, sectionProjection);
    const correct = projection.correct - projection.deletedCorrect;
    const incorrect =
      projection.incorrect +
      projection.extra +
      projection.missed -
      projection.deletedIncorrect;

    const total = correct + incorrect;

    const wpm = ((correct / duration) * 60000) / 5;
    const raw = ((projection.total / duration) * 60000) / 5;

    const accuracy = (correct / total) * 100 || 0;
    const rawAccuracy =
      (correct / (total + projection.deletedIncorrect)) * 100 || 0;

    return {
      core: { projection: Object.assign({}, projection), duration },
      meta: { logs: sortedLogs, sectionProjection, start, stop },
      stats: {
        speed: {
          byKeypress: [wpm, raw],
          byWord: [wpm, raw],
        },
        accuracies: [accuracy, rawAccuracy],
      },
    };
  };
  return { event, getProjection, start };
};

export default {
  createTypingProjection,
  keypressProjectionHandler,
  createKeypressProjection,
  createCoreProjection,
  createStatProjection,
};
