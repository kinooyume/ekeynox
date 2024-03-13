import { type Metakey } from "../content/Content.ts";
import {
  promptKeypressHandler,
  type PendingPromptKeypressMetrics,
  type PausedPromptKeypressMetrics,
  PromptWpmKind,
} from "./PromptKeypressMetrics.ts";
import { WordStatus } from "../prompt/PromptWord";

type createWordMetricsStateProps = {
  setWpm: (wpm: number) => void;
  keys: Array<Metakey>;
};

export type WordMetrics = ({ status }: { status: WordStatus }) => WordMetrics;
const createWordMetricsState = ({
  setWpm,
  keys,
}: createWordMetricsStateProps) => {
  type PendingMetricsProps = {
    metrics: PendingPromptKeypressMetrics;
  };

  const pending =
    ({ metrics }: PendingMetricsProps): WordMetrics =>
    ({ status }) => {
      if (!(status === WordStatus.over)) return pending({ metrics });
      const wpm = metrics.getWpm(keys);
      switch (wpm.kind) {
        case PromptWpmKind.done:
          setWpm(wpm.wpm);
          return paused({ metrics: metrics.pause() });
        case PromptWpmKind.pending:
          return pending({ metrics });
      }
    };

  type PausedMetricsProps = {
    metrics: PausedPromptKeypressMetrics;
  };
  const paused =
    ({ metrics }: PausedMetricsProps): WordMetrics =>
    ({ status }) => {
      switch (status) {
        case WordStatus.unstart:
          return create();
        case WordStatus.pending:
          return pending({ metrics: metrics.resume() });
      }
      return paused({ metrics });
    };

  const create = () =>
    paused({
      metrics: promptKeypressHandler(),
    });

  return create();
};

export { createWordMetricsState };
