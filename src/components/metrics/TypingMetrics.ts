import type { Setter } from "solid-js";
import { TypingStatusKind, type TypingStatus } from "../seqInput/UserInput.tsx";
import KeypressMetrics, {
  type KeypressMetricsProjection,
  type StatProjection,
} from "./KeypressMetrics";
import type { LinkedList } from "../List";
import List from "../List";
import type {
  PausedKeypressMetrics,
  PendingKeypressMetrics,
} from "./KeypressMetricsSessions";
import KeypressMetricsSessions from "./KeypressMetricsSessions";
import type { TypingProjection } from "./TypingProjection";

export type TypingMetrics = {
  projection: KeypressMetricsProjection;
  sessions: LinkedList<TypingProjection>;
  logs: LinkedList<KeypressMetricsProjection>;
};

const createTypingMetrics = (): TypingMetrics => ({
  projection: KeypressMetrics.createKeypressProjection(),
  sessions: List.make(null, KeypressMetrics.createTypingProjection()),
  logs: null,
});

type TypingMetricsProps = {
  status: TypingStatus;
};

export type TypingMetricsState = (
  props: TypingMetricsProps,
) => TypingMetricsState;

type Interval = {
  timer: NodeJS.Timer | NodeJS.Timeout;
};

const createTypingMetricsState = (
  setStat: Setter<StatProjection>,
  setTypingMetrics: Setter<TypingMetrics>,
  setCleanup: (cleanup: () => void) => void
): TypingMetricsState => {
  const updateStat = (
    projection: KeypressMetricsProjection,
    metrics: TypingMetrics,
  ) => {
    setStat(projection.stats);
    /* side effect */
    metrics.logs = List.make(metrics.logs, projection);
  };

  type PendingMetricsProps = {
    keypressMetrics: PendingKeypressMetrics;
    metrics: TypingMetrics;
    interval: Interval;
  };
  const pending =
    (props: PendingMetricsProps) =>
    ({ status }: TypingMetricsProps): TypingMetricsState => {
      switch (status.kind) {
        case TypingStatusKind.unstart:
          clearInterval(props.interval.timer);
          setStat(KeypressMetrics.createStatProjection());
          return create();
        case TypingStatusKind.pending:
          props.keypressMetrics.event(status);
          return pending(props);
        case TypingStatusKind.pause:
          clearInterval(props.interval.timer);
          const [pausedKeypressMetrics, projection] =
            props.keypressMetrics.pause(false);
          return paused({
            keypressMetrics: pausedKeypressMetrics,
            metrics: props.metrics,
          });
        case TypingStatusKind.over:
          clearInterval(props.interval.timer);
          const [overKeypressMetrics, finalProjection] =
            props.keypressMetrics.pause(true);
          // side effect
          updateStat(finalProjection, props.metrics);
          setTypingMetrics(props.metrics);
          props.metrics.projection = finalProjection;
          return paused({
            keypressMetrics: overKeypressMetrics,
            metrics: props.metrics,
          });
      }
    };

  type PausedMetricsProps = {
    keypressMetrics: PausedKeypressMetrics;
    metrics: TypingMetrics;
  };

  const paused =
    ({ keypressMetrics, metrics }: PausedMetricsProps) =>
    ({ status }: TypingMetricsProps): TypingMetricsState => {
      switch (status.kind) {
        case TypingStatusKind.unstart:
          setStat(KeypressMetrics.createStatProjection());
          return create();
        case TypingStatusKind.pending:
          const [pendingKeypressMetrics, lastDuration] =
            keypressMetrics.resume();
          pendingKeypressMetrics.event(status);

          const interval: Interval = { timer: 0 as unknown as NodeJS.Timer };
          const update = () =>
            updateStat(pendingKeypressMetrics.getProjection(false), metrics);
          interval.timer = setTimeout(() => {
            update();
            setCleanup(() => clearTimeout(interval.timer));
            clearTimeout(interval.timer);
            interval.timer = setInterval(update, 1000);
          }, 1000 - lastDuration);

          return pending({
            keypressMetrics: pendingKeypressMetrics,
            interval,
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

export { createTypingMetrics, createTypingMetricsState };
