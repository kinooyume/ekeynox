import { TypingStateKind, type TypingState } from "~/typingState";

import {
  createTypingProjection,
  updateTypingProjection,
  type TypingProjection,
} from "./TypingProjection";

export type KeysProjection = Record<string, TypingProjection>;

type KeysProjectionProps = { projection: KeysProjection; status: TypingState };
const updateKeyProjection = ({
  projection,
  status,
}: KeysProjectionProps): KeysProjection => {
  if (status.kind === TypingStateKind.unstart) {
    return {};
  } else if (status.kind !== TypingStateKind.pending) {
    return projection;
  }
  const [key, metrics] = status.key.keyMetrics;
  if (projection[key] === undefined) {
    projection[key] = createTypingProjection();
  }
  /* Side effect */
  updateTypingProjection(projection[key])(metrics);

  return projection;
};

export { updateKeyProjection };
