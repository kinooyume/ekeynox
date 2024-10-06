import { Portal } from "solid-js/web";
import { useAppState } from "~/contexts/AppStateProvider";
import { useTypingOptions } from "~/contexts/TypingOptionsProvider";

import { TypingOptions, optionsToPending } from "~/typingOptions/typingOptions";
import TypingModeMenu from "~/components/typingMode/TypingModeMenu";
import About from "~/components/about/About";

export default function Menu() {
  const { persistedTypingOptions: persistedGameOptions, setPersistedTypingOptions, fetchSourcesGen } =
    useTypingOptions();

  const { mutation: navigation } = useAppState();

  const start = (opts: TypingOptions) => {
    setPersistedTypingOptions(opts);

    const sourcesGen = fetchSourcesGen(opts.generation);
    const pendingMode = optionsToPending(opts, sourcesGen);

    navigation.start(pendingMode, persistedGameOptions);
  };

  return (
    <div class="index-wrapper">
      <TypingModeMenu
        typingOptions={persistedGameOptions}
        fetchSourcesGen={fetchSourcesGen}
        start={start}
      />
      <Portal mount={document.getElementById("header-nav-actions-portal")!}>
        <About />
      </Portal>
    </div>
  );
}
