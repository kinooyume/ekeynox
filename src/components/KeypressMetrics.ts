import { KeyStatus, PromptKeyStatus } from "./KeyMetrics";
import { updateWordProjection } from "./KpWordMetrics";
import type { LinkedList } from "./List";
import List from "./List";
import type { TypingPending } from "./TypingEngine";

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
};

const createStatProjection = (): StatProjection => ({
  speed: createSpeedProjection(),
  accuracies: [0, 0],
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

  const getProjection = (): KeypressMetricsProjection => {
    const stop = performance.now();
    let node = logs;
    updateWordProjection(props.words)(logs);
    logs = null;
    const duration = stop - start + props.part.duration;
    let sortedLogs = null;
    const sectionProjection = createTypingProjection();
    while (node !== null) {
      const { keyMetrics } = node.value;
      const [_, metrics] = keyMetrics;
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
  createKpWordsMetrics,
};
