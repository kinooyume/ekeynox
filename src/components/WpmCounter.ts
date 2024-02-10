type GetAverage = (value: number) => number;
type CreateAverage = (
  nbrIteration: number,
) => (prevAverage: number) => GetAverage;

const createAverage: CreateAverage = (nbr) => (average) => (value: number) =>
  average + (value - average) / nbr;

/* KeypressCounter */

const createKeypressCounter = () => {
  let correctKeys = 0;
  let wrongKeys = 0;

  const keyPressed = (correct: boolean) => {
    if (correct) {
      correctKeys++;
    } else {
      wrongKeys++;
    }
  };

  const date = Date.now();
  const getCurrentWpms = () => {
    const duration = Date.now() - date;
    return {
      wpm: (correctKeys * (1 / duration) * 60000) / 5,
      raw: ((correctKeys + wrongKeys) * (1 / duration) * 60000) / 5,
    };
  };
  return { keyPressed, getCurrentWpms };
};

/* *** */

type Wpms = { wpm: number; raw: number };

export enum CounterStatus {
  paused,
  pending,
}

export type Counter =
  | { kind: CounterStatus.paused; action: PausedCounter }
  | { kind: CounterStatus.pending; action: PendingCounter };

export type PendingCounter = {
  keyPressed: (correct: boolean) => void;
  getWpms: () => Wpms;
  pause: () => Counter;
};

type PausedCounter = { getWpms: () => Wpms; resume: () => Counter };

type PendingVariant = (counter: PendingCounter) => Counter;
const pendingVariant: PendingVariant = (action) => ({
  kind: CounterStatus.pending,
  action: action,
});

type PausedVariant = (counter: PausedCounter) => Counter;
const pausedVariant: PausedVariant = (action) => ({
  kind: CounterStatus.paused,
  action: action,
});

type NestedWpms = { wpm: GetAverage; raw: GetAverage };
type WpmCounter = (iterNbr: number, wpms: NestedWpms) => Counter; // wpmsAverage

const wpmCounter: WpmCounter = (iterNbr, averages) => {
  const keypress = createKeypressCounter();
  const getWpms = () => {
    const current = keypress.getCurrentWpms();
    return {
      wpm: averages.wpm(current.wpm),
      raw: averages.raw(current.raw),
    };
  };
  return pendingVariant({
    keyPressed: keypress.keyPressed,
    getWpms,
    pause: () => {
      const wpms = getWpms();
      return pausedVariant({
        getWpms: () => wpms,
        resume: () => {
          return wpmCounter(iterNbr++, {
            wpm: createAverage(iterNbr)(wpms.wpm),
            raw: createAverage(iterNbr)(wpms.raw),
          });
        },
      });
    },
  });
};

const defaultWpms: NestedWpms = {
  wpm: (n) => n,
  raw: (n) => n,
};

const initWpms = () => ({
  wpm: 0,
  raw: 0,
});

export default {
  create: pausedVariant({
    getWpms: initWpms,
    resume: () => wpmCounter(1, defaultWpms),
  }),
};
