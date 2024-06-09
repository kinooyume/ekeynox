import { useAppState } from "~/appState/AppStateProvider";
import { clientOnly } from "@solidjs/start";


import { useGameOptions } from "~/gameOptions/GameOptionsProvider";
import { useSettings } from "~/settings/SettingsProvider";
import { Match, Show, Switch, createResource, lazy, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";

import KeyboardLayout from "../settings/keyboardLayout.ts";
import { AppStateKind, PendingState, ResumeState } from "~/appState/appState.ts";
import { GameOptions, optionsToPending } from "~/gameOptions/gameOptions.ts";

// const ClientGameManager = clientOnly(
//   () => import("~/components/typing/TypingGameManager"),
// );

import TypingGameManager from "~/components/typing/TypingGameManager";

import TypingMetricsResume from "~/components/resume/TypingMetricsResume";
import ActionsResume from "~/components/resume/ActionsResume";

// const LazyMetricsResume = lazy(() => import("~/components/resume/TypingMetricsResume"));
// const LazyActionsResume = lazy(() => import("~/components/resume/ActionsResume"));

export default function Typing() {
  const { state, navigation } = useAppState();
  const navigate = useNavigate();
  const { persistedGameOptions, setPersistedGameOptions, fetchSourcesGen } =
    useGameOptions();

  const [pendingStatus] = createResource(state, (s) => {
    return s.kind === AppStateKind.pending ? s.status : undefined;
  });

  const start = (opts: GameOptions) => {
    setPersistedGameOptions(opts);

    const sourcesGen = fetchSourcesGen(opts.generation);
    const pendingMode = optionsToPending(opts, sourcesGen);

    navigation.start(pendingMode, opts);
  };

  onMount(() => {
    if (!(state().kind === AppStateKind.pending)) {
      start(persistedGameOptions);
    }
  });

  const { settings } = useSettings();

  return (
    <Switch>
      <Match when={state().kind === AppStateKind.pending}>
        <Show when={pendingStatus.state === "ready" && pendingStatus()}>
          <TypingGameManager
            status={pendingStatus()!}
            start={start}
            fetchSourcesGen={fetchSourcesGen}
            gameOptions={(state() as PendingState).options}
            showKb={settings.showKb}
            kbLayout={KeyboardLayout.create(settings.kb.value)}
            onExit={() => {
              navigation.menu();
              navigate("/");
            }}
            onOver={(m, c) => {
              navigation.over(m, c);
              // navigate("/resume");
            }}
          />
        </Show>
      </Match>
      <Match when={state().kind === AppStateKind.resume}>
        <TypingMetricsResume
          kbLayout={KeyboardLayout.create(settings.kb.value)}
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
      </Match>
    </Switch>
  );
}
