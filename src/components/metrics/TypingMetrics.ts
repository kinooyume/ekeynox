import type { Setter } from "solid-js";
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
import { TypingEventKind, type TypingEventType } from "../typing/TypingEvent";

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
  event: TypingEventType;
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
  setCleanup: (cleanup: () => void) => void,
  setOver: (over: () => void) => void,
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
    ({ event }: TypingMetricsProps): TypingMetricsState => {
      const over = () => {
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
      };
      setOver(over);
      switch (event.kind) {
        case TypingEventKind.unstart:
          clearInterval(props.interval.timer);
          setStat(KeypressMetrics.createStatProjection());
          return create();
        case TypingEventKind.pending:
          props.keypressMetrics.event(event);
          return pending(props);
        case TypingEventKind.pause:
          clearInterval(props.interval.timer);
          const [pausedKeypressMetrics, projection] =
            props.keypressMetrics.pause(false);
          return paused({
            keypressMetrics: pausedKeypressMetrics,
            metrics: props.metrics,
          });
        case TypingEventKind.over:
          return over();
      }
    };

  type PausedMetricsProps = {
    keypressMetrics: PausedKeypressMetrics;
    metrics: TypingMetrics;
  };

  const paused =
    ({ keypressMetrics, metrics }: PausedMetricsProps) =>
    ({ event }: TypingMetricsProps): TypingMetricsState => {
      switch (event.kind) {
        case TypingEventKind.unstart:
          setStat(KeypressMetrics.createStatProjection());
          return create();
        case TypingEventKind.pending:
          const [pendingKeypressMetrics, lastDuration] =
            keypressMetrics.resume();
          pendingKeypressMetrics.event(event);

          const interval: Interval = { timer: 0 as unknown as NodeJS.Timer };
          const update = () => {
            updateStat(pendingKeypressMetrics.getProjection(false), metrics);
          };
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
