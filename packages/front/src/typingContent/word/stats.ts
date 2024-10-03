import List, { type LinkedList } from "~/List";
import { TypingWord, TypingWordKind } from "./types";

export type WordStat = {
  correct: number;
};

const createWordStat = (correct: number = 0) => ({
  correct,
});

/* Side Effect */
const updateWordStat = (target: WordStat) => (source: TypingWord) => {
  switch (source.kind) {
    case TypingWordKind.correct:
      target.correct += source.length;
      break;
    case TypingWordKind.ignore:
      break;
  }
};

const mergeWordStats = (target: WordStat, source: WordStat) => {
  target.correct += source.correct;
};

const createWordStatFromList = (
  logs: LinkedList<TypingWord>,
): [WordStat, LinkedList<TypingWord>] => {
  const projection = { correct: 0 };
  const updater = updateWordStat(projection);
  let node = logs;
  let sortedLogs = null;
  while (node !== null) {
    updater(node.value);
    sortedLogs = List.make(sortedLogs, node.value);
    node = node.next;
  }
  return [projection, sortedLogs];
};

export { createWordStat, mergeWordStats, createWordStatFromList };
