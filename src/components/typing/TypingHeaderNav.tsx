import type { SetStoreFunction } from "solid-js/store";
import TypingHeaderMenu from "./TypingHeaderMenu";
import { css } from "solid-styled";
import { ContentGeneration, GameOptions } from "~/gameOptions/gameOptions";
import { PendingMode } from "~/appState/appState";
import TypingHeaderActions from "./TypingHeaderActions";
import { JSX } from "solid-js";

type TypingHeaderNavProps = {
  start: (opts: GameOptions) => void;
  gameOptions: GameOptions;
  fetchSourcesGen: (opts: ContentGeneration) => Promise<Array<string>>;
  children: JSX.Element | JSX.Element[];
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
        {props.children}
      </div>
    </div>
  );
};

export default TypingHeaderNav;
