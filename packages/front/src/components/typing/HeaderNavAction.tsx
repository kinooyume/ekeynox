import type { JSX } from "solid-js";
import { css } from "solid-styled";

export type HeaderNavActionProps = {
  svg: JSX.Element;
  clickable?: boolean;
  action: () => void;
};

const HeaderNavAction = (props: HeaderNavActionProps) => {
  css`
    .nav-action {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      border-radius: 12px;
      border: 1px solid transparent;
    }
    .nav-action.clickable {
      cursor: pointer;
    }
    .nav-action.clickable:hover {
      border: 1px solid var(--background-color);
    }
  `;

  return (
    <div
      class="nav-action animate"
      classList={{ clickable: props.clickable }}
      onClick={props.action}
    >
      {props.svg}
    </div>
  );
};

export default HeaderNavAction;
