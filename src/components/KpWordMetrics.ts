import { KeyStatus, PromptKeyStatus, type KeyMetrics } from "./KeyMetrics";
import type { KpWordsMetrics } from "./KeypressMetrics";
import type { LinkedList } from "./List";
import List from "./List";
import type { TypingPending } from "./TypingEngine";
import {
  createTypingProjection,
  mergeTypingProjections,
  updateTypingProjection,
  type TypingProjection,
} from "./TypingProjection";

// NOTE: we create too much typingprojection
// but I don't want to rely on "foundOperator"
// on doit pouvoir faire un truc avec des fonctions..

const updateWordProjection = (target: KpWordsMetrics) => {
  return (logs: LinkedList<TypingPending>, isOver: boolean) => {
    let node = logs;
    let memory = createTypingProjection();
    let sectionProjection = createTypingProjection(); // target.memory
    let updateMemory = updateTypingProjection(memory);

    while (node !== null) {
      if (node.value.focusIsSeparator) {
        mergeTypingProjections(sectionProjection, target.memory);
        target.memory = createTypingProjection();
        updateMemory = updateTypingProjection(sectionProjection);
      } else {
        updateMemory(node.value.keyMetrics[1]);
      }
      node = node.next;
    }
    mergeTypingProjections(target.projection, sectionProjection);
    mergeTypingProjections(target.memory, memory);
    isOver && mergeTypingProjections(target.projection, target.memory);
  };
};

export { updateWordProjection };
