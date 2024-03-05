import type { JSXElement } from "solid-js";

type ChooseClipProps = {
  children?: JSXElement;
};
const ChooseClip = (props: ChooseClipProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="0"
      width="0"
      viewBox="0 0 203.489 96.462"
    >
      <defs>
        <clipPath id="choose-clip" clipPathUnits="objectBoundingBox">
          <path
            d="M0.959,0.002 C0.79,0.002,0.622,0,0.454,0.002 c-0.015,0.001,-0.025,-0.008,-0.046,0.059 s-0.038,0.053,-0.041,0.054 c-0.004,0,-0.292,-0.001,-0.33,0 S0.001,0.189,0.001,0.189 v0 l0,0.737 c0,0.075,0.03,0.075,0.03,0.075 l0.594,0 c0.025,0,0.032,-0.033,0.032,-0.033 s0.001,-0.011,0.02,-0.083 c0.012,-0.065,0.039,-0.056,0.039,-0.056 l0.25,-0.001 c0.032,0.001,0.034,-0.067,0.034,-0.067 l0.001,-0.688 c0,-0.003,0,-0.006,0,-0.009 c-0.001,-0.037,-0.013,-0.052,-0.022,-0.058 c-0.005,-0.004,-0.015,-0.004,-0.02,-0.004"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ChooseClip;

