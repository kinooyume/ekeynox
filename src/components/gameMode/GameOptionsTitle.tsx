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
      height: 200px;
      width: 200px;
    }
    .game-title {
      display: flex;
    }
  `;
  return (
    <div class="game-title">
      <div class="picto">
        {gameModes[props.gameOptions.modeSelected].head()}
      </div>
      <div class="title">
        <h1>{`${props.t("gameMode")[props.gameOptions.modeSelected].subtitle}`}</h1>
        <GameOptionsRecap {...props} />
      </div>
    </div>
  );
};

export default GameOptionsTitle;
