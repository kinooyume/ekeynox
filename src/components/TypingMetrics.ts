import { type Setter } from "solid-js";
import {
  type TypingStatus,
  TypingStatusKind,
  KeyPressedKind,
} from "./TypingEngine.tsx";
import WpmCounter, {
  CounterStatus,
  type Counter,
  type PendingCounter,
} from "./WpmCounter.ts";
import { ReactiveMap } from "@solid-primitives/map";

// TODO: accurary & real accurary
// check the difference with consistency

/* Keys Metrics */

enum KeyStatus {
  correct,
  incorrect,
  extra,
  missed,
  deleted,
}

export type KeyResult =
  | { result: KeyStatus.correct }
  | { result: KeyStatus.incorrect; typedInstead: string }
  | { result: KeyStatus.extra; typedInstead: string }
  | { result: KeyStatus.missed; expected: string }
  | { result: KeyStatus.deleted; wasCorrect: boolean };

export type KeyInfo = {
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
  deletedCorrect: number;
  deletedIncorrect: number;
  total: number;
  typedInstead: Array<string>;
  expected: Array<string>;
};

export const createKeyInfo: () => KeyInfo = () => ({
  correct: 0,
  incorrect: 0,
  deletedCorrect: 0,
  deletedIncorrect: 0,
  extra: 0,
  missed: 0,
  total: 0,
  typedInstead: [],
  expected: [],
});

export type KeyData = {
  info: KeyInfo;
  logs: Array<KeyResult>;
};

export type KeyMap<T> = ReactiveMap<string, T>;
type KeyObject<T> = { [key: string]: T };
type KeyTuple<T> = [string, T];
export type KeyArray<T> = Array<KeyTuple<T>>;

const blankCharacters = new Set([" ", "\n", "\r"]);

/* Global Info, check if we need it */
export type GlobalInfo = {
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
  total: number;
};

export const createGlobalInfo: () => GlobalInfo = () => ({
  correct: 0,
  incorrect: 0,
  extra: 0,
  missed: 0,
  total: 0,
});

/* *** */

export type Metrics = {
  info: GlobalInfo;
  logs: KeyArray<KeyResult>;
  byKey: KeyMap<KeyData>;
  _interval?: number;
  _counter: Counter;
};

export const defaultMetrics: Metrics = {
  _counter: WpmCounter.create,
  logs: [],
  byKey: new ReactiveMap<string, KeyData>(),
  info: createGlobalInfo(),
};

type TypingMetricsProps = { status: TypingStatus };

type TypingMetrics = (metrics: Metrics, props: TypingMetricsProps) => Metrics;

type CreateTypingMetricsProps = {
  setWpm: Setter<number>;
  setRaw: Setter<number>;
};

type CreateTypingMetrics = (props: CreateTypingMetricsProps) => TypingMetrics;
const createTypingMetrics: CreateTypingMetrics =
  ({ setWpm, setRaw }) =>
  (metrics, props) => {
    switch (props.status.kind) {
      case TypingStatusKind.deleted:
        break;
      case TypingStatusKind.pending:
        if (metrics._counter.kind === CounterStatus.paused) {
          metrics._counter = metrics._counter.action.resume();
          const updateWpm = () => {
            const wpms = metrics._counter.action.getWpms();
            setWpm(wpms.wpm);
            setRaw(wpms.raw);
          };
          metrics._interval = setInterval(updateWpm, 1000);
        }
        const counter = metrics._counter.action as PendingCounter;
        /* *** */
        const keyPressed = props.status.keyPressed;

        const metric = metrics.byKey.get(keyPressed.key) || {
          info: createKeyInfo(),
          logs: [],
        };

        /* Side effect on metric.info and counter */
        // NOTE: surement un truc un peu plus smart a faire..
        const getResult = (): KeyResult => {
          if (keyPressed.kind === KeyPressedKind.match) {
            counter.keyPressed(true);
            metric.info.correct++;
            metrics.info.correct++;
            return { result: KeyStatus.correct };
          } else if (keyPressed.kind === KeyPressedKind.deleted) {
            if (keyPressed.wasCorrect) {
              metric.info.deletedCorrect++;
            } else {
              metric.info.deletedIncorrect++;
            }
            return {
              result: KeyStatus.deleted,
              wasCorrect: keyPressed.wasCorrect,
            };
          } else {
            counter.keyPressed(false);
            if (blankCharacters.has(keyPressed.key)) {
              metric.info.extra++;
              metrics.info.extra++;
              return {
                result: KeyStatus.extra,
                typedInstead: keyPressed.pressed,
              };
            } else if (blankCharacters.has(keyPressed.pressed)) {
              metric.info.missed++;
              metrics.info.missed++;
              return { result: KeyStatus.missed, expected: keyPressed.key };
            } else {
              metric.info.incorrect++;
              metrics.info.incorrect++;
              return {
                result: KeyStatus.incorrect,
                typedInstead: keyPressed.pressed,
              };
            }
          }
        };
        metric.info.total++;
        metrics.info.total++;
        const result = getResult();
        metric.logs.push(result);
        metrics.byKey.set(keyPressed.key, metric);
        break;
      case TypingStatusKind.pause:
        if (metrics._counter.kind === CounterStatus.pending) {
          clearInterval(metrics._interval);
          const counter = metrics._counter.action.pause();
          const wpms = counter.action.getWpms();
          setWpm(wpms.wpm);
          setRaw(wpms.raw);
          return { ...metrics, counter, interval: undefined };
        }
        break;
      case TypingStatusKind.unstart:
        clearInterval(metrics._interval);
        setWpm(0);
        setRaw(0);
        return defaultMetrics;
      case TypingStatusKind.over:
        clearInterval(metrics._interval);
    }
    return metrics;
  };

export default createTypingMetrics;
