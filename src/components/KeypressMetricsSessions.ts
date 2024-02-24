import type { KeyTimedTuple } from "./KeyMetrics";
import KeypressMetrics, { type KeypressMetricsProjection } from "./KeypressMetrics";

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
  const handler = KeypressMetrics.keypressProjectionHandler();
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
  projection: KeypressMetrics.createTypingProjection(),
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
