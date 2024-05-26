import { Title } from "@solidjs/meta";
import { useAppState } from "~/appState/AppStateProvider";
import GameModeMenu from "~/components/gameMode/GameModeMenu";
import { useGameOptions } from "~/gameOptions/GameOptionsProvider";
import { GameOptions } from "~/gameOptions/gameOptions";

export default function Menu() {
  const { gameOptions, setGameOptions, setContentGeneration, getPendingMode } =
    useGameOptions();

  const { navigation } = useAppState();

  const start = (opts: GameOptions, customSource: string) => {
    setGameOptions(opts);
    setGameOptions("custom", customSource);

    // NOTE: ca va pas, on en a fait une fonction side effect
    // alors qu'on veut surtout le start qui ne change pas
    // tout ca a cause du generationSource
    // putain
    navigation.start(getPendingMode());
  };

  return (
    <GameModeMenu
      gameOptions={gameOptions}
      setContentGeneration={setContentGeneration}
      start={start}
    />
  );
}
