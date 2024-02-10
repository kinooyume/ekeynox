import { css } from "solid-styled";
import type { Accessor } from "solid-js";

export enum KeyStatus {
  unset = "unset",
  valid = "valid",
  invalid = "invalid",
  current = "current",
  corrected = "corrected",
  deleted = "deleted",
}

export type KeyProps = { key: string; status: Accessor<KeyStatus> };

// const transform = (char: string) => (char === " " ? " " : char);

const Key = ({ key, status }: KeyProps) => {
  const special = key === "Enter" ? "special" : "";
  const transform = (char: string) => char === "Enter" ? "↵" : char;

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
    span.current {
      color: blue;
      background-color: lightblue;
    }
    span.corrected {
      color: orange;
      background-color: lightyellow;
    }
    span.special {
      width: 100%;
    }
  `;
  return <span class={`${status()} ${special}`}>{transform( key )}</span>;
};

export default Key;
