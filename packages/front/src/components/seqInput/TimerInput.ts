import { type Cursor } from "~/cursor/Cursor";
import type { TimerEffectStatus } from "~/timer/Timer";
import TimerKeypress, { type SetCleanup } from "~/timer/TimerKeypress";
import CursorNav from "~/cursor/CursorNav";
import TimerNavHooks from "~/cursor/TimerNavHooks";
import Timer from "~/timer/Timer";
import type { TimedKey } from "~/typingMetrics/Metrics";

type TimerInputProps = {
  cursor: Cursor;
  sequence: Array<TimedKey>;
  setCleanup: SetCleanup;
};

const TimerInput = ({
  cursor,
  sequence,
  setCleanup,
}: TimerInputProps): TimerEffectStatus => {
  const cursorNav = CursorNav({ cursor, hooks: TimerNavHooks });

  const apply = (key: TimedKey) => {
    key.back ? cursorNav.prev() : cursorNav.next();
  };

  return Timer(
    TimerKeypress.create({
      sequence,
      apply,
      setCleanup,
    }),
  );
};

export default TimerInput;
