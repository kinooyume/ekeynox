import type { Setter } from "solid-js";
import { type KeyTimedTuple } from "./KeyMetrics";
import { TypingStatusKind, type TypingStatus } from "./TypingEngine";
import KeypressMetrics, {
  type KeypressMetricsProjection,
  type TypingProjection,
} from "./KeypressMetrics";
import type { LinkedList } from "./List";
import List from "./List";
import type { PausedKeypressMetrics, PendingKeypressMetrics } from "./KeypressMetricsSessions";
import KeypressMetricsSessions from "./KeypressMetricsSessions";

export type TypingMetrics = {
  projection: TypingProjection;
  sessions: LinkedList<TypingProjection>;
  logs: LinkedList<KeypressMetricsProjection> | null;
};

const createTypingMetrics = (): TypingMetrics => ({
  projection: KeypressMetrics.createTypingProjection(),
  sessions: List.make(null, KeypressMetrics.createTypingProjection()),
  logs: null,
});

type TypingMetricsProps = {
  status: TypingStatus;
};

export type TypingMetricsState = (
  props: TypingMetricsProps,
) => TypingMetricsState;

export type TypingMetricsPreview = {
  wpms: [number, number];
  accuracies: [number, number];
};

const createTypingMetricsPreview = (): TypingMetricsPreview => ({
  wpms: [0, 0],
  accuracies: [0, 0],
});

const createTypingMetricsState = (
  setPreview: Setter<TypingMetricsPreview>,
  setTypingMetrics: Setter<TypingMetrics>,
): TypingMetricsState => {
  type PendingMetricsProps = {
    keypressMetrics: PendingKeypressMetrics;
    metrics: TypingMetrics;
    interval: NodeJS.Timer;
  };
  const pending =
    (props: PendingMetricsProps) =>
    ({ status }: TypingMetricsProps): TypingMetricsState => {
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
        case TypingStatusKind.over:
          clearInterval(props.interval);
          setTypingMetrics(props.metrics);
          return paused({
            keypressMetrics: props.keypressMetrics.pause(),
            metrics: props.metrics,
          });
      }
      return pending(props);
    };

  type pausedMetricsProps = {
    keypressMetrics: PausedKeypressMetrics;
    metrics: TypingMetrics;
  };

  const paused =
    ({ keypressMetrics, metrics }: pausedMetricsProps) =>
    ({ status }: TypingMetricsProps): TypingMetricsState => {
      switch (status.kind) {
        case TypingStatusKind.pending:
          const pendingKeypressMetrics = keypressMetrics.resume();
          pendingKeypressMetrics.event([
            ...status.keyMetrics,
            status.timestamp,
          ] as KeyTimedTuple);

          const updatePreview = () => {
            const KeypressMetricsProjection =
              pendingKeypressMetrics.getProjection();
            setPreview({
              wpms: KeypressMetricsProjection.wpms,
              accuracies: KeypressMetricsProjection.accuracies,
            });
            metrics.logs = List.make(metrics.logs, KeypressMetricsProjection);
          };

          return pending({
            keypressMetrics: pendingKeypressMetrics,
            interval: setInterval(updatePreview, 1000),
            metrics,
          });
      }
      return paused({ keypressMetrics, metrics });
    };

  const create = () =>
    paused({
      keypressMetrics: KeypressMetricsSessions.new,
      metrics: createTypingMetrics(),
    });

  return create();
};

export {
  createTypingMetrics,
  createTypingMetricsState,
  createTypingMetricsPreview,
};
