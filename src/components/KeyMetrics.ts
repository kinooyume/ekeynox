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
  | { kind: KeyStatus.missed; typed: string }
  | { kind: KeyStatus.unmatch; typed: string }
  | { kind: KeyStatus.deleted; status: PromptKeyStatus }
  | { kind: KeyStatus.ignore };

export type KeyTuple = [key: string, KeyMetrics];
export type KeyTimedTuple = [key: string, KeyMetrics, timestamps: number];

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
  if (typed === "Backspace") {
    return [expected, { kind: KeyStatus.deleted, status }];
  } else if (typed.length === 1 || typed === "Enter") {
    if (expected === typed) {
      return [expected, { kind: KeyStatus.match }];
    } else if (blankCharacters.includes(expected)) {
      return [typed, { kind: KeyStatus.extra }];
    } else if (blankCharacters.includes(typed)) {
      return [expected, { kind: KeyStatus.missed, typed }];
    } else {
      return [expected, { kind: KeyStatus.unmatch, typed }];
    }
  }
  return [typed, { kind: KeyStatus.ignore }];
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
  if (metrics.kind === KeyStatus.deleted) {
    switch (metrics.status) {
      case PromptKeyStatus.unset:
        return projection;
      case PromptKeyStatus.correct:
        projection[key].deletedCorrect++;
        break;
      case PromptKeyStatus.incorrect:
        projection[key].deletedIncorrect++;
        break;
    }

    projection[key].total++;
    return projection;
  }
  switch (metrics.kind) {
    case KeyStatus.match:
      projection[key].correct++;
      break;
    case KeyStatus.unmatch:
      projection[key].incorrect++;
      projection[key].expected.push(metrics.typed);
      break;
    case KeyStatus.extra:
      projection[key].extra++;
      break;
    case KeyStatus.missed:
      projection[key].missed++;
      projection[key].expected.push(metrics.typed);
      break;
  }

  projection[key].total++;
  return projection;
};

export { getKeyMetrics, updateKeyProjection, createKeyMetricsProjection };
