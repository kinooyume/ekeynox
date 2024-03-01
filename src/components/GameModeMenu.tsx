import { css } from "solid-styled";
import { createSignal } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";

import GameCustomParams from "./GameCustomParams";
import GameRandomParams from "./GameRandomParams";
import GameModeCard from "./GameModeCard";
import { GameMode, type GameOptions, type Translator } from "./App";

// Gsap animation
// https://codepen.io/dev_loop/pen/MWKbJmO
// Store like this
// https://codemyui.com/ecommerce-grid-full-screen-product-click/
// select
//https://uiverse.io/3bdel3ziz-T/gentle-vampirebat-46
//
// Bouncing radio
// https://uiverse.io/it12uw/sour-mayfly-77
//
// Clean avec notif
// https://uiverse.io/Pradeepsaranbishnoi/heavy-dragonfly-92
//
// et celui la
// https://uiverse.io/Yaya12085/lucky-fox-35

// https://uiverse.io/Yaya12085/silent-liger-85
//
// take a list and make cards
type GameModeMenuProps = {
  t: Translator;
  setGameMode: (mode: GameMode) => void;
  setContent: (content: string) => void;
  gameOptions: GameOptions;
  setGameOptions: SetStoreFunction<GameOptions>;
};

const GameModeMenu = (props: GameModeMenuProps) => {
  const [gameFocus, setGameFocus] = createSignal<GameMode>(GameMode.none);

  // if data is unresolved
  const setChameleon = (content: string) => {
    props.setContent(content);
    props.setGameMode(GameMode.chameleon);
  };

  const setMonkey = () => {
    // const wordsList = randomWords(data() || [])(words);
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
          <GameRandomParams
            start={setMonkey}
            words={props.gameOptions.wordNumber}
            language={props.gameOptions.language}
            setWords={(words) => props.setGameOptions("wordNumber", words)}
            setLanguage={(language) =>
              props.setGameOptions("language", language)
            }
            t={props.t}
          />
        </GameModeCard>
        <GameModeCard
          {...props.t("gameMode.chameleon")}
          picture="/images/monkey.jpg"
          onClick={() => setGameFocus(GameMode.chameleon)}
          selected={gameFocus() === GameMode.chameleon}
        >
          <GameCustomParams setContent={setChameleon} t={props.t} />
        </GameModeCard>
        <GameModeCard
          {...props.t("gameMode.rabbit")}
          picture="/images/rabbit.jpg"
          onClick={() => setGameFocus(GameMode.rabbit)}
          selected={gameFocus() === GameMode.rabbit}
        >
          <GameCustomParams setContent={setRabbit} t={props.t} />
        </GameModeCard>
      </div>
    </div>
  );
};

export default GameModeMenu;
