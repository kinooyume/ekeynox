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

const blankCharacters = [" ", "\n", "\r"];

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

export default getKeyMetrics;
