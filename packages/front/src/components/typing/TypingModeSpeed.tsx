import { type JSX, createComputed, createSignal } from "solid-js";
import type { TypingEventType } from "./TypingEvent";
import type { StatProjection } from "../metrics/KeypressMetrics";
import TypingInfo from "./TypingInfo";
import MetricPreview from "../ui/MetricPreview";
import Word from "../svgs/word";
import { css } from "solid-styled";

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

  css`
    span {
      width: 20px;
      color: var(--text-secondary-color);
      font-size: 16px;
      font-weight: 600;
      padding-top: 0px;
      text-align: right;
    }
  `;
  return (
    <TypingInfo
      typingHelp={props.children}
      stat={props.stat}
      progress={progress()}
    >
      <MetricPreview picto={<Word color="var(--text-secondary-color)"/>}>
        <span>{props.wordsCount}</span>
      </MetricPreview>
    </TypingInfo>
  );
};

export default TypingModeSpeed;
