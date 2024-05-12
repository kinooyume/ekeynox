import { css } from "solid-styled";
import type { GameOptions } from "./GameOptions";
import type { Translator } from "../App";
import GameOptionsRecap from "./GameOptionsRecap";
import { gameModes } from "./GameMode";

type GameOptionsTitleProps = {
  t: Translator;
  gameOptions: GameOptions;
};

const GameOptionsTitle = (props: GameOptionsTitleProps) => {
  css`
    .picto {
      width: 180px;
    }
    .game-title {
      display: flex;
      gap: 26px;
      align-items: center;
    }
    .title {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 25px;
    }
    h1 {
      font-size: 42px;
      font-weight: 100;
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
