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
  pause
}

export type PromptWpm =
  | { kind: PromptWpmKind.pause }
  | { kind: PromptWpmKind.done; wpm: number, duration: number }
  | { kind: PromptWpmKind.pending };

const promptKeypressHandler = (elapsed: number): PausedPromptKeypressMetrics => {
  const pending = (lastDuration: number) => {
    const start = performance.now();
    const getWpm = (keys: Array<Metakey>): PromptWpm => {
      const stop = performance.now();
      if (!keys.every((key) => key.status === KeyStatus.match))
        return { kind: PromptWpmKind.pause };
      const duration = stop - start + lastDuration + elapsed;
      const wpm = ((keys.length / duration) * 60000) / 5;
      return { kind: PromptWpmKind.done, wpm, duration };
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
