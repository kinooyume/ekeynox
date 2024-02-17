import { type Setter } from "solid-js";
import { type TypingStatus, TypingStatusKind } from "./TypingEngine.tsx";
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

type KeyResult =
  | { result: KeyStatus.correct }
  | { result: KeyStatus.incorrect; typedInstead: string }
  | { result: KeyStatus.extra; typedInstead: string }
  | { result: KeyStatus.missed; expected: string };

export type KeyMetrics = Map<string, Array<KeyResult>>;

const blankCharacters = new Set([" ", "\n", "\r"]);

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
        const [typedKey, expectedKey] = props.status.keyPressed;
        // peu mieux faire
        let result: KeyResult;
        if (expectedKey === typedKey) {
          counter.keyPressed(true);
          result = { result: KeyStatus.correct };
        } else {
          counter.keyPressed(false);
          if (blankCharacters.has(expectedKey)) {
            result = { result: KeyStatus.extra, typedInstead: typedKey };
          } else if (blankCharacters.has(typedKey)) {
            result = { result: KeyStatus.missed, expected: expectedKey };
          } else {
            result = {
              result: KeyStatus.incorrect,
              typedInstead: typedKey,
            };
          }
        }
        const metric = metrics.keyPressed.get(expectedKey);

        if (metric === undefined) {
          metrics.keyPressed.set(expectedKey, [result]);
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
