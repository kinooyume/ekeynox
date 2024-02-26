import type { Setter } from "solid-js";
import { TypingStatusKind, type TypingStatus } from "./TypingEngine";
import KeypressMetrics, {
  type KeypressMetricsProjection,
  type StatProjection,
} from "./KeypressMetrics";
import type { LinkedList } from "./List";
import List from "./List";
import type {
  PausedKeypressMetrics,
  PendingKeypressMetrics,
} from "./KeypressMetricsSessions";
import KeypressMetricsSessions from "./KeypressMetricsSessions";
import type { TypingProjection } from "./TypingProjection";

export type TypingMetrics = {
  projection: TypingProjection;
  sessions: LinkedList<TypingProjection>;
  logs: LinkedList<KeypressMetricsProjection>;
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

type Interval = {
  timer: NodeJS.Timer | NodeJS.Timeout;
};

const createTypingMetricsState = (
  setStat: Setter<StatProjection>,
  setTypingMetrics: Setter<TypingMetrics>,
): TypingMetricsState => {
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
          props.keypressMetrics.event(status.event);
          return pending(props);
        case TypingStatusKind.pause:
          clearInterval(props.interval.timer);
          const [ pausedKeypressMetrics, projection ] = props.keypressMetrics.pause();
          return paused({
            keypressMetrics: pausedKeypressMetrics,
            metrics: props.metrics,
          });
        case TypingStatusKind.over:
          clearInterval(props.interval.timer);
          setTypingMetrics(props.metrics);
          const [ overKeypressMetrics, finalProjection ] = props.keypressMetrics.pause();
          return paused({
            keypressMetrics: overKeypressMetrics,
            metrics: props.metrics,
          });
      }
    };

  type pausedMetricsProps = {
    keypressMetrics: PausedKeypressMetrics;
    metrics: TypingMetrics;
  };

  const paused =
    ({ keypressMetrics, metrics }: pausedMetricsProps) =>
    ({ status }: TypingMetricsProps): TypingMetricsState => {
      switch (status.kind) {
        case TypingStatusKind.unstart:
          setStat(KeypressMetrics.createStatProjection());
          return create();
        case TypingStatusKind.pending:
          const [pendingKeypressMetrics, lastDuration] =
            keypressMetrics.resume();
          pendingKeypressMetrics.event(status.event);

          const updatePreview = () => {
            const projection = pendingKeypressMetrics.getProjection();
            setStat(projection.stats);
            metrics.logs = List.make(metrics.logs, projection);
          };

          const interval: Interval = { timer: 0 as unknown as NodeJS.Timer };

          interval.timer = setTimeout(() => {
            updatePreview();
            clearTimeout(interval.timer);
            interval.timer = setInterval(updatePreview, 1000);
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

export {
  createTypingMetrics,
  createTypingMetricsState,
};
