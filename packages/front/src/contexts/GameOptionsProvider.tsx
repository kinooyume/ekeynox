import {
  JSX,
  createContext,
  onMount,
  useContext,
} from "solid-js";

import { makePersisted } from "@solid-primitives/storage";
import { createStore } from "solid-js/store";
import { isServer } from "solid-js/web";

import {
  TypingOptions,
  getDefaultGameOptions,
} from "~/typingOptions/typingOptions";

import SourcesGen, {
  SourcesGenFetch,
} from "~/typingContent/SourcesGenCache";

type GameOptionsProviderProps = {
  children: JSX.Element | JSX.Element[];
};

type GameOptionsContext = {
  persistedGameOptions: TypingOptions;
  setPersistedGameOptions: (opts: TypingOptions) => void;
  fetchSourcesGen: SourcesGenFetch;
};

const gameOptionsContext = createContext<GameOptionsContext>(
  {} as GameOptionsContext,
);

export function useGameOptions() {
  return useContext(gameOptionsContext);
}

export function GameOptionsProvider(props: GameOptionsProviderProps) {
  const [gameOptions, setGameOptions] = createStore<TypingOptions>(
    getDefaultGameOptions(),
  );

  const [persistedOptions, setPersistedOptions] = makePersisted(
    createStore<TypingOptions>(getDefaultGameOptions()),
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
