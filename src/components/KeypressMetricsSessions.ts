import type { KeyTimedTuple } from "./KeyMetrics";
import KeypressMetrics, {
  type KeypressMetricsProjection,
} from "./KeypressMetrics";

export type PendingKeypressMetrics = {
  event: (key: KeyTimedTuple) => void;
  getProjection: () => KeypressMetricsProjection;
  pause: () => PausedKeypressMetrics;
};

export type PausedKeypressMetrics = {
  getProjection: () => KeypressMetricsProjection;
  resume: () => [PendingKeypressMetrics, number];
};

const pendingKeypressMetrics = (): PendingKeypressMetrics => {
  const handler = KeypressMetrics.keypressProjectionHandler();
  return {
    event: handler.event,
    getProjection: handler.getProjection,
    pause: () => {
      const projection = handler.getProjection();
      return {
        getProjection: () => projection,
        resume: () => [pendingKeypressMetrics(), projection.stop],
      };
    },
  };
};

const defaultPausedKeypressMetrics: PausedKeypressMetrics = {
  getProjection: KeypressMetrics.createKeypressProjection,
  resume: () => [pendingKeypressMetrics(), 0],
};

export default {
  new: defaultPausedKeypressMetrics,
};
