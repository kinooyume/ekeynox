import { type LinkedList } from "~/List";
import { type KeypressMetricsProjection } from "./KeypressMetrics";

export type ChartMetrics = {
  wpm: Array<{ x: number; y: number }>;
  raw: Array<{ x: number; y: number }>;
  errors: Array<{ x: number; y: number }>;
};

//TODO: Logs to Array, puis Array to Chart
const logsToChartStatistics = (
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
      wpm.push({ x: elapsed, y: log.value.stats.speed.wpm });
      raw.push({ x: elapsed, y: log.value.stats.speed.kpm });
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

export { logsToChartStatistics };
