import { KeyStatus, type KeyMetrics, PromptKeyStatus } from "./KeyMetrics";
import type { LinkedList } from "./List";
import List from "./List";
import type { TypingPending } from "./TypingEngine";

export type TypingProjection = {
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
  deletedCorrect: number;
  deletedIncorrect: number;
  total: number;
  expected: Array<string>;
};

const createTypingProjection = (): TypingProjection => ({
  correct: 0,
  incorrect: 0,
  extra: 0,
  missed: 0,
  deletedCorrect: 0,
  deletedIncorrect: 0,
  total: 0,
  expected: [],
});

/* Side Effect */
const updateTypingProjection =
  (target: TypingProjection) => (source: KeyMetrics) => {
    switch (source.kind) {
      case KeyStatus.match:
        target.correct++;
        break;
      case KeyStatus.unmatch:
        target.incorrect++;
        target.expected.push(source.typed);
        break;
      case KeyStatus.extra:
        target.extra++;
        break;
      case KeyStatus.missed:
        target.missed++;
        target.expected.push(source.typed);
        break;
      case KeyStatus.deleted:
        switch (source.status) {
          case PromptKeyStatus.unstart:
            return;
          case PromptKeyStatus.correct:
            target.deletedCorrect++;
            break;
          case PromptKeyStatus.incorrect:
            target.deletedIncorrect++;
            break;
        }
    }

    target.total++;
  };

/* Side Effect */
const mergeTypingProjections = (
  target: TypingProjection,
  source: TypingProjection,
) => {
  target.correct += source.correct;
  target.incorrect += source.incorrect;
  target.extra += source.extra;
  target.missed += source.missed;
  target.deletedCorrect += source.deletedCorrect;
  target.deletedIncorrect += source.deletedIncorrect;
  target.total += source.total;
  target.expected = target.expected.concat(source.expected);
};

const updateTypingProjectionPendingList = (
  target: TypingProjection,
  list: LinkedList<TypingPending>,
) => {};

const createTypingProjectionFromPendingList = (
  list: LinkedList<TypingPending>,
): [TypingProjection, LinkedList<TypingPending>] => {
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
  updateTypingProjectionPendingList,
  mergeTypingProjections,
  createTypingProjectionFromPendingList,
};
