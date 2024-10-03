import { css } from "solid-styled";
import GameOptionsRecap from "./TypingOptionsRecap";
import { typingModes } from "~/typingOptions/typingMode";
import { Translator } from "~/contexts/i18nProvider";
import { TypingOptions } from "~/typingOptions/typingOptions";

type GameOptionsTitleProps = {
  t: Translator;
  gameOptions: TypingOptions;
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
        {typingModes[props.gameOptions.modeSelected].smile()}
      </div>
      <div class="title">
        <h1>{`${props.t("typingMode")[props.gameOptions.modeSelected].subtitle}`}</h1>
        <GameOptionsRecap {...props} />
      </div>
    </div>
  );
};

export default GameOptionsTitle;
