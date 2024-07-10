import { useAppState } from "~/appState/AppStateProvider";
import { clientOnly } from "@solidjs/start";

import { useGameOptions } from "~/gameOptions/GameOptionsProvider";
import { useSettings } from "~/settings/SettingsProvider";
import {
  Match,
  Show,
  Switch,
  createResource,
  onMount,
} from "solid-js";
import { useNavigate } from "@solidjs/router";

import KeyboardLayout from "../settings/keyboardLayout.ts";
import {
  AppStateKind,
  PendingState,
  ResumeState,
} from "~/appState/appState.ts";
import {
  GameOptions,
  deepCopy,
  optionsToPending,
} from "~/gameOptions/gameOptions.ts";

import TypingGameManager from "~/components/typing/TypingGameManager";

//import TypingMetricsResume from "~/components/resume/TypingMetricsResume";
// import ActionsResume from "~/components/resume/ActionsResume";

const ClientResume = clientOnly(() => import("~/components/resume/TypingMetricsResume"));
const ClientActionsResume = clientOnly(() => import("~/components/resume/ActionsResume"));

export default function Typing() {
  const { state, mutation } = useAppState();
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
              kbLayout={KeyboardLayout.create(settings.kb.value)}
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
          kbLayout={KeyboardLayout.create(settings.kb.value)}
          metrics={(state() as ResumeState).metrics}
        >
          {(metricsResume) => (
            <ClientActionsResume
              gameOptions={deepCopy(persistedGameOptions)}
              content={(state() as ResumeState).content}
              fetchSourcesGen={fetchSourcesGen}
              metrics={(state() as ResumeState).metrics}
              metricsResume={metricsResume}
              start={start}
              redo={(mode, metrics, opts) => {
                mutation.redo(mode, metrics, opts);
              }}
            />
          )}
        </ClientResume>
      </Match>
    </Switch>
  );
}
