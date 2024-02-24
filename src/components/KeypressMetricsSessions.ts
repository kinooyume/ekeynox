import type { KeyTimedTuple } from "./KeyMetrics";
import KeypressMetrics, {
  type CoreProjection,
  type KeypressMetricsProjection,
} from "./KeypressMetrics";

export type PendingKeypressMetrics = {
  event: (key: KeyTimedTuple) => void;
  getProjection: () => KeypressMetricsProjection;
  pause: () => [PausedKeypressMetrics, KeypressMetricsProjection];
};

export type PausedKeypressMetrics = {
  getProjection: () => KeypressMetricsProjection;
  resume: () => [PendingKeypressMetrics, stop: number];
};

const pendingKeypressMetrics = (
  part: CoreProjection,
): PendingKeypressMetrics => {
  const handler = KeypressMetrics.keypressProjectionHandler(part);
  return {
    event: handler.event,
    getProjection: handler.getProjection,
    pause: () => {
      const projection = handler.getProjection();
      return [
        {
          getProjection: () => projection,
          resume: () => [
            pendingKeypressMetrics(projection.core),
            projection.meta.stop,
          ],
        },
        projection,
      ];
    },
  };
};

const defaultPausedKeypressMetrics: PausedKeypressMetrics = {
  getProjection: KeypressMetrics.createKeypressProjection,
  resume: () => [
    pendingKeypressMetrics(KeypressMetrics.createCoreProjection()),
    0,
  ],
};

export default {
  new: defaultPausedKeypressMetrics,
};
