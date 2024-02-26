import { KeyStatus, PromptKeyStatus } from "./KeyMetrics";
import type { KpWordsMetrics } from "./KeypressMetrics";
import type { LinkedList } from "./List";
import List from "./List";
import type { TypingPending } from "./TypingEngine";
import {
  createTypingProjectionFromPendingList,
  mergeTypingProjections,
} from "./TypingProjection";

const updateWordProjectionByPending =
  (target: KpWordsMetrics) => (pending: TypingPending) => {
    if (pending.focusIsSeparator) {
      const [sectionProjection, _] = createTypingProjectionFromPendingList(
        target.word,
      );
      target.word = null;
      /*  Side effect */
      mergeTypingProjections(target.projection, sectionProjection);
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
