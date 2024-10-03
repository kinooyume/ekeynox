import List, { type LinkedList } from "~/List";
import { TypingWord, TypingWordKind } from "~/typingContent/word/types";

export type WordProjection = {
  correct: number;
};

const createWordProjection = () => ({
  correct: 0,
});

/* Side Effect */
const updateWordProjection =
  (target: WordProjection) => (source: TypingWord) => {
    switch (source.kind) {
      case TypingWordKind.correct:
        target.correct += source.length;
        break;
      case TypingWordKind.ignore:
        break;
    }
  };

const mergeWordProjections = (
  target: WordProjection,
  source: WordProjection,
) => {
  target.correct += source.correct;
};

const createWordProjectionFromList = (
  logs: LinkedList<TypingWord>,
): [WordProjection, LinkedList<TypingWord>] => {
  const projection = { correct: 0 };
  const updater = updateWordProjection(projection);
  let node = logs;
  let sortedLogs = null;
  while (node !== null) {
    updater(node.value);
    sortedLogs = List.make(sortedLogs, node.value);
    node = node.next;
  }
  return [projection, sortedLogs];
};

export {
  createWordProjection,
  mergeWordProjections,
  createWordProjectionFromList,
};
