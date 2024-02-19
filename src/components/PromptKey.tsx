import { css } from "solid-styled";
import { createSignal, createEffect } from "solid-js";
import { PromptKeyStatus } from "./KeyMetrics";

export type KeyProps = { key: string; status: PromptKeyStatus; focus: boolean };

const Key = (props: KeyProps) => {
  const [wasInvalid, setWasInvalid] = createSignal(false);
  const special = props.key === "Enter" ? "special" : "";
  const transform = (char: string) => (char === "Enter" ? "↵" : char);

  createEffect(() => {
    if (props.status === PromptKeyStatus.incorrect) setWasInvalid(true);
  });

  css`
    span {
      white-space: pre;
    }
    span.correct {
      color: green;
      background-color: lightgreen;
    }
    span.incorrect {
      color: red;
      background-color: lightcoral;
    }
    span.wasInvalid.correct {
      color: orange;
      background-color: lightyellow;
    }
    span.focus {
      color: blue;
      background-color: lightblue;
    }
    span.special {
      width: 100%;
    }
  `;
  return (
    <span
      class={`${props.status} ${props.focus ? "focus" : ""} ${wasInvalid() ? "wasInvalid" : ""} ${special}`}
    >
      {transform(props.key)}
    </span>
  );
};

export default Key;
