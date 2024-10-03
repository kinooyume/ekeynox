import { css } from "solid-styled";
import GameOptionsRecap from "./GameOptionsRecap";
import { gameModes } from "~/typingOptions/GameMode";
import { Translator } from "~/contexts/i18nProvider";
import { GameOptions } from "~/typingOptions/gameOptions";

type GameOptionsTitleProps = {
  t: Translator;
  gameOptions: GameOptions;
};

const GameOptionsTitle = (props: GameOptionsTitleProps) => {
  css`
    .picto {
      width: 130px;
    }
    .game-title {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 26px;
    }
    .title {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    h1 {
      font-size: 32px;
      font-weight: 200;
      margin: 0;
    }
  `;
  return (
    <div class="game-title">
      <div class="picto">
        {gameModes[props.gameOptions.modeSelected].smile()}
      </div>
      <div class="title">
        <h1>{`${props.t("gameMode")[props.gameOptions.modeSelected].subtitle}`}</h1>
        <GameOptionsRecap {...props} />
      </div>
    </div>
  );
};

export default GameOptionsTitle;
