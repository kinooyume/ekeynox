import { TypingEventKind, type TypingEventType } from "../typing/TypingEvent";
import {
  createTypingProjection,
  updateTypingProjection,
  type TypingProjection,
} from "./TypingProjection";

export type KeysProjection = Record<string, TypingProjection>;

type KeysProjectionProps = { projection: KeysProjection; status: TypingEventType };
const updateKeyProjection = ({
  projection,
  status,
}: KeysProjectionProps): KeysProjection => {
  if (status.kind === TypingEventKind.unstart) {
    return {};
  } else if (status.kind !== TypingEventKind.pending) {
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
