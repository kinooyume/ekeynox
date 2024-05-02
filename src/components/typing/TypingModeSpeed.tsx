import { type JSX, createComputed, createSignal } from "solid-js";
import type { TypingEventType } from "./TypingEvent";
import { type Cursor } from "../cursor/Cursor";
import { WordStatus } from "../prompt/PromptWord";
import type { StatProjection } from "../metrics/KeypressMetrics";
import TypingInfo from "./TypingInfo";

// [x] progress
// ==> Pas besoins que ca soit ici

// [ ] changer le comportement au extraEnd
// [ ] changer le comportement getContent

type TypingModeSpeedProps = {
  typingEvent: TypingEventType;
  stat: StatProjection;
  children: JSX.Element;

  cursor: Cursor;
  wordsCount: number;
  totalWords: number;
};

const TypingModeSpeed = (props: TypingModeSpeedProps) => {
  const [progress, setProgress] = createSignal(0);

  createComputed(() => {
    setProgress(100 - (props.wordsCount / props.totalWords) * 100);
  });

  return (
    <TypingInfo
      typingHelp={props.children}
      stat={props.stat}
      progress={progress()}
    >
      <p>WordsCount: {props.wordsCount}</p>
    </TypingInfo>
  );
};

export default TypingModeSpeed;
