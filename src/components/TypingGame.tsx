import Content from "./Content.ts";
import TypingEngine, {
  type TypingEngineRemoteControl,
  TypingStatus,
} from "./TypingEngine";
import Prompt from "./Prompt.tsx";
import TypingNav from "./TypingNav.tsx";
import Keyboard, { type TypingKeyboardRef } from "./TypingKeyboard.tsx";
import CreateTypingMetrics from "./TypingMetrics.ts";

import { css } from "solid-styled";
import { createSignal, onMount } from "solid-js";

type TypingGameProps = { source: string };

// https://icon-sets.iconify.design/line-md/?query=play

const TypingGame = ({ source }: TypingGameProps) => {
  const data = Content.parse(source);

  const [status, setStatus] = createSignal(TypingStatus.unstart);

  const metrics = CreateTypingMetrics();
  css`
    .mega {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  `;

  const focus = () => {};
  const pause = () => setStatus(TypingStatus.pause);
  const reset = () => setStatus(TypingStatus.unstart);

  let keyboard: TypingKeyboardRef;

  return (
    <div class="mega" onClick={focus}>
      <TypingEngine
        data={data}
        metrics={metrics.get}
        status={status()}
        setStatus={setStatus}
        onKeyDown={(k) => keyboard?.keyDown(k)}
        onKeyUp={(k) => keyboard?.keyUp(k)}
      />
      <Prompt data={data} />
      <TypingNav
        isPaused={status() === TypingStatus.pause}
        wpm={metrics.wpm}
        raw={metrics.raw}
        onPause={pause}
        onReset={reset}
      />
      <Keyboard ref={(k) => (keyboard = k)} />
    </div>
  );
};

export default TypingGame;
