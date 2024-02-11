import { css } from "solid-styled";
import { createSignal, type Accessor, createEffect } from "solid-js";

export enum KeyStatus {
  unset = "unset",
  current = "current",

  valid = "valid",
  invalid = "invalid",
}

export type KeyProps = { key: string; status: KeyStatus };

const Key = (props: KeyProps) => {
  const [wasInvalid, setWasInvalid] = createSignal(false);
  const special = props.key === "Enter" ? "special" : "";
  const transform = (char: string) => (char === "Enter" ? "↵" : char);

  createEffect(() => {
    if (props.status === KeyStatus.invalid) setWasInvalid(true);
  });

  css`
    span {
      white-space: pre;
    }
    span.valid {
      color: green;
      background-color: lightgreen;
    }
    span.invalid {
      color: red;
      background-color: lightcoral;
    }
    span.wasInvalid.valid {
      color: orange;
      background-color: lightyellow;
    }
    span.current {
      color: blue;
      background-color: lightblue;
    }
    span.special {
      width: 100%;
    }
  `;
  return (
    <span class={`${props.status} ${wasInvalid() ? "wasInvalid" : ""} ${special}`}>
      {transform(props.key)}
    </span>
  );
};

export default Key;
