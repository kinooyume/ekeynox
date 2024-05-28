import {
  JSX,
  Suspense,
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
import { createFetchWords } from "~/components/content/fetchContent";
import { PendingMode } from "~/appState/appState";
import { isServer } from "solid-js/web";

type GameOptionsProviderProps = {
  children: JSX.Element | JSX.Element[];
};

type GameOptionsContext = {
  gameOptions: GameOptions;
  setGameOptions: SetStoreFunction<GameOptions>;
  generationSource: () => string[];
  setContentGeneration: (type: ContentGeneration) => void;
  getPendingMode: () => PendingMode;
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

  // NOTE: find something else for here, don't want server code in the build
  const fetchWords = isServer ? () => [] : createFetchWords();

  const [generationSource, { refetch: refetchGenerationSource }] =
    createResource<string[], ContentGeneration>(contentGeneration, fetchWords, {
      initialValue: [],
    });

  const getPendingMode = () => {
    return optionsToPending(gameOptions, {
      random: generationSource(),
      custom: gameOptions.custom,
    });
  };

  return (
    <gameOptionsContext.Provider
      value={{
        gameOptions,
        setGameOptions,
        setContentGeneration,
        generationSource,
        getPendingMode,
      }}
    >
      <Suspense>{props.children}</Suspense>
    </gameOptionsContext.Provider>
  );
}
