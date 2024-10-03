import { type LinkedList } from "~/List";
import { type KeypressMetricsProjection } from "./KeypressMetrics";

export type ChartMetrics = {
  wpm: Array<{ x: number; y: number }>;
  raw: Array<{ x: number; y: number }>;
  errors: Array<{ x: number; y: number }>;
};

// TODO: rename, logsTo.. Sequences / seconde (wpm, raw, errors) ?
const logsToChartMetrics = (
  logs: LinkedList<KeypressMetricsProjection>,
): ChartMetrics => {
  let wpm = [] as { x: number; y: number }[];
  let raw = [] as { x: number; y: number }[];
  let errors = [] as { x: number; y: number }[];

  let log = logs;
  let prevElapsed = -1;
  while (log) {
    const elapsed = Math.round(log.value.core.duration / 1000);
    const secProj = log.value.meta.sectionProjection;
    const wrong =
      secProj.added.unmatch + secProj.added.missed + secProj.added.extra;
    if (prevElapsed !== elapsed) {
      wpm.push({ x: elapsed, y: log.value.stats.speed.byWord[0] });
      raw.push({ x: elapsed, y: log.value.stats.speed.byKeypress[1] });
      if (wrong > 0) {
        errors.push({ x: elapsed, y: wrong });
      }
    } else if (errors.length > 0) {
      errors[errors.length - 1].y += wrong;
    }
    prevElapsed = elapsed;
    log = log.next;
  }
  return { wpm, raw, errors };
};

export { logsToChartMetrics };
