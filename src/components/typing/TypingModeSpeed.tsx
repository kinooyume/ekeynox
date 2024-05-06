import { type JSX, createComputed, createSignal } from "solid-js";
import type { TypingEventType } from "./TypingEvent";
import type { StatProjection } from "../metrics/KeypressMetrics";
import TypingInfo from "./TypingInfo";

type TypingModeSpeedProps = {
  typingEvent: TypingEventType;
  stat: StatProjection;
  children: JSX.Element;

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
