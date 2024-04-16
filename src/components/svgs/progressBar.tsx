import { css } from "solid-styled";

type ProgressBarProps = {
  progress: number;
};

const ProgressBar = (props: ProgressBarProps) => {
  css`
    svg {
      height: 8px;
      width: 100%;
    }
  `;
  return (
    <svg>
      <g>
        <line
          stroke="var(--color-surface-alt)"
          x1="0"
          y1="50%"
          x2="100%"
          y2="50%"
          stroke-width="8"
        />
      </g>
      <g>
        <line
          x1="0"
          y1="50%"
          x2={`${props.progress}%`}
          y2="50%"
          stroke="var(--text-secondary-color)"
          fill="transparent"
          stroke-width="8px"
        />
      </g>
    </svg>
  );
};

export default ProgressBar;

// Super interessant
// svg stuff
// https://tympanus.net/codrops/2015/09/23/elastic-progress/
//
// interesting guy
// http://lbebber.github.io/public/
