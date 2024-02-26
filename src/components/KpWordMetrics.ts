import { KeyStatus, PromptKeyStatus } from "./KeyMetrics";
import type { KpWordsMetrics } from "./KeypressMetrics";
import type { LinkedList } from "./List";
import List from "./List";
import type { TypingPending } from "./TypingEngine";
import {
  createTypingProjectionFromPendingList,
  mergeTypingProjections,
} from "./TypingProjection";

const mergeWordProjection = (target: KpWordsMetrics) => {
  const [sectionProjection, _] = createTypingProjectionFromPendingList(
    target.word,
  );
  target.word = null;
  /*  Side effect */
  mergeTypingProjections(target.projection, sectionProjection);
};

const updateWordProjectionByPending =
  (target: KpWordsMetrics) => (pending: TypingPending) => {
    if (pending.focusIsSeparator) {
      mergeWordProjection(target);
    } else {
      target.word = List.make(target.word, pending);
    }
  };

const updateWordProjection =
  (target: KpWordsMetrics) =>
  (logs: LinkedList<TypingPending>, isOver: boolean) => {
    let node = logs;
    const update = updateWordProjectionByPending(target);
    while (node !== null) {
      update(node.value);
      node = node.next;
    }
    isOver && mergeWordProjection(target);
  };

export { updateWordProjection };
