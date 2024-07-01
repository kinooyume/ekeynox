import { useAppState } from "~/appState/AppStateProvider";
import GameModeMenu from "~/components/gameMode/GameModeMenu";
import { useGameOptions } from "~/gameOptions/GameOptionsProvider";

import { GameOptions, optionsToPending } from "~/gameOptions/gameOptions";

export default function Menu() {
  const { persistedGameOptions, setPersistedGameOptions, fetchSourcesGen } =
    useGameOptions();

  const { mutation: navigation } = useAppState();

  const start = (opts: GameOptions) => {
    setPersistedGameOptions(opts);

    const sourcesGen = fetchSourcesGen(opts.generation);
    const pendingMode = optionsToPending(opts, sourcesGen);

    navigation.start(pendingMode, persistedGameOptions);
  };

  return (
    <GameModeMenu
      gameOptions={persistedGameOptions}
      fetchSourcesGen={fetchSourcesGen}
      start={start}
    />
  );
}
