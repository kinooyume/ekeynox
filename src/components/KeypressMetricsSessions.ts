import KeypressMetrics, {
  type KeypressMetricsProjection,
  type KeypressMetricsProps,
} from "./KeypressMetrics";
import type { TypingPending } from "./TypingEngine";

export type PendingKeypressMetrics = {
  event: (key: TypingPending) => void;
  getProjection: (isOver: boolean) => KeypressMetricsProjection;
  pause: (isOver: boolean) => [PausedKeypressMetrics, KeypressMetricsProjection];
};

export type PausedKeypressMetrics = {
  getProjection: (isOver: boolean) => KeypressMetricsProjection;
  resume: () => [PendingKeypressMetrics, stop: number];
};

const pendingKeypressMetrics = (
  props: KeypressMetricsProps,
): PendingKeypressMetrics => {
  const handler = KeypressMetrics.keypressProjectionHandler(props);
  return {
    event: handler.event,
    getProjection: handler.getProjection,
    pause: (isOver) => {
      const projection = handler.getProjection(isOver);
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
