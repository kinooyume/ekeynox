import { createEffect, createSignal } from "solid-js";
import { css } from "solid-styled";

type PlayProps = {
  paused: boolean;
};
const Play = (props: PlayProps) => {
  const getPaths = () =>
    props.paused
      ? ["M13 15L8 18L8 6L13 9L13 15", "M13 9L18 12L18 12L13 15L13 9"]
      : ["M9 6L9 18L7 18L7 6z", "M15 6L17 6L17 18L15 18L15 6"];

  const [paths, setPaths] = createSignal(getPaths());

  createEffect(() => {
    setPaths(getPaths());
  });
  css`
    svg {
      cursor: pointer;
    }
    path {
      transition: 0.2s;
    }

    svg:hover .paused path {
      fill: black;
    }

    .center {
      opacity: 1;
    }
    .paused .center {
      opacity: 0;
    }
  `;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1.5em"
      height="1.5em"
      viewBox="0 0 24 24"
    >
      <g
        classList={{ paused: !props.paused }}
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="var(--text-secondary-color)"
        stroke-width="2"
      >
        <path class="left" d={paths()[0]} />
        <path class="right" d={paths()[1]} />
        <path class="center" d="M8 6L18 12L8 18z" />
      </g>
    </svg>
  );
};

export default Play;
