import { createEffect, createSignal, onCleanup, type Accessor } from "solid-js";
import { TypingStatus, type KeyPressed } from "./TypingEngine.tsx";
import WpmCounter, { CounterStatus, type Counter } from "./WpmCounter.ts";

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
  | { result: KeyStatus.missed; typedInstead: string };

type KeyMetrics = Map<string, Array<KeyResult>>;

const blankCharacters = new Set([" ", "\n", "\r"]);

/* *** */

type TypingMetricsProps = { status: TypingStatus; keyPressed: KeyPressed };
export type TypingMetrics = (props: TypingMetricsProps) => void;
export type CreateTypingMetrics = () => {
  wpm: Accessor<number>;
  raw: Accessor<number>;
  get: TypingMetrics;
};

type CounterEffectProps = {
  interval?: number;
  counter: Counter;
  keys: KeyMetrics;
};

const createTypingMetrics: CreateTypingMetrics = () => {
  const [wpm, setWpm] = createSignal(0);
  const [raw, setRaw] = createSignal(0);

  return {
    wpm,
    raw,
    get: (props: TypingMetricsProps) => {
      const defaultEffect: CounterEffectProps = {
        counter: WpmCounter.create,
        keys: new Map(),
      };

      const counterEffect = (
        effect: CounterEffectProps,
      ): CounterEffectProps => {
      console.log("props", props);
        switch (props.status) {
          case TypingStatus.pending:
            if (effect.counter.kind === CounterStatus.paused) {
              const counter = effect.counter.action.resume();
              console.log("counter", counter);
              const updateWpm = () => {
                const wpms = counter.action.getWpms();
                setWpm(wpms.wpm);
                setRaw(wpms.raw);
              };
              const interval = setInterval(updateWpm, 1000);
              onCleanup(() => clearInterval(effect.interval));
              return { ...effect, interval };
            } else {
              const [expectedKey, typedKey] = props.keyPressed;
              // peu mieux faire
              let result: KeyResult;
              if (expectedKey === typedKey) {
                effect.counter.action.keyPressed(true);
                result = { result: KeyStatus.correct };
              } else {
                effect.counter.action.keyPressed(false);
                if (blankCharacters.has(expectedKey)) {
                  result = { result: KeyStatus.extra, typedInstead: typedKey };
                } else if (blankCharacters.has(typedKey)) {
                  result = { result: KeyStatus.missed, typedInstead: typedKey };
                } else {
                  result = {
                    result: KeyStatus.incorrect,
                    typedInstead: typedKey,
                  };
                }
              }
              const metric = effect.keys.get(expectedKey);

              if (metric === undefined) {
                effect.keys.set(expectedKey, [result]);
              } else {
                metric.push(result);
              }
            }
            break;
          case TypingStatus.pause:
            if (effect.counter.kind === CounterStatus.pending) {
              clearInterval(effect.interval);
              const counter = effect.counter.action.pause();
              const wpms = counter.action.getWpms();
              setWpm(wpms.wpm);
              setRaw(wpms.raw);
              return { ...effect, counter };
            }
            break;
          case TypingStatus.unstart:
            return defaultEffect;
        }
        return effect;
      };

      createEffect(counterEffect, defaultEffect);
    },
  };
};

export default createTypingMetrics;
