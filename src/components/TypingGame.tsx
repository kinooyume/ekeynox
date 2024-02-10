import Content from "./Content.ts";
import TypingEngine, {
  type TypingStatus,
  TypingStatusKind,
} from "./TypingEngine";
import Prompt from "./Prompt.tsx";
import TypingNav from "./TypingNav.tsx";
import Keyboard, { type TypingKeyboardRef } from "./TypingKeyboard.tsx";
import CreateTypingMetrics, {
  defaultMetrics,
  type Metrics,
} from "./TypingMetrics.ts";

import { css } from "solid-styled";
import { createEffect, createSignal } from "solid-js";

type TypingGameProps = { source: string };

// https://icon-sets.iconify.design/line-md/?query=play

const TypingGame = ({ source }: TypingGameProps) => {
  const data = Content.parse(source);

  const [status, setStatus] = createSignal<TypingStatus>({
    kind: TypingStatusKind.unstart,
  });
  const [wpm, setWpm] = createSignal(0);
  const [raw, setRaw] = createSignal(0);
  const [keyMetrics, setKeyMetrics] = createSignal(new Map());

  const pause = () => setStatus({ kind: TypingStatusKind.pause });
  const reset = () => {
    setStatus({ kind: TypingStatusKind.unstart });
    resetInput();
    focus!();
  };

  let resetInput: () => void;
  let focus: () => void;
  let keyboard: TypingKeyboardRef;

  const metrics = CreateTypingMetrics({ setWpm, setRaw, setKeyMetrics });

  createEffect(
    (met: Metrics) => metrics(met, { status: status() }),
    defaultMetrics,
  );

  css`
    .mega {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  `;
  return (
    <div class="mega" onClick={() => focus()}>
      <TypingEngine
        data={data}
        status={status()}
        setStatus={setStatus}
        setFocus={(f) => (focus = f)}
        setReset={(r) => (resetInput = r)}
        onKeyDown={keyboard!?.keyDown}
        onKeyUp={keyboard!?.keyUp}
      />
      <Prompt data={data} />
      <TypingNav
        isPaused={status().kind !== TypingStatusKind.pending}
        wpm={wpm()}
        raw={raw()}
        onPause={pause}
        onReset={reset}
      />
      <Keyboard ref={(k) => (keyboard = k)} />
    </div>
  );
};

export default TypingGame;
