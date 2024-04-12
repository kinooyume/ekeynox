import { css } from "solid-styled";

import { GameStatusKind, type GameStatus, type Translator } from "./App.tsx";
import HeaderMode from "./HeaderMode.tsx";
import { Show, type JSXElement } from "solid-js";

import Logo from "./svgs/logo.tsx";
import type {
  ContentGeneration,
  GameOptions,
} from "./gameMode/GameOptions.ts";
import type { SetStoreFunction } from "solid-js/store";

type HeaderProps = {
  t: Translator;
  toHome: () => void;
  gameStatus: GameStatus;
  gameOptions: GameOptions;
  setGameOptions: SetStoreFunction<GameOptions>;
  setContentGeneration: (type: ContentGeneration) => void;
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
      align-items: center;
      justify-content: space-between;
      height: 72px;
      padding: 1rem 2rem;
      background-color: var(--bg-secondary-color);
    }

    .header .left {
      display: flex;
      align-items: center;
      gap: 36px;
    }
  `;

  return (
    <div class="header">
      <div class="left">
        <div class="home" onClick={props.toHome}>
          <Logo />
        </div>
        <Show when={props.gameStatus.kind === GameStatusKind.pending}>
          <HeaderMode
            t={props.t}
            gameOptions={props.gameOptions}
            content={(props.gameStatus as any).content}
            setGameOptions={props.setGameOptions}
            setContentGeneration={props.setContentGeneration}
          />
        </Show>
      </div>
      {props.children}
    </div>
  );
};

export default Header;
