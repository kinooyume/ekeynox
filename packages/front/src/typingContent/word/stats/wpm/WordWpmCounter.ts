//
import {
  CharacterStatus,
  MetaCharacter,
} from "~/typingContent/character/types";

export enum WpmCounterStateKind {
  done,
  pending,
  pause,
}

export type WpmCounterState =
  | { kind: WpmCounterStateKind.pause }
  | { kind: WpmCounterStateKind.done; wpm: number; duration: number }
  | { kind: WpmCounterStateKind.pending };

export type PendingWpmCounter = {
  pause: () => PausedWpmCounter;
  getWpm: (keys: Array<MetaCharacter>) => WpmCounterState;
};

export type PausedWpmCounter = {
  resume: () => PendingWpmCounter;
};

const WordWpmCounter = (
  elapsed: number,
): PausedWpmCounter => {
  const pending = (lastDuration: number) => {
    const start = performance.now();
    const getWpm = (keys: Array<MetaCharacter>): WpmCounterState => {
      const stop = performance.now();
      if (!keys.every((key) => key.status === CharacterStatus.match))
        return { kind: WpmCounterStateKind.pause };
      const duration = stop - start + lastDuration + elapsed;
      const wpm = ((keys.length / duration) * 60000) / 5;
      return { kind: WpmCounterStateKind.done, wpm, duration };
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

export default WordWpmCounter;
