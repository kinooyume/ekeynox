export enum PromptKeyStatus {
  unstart = "unstart",
  correct = "correct",
  incorrect = "incorrect",
}

export enum PromptKeyFocus {
  unset = "unset",
  focus = "focus",
  unfocus = "unfocus",
  back = "back",
}

export enum KeyStatus {
  match,
  unmatch,
  extra,
  missed,
  deleted,
  back,
  ignore,
}

export type KeyMetrics =
  | { kind: KeyStatus.match }
  | { kind: KeyStatus.extra }
  | { kind: KeyStatus.missed; typed: string }
  | { kind: KeyStatus.unmatch; typed: string }
  | { kind: KeyStatus.deleted; status: PromptKeyStatus }
  | { kind: KeyStatus.back }
  | { kind: KeyStatus.ignore };

const blankCharacters = [" ", "Enter"];

export type KeyTuple = [key: string, KeyMetrics];

type KeyMetricsProps = {
  typed: string;
  expected: string;
};

type KeyDeletedMetricsProps = {
  expected: string;
  status: PromptKeyStatus;
};

const makeDeletedKeyMetrics = ({
  expected,
  status,
}: KeyDeletedMetricsProps): KeyTuple => [
  expected,
  { kind: KeyStatus.deleted, status },
];

const getKeyMetrics = ({ typed, expected }: KeyMetricsProps): KeyTuple => {
  if (typed === "Backspace") {
    return [typed, { kind: KeyStatus.back }];
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

export { getKeyMetrics, makeDeletedKeyMetrics };
