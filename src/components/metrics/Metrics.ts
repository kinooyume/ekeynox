import type { LinkedList } from "../List";
import type { MetaWord, Paragraphs } from "../content/Content";
import type { GameOptions } from "../gameMode/GameOptions";
import { KeyEventKind } from "./KeyMetrics";
import type { KeypressMetricsProjection } from "./KeypressMetrics";
import type { KeysProjection } from "./KeysProjection";
import type { TypingMetrics } from "./TypingMetrics";
import {
  diffKeyStatusProjections,
  type KeyStatusProjection,
} from "./TypingProjection";

export type Metrics = {
  paragraphs: Paragraphs;
  wordsCount: number;
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

export type TimedKey = {
  back: boolean;
  duration: number;
};

export type KeyResume = { [k: string]: KeyStatusProjection };

export type MetricsResume = {
  chart: ChartMetrics;
  words: Array<WordSpeed>;
  keys: [KeyResume, Map<string, number>];
  getSequence: () => Array<TimedKey>;
};

const blankCharacters = [" ", "Enter"];
const makeKeysResume = (
  keys: KeysProjection,
): [KeyResume, Map<string, number>] => {
  const expected = new Map<string, number>();
  const result = Object.entries(keys).reduce((acc, [key, value]) => {
    // TODO: Keypress metrics, better handle separator
    if (blankCharacters.includes(key)) return acc;
    value.expected.forEach((e) => {
      expected.set(e, (expected.get(e) || 0) + 1);
    });
    return { ...acc, [key]: diffKeyStatusProjections(value) };
  }, {});
  return [result, expected];
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

const averageWordWpm = (words: Array<MetaWord>): Array<WordSpeed> => {
  let result = [] as WordSpeed[];
  words.forEach((word) => {
    if (word.wpm === 0 || blankCharacters.includes(word.keys[0].key)) return;
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

const getSequence = (
  events: LinkedList<KeypressMetricsProjection>,
): Array<TimedKey> => {
  let event = events;
  const keysSequences: Array<Array<TimedKey>> = [];
  while (event) {
    let logs = event.value.meta.logs;
    let prevTimestamp = logs!.value.timestamp;

    let localSequence = [];
    while (logs) {
      const key = logs.value.keyMetrics;
      const duration = logs.value.timestamp - prevTimestamp;
      localSequence.push({
        back: key[1].kind === KeyEventKind.deleted,
        duration,
      });
      prevTimestamp = logs!.value.timestamp;
      logs = logs.next;
    }
    keysSequences.unshift(localSequence);
    event = event.next;
  }
  return keysSequences.flat();
};

const createMetricsResume = (metrics: Metrics): MetricsResume => ({
  chart: logsToChartMetrics(metrics.typing.logs),
  words: averageWordWpm(metrics.paragraphs.flat()).sort(
    (a, b) => b.averageWpm - a.averageWpm,
  ),
  getSequence: () => getSequence(metrics.typing.logs),
  keys: makeKeysResume(sortKeys(metrics.keys)),
});

export { createMetricsResume };
