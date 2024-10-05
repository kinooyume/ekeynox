import {
  Accessor,
  createComputed,
  createEffect,
  createSignal,
  on,
  onCleanup,
} from "solid-js";
import makeCursor from "~/cursor/Cursor";
import { PendingKind, PendingStatusRedo } from "~/states";
import { TypingTimer } from "~/timer/Timer";
import { getTimedKeySequence } from "~/typingStatistics/timedKey";
import { SetStoreFunction } from "solid-js/store";
import { Paragraphs } from "~/typingContent/paragraphs/types";
import { TypingState } from "~/typingState";
import TimerInput from "~/components/seqInput/TimerInput";

type Props = {
  paragraphs: Paragraphs;
  setParagraphs: SetStoreFunction<Paragraphs>;
  status: PendingStatusRedo;
  typingState: Accessor<TypingState>;
};

type Redo = (props: Props) => void;

const typingGameRedo: Redo = (props) => {
  // const [ghostCursor, setGhostCursor] = createSignal<Cursor>();
  const [cleanupGhost, setCleanupGhost] = createSignal(() => {});

  createComputed(
    on(
      () => props.status,
      (status) => {
        switch (status.kind) {
          case PendingKind.redo:
            const ghostCursor = makeCursor({
              paragraphs: props.paragraphs,
              setParagraphs: props.setParagraphs,
            });
            // setGhostCursor(ghostCursor);
            const ghostInput = TimerInput({
              cursor: ghostCursor,
              sequence: getTimedKeySequence(status.prev.typingLogs),
              setCleanup: setCleanupGhost,
            });
            createEffect((timer: TypingTimer) => {
              return timer({ state: props.typingState() });
            }, ghostInput);
            break;
          // case PendingKind.new:
          //   cleanupGhost();
          //   // setGhostCursor(undefined);
          //   break;
        }
      },
    ),
  );

  onCleanup(cleanupGhost);
};

export default typingGameRedo;
