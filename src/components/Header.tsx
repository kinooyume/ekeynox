import { css } from "solid-styled";

import KeyboardIcon from "./ui/keyboard.tsx";
import GlobeIcon from "./ui/globe.tsx";
import DarkModeToggle from "./DarkModeToggle";
import type { I18nContext } from "./App.tsx";

type HeaderProps = {
  i18n: I18nContext
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
    .actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }
    .globe {
      padding-top: 2px;
    }
    .keyboard,
    .globe {
      cursor: pointer;
      fill: var(--text-secondary-color);
    }

    .keyboard:hover,
    .globe:hover {
      fill: var(--text-color);
    }
  `;

  return (
    <div class="hud">
      <div class="header">
        <a href="/">eKeyNox</a>
        <div class="actions">
          <div class="keyboard">
            <KeyboardIcon />
          </div>
          <div class="globe">
            <GlobeIcon />
          </div>
          <div class="toggle">
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
