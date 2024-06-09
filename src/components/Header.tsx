import { css } from "solid-styled";

import { type JSXElement } from "solid-js";

import Logo from "./svgs/logo.tsx";
import HeaderSettings from "./HeaderSettings.tsx";
import { useAppState } from "~/appState/AppStateProvider.tsx";
import { useNavigate } from "@solidjs/router";

type HeaderProps = {};

const Header = (props: HeaderProps) => {
  const { navigation } = useAppState();
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

  const navigate = useNavigate();
  return (
    <div class="header">
      <div class="left">
        <div
          class="home"
          onClick={() => {
            navigation.menu();
            navigate("/");
          }}
        >
          <Logo />
        </div>
      </div>
      <div class="center">
        <div id="header-nav-actions-portal"></div>
      </div>
      <div class="right">
        <HeaderSettings />
      </div>
    </div>
  );
};

export default Header;

// cool magnet menu selection, + custom cursor
// https://codepen.io/dev_loop/pen/KKdEgdz
