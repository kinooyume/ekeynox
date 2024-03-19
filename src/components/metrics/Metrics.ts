import type { LinkedList } from "../List";
import type { ContentData } from "../content/Content";
import type { GameOptions } from "../gameSelection/GameOptions";
import type { KeypressMetricsProjection } from "./KeypressMetrics";
import type { KeysProjection } from "./KeysProjection";
import type { TypingMetrics } from "./TypingMetrics";

export type Metrics = {
  content: ContentData;
  gameOptions: GameOptions;
  typing: TypingMetrics;
  keys: KeysProjection;
};

export type ChartMetrics = {
  wpm: Array<{ x: number; y: number }>;
  raw: Array<{ x: number; y: number }>;
  errors: Array<{ x: number; y: number }>;
};

export type MetricsResume = {
  chart: ChartMetrics;
}
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
    if (prevElapsed !== elapsed) {
      wpm.push({ x: elapsed, y: log.value.stats.speed.byWord[0] });
      raw.push({ x: elapsed, y: log.value.stats.speed.byKeypress[1] });
      let secProj = log.value.meta.sectionProjection;
      let wrong = secProj.incorrect + secProj.missed + secProj.extra;
      if (wrong > 0) {
        errors.push({ x: elapsed, y: wrong });
      }
    }
    prevElapsed = elapsed;
    log = log.next;
  }
  return { wpm, raw, errors };
};

const createMetricsResume = ( metrics: Metrics ): MetricsResume => ({
    chart: logsToChartMetrics(metrics.typing.logs),
})

export { createMetricsResume };
