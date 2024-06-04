import {
    Accessor,
  JSX,
  createComputed,
  createContext,
  createSignal,
  useContext,
} from "solid-js";

import type { Metrics, MetricsResume } from "../components/metrics/Metrics";
import { AppState, AppStateKind, PendingKind, PendingMode } from "./appState";
import { useLocation, useNavigate } from "@solidjs/router";
import { useGameOptions } from "~/gameOptions/GameOptionsProvider";
import { GameOptions } from "~/gameOptions/gameOptions";

type AppStateProviderProps = {
  children: JSX.Element | JSX.Element[];
};

type AppContext = {
  state: Accessor<AppState>;
  navigation: {
    start: (mode: Promise<PendingMode>, options: GameOptions) => void;
    redo: (
      mode: PendingMode,
      metrics: MetricsResume,
      options: GameOptions,
    ) => void;
    over: (metrics: Metrics, content: PendingMode) => void;
    menu: () => void;
  };
};

const AppStateContext = createContext<AppContext>();

export function useAppState() {
  const appState = useContext(AppStateContext);
  if (appState === undefined) {
    throw new Error("useAppState must be used within a AppStateProvider");
  }
  return appState;
}

export function AppStateProvider(props: AppStateProviderProps) {
  const {
    persistedGameOptions: gameOptions,
    setPersistedGameOptions: setGameOptions,
  } = useGameOptions();

  const { pathname } = useLocation();

  // start
  const getAppState = (): AppState => {
    if (pathname === "/") {
      return { kind: AppStateKind.menu };
    }
    return { kind: AppStateKind.loading };
  };

  const appState: AppState = getAppState();

  const [state, setState] = createSignal<AppState>(appState);

  const setStateGuard = (newState: AppState) => {
    // surement pas bon
    if (state().kind !== newState.kind) setState(newState);
  };

  const navigation = {
    start: (mode: Promise<PendingMode>, options: GameOptions) => {
      setStateGuard({
        kind: AppStateKind.pending,
        status: mode.then((m) => ({ kind: PendingKind.new, mode: m })),
        options: options,
      });
    },
    redo: (mode: PendingMode, metrics: MetricsResume, options: GameOptions) => {
      setStateGuard({
        kind: AppStateKind.pending,
        options: options,
        status: Promise.resolve({
          kind: PendingKind.redo,
          mode,
          prev: metrics,
        }),
      });
    },
    over: (metrics: Metrics, content: PendingMode) => {
      setStateGuard({ kind: AppStateKind.resume, metrics, content });
    },
    menu: () => {
      setStateGuard({ kind: AppStateKind.menu });
    },
  };

  return (
    <AppStateContext.Provider value={{ state, navigation }}>
      {props.children}
    </AppStateContext.Provider>
  );
}
