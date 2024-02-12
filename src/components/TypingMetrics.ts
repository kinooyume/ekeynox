import { type Setter } from "solid-js";
import { type TypingStatus, TypingStatusKind, KeyPressedKind } from "./TypingEngine.tsx";
import WpmCounter, {
  CounterStatus,
  type Counter,
  type PendingCounter,
} from "./WpmCounter.ts";

// TODO: accurary & real accurary
// check the difference with consistency

/* Keys Metrics */

enum KeyStatus {
  correct,
  incorrect,
  extra,
  missed,
}

// je pense qu'on va ajouter corrected
// ou alors.. removed ? et du coup on calculerait..

type KeyResult =
  | { result: KeyStatus.correct }
  | { result: KeyStatus.incorrect; typedInstead: string }
  | { result: KeyStatus.extra; typedInstead: string }
  | { result: KeyStatus.missed; expected: string };

export type KeyInfo = {
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
  total: number;
  typedInstead: Array<string>;
  expected: Array<string>;
};

type KeyMap<T> = Map<string, T>;
type KeyObject<T> = { [key: string]: T };
type KeyTuple<T> = [string, T];
type KeyArray<T> = Array<KeyTuple<T>>;

export type KeyMetrics = KeyMap<Array<KeyResult>>;
export type KeyInfos = KeyObject<KeyInfo>;

const blankCharacters = new Set([" ", "\n", "\r"]);

export const createKeyInfo: () => KeyInfo = () => ({
  correct: 0,
  incorrect: 0,
  extra: 0,
  missed: 0,
  total: 0,
  typedInstead: [],
  expected: [],
});
 
/* *** */
// Add logs support and dynamic counting
/* *** */

export type KeyInfoPack = [KeyInfo, KeyInfos];
type CalculateKeyAccuracy = (metrics: KeyMetrics) => KeyInfoPack;
export const calculateKeyAccuracy: CalculateKeyAccuracy = (metrics) => {
  let global = createKeyInfo();

  let infos: KeyInfos = {};
  metrics.forEach((results, key) => {
    let info = createKeyInfo();
    info.total = results.length;
    global.total += results.length;
    results.forEach((result) => {
      if (result.result === KeyStatus.correct) {
        info.correct++;
        global.correct++;
      } else if (result.result === KeyStatus.incorrect) {
        info.incorrect++;
        global.incorrect++;
        info.typedInstead.push(result.typedInstead);
      } else if (result.result === KeyStatus.extra) {
        info.extra++;
        global.extra++;
        // info.typedInstead.push(result.typedInstead);
      } else if (result.result === KeyStatus.missed) {
        info.missed++;
        global.missed++;
        info.expected.push(result.expected);
      }
    });
    infos[key] = info;
  });
  return [global, infos];
};
/* *** */

export type Metrics = {
  interval?: number;
  counter: Counter;
  keyPressed: KeyMetrics;
};

export const defaultMetrics: Metrics = {
  counter: WpmCounter.create,
  keyPressed: new Map(),
};

type TypingMetricsProps = { status: TypingStatus };

type TypingMetrics = (metrics: Metrics, props: TypingMetricsProps) => Metrics;

type CreateTypingMetricsProps = {
  setWpm: Setter<number>;
  setRaw: Setter<number>;
  setKeyMetrics: Setter<KeyMetrics>;
};

type CreateTypingMetrics = (props: CreateTypingMetricsProps) => TypingMetrics;
const createTypingMetrics: CreateTypingMetrics =
  ({ setWpm, setRaw, setKeyMetrics }) =>
  (metrics, props) => {
    switch (props.status.kind) {
      case TypingStatusKind.pending:
        if (metrics.counter.kind === CounterStatus.paused) {
          metrics.counter = metrics.counter.action.resume();
          const updateWpm = () => {
            const wpms = metrics.counter.action.getWpms();
            setWpm(wpms.wpm);
            setRaw(wpms.raw);
          };
          metrics.interval = setInterval(updateWpm, 1000);
        }
        const counter = metrics.counter.action as PendingCounter;
        /* *** */
        const keyPressed = props.status.keyPressed
        // peu mieux faire, plus tard
        let result: KeyResult;
        if (keyPressed.kind === KeyPressedKind.match) {
          counter.keyPressed(true);
          result = { result: KeyStatus.correct };
        } else {
          counter.keyPressed(false);
          if (blankCharacters.has(keyPressed.key)) {
            result = { result: KeyStatus.extra, typedInstead: keyPressed.pressed };
          } else if (blankCharacters.has(keyPressed.pressed)) {
            result = { result: KeyStatus.missed, expected: keyPressed.key };
          } else {
            result = {
              result: KeyStatus.incorrect,
              typedInstead: keyPressed.pressed,
            };
          }
        }
        const metric = metrics.keyPressed.get(keyPressed.key);

        if (metric === undefined) {
          metrics.keyPressed.set(keyPressed.key, [result]);
        } else {
          metric.push(result);
        }

        break;
      case TypingStatusKind.pause:
        if (metrics.counter.kind === CounterStatus.pending) {
          clearInterval(metrics.interval);
          const counter = metrics.counter.action.pause();
          const wpms = counter.action.getWpms();
          setWpm(wpms.wpm);
          setRaw(wpms.raw);
          return { ...metrics, counter, interval: undefined };
        }
        break;
      case TypingStatusKind.unstart:
        setWpm(0);
        setRaw(0);
        clearInterval(metrics.interval);
        return defaultMetrics;
      case TypingStatusKind.over:
        clearInterval(metrics.interval);
        setKeyMetrics(metrics.keyPressed);
    }
    return metrics;
  };

export default createTypingMetrics;
