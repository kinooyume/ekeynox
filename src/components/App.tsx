import { css } from "solid-styled";
import {
  Match,
  Show,
  Suspense,
  Switch,
  createMemo,
  createResource,
  createSignal,
} from "solid-js";
import { createStore } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage";
import { Transition } from "solid-transition-group";

/* i18n */
import * as i18n from "@solid-primitives/i18n";

import type * as en from "../i18n/en.json";
import en_dict from "../i18n/en.json";
import fr_dict from "../i18n/fr.json";

/* *** */

import Header from "./Header";
import HeaderAction from "./HeaderAction";
import { fetchWords } from "./content/fetchContent";
import { makeGetContent } from "./content/TypingGameSource";
import GameModeMenu from "./gameSelection/GameModeMenu";
import TypingGame from "./typing/TypingGame";
import {
  ContentTypeKind,
  GameModeKind,
  WordsGenerationCategory,
  type GameOptions,
  NumberSelectionType,
  getDefaultGameOptions,
  type ContentGeneration,
  GameStatusKind,
  type GameStatus,
} from "./gameSelection/GameOptions";

const dictionaries = {
  en: en_dict,
  fr: fr_dict,
};

// NOTE: i18n should be a context, but I can't make it work
// probably due to astro, so it will stay like this for now

export type Locale = "en" | "fr";
export type RawDictionary = typeof en;

export type Dictionary = i18n.Flatten<RawDictionary>;
export type Translator = i18n.Translator<Dictionary>;

export type I18nContext = {
  t: Translator;
};

export type Kb = "qwerty" | "azerty";

export type Config = {
  dark: boolean;
  locale: Locale;
  kb: Kb;
};

export type ConfigLists = {
  locale: Locale[];
  kb: Kb[];
};

const configLists: ConfigLists = {
  locale: ["en", "fr"],
  kb: ["qwerty", "azerty"],
};

const App = () => {
  const [config, setConfig] = makePersisted(
    createStore<Config>({
      dark: window.matchMedia("(prefers-color-scheme: dark)").matches,
      locale: "en",
      kb: "qwerty",
    }),
    { name: "config" },
  );
  /* i18n */
  const dict = createMemo(() => i18n.flatten(dictionaries[config.locale]));
  const t = i18n.translator(dict);
  const i18nContext: I18nContext = { t };
  /* *** */

  const [gameOptions, setGameOptions] = makePersisted(
    createStore<GameOptions>(getDefaultGameOptions(), { name: "gameOptions" }),
  );

  const [contentGeneration, setContentGeneration] =
    createSignal<ContentGeneration>(gameOptions.generation);

  const [randomSource] = createResource(contentGeneration, fetchWords);

  const start = (opts: GameOptions, customSource: string) => {
    setGameOptions(opts);
    setGameOptions("custom", customSource);
    const content = makeGetContent(opts, {
      random: randomSource() || [],
      custom: customSource,
    });
    setGameStatus({ kind: GameStatusKind.pending, content });
  };

  const [gameStatus, setGameStatus] = createSignal<GameStatus>({
    kind: GameStatusKind.menu,
  });

  css`
    .app {
      display: grid;
      margin: 0;
      min-height: 100%;
      background-color: var(--color-surface-100);
    }
    main {
      margin-top: 96px;
      display: grid;
      grid-template-columns:
        1fr
        min(1400px, 100%)
        1fr;
      grid-template-rows: 1f;
    }
  `;
  return (
    <div class="app" classList={{ dark: config.dark }}>
      <Header
        i18n={i18nContext}
        toHome={() => setGameStatus({ kind: GameStatusKind.menu })}
      >
        <HeaderAction
          config={config}
          setConfig={setConfig}
          configLists={configLists}
        />
      </Header>
      <main>
        <Transition
          onEnter={(el, done) => {
            const a = el.animate([{ opacity: 0 }, { opacity: 1 }], {
              duration: 300,
            });
            a.finished.then(done);
          }}
          onExit={(el, done) => {
            const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
              duration: 0,
            });
            a.finished.then(done);
          }}
        >
          <Switch>
            <Match when={gameStatus().kind === GameStatusKind.menu}>
              <GameModeMenu
                t={t}
                gameOptions={gameOptions}
                setContentGeneration={setContentGeneration}
                start={start}
              />
            </Match>
            <Match when={gameStatus().kind === GameStatusKind.pending}>
              <Suspense>
                <Show when={randomSource()}>
                  <TypingGame
                    t={t}
                    contentMode={(gameStatus() as any).content}
                    currentGameOptions={Object.assign({}, gameOptions)}
                    setGameOptions={setGameOptions}
                    kb={config.kb}
                  />
                </Show>
              </Suspense>
            </Match>
          </Switch>
        </Transition>
      </main>
    </div>
  );
};

export default App;
