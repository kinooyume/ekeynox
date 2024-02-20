type GetAverage = (value: number) => number;
type CreateAverage = (nbrIteration: number, prevAverage: number) => GetAverage;

const createAverage: CreateAverage = (nbr, average) => (value: number) =>
  average + (value - average) / nbr;

const createKeypressCounter = () => {
  let correctKeys = 0;
  let wrongKeys = 0;

  const keyPressed = (correct: boolean) => {
    console.log(correct);
    if (correct) {
      correctKeys++;
    } else {
      wrongKeys++;
    }
  };

  const date = performance.now();
  const getCurrentWpms = () => {
    const duration = performance.now() - date;
    return [
      (correctKeys * (1 / duration) * 60000) / 5,
      ((correctKeys + wrongKeys) * (1 / duration) * 60000) / 5,
    ];
  };
  return { keyPressed, getCurrentWpms };
};

type Wpms = [number, number];

export type PendingCounter = {
  keyPressed: (correct: boolean) => void;
  getWpms: () => Wpms;
  pause: () => PausedCounter;
};

export type PausedCounter = {
  getWpms: () => Wpms;
  resume: () => PendingCounter;
};

type NestedWpms = [GetAverage, GetAverage];
type WpmCounter = (iterNbr: number, wpms: NestedWpms) => PendingCounter; // wpmsAverage

const wpmCounter: WpmCounter = (iterNbr, averages) => {
  const keypress = createKeypressCounter();
  const getWpms = (): Wpms => {
    const current = keypress.getCurrentWpms();
    return [averages[0](current[0]), averages[1](current[1])];
  };
  return {
    keyPressed: keypress.keyPressed,
    getWpms,
    pause: () => {
      const wpms = getWpms();
      return {
        getWpms: () => wpms,
        resume: () => {
          return wpmCounter(iterNbr++, [
            createAverage(iterNbr, wpms[0]),
            createAverage(iterNbr, wpms[1]),
          ]);
        },
      };
    },
  };
};

const defaultWpms: NestedWpms = [(n) => n, (n) => n];
const initWpms = (): Wpms => [0, 0];

export default {
  create: {
    getWpms: initWpms,
    resume: () => wpmCounter(1, defaultWpms),
  },
};
