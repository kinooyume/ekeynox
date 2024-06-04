import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import { createComputed, on } from "solid-js";
import { useAppState } from "~/appState/AppStateProvider";
import GameModeMenu from "~/components/gameMode/GameModeMenu";
import { useGameOptions } from "~/gameOptions/GameOptionsProvider";
import {
  CategoryKind,
  GameOptions,
  optionsToPending,
} from "~/gameOptions/gameOptions";

export default function Menu() {
  const { persistedGameOptions, setPersistedGameOptions, fetchSourcesGen } =
    useGameOptions();

  const { navigation } = useAppState();

  const navigate = useNavigate();

  const start = (opts: GameOptions, customSource: string) => {
    setPersistedGameOptions(opts);
    setPersistedGameOptions("custom", customSource);

    const sourcesGen = fetchSourcesGen(opts.generation);
    const pendingMode = optionsToPending(opts, sourcesGen);

    navigation.start(pendingMode, persistedGameOptions);
    navigate("/typing");
  };

  return (
    <GameModeMenu
      gameOptions={persistedGameOptions}
      fetchSourcesGen={fetchSourcesGen}
      start={start}
    />
  );
}
