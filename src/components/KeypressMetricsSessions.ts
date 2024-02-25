import type { KeyTimedTuple } from "./KeyMetrics";
import KeypressMetrics, {
  type KeypressMetricsProjection,
  type KeypressMetricsProps,
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
  props: KeypressMetricsProps,
): PendingKeypressMetrics => {
  const handler = KeypressMetrics.keypressProjectionHandler(props);
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
              part: projection.core,
              words: projection.words,
            }),
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
    pendingKeypressMetrics({
      part: KeypressMetrics.createCoreProjection(),
      words: KeypressMetrics.createKpWordsMetrics(),
    }),
    0,
  ],
};

export default {
  new: defaultPausedKeypressMetrics,
};
