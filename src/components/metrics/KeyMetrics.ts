export enum KeyStatus {
  unset = "unset",
  match = "match",
  unmatch = "unmatch",
  extra = "extra",
  missed = "missed",
}

export enum KeyFocus {
  unset = "unset",
  focus = "focus",
  unfocus = "unfocus",
  back = "back",
}

export type KeyAdded =
  | { kind: KeyStatus.match }
  | { kind: KeyStatus.extra }
  | { kind: KeyStatus.missed; typed: string }
  | { kind: KeyStatus.unmatch; typed: string };

export enum KeyEventKind {
  added,
  deleted,
  back,
  ignore,
}

export type KeyEvent =
  | { kind: KeyEventKind.added; status: KeyAdded }
  | { kind: KeyEventKind.deleted; status: KeyStatus }
  | { kind: KeyEventKind.back }
  | { kind: KeyEventKind.ignore };

const blankCharacters = [" ", "Enter"];

export type KeyTuple = [key: string, KeyEvent];

type KeyMetricsProps = {
  typed: string;
  expected: string;
};

type KeyDeletedMetricsProps = {
  expected: string;
  status: KeyStatus;
};

const makeDeletedKeyMetrics = ({
  expected,
  status,
}: KeyDeletedMetricsProps): KeyTuple => [
  expected,
  { kind: KeyEventKind.deleted, status },
];

const getAddedKeyMetrics = ({ typed, expected }: KeyMetricsProps): KeyTuple => {
  if (typed.length === 1 || typed === "Enter") {
    if (expected === typed) {
      return [
        expected,
        { kind: KeyEventKind.added, status: { kind: KeyStatus.match } },
      ];
    } else if (blankCharacters.includes(expected)) {
      return [
        typed,
        { kind: KeyEventKind.added, status: { kind: KeyStatus.extra } },
      ];
    } else if (blankCharacters.includes(typed)) {
      return [
        expected,
        { kind: KeyEventKind.added, status: { kind: KeyStatus.missed, typed } },
      ];
    } else {
      return [
        expected,
        { kind: KeyEventKind.added, status: { kind: KeyStatus.unmatch, typed } },
      ];
    }
  }
  return [typed, { kind: KeyEventKind.ignore }];
};
const getKeyMetrics = ({ typed, expected }: KeyMetricsProps): KeyTuple => {
  if (typed === "Backspace") {
    return [typed, { kind: KeyEventKind.back }];
  } else if (typed.length === 1 || typed === "Enter") {
    return getAddedKeyMetrics({ typed, expected });
  }
  return [typed, { kind: KeyEventKind.ignore }];
};

export { getKeyMetrics, makeDeletedKeyMetrics };
