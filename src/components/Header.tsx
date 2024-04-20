import { css } from "solid-styled";

import { type Translator } from "./App.tsx";
import { type JSXElement } from "solid-js";

import Logo from "./svgs/logo.tsx";

type HeaderProps = {
  t: Translator;
  toHome: () => void;
  actions: JSXElement;
  children: JSXElement;
};

// NOTE: Similar to GameModeDropdown
const Header = (props: HeaderProps) => {
  css`
    .header {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      z-index: 100;
      display: flex;
gap: 36px;
      align-items: center;
      justify-content: space-between;
      height: 72px;
      padding: 1rem 2rem;
      background-color: var(--bg-secondary-color);
    }
    .home {
      cursor: pointer;
    }

    .header .left {
      display: flex;
      align-items: center;
    }

    .center {
      flex-grow: 1;
    }
  `;

  return (
    <div class="header">
      <div class="left">
        <div class="home" onClick={props.toHome}>
          <Logo />
        </div>
      </div>
      <div class="center">{props.children}</div>
      <div class="right">{props.actions}</div>
    </div>
  );
};

export default Header;

// cool magnet menu selection, + custom cursor
// https://codepen.io/dev_loop/pen/KKdEgdz
