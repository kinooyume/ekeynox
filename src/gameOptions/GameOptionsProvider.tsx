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
  setPersistedGameOptions: SetStoreFunction<GameOptions>;
  fetchSourcesGen: SourcesGenFetch;
};

const gameOptionsContext = createContext<GameOptionsContext>(
  {} as GameOptionsContext,
);

export function useGameOptions() {
  return useContext(gameOptionsContext);
}

export function GameOptionsProvider(props: GameOptionsProviderProps) {
  const [gameOptions, setGameOptions] = makePersisted(
    createStore<GameOptions>(getDefaultGameOptions()),
    { name: "gameOptions" },
  );

  const [contentGeneration, setContentGeneration] =
    createSignal<ContentGeneration>(gameOptions.generation);

  const sourcesGen = SourcesGen.create();
  const fetchSourcesGen = isServer
    ? () => Promise.resolve([])
    : sourcesGen.fetch;

  // const [generationSource, { refetch: refetchSource }] = createResource<
  //   string[],
  //   ContentGeneration
  // >(contentGeneration, fetchWords, {
  //   initialValue: [],
  // });

  const [currentSource, setCurrentSource] = createSignal<string[]>();

  // const [pendingMode, setPendingMode] = createSignal<PendingMode>();
  //
  // createComputed(() => {
  //   setPendingMode(
  //     optionsToPending(gameOptions, {
  //       random: generationSource(),
  //       custom: gameOptions.custom,
  //     }),
  //   );
  // });

  return (
    <gameOptionsContext.Provider
      value={{
        persistedGameOptions: gameOptions,
        setPersistedGameOptions: setGameOptions,
        fetchSourcesGen,
      }}
    >
      {props.children}
    </gameOptionsContext.Provider>
  );
}
