import type { SetStoreFunction } from "solid-js/store";
import type { Translator } from "../App";
import type { ContentGeneration, GameOptions } from "../gameMode/GameOptions";
import TypingHeaderMenu from "./TypingHeaderMenu";
import { css } from "solid-styled";
import type { PendingMode } from "../AppState";

type TypingHeaderNavProps = {
  t: Translator;
  start: (opts: GameOptions, customSource: string) => void;
  gameOptions: GameOptions;
  setGameOptions: SetStoreFunction<GameOptions>;
  setContentGeneration: (type: ContentGeneration) => void;
  content: PendingMode;
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
        <TypingHeaderMenu {...props} />
      </div>
      <div class="right">
        <div id="header-nav-actions-portal"></div>
      </div>
    </div>
  );
};

export default TypingHeaderNav;
