import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";
import { isServer } from "solid-js/web";
import { useAppState } from "~/appState/AppStateProvider";
import GameModeMenu from "~/components/gameMode/GameModeMenu";
import { useGameOptions } from "~/gameOptions/GameOptionsProvider";

import { GameOptions, optionsToPending } from "~/gameOptions/gameOptions";

export default function Menu() {
  const { persistedGameOptions, setPersistedGameOptions, fetchSourcesGen } =
    useGameOptions();

  const { navigation } = useAppState();

  const navigate = useNavigate();

  const start = (opts: GameOptions) => {
    setPersistedGameOptions(opts);

    const sourcesGen = fetchSourcesGen(opts.generation);
    const pendingMode = optionsToPending(opts, sourcesGen);

    navigation.start(pendingMode, persistedGameOptions);
    // navigate("/typing");
  };

  return (
    <GameModeMenu
      gameOptions={persistedGameOptions}
      fetchSourcesGen={fetchSourcesGen}
      start={start}
    />
  );
}
