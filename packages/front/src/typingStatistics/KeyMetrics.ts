import {
  CharacterEventKind,
  CharacterEventTuple,
  CharacterStatus,
} from "~/typingContent/character/types";

// NOTE: Tout ça, c'est appelé dans userKeypress
// ==> CharacterEventTuple, que ça

// Donc c'est meme pas des metrics
// C'est lié a l'event typingPending

const blankCharacters = [" ", "Enter"];

type KeyMetricsProps = {
  typed: string;
  expected: string;
};

type KeyDeletedMetricsProps = {
  expected: string;
  status: CharacterStatus;
};

const makeDeletedKeyMetrics = ({
  expected,
  status,
}: KeyDeletedMetricsProps): CharacterEventTuple => [
  expected,
  { kind: CharacterEventKind.deleted, status },
];

// TODO: better handling of separators/blankCharacters, as special events.
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
      // NOTE: Not sure it's only backspace
      // case "Process": // Firefox Mobile
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
  // typed.length === 0, userAgent
  // NOTE: doesn't weems useful
  if (typed === "Backspace") {
    return [typed, { kind: CharacterEventKind.back }];
  } else if (typed.length === 1 || typed === "Enter") {
    // NOTE: check if really enter needed here ?
    return getAddedKeyMetrics({ typed, expected });
  }
  return [typed, { kind: CharacterEventKind.ignore }];
};

export { getKeyMetrics, getKeyDownMetrics, makeDeletedKeyMetrics };
