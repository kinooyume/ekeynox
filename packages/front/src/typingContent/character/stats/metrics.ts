import List, { LinkedList } from "~/List";
import { TypingCharacter, CharacterEvent, CharacterEventKind } from "../types";
import {
  CharacterScore,
  createCharacterScore,
  updateCharacterScore,
  pushCharacterScore,
} from "./score";

export type CharacterMetrics = {
  added: CharacterScore;
  deleted: CharacterScore;
  total: number;
  expected: Array<string>;
};

const createCharacterMetrics = (): CharacterMetrics => ({
  added: createCharacterScore(),
  deleted: createCharacterScore(),
  total: 0,
  expected: [],
});

const createCharacterMetricsFromPendingList = (
  list: LinkedList<TypingCharacter>,
): [CharacterMetrics, LinkedList<TypingCharacter>] => {
  const projection = createCharacterMetrics();
  const updater = updateCharacterMetrics(projection);
  let node = list;
  let sortedLogs = null;
  while (node !== null) {
    updater(node.value.keyMetrics[1]);
    sortedLogs = List.make(sortedLogs, node.value);
    node = node.next;
  }
  return [projection, sortedLogs];
};

// side effect
const updateCharacterMetrics =
  (target: CharacterMetrics) => (source: CharacterEvent) => {
    switch (source.kind) {
      case CharacterEventKind.back || CharacterEventKind.ignore:
        return;
      case CharacterEventKind.added:
        // side effect
        updateCharacterScore(target.added).add(source.status, target.expected);
        break;
      case CharacterEventKind.deleted:
        // side effect
        updateCharacterScore(target.deleted).delete(source.status);
    }
    target.total++;
  };

/* Side Effect */
const pushCharacterMetrics = (
  target: CharacterMetrics,
  source: CharacterMetrics,
) => {
  pushCharacterScore(target.added, source.added);
  pushCharacterScore(target.deleted, source.deleted);
  target.total += source.total;
  target.expected = target.expected.concat(source.expected);
};

export {
  createCharacterMetrics,
  updateCharacterMetrics,
  pushCharacterMetrics,
  createCharacterMetricsFromPendingList,
};
