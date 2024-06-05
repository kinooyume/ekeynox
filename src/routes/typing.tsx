import { useAppState } from "~/appState/AppStateProvider";
import { clientOnly } from "@solidjs/start";

import KeyboardLayout from "../settings/keyboardLayout.ts";
import { useGameOptions } from "~/gameOptions/GameOptionsProvider";
import { useSettings } from "~/settings/SettingsProvider";
import { AppStateKind, PendingState } from "~/appState/appState.ts";
import { GameOptions, optionsToPending } from "~/gameOptions/gameOptions.ts";
import { Show, createResource, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";

// const ClientGameManager = clientOnly(
//   () => import("~/components/typing/TypingGameManager"),
// );

import TypingGameManager from "~/components/typing/TypingGameManager";

export default function Typing() {
  const { state, navigation } = useAppState();
  const navigate = useNavigate();
  const { persistedGameOptions, setPersistedGameOptions, fetchSourcesGen } =
    useGameOptions();

  const [pendingStatus] = createResource(state, (s) => {
    console.log("PEN  Ng");
    return s.kind === AppStateKind.pending ? s.status : undefined;
  });

  const start = (opts: GameOptions) => {
    setPersistedGameOptions(opts);

    console.log("start")
    const sourcesGen = fetchSourcesGen(opts.generation);
    const pendingMode = optionsToPending(opts, sourcesGen);

    navigation.start(pendingMode, opts);
  };

  onMount(() => {
    if (!(state().kind === AppStateKind.pending)) {
      start(persistedGameOptions);
    }
  });

  const [settings] = useSettings();

  return (
    <Show when={state().kind === AppStateKind.pending}>
      <Show when={pendingStatus.state === "ready" && pendingStatus()}>
        <TypingGameManager
          status={pendingStatus()!}
          start={start}
          fetchSourcesGen={fetchSourcesGen}
          gameOptions={(state() as PendingState).options}
          showKb={settings.showKb}
          kbLayout={KeyboardLayout.create(settings.kb)}
          onExit={() => {
            navigation.menu();
            navigate("/");
          }}
          onOver={navigation.over}
        />
      </Show>
    </Show>
  );
}
