import type { Setter } from "solid-js";
import { KeyStatus, type KeyTimedTuple, type KeyTuple } from "./KeyMetrics";
import { TypingStatusKind, type TypingStatus } from "./TypingEngine";
import KeypressMetrics, {
  type PendingKeypressMetrics,
  type PausedKeypressMetrics,
  type KeypressMetricsProjection,
} from "./KeypressMetrics";

/* LinkedList */

export type LinkedList<T> = {
  value: T;
  next: LinkedList<T> | null;
};

const makeLinkedList = <T>(
  list: LinkedList<T> | null,
  value: T,
): LinkedList<T> => {
  return { value, next: list };
};

/* *** */

export type TypingProjection = {
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
  deletedCorrect: number;
  deletedIncorrect: number;
  total: number;
};

const createTypingProjection = () => ({
  correct: 0,
  incorrect: 0,
  deletedCorrect: 0,
  deletedIncorrect: 0,
  extra: 0,
  missed: 0,
  total: 0,
});

export type TypingMetrics = {
  projection: TypingProjection;
  logs: LinkedList<KeypressMetricsProjection> | null;
};

const createTypingMetrics = (): TypingMetrics => ({
  projection: createTypingProjection(),
  logs: null,
});

type TypingMetricsProps = {
  status: TypingStatus;
};

type TypingMetricsPreview = {
  wpms: [number, number];
  accuracies: [number, number];
};

const createTypingMetricsState = (setPreview: Setter<TypingMetricsPreview>) => {
  type PendingMetricsProps = {
    keypressMetrics: PendingKeypressMetrics;
    metrics: TypingMetrics;
    interval: number;
  };
  const pending =
    (props: PendingMetricsProps) =>
    ({ status }: TypingMetricsProps) => {
      switch (status.kind) {
        case TypingStatusKind.pause:
          clearInterval(props.interval);
          const pausedKeypressMetrics = props.keypressMetrics.pause();
          return paused({
            keypressMetrics: pausedKeypressMetrics,
            metrics: props.metrics,
          });
        case TypingStatusKind.pending:
          props.keypressMetrics.event([
            ...status.keyMetrics,
            status.timestamp,
          ] as KeyTimedTuple);
          return pending(props);
      }
    };

  type pausedMetricsProps = {
    keypressMetrics: PausedKeypressMetrics;
    metrics: TypingMetrics;
  };

  const paused =
    ({ keypressMetrics, metrics }: pausedMetricsProps) =>
    ({ status }: TypingMetricsProps) => {
      switch (status.kind) {
        case TypingStatusKind.pending:
          const pendingKeypressMetrics = keypressMetrics.resume();
          const updatePreview = () => {
            const KeypressMetricsProjection =
              pendingKeypressMetrics.getProjection();
            setPreview({
              wpms: KeypressMetricsProjection.wpms,
              accuracies: KeypressMetricsProjection.accuracies,
            });
            metrics.logs = makeLinkedList(
              metrics.logs,
              KeypressMetricsProjection,
            );
          };

          pendingKeypressMetrics.event([
            ...status.keyMetrics,
            status.timestamp,
          ] as KeyTimedTuple);
          const interval = setInterval(updatePreview, 1000);
          return pending({
            keypressMetrics: pendingKeypressMetrics,
            interval,
            metrics,
          });
      }
    };

  const create = () =>
    paused({
      keypressMetrics: KeypressMetrics.new,
      metrics: createTypingMetrics(),
    });

  return create();
};

export { createTypingMetricsState, makeLinkedList, createTypingProjection };
