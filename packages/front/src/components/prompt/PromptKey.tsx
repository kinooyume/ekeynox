import { css } from "solid-styled";
import { createSignal, createEffect, on, createComputed } from "solid-js";
import { KeyFocus, KeyStatus } from "../metrics/KeyMetrics";
import { type MetaKey } from "../content/Content.ts";

const transformDict = [
  ["Enter", "↵"],
  ["\t", "⇥"],
];

const Key = (props: MetaKey) => {
  const [wasInvalid, setWasInvalid] = createSignal(false);

  // const special = props.key === "Enter" ? "special" : "";

  const transform = (char: string) =>
    transformDict.find(([key]) => key === char)?.[1] || char;

  createComputed(
    () => {
      if (
        props.status !== KeyStatus.match &&
        props.status !== KeyStatus.unset
      ) {
        setWasInvalid(true);
      }
    },
    { defer: true },
  );

  css`
    .prompt-key {
      font-family: "OdudoMono", monospace;
      font-optical-sizing: auto;
      transform-origin: 0 100%;
    }
    span {
      white-space: pre;
    }

    span.match {
      color: var(--correct-color);
      background-color: var(--correct-bg-color);
    }
    span.unmatch,
    span.extra,
    span.missed {
      color: var(--incorrect-color);
      background-color: var(--incorrect-bg-color);
    }
    span.wasInvalid.match {
      color: var(--corrected-color);
      background-color: var(--corrected-bg-color);
    }
    span.ghost-focus {
      background-color: grey;
      position: relative;
    }
    span.ghost-focus::before {
      content: " ";
      position: absolute;
      top: -4px;
      left: 0;
      width: 100%;
      height: 100%;
      border-bottom: 2px solid grey;
      animation: blink 1s infinite;
    }
    span.focus {
      position: relative;
      color: var(--focus-color);
      background-color: var(--focus-bg-color);
    }

    span.focus::before {
      content: " ";
      position: absolute;
      top: -4px;
      left: 0;
      width: 100%;
      height: 100%;
      border-bottom: 2px solid var(--focus-color);
      animation: blink 1s infinite;
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
      class={`prompt-key ${props.focus} ${wasInvalid() ? "wasInvalid" : ""} ${props.status}`}
      classList={{
        ["ghost-focus"]: props.ghostFocus === KeyFocus.focus,
      }}
    >
      {transform(props.key)}
    </span>
  );
};

export default Key;
