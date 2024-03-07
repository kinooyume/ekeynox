import { css } from "solid-styled";

import { type GameModePending, type I18nContext } from "./App.tsx";
import HeaderNav from "./HeaderNav.tsx";
import { Show, type JSXElement } from "solid-js";

type HeaderProps = {
  i18n: I18nContext;
  toHome: () => void;
  gameMode: GameModePending;
  children: JSXElement;
};

const Header = (props: HeaderProps) => {
  css`
    .header {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 72px;
      padding: 1rem 2rem;
      background-color: var(--bg-secondary-color);
    }

    .header .left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  `;

  return (
      <div class="header">
        <div class="left">
          <div class="home" onClick={props.toHome}>
            <p>eKeyNox</p>
          </div>
          <Show when={props.gameMode !== "none"}>
            <HeaderNav i18n={props.i18n} mode={props.gameMode} />
          </Show>
        </div>
        {props.children}
      </div>
  );
};

export default Header;
