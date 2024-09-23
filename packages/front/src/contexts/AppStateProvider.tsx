import {
  Accessor,
  JSX,
  createComputed,
  createContext,
  createEffect,
  createSignal,
  useContext,
} from "solid-js";

import type { Metrics, MetricsResume } from "../components/metrics/Metrics";
import {
  AppState,
  AppStateKind,
  PendingKind,
  PendingMode,
  PendingStatusNew,
  PendingStatusRedo,
} from "../appState/appState";
import { useLocation } from "@solidjs/router";
import { GameOptions, deepCopy } from "~/gameOptions/gameOptions";

type AppStateProviderProps = {
  children: JSX.Element | JSX.Element[];
};

type AppContext = {
  state: Accessor<AppState>;
  mutation: {
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
  const appState: AppState = { kind: AppStateKind.loading };

  const [state, setState] = createSignal<AppState>(appState);

  const mutation = {
    start: (mode: Promise<PendingMode>, options: GameOptions) => {
      setState({
        kind: AppStateKind.pending,
        options: options,
        status: mode.then(
          (m) => ({ kind: PendingKind.new, mode: m }) as PendingStatusNew,
        ),
      });
    },
    redo: (mode: PendingMode, metrics: MetricsResume, options: GameOptions) => {
      setState({
        kind: AppStateKind.pending,
        options: deepCopy(options),
        status: Promise.resolve({
          kind: PendingKind.redo,
          mode,
          prev: metrics,
        } as PendingStatusRedo),
      });
    },
    over: (metrics: Metrics, content: PendingMode) => {
      setState({ kind: AppStateKind.resume, metrics, content });
    },
    menu: () => {
      setState({ kind: AppStateKind.menu });
    },
  };

  return (
    <AppStateContext.Provider value={{ state, mutation }}>
      {props.children}
    </AppStateContext.Provider>
  );
}
