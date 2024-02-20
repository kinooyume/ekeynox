import { KeyStatus, PromptKeyStatus, type KeyTimedTuple } from "./KeyMetrics";
import {
  makeLinkedList,
  type LinkedList,
  createTypingProjection,
  type TypingProjection,
} from "./TypingMetrics";

/* Average */
type GetAverage = (value: number) => number;
type CreateAverage = (nbrIteration: number, prevAverage: number) => GetAverage;

const createAverage: CreateAverage = (nbr, average) => (value: number) =>
  average + (value - average) / nbr;

/* *** */

export type KeypressMetricsProjection = {
  wpms: [number, number];
  accuracies: [number, number];
  projection: TypingProjection;
  logs: LinkedList<KeyTimedTuple> | null;
  start: number;
  stop: number;
};

const keypressProjectionHandler = () => {
  const projection = createTypingProjection();
  let logs: LinkedList<KeyTimedTuple> | null = null;

  const event = (key: KeyTimedTuple) => {
    logs = makeLinkedList(logs, key);
  };

  const start = performance.now();

  const getProjection = (): KeypressMetricsProjection => {
    const stop = performance.now();
    const duration = stop - start;
    let sortedLogs = null;
    let node = logs;
    while (node !== null) {
      const [_, metrics] = node.value;
      switch (metrics.kind) {
        case KeyStatus.match:
          projection.correct++;
          break;
        case KeyStatus.unmatch:
          projection.incorrect++;
          break;
        case KeyStatus.extra:
          projection.extra++;
          break;
        case KeyStatus.missed:
          projection.missed++;
          break;
        case KeyStatus.deleted:
          if (metrics.status === PromptKeyStatus.correct)
            projection.deletedCorrect++;
          else if (metrics.status === PromptKeyStatus.incorrect)
            projection.deletedIncorrect++;
          else projection.total--;
          break;
      }
      projection.total++;
      sortedLogs = makeLinkedList(sortedLogs, node.value);
      node = node.next;
    }

    const wpm =
      (((projection.correct - projection.deletedCorrect) / duration) * 60000) /
      5;

    const raw =
      (((projection.total -
        projection.deletedCorrect -
        projection.deletedIncorrect) /
        duration) *
        60000) /
      5;

    const accuracy =
      ((projection.correct - projection.deletedCorrect) /
        (projection.total -
          projection.deletedCorrect -
          projection.deletedIncorrect)) *
      100;

    const rawAccuracy = (projection.correct / projection.total) * 100;

    return {
      wpms: [wpm, raw],
      accuracies: [accuracy, rawAccuracy],
      projection: Object.assign({}, projection),
      logs: sortedLogs,
      start,
      stop,
    };
  };
  return { event, getProjection, start };
};

/* Session */

export type PendingKeypressMetrics = {
  event: (key: KeyTimedTuple) => void;
  getProjection: () => KeypressMetricsProjection;
  pause: () => PausedKeypressMetrics;
};

export type PausedKeypressMetrics = {
  getProjection: () => KeypressMetricsProjection;
  resume: () => PendingKeypressMetrics;
};

// NOTE: broken play/pause, act like a reset
// TODO: Multiple Session Handler (play/pause)

const pendingKeypressMetrics = (): PendingKeypressMetrics => {
  const handler = keypressProjectionHandler();
  return {
    event: handler.event,
    getProjection: handler.getProjection,
    pause: () => {
      const projection = handler.getProjection();
      return {
        getProjection: () => projection,
        resume: pendingKeypressMetrics,
      };
    },
  };
};

const defaultProjection: KeypressMetricsProjection = {
  wpms: [0, 0],
  accuracies: [0, 0],
  projection: createTypingProjection(),
  logs: null,
  start: 0,
  stop: 0,
};
const defaultPausedKeypressMetrics: PausedKeypressMetrics = {
  getProjection: () => defaultProjection,
  resume: pendingKeypressMetrics,
};

export default {
  new: defaultPausedKeypressMetrics,
};
