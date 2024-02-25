import { KeyStatus, PromptKeyStatus } from "./KeyMetrics";
import type { TypingProjection, KpWordsMetrics } from "./KeypressMetrics";
import type { LinkedList } from "./List";
import List from "./List";
import type { TypingPending } from "./TypingEngine";

// TODO:  refacto with keypressMetrics, separate word and key stuff
// separate in 4 parts, word, word, typingProjection, keypress

/* Common to char */

const createTypingProjection = () => ({
  correct: 0,
  incorrect: 0,
  deletedCorrect: 0,
  deletedIncorrect: 0,
  extra: 0,
  missed: 0,
  total: 0,
});

const makeProjection = (source: LinkedList<TypingPending>) => {
  let node = source;
  let sortedLogs = null;
  const sectionProjection = createTypingProjection();
  while (node !== null) {
    const { keyMetrics } = node.value;
    const [_, metrics] = keyMetrics;
    if (metrics.kind === KeyStatus.deleted) {
      if (metrics.status === PromptKeyStatus.correct)
        sectionProjection.deletedCorrect++;
      else if (metrics.status === PromptKeyStatus.incorrect)
        sectionProjection.deletedIncorrect++;
      else break;
    } else {
      switch (metrics.kind) {
        case KeyStatus.match:
          sectionProjection.correct++;
          break;
        case KeyStatus.unmatch:
          sectionProjection.incorrect++;
          break;
        case KeyStatus.extra:
          sectionProjection.extra++;
          break;
        case KeyStatus.missed:
          sectionProjection.missed++;
          break;
      }
    }
    sectionProjection.total++;
    sortedLogs = List.make(sortedLogs, node.value);
    node = node.next;
  }
  return { sectionProjection, logs: sortedLogs };
};

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
  return target;
};

/* *** */

const updateWordProjectionByPending =
  (target: KpWordsMetrics) => (pending: TypingPending) => {
    if (pending.focusIsSeparator) {
      const { sectionProjection } = makeProjection(target.word);
      target.word = null;
      target.projection = mergeTypingProjections(
        target.projection,
        sectionProjection,
      );
    } else {
      target.word = List.make(target.word, pending);
    }
  };

const updateWordProjection =
  (target: KpWordsMetrics) => (logs: LinkedList<TypingPending>) => {
    let node = logs;
    const update = updateWordProjectionByPending(target);
    while (node !== null) {
      update(node.value);
      node = node.next;
    }
  };

export { updateWordProjection };
