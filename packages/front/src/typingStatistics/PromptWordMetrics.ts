import { MetaWord, WordStatus } from "~/typingContent/word/types.ts";

import {
  promptKeypressHandler,
  type PendingPromptKeypressMetrics,
  type PausedPromptKeypressMetrics,
  PromptWpmKind,
} from "./PromptCharacterMetrics.ts";

// TODO: Redo all of it
// TODO: make a proper pause management
//
// ==> Became shitty

type CreateWordMetricsStateProps = {
  word: MetaWord;
  setWpm: (arg: { wpm: number; duration: number }) => void;
};

export type WordMetrics = ({ status }: { status: WordStatus }) => WordMetrics;

const createWordMetricsState = ({
  word,
  setWpm,
}: CreateWordMetricsStateProps) => {
  type PendingMetricsProps = {
    metrics: PendingPromptKeypressMetrics;
  };

  const pending =
    ({ metrics }: PendingMetricsProps): WordMetrics =>
    ({ status }) => {
      if (status === WordStatus.pause)
        return paused({ metrics: metrics.pause() });

      if (!(status === WordStatus.over)) return pending({ metrics });
      const wpm = metrics.getWpm(word.characters);
      switch (wpm.kind) {
        case PromptWpmKind.done:
          setWpm(wpm);
          return paused({ metrics: metrics.pause() });
        case PromptWpmKind.pause:
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
          return create(word.spentTime);
        case WordStatus.pending:
          return pending({ metrics: metrics.resume() });
      }
      return paused({ metrics });
    };

  const create = (elapsed: number) =>
    paused({
      metrics: promptKeypressHandler(elapsed),
    });
  return create(word.spentTime);
};

export { createWordMetricsState };
