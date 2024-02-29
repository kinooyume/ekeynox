import { css } from "solid-styled";

import { GameMode,type I18nContext } from "./App.tsx";
import HeaderNav from "./HeaderNav.tsx";
import { Show, type JSXElement } from "solid-js";

type HeaderProps = {
  i18n: I18nContext;
  toHome: () => void;
  gameMode: GameMode;
  children: JSXElement;
};

const Header = (props: HeaderProps) => {
  css`
    .hud {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: fixed;
      top: 0;
      right: 0;
      width: 100%;
      background-color: var(--bg-secondary-color);
      border-bottom: 1px solid var(--border-color);
    }
    .header {
      display: flex;
      width: 100%;
      height: 72px;
      padding: 1rem 2rem;
      align-items: center;
      justify-content: space-between;
    }

    .header .left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  `;

  return (
    <div class="hud">
      <div class="header">
        <div class="left">
          <div class="home" onClick={props.toHome}>
            eKeyNox
          </div>
          <Show when={props.gameMode !== GameMode.none}>
            <HeaderNav i18n={props.i18n} mode={props.gameMode} />
          </Show>
        </div>
        {props.children}
      </div>
    </div>
  );
};

export default Header;
