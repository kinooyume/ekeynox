import { TypingStatusKind, type TypingStatus } from "../typing/TypingEngine";
import {
  createTypingProjection,
  updateTypingProjection,
  type TypingProjection,
} from "./TypingProjection";

export type KeysProjection = Record<string, TypingProjection>;

type KeysProjectionProps = { projection: KeysProjection; status: TypingStatus };
const updateKeyProjection = ({
  projection,
  status,
}: KeysProjectionProps): KeysProjection => {
  if (status.kind === TypingStatusKind.unstart) {
    return {};
  } else if (status.kind !== TypingStatusKind.pending) {
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
