import { Component, Show, type JSXElement } from "solid-js";
import { css } from "solid-styled";

type Props = {
  action?: () => void;
  children: JSXElement;
};
const HeaderTypingAction: Component<Props> = (props) => {
  css`
    button {
      padding: 0;
      cursor: pointer;
    }
    @media screen and (hover: hover) {
      button:hover {
        border: 1px solid var(--background-color);
      }
    }
    .nav-action {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      border-radius: 12px;
      border: 1px solid transparent;
    }
    @media screen and (max-width: 580px) {
      .nav-action {
        width: 40px;
        height: 40px;
      }
    }
    @media screen and (max-width: 500px) {
      .nav-action {
        width: 30px;
        height: 30px;
      }
    }
  `;
  return (
    <Show
      when={props.action}
      fallback={<div class="nav-action animate">{props.children}</div>}
    >
      <button class="nav-action animate" onClick={props.action}>
        {props.children}
      </button>
    </Show>
  );
};

export default HeaderTypingAction;
