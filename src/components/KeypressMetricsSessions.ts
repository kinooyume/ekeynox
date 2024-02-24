import type { KeyTimedTuple } from "./KeyMetrics";
import KeypressMetrics, {
  type CoreKeypressProjection,
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

// pause: on donne le part
// getProjection, nouveau part
const pendingKeypressMetrics = (
  part: CoreKeypressProjection,
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
            pendingKeypressMetrics({
              duration: projection.duration,
              projection: projection.projection,
            }),
            projection.stop,
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
    pendingKeypressMetrics(KeypressMetrics.createCoreKeypressProjection()),
    0,
  ],
};

export default {
  new: defaultPausedKeypressMetrics,
};
