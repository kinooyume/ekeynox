import { css } from "solid-styled";
import { createSignal, createEffect } from "solid-js";
import { PromptKeyStatus } from "./KeyMetrics";
import { type Metakey } from "./Content.ts";

const transformDict = [
  ["Enter", "↵"],
  ["\t", "⇥"],
];

const Key = (props: Metakey) => {
  const [wasInvalid, setWasInvalid] = createSignal(false);

  const special = props.key === "Enter" ? "special" : "";

  const transform = (char: string) =>
    transformDict.find(([key]) => key === char)?.[1] || char;

  createEffect(() => {
    if (props.status === PromptKeyStatus.incorrect) setWasInvalid(true);
  });

  css`
    .prompt-key {
      transform-origin: 0 100%;
    }
    span {
      white-space: pre;
    }

    span.focus {
      position: relative;
      color: var(--focus-color);
      background-color: var(--focus-bg-color);
    }
    span.correct {
      color: var(--correct-color);
      background-color: var(--correct-bg-color);
    }
    span.incorrect {
      color: var(--incorrect-color);
      background-color: var(--incorrect-bg-color);
    }
    span.wasInvalid.correct {
      color: var(--corrected-color);
      background-color: var(--corrected-bg-color);
    }
    span.focus::before {
      content: " ";
      position: absolute;
      top: -4px;
      left: 0;
      width: 100%;
      height: 100%;
      border-bottom: 2px solid var(--focus-color);
    }
    span.back {
      opacity: 0.6;
    }
    span.special {
      opacity: 0.6;
      width: 100%;
    }
  `;
  return (
    <span
      class={`prompt-key ${props.focus} ${props.status} ${wasInvalid() ? "wasInvalid" : ""} ${special}`}
    >
      {transform(props.key)}
    </span>
  );
};

export default Key;
