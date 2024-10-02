import type { Setter } from "solid-js";

import List, { type LinkedList } from "~/List";
import {
  TypingEventKind,
  type TypingEventType,
} from "~/components/typing/TypingEvent";

import type { TypingProjection } from "./TypingProjection";
import type {
  PausedKeypressMetrics,
  PendingKeypressMetrics,
} from "./KeypressMetricsSessions";
import KeypressMetrics, {
  type KeypressMetricsProjection,
  type StatProjection,
} from "./KeypressMetrics";

import KeypressMetricsSessions from "./KeypressMetricsSessions";

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

  // TODO: make something so that the LinkedList can't be null
  // TODO: just ne pas l'ajouter direct
  //
  // NOTE: Doesnt't work
  // don't care for now
  //
  const cleanLogs = (logs: LinkedList<KeypressMetricsProjection>) => {
    if (!logs) return null;
    let log: LinkedList<KeypressMetricsProjection> = logs;
    let prevLog = log;
    while (log) {
      if (!log.value.meta.logs) {
        prevLog.next = log.next;
      } else {
        prevLog = log;
      }
      log = log.next;
    }
    return log;
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
        // props.metrics.logs = cleanLogs(props.metrics.logs);
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
