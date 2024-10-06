import {
  Accessor,
  JSX,
  createContext,
  createSignal,
  useContext,
} from "solid-js";

import { type TypingOptions, deepCopy } from "~/typingOptions/typingOptions";
import { type TypingTypingOptions } from "~/typingOptions/typingTypingOptions";

import {
  AppStateKind,
  PendingKind,
  type AppState,
  type PendingStatusNew,
} from "~/states";
import { TypingStatistics, TypingStatisticsResult } from "~/typingStatistics";

type AppMutation = {
  start: (mode: Promise<TypingTypingOptions>, options: TypingOptions) => void;
  redo: (
    mode: TypingTypingOptions,
    statisticsResult: TypingStatisticsResult,
    options: TypingOptions,

  ) => void;
  over: (statistics: TypingStatistics, content: TypingTypingOptions) => void;
  menu: () => void;
  login: () => void;
};
type AppContext = {
  state: Accessor<AppState>;
  mutation: AppMutation;
};

const AppStateContext = createContext<AppContext>();

export function useAppState() {
  const appState = useContext(AppStateContext);
  if (appState === undefined) {
    throw new Error("useAppState must be used within a AppStateProvider");
  }
  return appState;
}

type Props = {
  children: JSX.Element | JSX.Element[];
};

export function AppStateProvider(props: Props) {
  const appState: AppState = { kind: AppStateKind.loading };

  const [state, setState] = createSignal<AppState>(appState);

  const mutation: AppMutation = {
    start: (mode, options) => {
      setState({
        kind: AppStateKind.pending,
        options: options,
        status: mode.then(
          (m) => ({ kind: PendingKind.new, mode: m }) as PendingStatusNew,
        ),
      });
    },
    redo: (mode, metrics, options) => {
      setState({
        kind: AppStateKind.pending,
        options: deepCopy(options),
        status: Promise.resolve({
          kind: PendingKind.redo,
          mode,
          prev: metrics,
        }),
      });
    },
    over: (statistics, content: TypingTypingOptions) => {
      setState({ kind: AppStateKind.resume, statistics, content });
    },
    menu: () => {
      setState({ kind: AppStateKind.menu });
    },
    login: () => {
      setState({ kind: AppStateKind.login });
    },
  };

  return (
    <AppStateContext.Provider value={{ state, mutation }}>
      {props.children}
    </AppStateContext.Provider>
  );
}
