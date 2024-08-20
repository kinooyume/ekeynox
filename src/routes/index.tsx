import { Portal } from "solid-js/web";
import { emptyAnimationChildren } from "~/animations/animation";
import About from "~/components/about/About";
import ContactForm from "~/components/about/AboutContactForm";
import AboutInfo from "~/components/about/AboutInfo";
import GameModeMenu from "~/components/gameMode/GameModeMenu";
import Modal from "~/components/ui/Modal";
import Morphing from "~/components/ui/Morphing";
import QuestionMark from "~/components/ui/QuestionMark";
import { useAppState } from "~/contexts/AppStateProvider";
import { useGameOptions } from "~/contexts/GameOptionsProvider";

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
