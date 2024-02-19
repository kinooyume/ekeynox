import { TypingStatusKind, type TypingStatus } from "./TypingEngine";

export enum PromptKeyStatus {
  unset = "unset",
  correct = "correct",
  incorrect = "incorrect",
}

export enum KeyStatus {
  match,
  unmatch,
  extra,
  missed,
  deleted,
  ignore,
}

const blankCharacters = [" ", "Enter"];

type KeyMetrics =
  | { kind: KeyStatus.match }
  | { kind: KeyStatus.extra }
  | { kind: KeyStatus.missed; expected: string }
  | { kind: KeyStatus.unmatch; expected: string }
  | { kind: KeyStatus.deleted; status: PromptKeyStatus }
  | { kind: KeyStatus.ignore };

export type KeyTuple = [string, KeyMetrics];

type KeyMetricsProps = {
  typed: string;
  expected: string;
  status: PromptKeyStatus;
};

const getKeyMetrics = ({
  typed,
  expected,
  status,
}: KeyMetricsProps): KeyTuple => {
  let metrics: KeyMetrics;
  if (typed === "Backspace") {
    metrics = { kind: KeyStatus.deleted, status };
  } else if (typed.length === 1 || typed === "Enter") {
    if (expected === typed) {
      metrics = { kind: KeyStatus.match };
    } else if (blankCharacters.includes(expected)) {
      metrics = { kind: KeyStatus.extra };
    } else if (blankCharacters.includes(typed)) {
      metrics = { kind: KeyStatus.missed, expected };
    } else {
      metrics = { kind: KeyStatus.unmatch, expected };
    }
  } else {
    metrics = { kind: KeyStatus.ignore };
  }
  return [typed, metrics];
};

export type KeyMetricsProjection = {
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
  deletedCorrect: number;
  deletedIncorrect: number;
  total: number;
  expected: Array<string>;
};

const createKeyMetricsProjection = (): KeyMetricsProjection => ({
  correct: 0,
  incorrect: 0,
  extra: 0,
  missed: 0,
  deletedCorrect: 0,
  deletedIncorrect: 0,
  total: 0,
  expected: [],
});

export type KeysProjection = Record<string, KeyMetricsProjection>;

type KeysProjectionProps = { projection: KeysProjection; status: TypingStatus };
const updateKeyProjection = ({
  projection,
  status,
}: KeysProjectionProps): KeysProjection => {
  if (status.kind === TypingStatusKind.unstart) {
    return {};
  } else if (status.kind !== TypingStatusKind.pending) {
    return projection;
  }
  const [key, metrics] = status.keyMetrics;
  if (projection[key] === undefined) {
    projection[key] = createKeyMetricsProjection();
  }
  switch (metrics.kind) {
    case KeyStatus.match:
      projection[key].correct++;
      break;
    case KeyStatus.unmatch:
      projection[key].incorrect++;
      projection[key].expected.push(metrics.expected);
      break;
    case KeyStatus.extra:
      projection[key].extra++;
      break;
    case KeyStatus.missed:
      projection[key].missed++;
      projection[key].expected.push(metrics.expected);
      break;
    case KeyStatus.deleted:
      if (metrics.status === PromptKeyStatus.correct) {
        projection[key].deletedCorrect++;
      } else {
        projection[key].deletedIncorrect++;
      }
      break;
  }
  return projection;
};

export { getKeyMetrics, updateKeyProjection, createKeyMetricsProjection };
