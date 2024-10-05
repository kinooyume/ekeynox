import { type Cursor } from "~/cursor/Cursor";
import CursorNav from "~/cursor/CursorNav";
import TimerNavHooks from "~/cursor/TimerNavHooks";

import type { TypingTimer } from "~/timer/Timer";
import TimerKeypress, { type SetCleanup } from "~/timer/TimerKeypress";
import Timer from "~/timer/Timer";
import { TimedKey } from "~/typingStatistics/timedKey";

type TimerInputProps = {
  cursor: Cursor;
  sequence: Array<TimedKey>;
  setCleanup: SetCleanup;
};

const TimerInput = (props: TimerInputProps): TypingTimer => {
  const cursorNav = CursorNav({ cursor: props.cursor, hooks: TimerNavHooks });

  const apply = (key: TimedKey) => {
    key.back ? cursorNav.prev() : cursorNav.next();
  };

  const init = () => {
    if (!props.cursor) return;
    props.cursor.positions.set.paragraph(0);
    props.cursor.positions.set.word(0);
    props.cursor.positions.set.character(0);
  };

  return Timer(
    TimerKeypress({
      sequence: props.sequence,
      apply,
      init,
      setCleanup: props.setCleanup,
    }),
  );
};

export default TimerInput;
