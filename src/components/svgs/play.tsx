import { css } from "solid-styled";

const Play = ({ pause: boolean }) => {
  let pause;
  let pauses;

  css`
    svg {
      cursor: pointer;
    }
    path {
      fill: grey;
      transition: ease-in-out 0.2s;
    }
    svg:hover path {
      transition: ease-in-out 0.2s;
      fill: black;
    }

    @keyframes play {
      0% {
        transform: translateX(0);
      }
      50% {
        transform: translateX(4px);
      }
      100% {
        transform: translateX(0);
      }
    }
  `;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1.5em"
      height="1.5em"
      viewBox="0 0 24 24"
    >
      <g stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path d="M9 6L9 18L7 18L7 6z">
          <animate
            ref={pause}
            fill="freeze"
            attributeName="d"
            dur="0.4s"
            values="M9 18L7 18L7 6L9 6L9 18;M13 15L8 18L8 6L13 9L13 15"
          />
          <set attributeName="opacity" begin="0.4s" to="0" />
        </path>
        <path d="M15 6L17 6L17 18L15 18L15 6">
          <animate
            ref={pauses}
            fill="freeze"
            attributeName="d"
            dur="0.4s"
            values="M15 6L17 6L17 18L15 18L15 6;M13 9L18 12L18 12L13 15L13 9"
          />
          <set attributeName="opacity" begin="0.4s" to="0" />
        </path>
        <path d="M8 6L18 12L8 18z" opacity="0">
          <set attributeName="opacity" begin="0.4s" to="1" />
        </path>
      </g>
    </svg>
  );
};

export default Play;
