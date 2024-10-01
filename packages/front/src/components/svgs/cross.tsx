import { css } from "solid-styled";

const Cross = () => {
  css`
    svg {
      margin-bottom: 4px;
      margin-right: 4px;
    }
  `;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="cross"
      width="1.3em"
      height="1.3em"
    >
      <title>Quit</title>
      <path
        fill="var(--text-secondary-color)"
        d="m13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29l-4.3 4.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l4.29-4.3l4.29 4.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42Z"
      ></path>
    </svg>
  );
};

export default Cross;
