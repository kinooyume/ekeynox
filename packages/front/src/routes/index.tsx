import { Portal } from "solid-js/web";
import { useAppState } from "~/contexts/AppStateProvider";
import { useGameOptions } from "~/contexts/GameOptionsProvider";

import { GameOptions, optionsToPending } from "~/typingOptions/gameOptions";
import GameModeMenu from "~/components/gameMode/GameModeMenu";
import About from "~/components/about/About";

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
    <div>
      <GameModeMenu
        gameOptions={persistedGameOptions}
        fetchSourcesGen={fetchSourcesGen}
        start={start}
      />
      <Portal mount={document.getElementById("header-nav-actions-portal")!}>
        <About />
      </Portal>
    </div>
  );
}
