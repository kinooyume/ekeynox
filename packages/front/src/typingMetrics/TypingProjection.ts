import List, { type LinkedList } from "~/List";

import {
  CharacterEventKind,
  type CharacterEvent,
  CharacterStatus,
  type CharacterAdded,
  TypingCharacter,
} from "~/typingContent/character/types";

// NOTE: C'est vraiment du Character

export type CharacterStatusProjection = {
  match: number;
  unmatch: number;
  extra: number;
  missed: number;
  total: number;
};

const createCharacterStatusProjection = (): CharacterStatusProjection => ({
  match: 0,
  unmatch: 0,
  extra: 0,
  missed: 0,
  total: 0,
});

export type TypingProjection = {
  added: CharacterStatusProjection;
  deleted: CharacterStatusProjection;
  total: number;
  expected: Array<string>;
};

const createTypingProjection = (): TypingProjection => ({
  added: createCharacterStatusProjection(),
  deleted: createCharacterStatusProjection(),
  total: 0,
  expected: [],
});

export type UpdateAddedKeyProps = {
  target: CharacterStatusProjection;
  source: CharacterAdded;
  expected: Array<string>;
};
/* Side Effect */
const updateAddedCharacterStatus = ({
  target,
  source,
  expected,
}: UpdateAddedKeyProps) => {
  switch (source.kind) {
    case CharacterStatus.match:
      target.match++;
      break;
    case CharacterStatus.unmatch:
      target.unmatch++;
      expected.push(source.typed);
      break;
    case CharacterStatus.extra:
      target.extra++;
      break;
    case CharacterStatus.missed:
      target.missed++;
      expected.push(source.typed);
      break;
  }
  target.total++;
};

type KeyDeletedMetricsProps = {
  target: CharacterStatusProjection;
  source: CharacterStatus;
};

const updateDeletedCharacterStatus = ({ target, source }: KeyDeletedMetricsProps) => {
  switch (source) {
    case CharacterStatus.match:
      target.match++;
      break;
    case CharacterStatus.unmatch:
      target.unmatch++;
      break;
    case CharacterStatus.extra:
      target.extra++;
      break;
    case CharacterStatus.missed:
      target.missed++;
      break;
  }
  target.total++;
};

/* Side Effect */
const updateTypingProjection =
  (target: TypingProjection) => (source: CharacterEvent) => {
    switch (source.kind) {
      case CharacterEventKind.back || CharacterEventKind.ignore:
        return;
      case CharacterEventKind.added:
        updateAddedCharacterStatus({
          target: target.added,
          source: source.status,
          expected: target.expected,
        });
        break;
      case CharacterEventKind.deleted:
        updateDeletedCharacterStatus({
          target: target.deleted,
          source: source.status,
        });
    }

    target.total++;
  };

/* Side effect */
const mergeCharacterStatusProjections = (
  target: CharacterStatusProjection,
  source: CharacterStatusProjection,
) => {
  target.match += source.match;
  target.unmatch += source.unmatch;
  target.extra += source.extra;
  target.missed += source.missed;
  target.total += source.total;
};

const diffCharacterStatusProjections = ({ added, deleted }: TypingProjection) => ({
  match: added.match - deleted.match,
  unmatch: added.unmatch - deleted.unmatch,
  extra: added.extra - deleted.extra,
  missed: added.missed - deleted.missed,
  total: added.total - deleted.total,
});

/* Side Effect */
const mergeTypingProjections = (
  target: TypingProjection,
  source: TypingProjection,
) => {
  mergeCharacterStatusProjections(target.added, source.added);
  mergeCharacterStatusProjections(target.deleted, source.deleted);
  target.total += source.total;
  target.expected = target.expected.concat(source.expected);
};

const createTypingProjectionFromPendingList = (
  list: LinkedList<TypingCharacter>,
): [TypingProjection, LinkedList<TypingCharacter>] => {
  const projection = createTypingProjection();
  const updater = updateTypingProjection(projection);
  let node = list;
  let sortedLogs = null;
  while (node !== null) {
    updater(node.value.keyMetrics[1]);
    sortedLogs = List.make(sortedLogs, node.value);
    node = node.next;
  }
  return [projection, sortedLogs];
};

export {
  createTypingProjection,
  updateTypingProjection,
  mergeTypingProjections,
  createTypingProjectionFromPendingList,
  diffCharacterStatusProjections,
};
