import {
  JSX,
  Resource,
  ResourceActions,
  ResourceFetcher,
  ResourceReturn,
  Suspense,
  createComputed,
  createContext,
  createResource,
  createSignal,
  onMount,
  useContext,
} from "solid-js";
import {
  ContentGeneration,
  GameOptions,
  getDefaultGameOptions,
  optionsToPending,
} from "./gameOptions";
import { makePersisted } from "@solid-primitives/storage";
import { SetStoreFunction, createStore } from "solid-js/store";
import { PendingMode } from "~/appState/appState";
import { isServer } from "solid-js/web";
import SourcesGen, {
  SourcesGenFetch,
  type SourcesGenCache,
} from "~/components/content/SourcesGenCache";

type GameOptionsProviderProps = {
  children: JSX.Element | JSX.Element[];
};

type GameOptionsContext = {
  persistedGameOptions: GameOptions;
  setPersistedGameOptions: (opts: GameOptions) => void;
  fetchSourcesGen: SourcesGenFetch;
};

const gameOptionsContext = createContext<GameOptionsContext>(
  {} as GameOptionsContext,
);

export function useGameOptions() {
  return useContext(gameOptionsContext);
}

export function GameOptionsProvider(props: GameOptionsProviderProps) {
  const [gameOptions, setGameOptions] = createStore<GameOptions>(
    getDefaultGameOptions(),
  );

  const [persistedOptions, setPersistedOptions] = makePersisted(
    createStore<GameOptions>(getDefaultGameOptions()),
    { name: "gameOptions" },
  );

  onMount(() => {
    setGameOptions(persistedOptions);
  });

  const sourcesGen = SourcesGen.create();
  const fetchSourcesGen = isServer
    ? () => Promise.resolve([])
    : sourcesGen.fetch;

  return (
    <gameOptionsContext.Provider
      value={{
        persistedGameOptions: gameOptions,
        setPersistedGameOptions: (opts) => {
          setGameOptions(opts);
          setPersistedOptions(opts);
        },
        fetchSourcesGen,
      }}
    >
      {props.children}
    </gameOptionsContext.Provider>
  );
}
