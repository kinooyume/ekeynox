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
import TypingMetrics from "./TypingMetrics.tsx";

import { css } from "solid-styled";
import { Show, createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

type TypingGameProps = { source: string };

// https://icon-sets.iconify.design/line-md/?query=play

const TypingGame = ({ source }: TypingGameProps) => {
  const paragraphs = Content.parse(source);
  const [paraStore, setParaStore] = createStore(Content.deepClone(paragraphs));

  // NOTE: surement refaire un store avec clef de clavier du coup
  const [status, setStatus] = createSignal<TypingStatus>({
    kind: TypingStatusKind.unstart,
  });

  // Accuracy ca serra la meme chose, avec des intervals et tout ca
  const [wpm, setWpm] = createSignal(0);
  const [raw, setRaw] = createSignal(0);

  const pause = () => setStatus({ kind: TypingStatusKind.pause });

  const reset = () => {
    setParaStore(Content.deepClone(paragraphs));
    setStatus({ kind: TypingStatusKind.unstart });
    resetInput();
    focus!();
  };

  let resetInput: () => void;
  let focus: () => void;
  let keyboard: TypingKeyboardRef;

  const updateMetrics = CreateTypingMetrics({setWpm, setRaw})

  const metrics = createMemo(
    (met: Metrics) => updateMetrics(met, { status: status() }),
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
    <Show
      when={status().kind !== TypingStatusKind.over}
      fallback={
        <TypingMetrics wpm={wpm()} raw={raw()} metrics={metrics()} />
      }
    >
      <div class="mega" onClick={() => focus()}>
        <TypingEngine
          paragraphs={paraStore}
          setParagraphs={setParaStore}
          status={status()}
          setStatus={setStatus}
          setFocus={(f) => (focus = f)}
          setReset={(r) => (resetInput = r)}
          onKeyDown={keyboard!?.keyDown}
          onKeyUp={keyboard!?.keyUp}
        />
        <Prompt paragraphs={paraStore} />
        <TypingNav
          isPaused={status().kind !== TypingStatusKind.pending}
          wpm={wpm()}
          raw={raw()}
          onPause={pause}
          onReset={reset}
        />
        <Keyboard metrics={metrics().byKey} layout="qwerty" ref={(k) => (keyboard = k)} />
      </div>
    </Show>
  );
};

export default TypingGame;
