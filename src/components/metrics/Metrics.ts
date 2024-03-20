import type { LinkedList } from "../List";
import type { ContentData, MetaWord } from "../content/Content";
import type { GameOptions } from "../gameSelection/GameOptions";
import type { KeypressMetricsProjection } from "./KeypressMetrics";
import type { KeysProjection } from "./KeysProjection";
import type { TypingMetrics } from "./TypingMetrics";
import type { TypingProjection } from "./TypingProjection";

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

export type WordSpeed = {
  word: string;
  averageWpm: number;
  wpm: number[];
};

export type MetricsResume = {
  chart: ChartMetrics;
  words: Array<WordSpeed>;
  // keys: [string, TypingProjection][];
};

const sortKeys = (keys: KeysProjection): KeysProjection => {
  const sorted = Object.entries(keys).sort(
    ([, a], [, b]) => b.added.match - a.added.match,
  );
  return Object.fromEntries(sorted);
};

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
    const wrong = secProj.added.unmatch + secProj.added.missed + secProj.added.extra;
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

const averageWordWpm = (words: Array<MetaWord>): Array<WordSpeed> => {
  let result = [] as WordSpeed[];
  words.forEach((word) => {
    if (word.wpm === 0) return;
    // NOTE: maybe in metaWord
    const keys = word.keys.map((k) => k.key).join("");
    if (keys.length < 5) return;

    const wordResult = result.find((r) => r.word === keys);
    if (wordResult) {
      wordResult.wpm.push(word.wpm);
      wordResult.averageWpm = Math.round(
        wordResult.wpm.reduce((a, b) => a + b, 0) / wordResult.wpm.length,
      );
    } else {
      result.push({
        word: keys,
        wpm: [word.wpm],
        averageWpm: word.wpm,
      });
    }
  });
  return result;
};

const createMetricsResume = (metrics: Metrics): MetricsResume => ({
  chart: logsToChartMetrics(metrics.typing.logs),
  words: averageWordWpm(metrics.content.paragraphs.flat()).sort(
    (a, b) => b.averageWpm - a.averageWpm,
  ),
});

export { createMetricsResume };
