import { onCleanup, type Setter } from "solid-js";

import List, { type LinkedList } from "~/List";

import { TypingStateKind, type TypingState } from "~/typingState";

import KeypressMetrics, {
  type KeypressMetricsProjection,
  type StatProjection,
} from "./KeypressMetrics";

import KeypressMetricsSessions, {
  type PausedKeypressMetrics,
  type PendingKeypressMetrics,
} from "./KeypressMetricsSessions";
import { CharacterMetrics } from "~/typingContent/character/stats/metrics";

export type TypingMetrics = {
  projection: KeypressMetricsProjection;
  sessions: LinkedList<CharacterMetrics>;
  logs: LinkedList<KeypressMetricsProjection>;
};

const createTypingMetrics = (): TypingMetrics => ({
  projection: KeypressMetrics.createKeypressProjection(),
  sessions: List.make(null, KeypressMetrics.createCharacterMetrics()),
  logs: null,
});

type TypingMetricsProps = {
  event: TypingState;
};

export type TypingMetricsState = (
  props: TypingMetricsProps,
) => TypingMetricsState;

type Interval = {
  timer: NodeJS.Timeout;
};

const createTypingMetricsState = (
  setStat: Setter<StatProjection>,
  setTypingMetrics: Setter<TypingMetrics>,
  setCleanup: (cleanup: () => void) => void,
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
  // const cleanLogs = (logs: LinkedList<KeypressMetricsProjection>) => {
  //   if (!logs) return null;
  //   let log: LinkedList<KeypressMetricsProjection> = logs;
  //   let prevLog = log;
  //   while (log) {
  //     if (!log.value.meta.logs) {
  //       prevLog.next = log.next;
  //     } else {
  //       prevLog = log;
  //     }
  //     log = log.next;
  //   }
  //   return log;
  // };
  //
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
      switch (event.kind) {
        case TypingStateKind.unstart:
          clearInterval(props.interval.timer);
          setStat(KeypressMetrics.createStatProjection());
          return create();
        case TypingStateKind.pending:
          props.keypressMetrics.event(event);
          return pending(props);
        case TypingStateKind.pause:
          clearInterval(props.interval.timer);
          const [pausedKeypressMetrics, projection] =
            props.keypressMetrics.pause(false);
          return paused({
            keypressMetrics: pausedKeypressMetrics,
            metrics: props.metrics,
          });
        case TypingStateKind.over:
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
        case TypingStateKind.unstart:
          setStat(KeypressMetrics.createStatProjection());
          return create();
        case TypingStateKind.pending:
          const [pendingKeypressMetrics, lastDuration] =
            keypressMetrics.resume();
          pendingKeypressMetrics.event(event);

          const interval: Interval = { timer: 0 as unknown as NodeJS.Timeout };
          const update = () => {
            updateStat(pendingKeypressMetrics.getProjection(false), metrics);
          };
          interval.timer = setTimeout(() => {
            update();
            // TODO: make it directly in "cleanUp"
            // so, we had to make it mutable :(
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
