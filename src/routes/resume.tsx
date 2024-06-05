import ActionsResume from "~/components/resume/ActionsResume";
import TypingMetricsResume from "~/components/resume/TypingMetricsResume";
import KeyboardLayout from "../settings/keyboardLayout.ts";
import { useAppState } from "~/appState/AppStateProvider.tsx";
import { useSettings } from "~/settings/SettingsProvider.tsx";
import { useGameOptions } from "~/gameOptions/GameOptionsProvider.tsx";
import { GameOptions, optionsToPending } from "~/gameOptions/gameOptions.ts";
import { useNavigate } from "@solidjs/router";
import { AppStateKind, ResumeState } from "~/appState/appState.ts";
import { Show } from "solid-js";

export default function Resume() {
  const { state, navigation } = useAppState();
  const navigate = useNavigate();
  const { persistedGameOptions, setPersistedGameOptions, fetchSourcesGen } =
    useGameOptions();
  const [settings] = useSettings();

  const start = (opts: GameOptions) => {
    setPersistedGameOptions(opts);

    const sourcesGen = fetchSourcesGen(opts.generation);
    const pendingMode = optionsToPending(opts, sourcesGen);

    navigation.start(pendingMode, opts);
    navigate("/typing");
  };

  if (state().kind !== AppStateKind.resume) {
    navigate("/");
  }

  return (
    <Show when={state().kind === AppStateKind.resume}>
      <TypingMetricsResume
        kbLayout={KeyboardLayout.create(settings.kb)}
        metrics={(state() as ResumeState).metrics}
      >
        {(metricsResume) => (
          <ActionsResume
            gameOptions={persistedGameOptions}
            content={(state() as ResumeState).content}
            fetchSourcesGen={fetchSourcesGen}
            metrics={(state() as ResumeState).metrics}
            metricsResume={metricsResume}
            start={start}
            redo={navigation.redo}
          />
        )}
      </TypingMetricsResume>
    </Show>
  );
}
