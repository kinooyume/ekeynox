import { css } from "solid-styled";
import { createSignal, createEffect } from "solid-js";
import { PromptKeyStatus } from "./KeyMetrics";
import { type Metakey } from "./Content.ts"

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
    span.back {
      opacity: 0.6;
    }
    span.special {
      width: 100%;
    }
  `;
  return (
    <span
      class={`${props.focus} ${props.status} ${wasInvalid() ? "wasInvalid" : ""} ${special}`}
    >
      {transform(props.key)}
    </span>
  );
};

export default Key;
