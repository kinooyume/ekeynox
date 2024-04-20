import type { SetStoreFunction } from "solid-js/store";
import type { Translator } from "../App";
import type { ContentGeneration, GameOptions } from "../gameMode/GameOptions";
import type { GameModeContent } from "../content/TypingGameSource";
import HeaderNavLeft from "./TypingHeaderNavLeft";
import { css } from "solid-styled";

type TypingHeaderNavProps = {
  t: Translator;
  gameOptions: GameOptions;
  setGameOptions: SetStoreFunction<GameOptions>;
  setContentGeneration: (type: ContentGeneration) => void;
  content: GameModeContent;
};

const TypingHeaderNav = (props: TypingHeaderNavProps) => {
  css`
    .header-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      border-left: 2px solid var(--border-color);
      border-right: 2px solid var(--border-color);
    }
  `;

  return (
    <div class="header-nav">
      <div class="left">
        <HeaderNavLeft {...props} />
      </div>
      <div class="right">
        <div id="header-nav-actions-portal"></div>
      </div>
    </div>
  );
};

export default TypingHeaderNav;
