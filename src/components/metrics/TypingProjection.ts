import {
  KeyEventKind,
  type KeyEvent,
  KeyStatus,
  type KeyAdded,
} from "./KeyMetrics";
import List, { type LinkedList } from "../List";
import { TypingKey } from "../typing/TypingEvent";

export type KeyStatusProjection = {
  match: number;
  unmatch: number;
  extra: number;
  missed: number;
  total: number;
};

const createKeyStatusProjection = (): KeyStatusProjection => ({
  match: 0,
  unmatch: 0,
  extra: 0,
  missed: 0,
  total: 0,
});

export type TypingProjection = {
  added: KeyStatusProjection;
  deleted: KeyStatusProjection;
  total: number;
  expected: Array<string>;
};

const createTypingProjection = (): TypingProjection => ({
  added: createKeyStatusProjection(),
  deleted: createKeyStatusProjection(),
  total: 0,
  expected: [],
});

export type UpdateAddedKeyProps = {
  target: KeyStatusProjection;
  source: KeyAdded;
  expected: Array<string>;
};
/* Side Effect */
const updateAddedKeyStatus = ({
  target,
  source,
  expected,
}: UpdateAddedKeyProps) => {
  switch (source.kind) {
    case KeyStatus.match:
      target.match++;
      break;
    case KeyStatus.unmatch:
      target.unmatch++;
      expected.push(source.typed);
      break;
    case KeyStatus.extra:
      target.extra++;
      break;
    case KeyStatus.missed:
      target.missed++;
      expected.push(source.typed);
      break;
  }
  target.total++;
};

type KeyDeletedMetricsProps = {
  target: KeyStatusProjection;
  source: KeyStatus;
};

const updateDeletedKeyStatus = ({ target, source }: KeyDeletedMetricsProps) => {
  switch (source) {
    case KeyStatus.match:
      target.match++;
      break;
    case KeyStatus.unmatch:
      target.unmatch++;
      break;
    case KeyStatus.extra:
      target.extra++;
      break;
    case KeyStatus.missed:
      target.missed++;
      break;
  }
  target.total++;
};

/* Side Effect */
const updateTypingProjection =
  (target: TypingProjection) => (source: KeyEvent) => {
    switch (source.kind) {
      case KeyEventKind.back || KeyEventKind.ignore:
        return;
      case KeyEventKind.added:
        updateAddedKeyStatus({
          target: target.added,
          source: source.status,
          expected: target.expected,
        });
        break;
      case KeyEventKind.deleted:
        updateDeletedKeyStatus({
          target: target.deleted,
          source: source.status,
        });
    }

    target.total++;
  };

/* Side effect */
const mergeKeyStatusProjections = (
  target: KeyStatusProjection,
  source: KeyStatusProjection,
) => {
  target.match += source.match;
  target.unmatch += source.unmatch;
  target.extra += source.extra;
  target.missed += source.missed;
  target.total += source.total;
};

const diffKeyStatusProjections = ({ added, deleted }: TypingProjection) => ({
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
  mergeKeyStatusProjections(target.added, source.added);
  mergeKeyStatusProjections(target.deleted, source.deleted);
  target.total += source.total;
  target.expected = target.expected.concat(source.expected);
};

const createTypingProjectionFromPendingList = (
  list: LinkedList<TypingKey>,
): [TypingProjection, LinkedList<TypingKey>] => {
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
  diffKeyStatusProjections,
};
