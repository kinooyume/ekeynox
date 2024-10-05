import { LinkedList } from "~/List";
import { CharacterEventKind } from "~/typingContent/character/types";
import { KeypressMetricsProjection } from "./KeypressMetrics";

export type TimedKey = {
  back: boolean;
  duration: number;
};

const getTimedKeySequence = (
  events: LinkedList<KeypressMetricsProjection>,
): Array<TimedKey> => {
  let event = events;
  const keysSequences: Array<Array<TimedKey>> = [];
  while (event) {
    let logs = event.value.meta.logs;
    event = event.next;
    if (!logs) continue;
    let prevTimestamp = logs.value.timestamp;

    let localSequence = [];
    while (logs) {
      const key = logs.value.keyMetrics;
      const duration = logs.value.timestamp - prevTimestamp;
      localSequence.push({
        back: key[1].kind === CharacterEventKind.deleted,
        duration,
      });
      prevTimestamp = logs!.value.timestamp;
      logs = logs.next;
    }
    keysSequences.unshift(localSequence);
  }
  return keysSequences.flat();
};

export { getTimedKeySequence };
