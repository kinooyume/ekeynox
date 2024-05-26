import {
  JSX,
  createComputed,
  createContext,
  createSignal,
  useContext,
} from "solid-js";
import type { Metrics, MetricsResume } from "../components/metrics/Metrics";
import { AppState, AppStateKind, PendingKind, PendingMode } from "./appState";
import { useLocation, useNavigate } from "@solidjs/router";

type AppStateProviderProps = {
  children: JSX.Element | JSX.Element[];
};

type AppContext = {
  state: () => AppState;
  navigation: {
    start: (mode: PendingMode) => void;
    redo: (mode: PendingMode, metrics: MetricsResume) => void;
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
  // NOTE: no default without initial root
  // ==> Menu, ou typing
  // ==> Redirect to typing if
  const [state, setState] = createSignal<AppState>({ kind: AppStateKind.menu });

  const navigation = {
    start: (mode: PendingMode) => {
      setState({
        kind: AppStateKind.pending,
        data: { kind: PendingKind.new, mode },
      });
    },
    redo: (mode: PendingMode, metrics: MetricsResume) => {
      setState({
        kind: AppStateKind.pending,
        data: { kind: PendingKind.redo, mode, prev: metrics },
      });
    },
    over: (metrics: Metrics, content: PendingMode) => {
      setState({ kind: AppStateKind.resume, metrics, content });
    },
    menu: () => {
      setState({ kind: AppStateKind.menu });
    },
  };

  const navigate = useNavigate();
  createComputed(
    () => {
      switch (state().kind) {
        case AppStateKind.menu:
          navigate("/");
          break;
        case AppStateKind.pending:
          console.log(JSON.stringify(state()));
          navigate("/typing");
          break;
        case AppStateKind.resume:
          navigate("/resume");
          break;
      }
      // On veut surement ici une redirection
    },
    { defer: true },
  );

  return (
    <AppStateContext.Provider value={{ state, navigation }}>
      {props.children}
    </AppStateContext.Provider>
  );
}
