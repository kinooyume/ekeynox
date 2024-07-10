import { Portal } from "solid-js/web";
import { css } from "solid-styled";
import { useAppState } from "~/appState/AppStateProvider";
import GameModeMenu from "~/components/gameMode/GameModeMenu";
import ModalAbout from "~/components/modals/ModalAbout";
import Modal from "~/components/ui/Modal";
import QuestionMark from "~/components/ui/QuestionMark";
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
    <div>
      <GameModeMenu
        gameOptions={persistedGameOptions}
        fetchSourcesGen={fetchSourcesGen}
        start={start}
      />
      <Portal mount={document.getElementById("header-nav-actions-portal")!}>
        <div
          class="info"
          style={{
            display: "flex",
            gap: "4px",
          }}
        >
          <span
            class="version"
            style={{
              "font-weight": 200,
              color: "var(--text-secondary-color)",
            }}
          >
            Alpha 0.13-3 ·
          </span>
          <Modal
            portalId="modal-portal"
            openAnimation={[]}
            childrenTarget={[
              ".modal-about-content p",
              ".modal-about-content h2",
              ".modal-about-content .animate",
            ]}
            closeAnimation={[]}
            button={(isOpen, toggle) => (
              <QuestionMark
                onClick={toggle}
                colorVariable="text-secondary-color"
              />
            )}
          >
            <ModalAbout />
          </Modal>
        </div>
      </Portal>
    </div>
  );
}
