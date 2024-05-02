// NOTE: not used 
import { createEffect, createSignal, onCleanup } from "solid-js";
import makeCursor, { type Cursor } from "../cursor/Cursor";
import TimerInput from "../seqInput/TimerInput";
import type { TimerEffectStatus } from "../timer/Timer";
import type { TypingInput } from "./TypingInput";
import type { TimedKey } from "../metrics/Metrics";
import HeaderNavAction from "./HeaderNavAction";
import Ghost from "../svgs/ghost";
import type { TypingEvent, TypingEventType } from "./TypingEvent";

type TypingInputGhostProps = {
  keys: Array<TimedKey>;
  event: TypingEventType;
  cursor: Cursor;
}

//  ------ Redo ------- //

// Timer
// HeaderAction
//
// NOTE: HeaderAction peut/doit etre autre part
//
//

const TypingInputGhost = (props: TypingInputGhostProps) => {
  // NOTE: probably not here
  // const [showGhost, setShowGhost] = createSignal(true);

  // keys :
  // sequence: props.status.prev.getSequence(),
  //

  let cleanupGhost = () => {};
  const ghostInput = TimerInput({
    cursor: props.cursor,
    sequence: props.keys,
    setCleanup: (cleanup) => (cleanupGhost = cleanup),
  });

  createEffect((timer: TimerEffectStatus) => {
    // if (!showGhost()) return timer;
    return timer({ status: props.event });
  }, ghostInput);

  const onReset = () => {
    props.cursor.positions.set.paragraph(0);
    props.cursor.positions.set.word(0);
    props.cursor.positions.set.key(0);
  };

  onCleanup(cleanupGhost);

  return {
    input: {
      element: HeaderNavAction({
        svg: Ghost(),
        clickable: false,
        // action: () => setShowGhost(!showGhost()),
        action: () => {}
      }),
    },
    actions: {
      onReset,
    },
  };
};

export default TypingInputGhost;
