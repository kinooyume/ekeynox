import { css } from "solid-styled";
import GameModeCard from "./GameModeCard";
import { GameMode, type Translator } from "./App";
import { createSignal } from "solid-js";
import GameCustomParams from "./GameCustomParams";

// take a list and make cards
type GameModeMenuProps = {
  t: Translator;
  setGameMode: (mode: GameMode) => void;
  setContent: (content: string) => void;
};

const GameModeMenu = (props: GameModeMenuProps) => {
  const [gameFocus, setGameFocus] = createSignal<GameMode>(GameMode.none);

  const setChameleon = (content: string) => {
    props.setContent(content);
    props.setGameMode(GameMode.chameleon);
  };

  const setMonkey = (content: string) => {
    props.setContent(content);
    props.setGameMode(GameMode.monkey);
  };

  const setRabbit = (content: string) => {
    props.setContent(content);
    props.setGameMode(GameMode.rabbit);
  };
  css`
    .game-menu {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }
  `;
  return (
    <div class="menu">
      <div class="game-menu">
        <GameModeCard
          {...props.t("gameMode.monkey")}
          picture="/images/monkey.jpg"
          onClick={() => setGameFocus(GameMode.monkey)}
          selected={gameFocus() === GameMode.monkey}
        >
          <GameCustomParams setContent={setMonkey} />
        </GameModeCard>
        <GameModeCard
          {...props.t("gameMode.chameleon")}
          picture="/images/monkey.jpg"
          onClick={() => setGameFocus(GameMode.chameleon)}
          selected={gameFocus() === GameMode.chameleon}
        >
          <GameCustomParams setContent={setChameleon} />
        </GameModeCard>
        <GameModeCard
          {...props.t("gameMode.rabbit")}
          picture="/images/rabbit.jpg"
          onClick={() => setGameFocus(GameMode.rabbit)}
          selected={gameFocus() === GameMode.rabbit}
        >
          <GameCustomParams setContent={setRabbit} />
        </GameModeCard>
      </div>
    </div>
  );
};

export default GameModeMenu;
