import { Match, Show, Switch, createResource, onMount } from "solid-js";
import { clientOnly } from "@solidjs/start";
import { useNavigate } from "@solidjs/router";

import { useGameOptions } from "~/contexts/GameOptionsProvider";
import { useSettings } from "~/contexts/SettingsProvider";
import { useAppState } from "~/contexts/AppStateProvider.tsx";

import { AppStateKind, PendingState, ResumeState } from "~/states";

import {
  TypingOptions,
  deepCopy,
  optionsToPending,
} from "~/typingOptions/typingOptions.ts";

import TypingGameManager from "~/components/typing/TypingGameManager";
import keyboardLayout from "~/typingKeyboard/keyboardLayout";

const ClientResume = clientOnly(
  () => import("~/components/statistics/TypingStatisticsResume"),
);
const ClientActionsResume = clientOnly(
  () => import("~/components/statistics/ActionsResume"),
);

export default function Typing() {
  const { state, mutation } = useAppState();
  const navigate = useNavigate();
  const { persistedGameOptions, setPersistedGameOptions, fetchSourcesGen } =
    useGameOptions();

  const [pendingStatus] = createResource(state, (s) => {
    return s.kind === AppStateKind.pending ? s.status : undefined;
  });

  const start = (opts: TypingOptions) => {
    setPersistedGameOptions(opts);

    const sourcesGen = fetchSourcesGen(opts.generation);
    const pendingMode = optionsToPending(opts, sourcesGen);

    mutation.start(pendingMode, opts);
  };

  onMount(() => {
    if (!(state().kind === AppStateKind.pending)) {
      start(persistedGameOptions);
    }
  });

  const { settings } = useSettings();

  return (
    <Switch>
      <Match when={state().kind === AppStateKind.pending} keyed>
        <Show when={pendingStatus.state === "ready" && pendingStatus()} keyed>
          <Show when={(state() as PendingState).options} keyed>
            <TypingGameManager
              status={pendingStatus()!}
              start={start}
              gameOptions={(state() as PendingState).options}
              showKb={settings.showKb}
              kbLayout={keyboardLayout(settings.kb.value)}
              onExit={() => {
                mutation.menu();
                navigate("/");
              }}
              onOver={mutation.over}
            />
          </Show>
        </Show>
      </Match>
      <Match when={state().kind === AppStateKind.resume} keyed>
        <ClientResume
          kbLayout={keyboardLayout(settings.kb.value)}
          metrics={(state() as ResumeState).statistics}
        >
          {(metricsResume) => (
            <ClientActionsResume
              gameOptions={deepCopy(persistedGameOptions)}
              content={(state() as ResumeState).content}
              fetchSourcesGen={fetchSourcesGen}
              metrics={(state() as ResumeState).statistics}
              metricsResume={metricsResume}
              start={start}
              redo={mutation.redo}
            />
          )}
        </ClientResume>
      </Match>
    </Switch>
  );
}
