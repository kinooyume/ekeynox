import type { Metakey } from "../content/Content";
import { KeyStatus } from "./KeyMetrics";

// TODO: rename, WordWpmCounter ?
export type PendingPromptKeypressMetrics = {
  pause: () => PausedPromptKeypressMetrics;
  getWpm: (keys: Array<Metakey>) => PromptWpm;
};

export type PausedPromptKeypressMetrics = {
  resume: () => PendingPromptKeypressMetrics;
};

export enum PromptWpmKind {
  done,
  pending,
}

type PromptWpm =
  | { kind: PromptWpmKind.done; wpm: number }
  | { kind: PromptWpmKind.pending };

const promptKeypressHandler = (): PausedPromptKeypressMetrics => {
  const pending = (lastDuration: number) => {
    const start = performance.now();
    const getWpm = (keys: Array<Metakey>): PromptWpm => {
      const stop = performance.now();
      if (!keys.every((key) => key.status === KeyStatus.match))
        return { kind: PromptWpmKind.pending };
      const duration = stop - start + lastDuration;
      const wpm = ((keys.length / duration) * 60000) / 5;
      return { kind: PromptWpmKind.done, wpm };
    };
    const pause = () => {
      const stop = performance.now();
      const duration = stop - start + lastDuration;
      return paused(duration);
    };

    return { getWpm, pause };
  };

  const paused = (duration: number) => ({
    resume: () => pending(duration),
  });

  return paused(0);
};

export { promptKeypressHandler };
