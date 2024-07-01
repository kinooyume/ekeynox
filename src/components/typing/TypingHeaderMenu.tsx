import { css } from "solid-styled";
import GameModeDropdown from "../gameMode/GameModeDropdown";
import GameOptionsRecap from "../gameMode/GameOptionsRecap";
import { Show } from "solid-js";
import { ContentGeneration, GameOptions } from "~/gameOptions/gameOptions";
import { useI18n } from "~/settings/i18nProvider";

type HeaderNavLeftProps = {
  start: (opts: GameOptions) => void;
  gameOptions: GameOptions;
};

const HeaderNavLeft = (props: HeaderNavLeftProps) => {
  const t = useI18n();
  css`
    .header-mode {
      height: 48px;
      display: flex;
      gap: 18px;
    }

    .options-recap {
      display: flex;
    }

    .menu-title {
      display: flex;
      font-size: 18px;
      filter: grayscale(20%);
      opacity: 0.8;
      overflow: hidden;
      position: relative;
      width: 100%;
      height: 30px;
      max-height: 40px;
      padding: 8px;
      padding-left: 20px;
      align-items: center;
      cursor: pointer;
      content: attr(data-passive);
    }

    .menu-title:before {
      position: absolute;
      color: var(--text-secondary-color);
      content: attr(data-passive);
      top: 50%;
      transform: translateY(-50%);
      transition: all 0.2s ease;
    }

    .menu-title:after {
      display: inline-block;
      width: 200px;
      position: absolute;
      color: var(--text-secondary-color);
      top: 150px;
      content: attr(data-active);
      transition: all 0.3s ease;
    }

    .menu-title.open {
      font-size: 19px;
      filter: none;
      opacity: 1;
    }

    menu-title.open:before {
      content: "";
      opacity: 0;
      transition: none;
      display: none;
    }

    .menu-title.hover {
      filter: none;
      opacity: 1;
    }
    .menu-title.hover:before {
      top: -50%;
      transform: rotate(5deg);
    }

    .menu-title.open:before {
      opacity: 0;
    }

    .menu-title.hover:after,
    .menu-title.open:after {
      top: 50%;
      transform: translateY(-50%);
    }

    .cursor {
      corsor: pointer;
      position: absolute;
      right: 16px;
      top: 14px;
      pointer-events: none;
      color: var(--background-color);
      color: var(--text-secondary-color);
      transition: all 0.2s ease-in-out;
      z-index: 206;
    }
  `;

  return (
    <div class="header-mode animate">
      <GameModeDropdown {...props}>
        {(isOpen, hover) => (
          <div
            class="menu-title"
            classList={{ hover: hover(), open: isOpen() }}
            data-passive={`${t("gameMode")[props.gameOptions.modeSelected].subtitle}`}
            data-active={`${t("newGame.one")} ${t("newGame.two")}`}
          >
            <Show when={!isOpen()}>
              <span class="cursor">▼</span>
            </Show>
          </div>
        )}
      </GameModeDropdown>
      <div class="options-recap">
        <GameOptionsRecap gameOptions={props.gameOptions} />
      </div>
    </div>
  );
};

export default HeaderNavLeft;
