import {
  CharacterEventKind,
  CharacterEventTuple,
  CharacterStatus,
} from "~/typingContent/character/types";

const blankCharacters = [" ", "Enter"];

type KeyMetricsProps = {
  typed: string;
  expected: string;
};

type KeyDeletedMetricsProps = {
  status: CharacterStatus;
  expected: string;
};

const makeDeletedKeyMetrics = ({
  status,
  expected,
}: KeyDeletedMetricsProps): CharacterEventTuple => [
  expected,
  { kind: CharacterEventKind.deleted, status },
];

const getAddedKeyMetrics = ({
  typed,
  expected,
}: KeyMetricsProps): CharacterEventTuple => {
  if (expected === typed) {
    return [
      expected,
      {
        kind: CharacterEventKind.added,
        status: { kind: CharacterStatus.match },
      },
    ];
  } else if (blankCharacters.includes(expected)) {
    return [
      typed,
      {
        kind: CharacterEventKind.added,
        status: { kind: CharacterStatus.extra },
      },
    ];
  } else if (blankCharacters.includes(typed)) {
    return [
      expected,
      {
        kind: CharacterEventKind.added,
        status: { kind: CharacterStatus.missed, typed },
      },
    ];
  } else {
    return [
      expected,
      {
        kind: CharacterEventKind.added,
        status: { kind: CharacterStatus.unmatch, typed },
      },
    ];
  }
};

const getKeyDownMetrics = (typed: string) => {
  switch (typed) {
    case "Backspace":
      return CharacterEventKind.back;
    case "Enter":
    case "Tab":
      return CharacterEventKind.added;
  }
  return CharacterEventKind.ignore;
};

const getKeyMetrics = ({
  typed,
  expected,
}: KeyMetricsProps): CharacterEventTuple => {
  if (typed === "Backspace") {
    return [typed, { kind: CharacterEventKind.back }];
  } else if (typed.length === 1 || typed === "Enter") {
    return getAddedKeyMetrics({ typed, expected });
  }
  return [typed, { kind: CharacterEventKind.ignore }];
};

export { getKeyMetrics, getKeyDownMetrics, makeDeletedKeyMetrics };
