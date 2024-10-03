import type { TypingState } from "~/typingState";

import KeypressMetrics, {
  type KeypressMetricsProjection,
  type KeypressMetricsProps,
} from "./KeypressMetrics";

export type PendingKeypressMetrics = {
  event: (event: TypingState) => void;
  getProjection: (isOver: boolean) => KeypressMetricsProjection;
  pause: (
    isOver: boolean,
  ) => [PausedKeypressMetrics, KeypressMetricsProjection];
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
      const projection = handler.getProjection();
      return [
        {
          getProjection: () => projection,
          resume: () => [
            pendingKeypressMetrics({
              part: projection.core,
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
    }),
    0,
  ],
};

export default {
  new: defaultPausedKeypressMetrics,
};
