import { JSX, Show } from "solid-js";
import { css } from "solid-styled";

type TooltipProps = {
  content: JSX.Element;
  show: boolean;
  // position: "top" | "right" | "bottom" | "left";
  children: JSX.Element;
};

const Tooltip = (props: TooltipProps) => {
  css`
    li::after {
      content: "";
      display: block;
      height: 0px;
      transition: height 0.3s ease-in-out;
      pointer-events: none;
    }

    li:hover::after {
      height: 10px;
    }

    .tooltip-wrapper {
      margin: 0 10px;
      position: relative;
    }
    .tooltip-wrapper .tooltip {
      position: absolute;
      bottom: -30px;
      left: 50%;
      transform: translateX(-50%);
      color: #fff;
      padding: 6px 10px;
      border-radius: 5px;
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
      font-size: 14px;
      transition: all 0.3s ease;
    }
    .tooltip-wrapper:hover .tooltip {
      opacity: 1;
      visibility: visible;
      bottom: -40px;
    }
    .tooltip-wrapper a {
      position: relative;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      color: #4d4d4d;
      background-color: #fff;
      transition: all 0.3s ease-in-out;
    }
    .tooltip-wrapper a:hover {
      box-shadow: 3px 2px 45px 0px rgb(0 0 0 / 12%);
    }
    .tooltip-wrapper a svg {
      position: relative;
      z-index: 1;
      width: 30px;
      height: 30px;
    }
    .tooltip-wrapper a:hover {
      color: white;
    }
    .tooltip-wrapper a .filled {
      position: absolute;
      top: auto;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 0;
      background-color: #000;
      transition: all 0.3s ease-in-out;
    }
    .tooltip-wrapper a:hover .filled {
      height: 100%;
    }
  `;
  return (
    <div class="tooltip-wrapper">
      <div class="icon">{props.children}</div>
      <Show when={props.show}>
        <div class="tooltip">{props.content}</div>
      </Show>
    </div>
  );
};

export default Tooltip;
