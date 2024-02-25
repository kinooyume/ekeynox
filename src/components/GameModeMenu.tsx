import { css } from "solid-styled";
import GameModeCard, { type GameModeCardProps } from "./GameModeCard";

// take a list and make cards
type GameModeMenuProps = {
  gameModes: Array<GameModeCardProps>;
};

const GameModeMenu = (props: GameModeMenuProps) => {
  css`
    .menu {
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
      {props.gameModes.map((mode) => (
        <GameModeCard {...mode} />
      ))}
    </div>
  );
};

export default GameModeMenu;
