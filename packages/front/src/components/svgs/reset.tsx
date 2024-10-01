import { css } from "solid-styled";

const Reset = () => {
  css`
    .arrow path {
      fill: var(--text-secondary-color);
      transition: ease-in-out 0.2s;
    }
    svg:hover .arrow path {
      fill: black;
      transition: ease-in-out 0.2s;
    }
    .path {
      stroke: grey;
      stroke: var(--text-secondary-color);
      transition: ease-in-out 0.2s;
    }
  `;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1.3em"
      height="1.3em"
      viewBox="0 0 24 24"
    >
      <title>Reset</title>
      <path
        class="path"
        fill="none"
        stroke-dasharray="48"
        stroke-dashoffset="48"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M4.25 14C5.14 17.45 8.27 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4C9.61 4 7.47 5.05 6 6.71L4 9"
      >
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          dur="0.6s"
          values="48;0"
        />
      </path>
      <g class="arrow">
        <path
          fill-opacity="0"
          d="M3.25 10H3.89645C4.11917 10 4.23071 9.73071 4.07322 9.57322L3.42678 8.92678C3.26929 8.76929 3 8.88083 3 9.10355V9.75C3 9.88807 3.11193 10 3.25 10Z"
        >
          <set attributeName="fill-opacity" begin="0.6s" to="1" />
          <animate
            fill="freeze"
            attributeName="d"
            begin="0.6s"
            dur="0.2s"
            values="M3.25 10H3.89645C4.11917 10 4.23071 9.73071 4.07322 9.57322L3.42678 8.92678C3.26929 8.76929 3 8.88083 3 9.10355V9.75C3 9.88807 3.11193 10 3.25 10Z;M3.5 10H7.79289C8.23835 10 8.46143 9.46143 8.14645 9.14645L3.85355 4.85355C3.53857 4.53857 3 4.76165 3 5.20711V9.5C3 9.77614 3.22386 10 3.5 10Z"
          />
        </path>
      </g>
    </svg>
  );
};

export default Reset;
