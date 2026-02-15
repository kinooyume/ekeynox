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
  getDefaultTypingOptions,
} from "~/typingOptions/typingOptions";

import SourcesGen, {
  SourcesGenFetch,
} from "~/typingContent/SourcesGenCache";

type TypingOptionsProviderProps = {
  children: JSX.Element | JSX.Element[];
};

type TypingOptionsContext = {
  persistedTypingOptions: TypingOptions;
  setPersistedTypingOptions: (opts: TypingOptions) => void;
  fetchSourcesGen: SourcesGenFetch;
};

const typingOptionsContext = createContext<TypingOptionsContext>(
  {} as TypingOptionsContext,
);

export function useTypingOptions() {
  return useContext(typingOptionsContext);
}

export function TypingOptionsProvider(props: TypingOptionsProviderProps) {
  const [typingOptions, setTypingOptions] = createStore<TypingOptions>(
    getDefaultTypingOptions(),
  );

  const noopStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

  const [persistedOptions, setPersistedOptions] = makePersisted(
    createStore<TypingOptions>(getDefaultTypingOptions()),
    { name: "typingOptions", storage: isServer ? noopStorage : localStorage },
  );

  onMount(() => {
    setTypingOptions(persistedOptions);
  });

  const sourcesGen = SourcesGen.create();
  const fetchSourcesGen = isServer
    ? () => Promise.resolve([])
    : sourcesGen.fetch;

  return (
    <typingOptionsContext.Provider
      value={{
        persistedTypingOptions: typingOptions,
        setPersistedTypingOptions: (opts) => {
          setTypingOptions(opts);
          setPersistedOptions(opts);
        },
        fetchSourcesGen,
      }}
    >
      {props.children}
    </typingOptionsContext.Provider>
  );
}
