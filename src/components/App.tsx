import { css } from "solid-styled";
import {
  Match,
  Show,
  Suspense,
  Switch,
  createComputed,
  createMemo,
  createResource,
  createSignal,
} from "solid-js";
import { createStore } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage";
import { Transition } from "solid-transition-group";

import Header from "./Header";
import HeaderAction from "./HeaderAction";
import { createFetchWords } from "./content/fetchContent";
import GameModeMenu from "./gameMode/GameModeMenu";
import {
  type GameOptions,
  getDefaultGameOptions,
  type ContentGeneration,
} from "./gameMode/GameOptions";
import type { Metrics, MetricsResume } from "./metrics/Metrics";
import TypingMetricsResume from "./resume/TypingMetricsResume";
import KeyboardLayout, { type HigherKeyboard } from "./keyboard/KeyboardLayout";
import TypingHeaderNav from "./typing/TypingHeaderNav";

/* NOTE:  Refacto: fileReader in one given folder
 * PERF: i18n Dictionaries, KeyboardLayout
 * 
 *
export type Kb = "qwerty" | "azerty"; // NOTE: also in folder,
export type Locale = "en" | "fr"; // NOTE: also in folder,

* ==> Comment qu'on fait ?

* Parce que du coup on pourrait avoir un

const locales = Record<string, RawDictionary>  #i18n
const dictionaries = Record<string, Dictionary>

typeof dictionaries ?
typeof keyof dictionaries ?
 
 */

/* i18n */
// NOTE: i18n should be a context, but I can't make it work
// probably due to astro, so it will stay like this for now

import * as i18n from "@solid-primitives/i18n";

import type * as DictionaryType from "../i18n/en.json";

export type RawDictionary = typeof DictionaryType;

import en_dict from "../i18n/en.json";
import fr_dict from "../i18n/fr.json";
import {
  AppStateKind,
  type AppState,
  PendingKind,
  type PendingMode,
  makePendingMode,
} from "./AppState";
import TypingGameManager from "./typing/TypingGameManager";
import ActionsResume from "./resume/ActionsResume";

type Dictionaries = Record<string, RawDictionary>;

// TODO: simple read file in folder
const dictionaries: Dictionaries = {
  en: en_dict,
  fr: fr_dict,
};

export type Dictionary = i18n.Flatten<RawDictionary>;
export type Translator = i18n.Translator<Dictionary>;

export type I18nContext = {
  t: Translator;
};

/* *** */

/* Config: Keybord & Locale */

export type Kb = "qwerty" | "azerty";
export type Locale = "en" | "fr"; // NOTE: also in folder,

export type Config = {
  dark: boolean;
  locale: Locale;
  kb: Kb;
  showKb: boolean;
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
      // dark: window.matchMedia("(prefers-color-scheme: dark)").matches,
      dark: false,
      locale: "en",
      kb: "qwerty",
      showKb: true,
    }),
    { name: "config" },
  );
  /* i18n */
  const dict = createMemo(() => i18n.flatten(dictionaries[config.locale]));
  const t = i18n.translator(dict);
  const i18nContext: I18nContext = { t };
  /* *** */

  /* Keyboard */
  const [kbLayout, setKbLayout] = createSignal<HigherKeyboard>(
    KeyboardLayout.create(config.kb),
  );

  // prev createEffect
  createComputed(() => {
    setKbLayout(() => KeyboardLayout.create(config.kb));
  });

  /* *** */

  /* Keep the rest inside, here */

  /* Content Generation & GameOptions */

  /* Ca, c'est la save (makePersisted)
   * Qu'on veut mettre a jours uniquement quand une nouvelle partie est lancé
   * => Depuis Menu
   * => Depuis headerMode la
   * => et tiny game menu
   */

  const [persistedOptions, setPersistedOptions] = makePersisted(
    createStore<GameOptions>(getDefaultGameOptions(), { name: "gameOptions" }),
  );

  /* Contente Generation */
  // On veut etendre ce fonctionnement au clavier, et pitetre locales
  //
  // const [generation, setGeneration] = createSignal<ContentGeneration>(
  //   persistedOptions.generation,
  // );

  const [contentGeneration, setContentGeneration] =
    createSignal<ContentGeneration>(persistedOptions.generation);

  const fetchWords = createFetchWords();
  const [generationSource, { refetch: refetchGenerationSource }] =
    createResource<string[], ContentGeneration>(contentGeneration, fetchWords, {
      initialValue: [],
    });

  /* *** */

  /* Game Status */

  const [AppState, setAppState] = createSignal<AppState>({
    kind: AppStateKind.menu,
  });

  const over = (metrics: Metrics, content: PendingMode) => {
    setAppState({ kind: AppStateKind.resume, metrics, content });
  };

  const goHome = () => setAppState({ kind: AppStateKind.menu });

  /* Pending */

  const redo = (mode: PendingMode, metrics: MetricsResume) => {
    setAppState({
      kind: AppStateKind.pending,
      data: { kind: PendingKind.redo, mode, prev: metrics },
    });
  };

  const start = async (opts: GameOptions, customSource: string) => {
    const mode = makePendingMode(opts, {
      random: generationSource(),
      custom: customSource,
    });

    setPersistedOptions(opts);
    setPersistedOptions("custom", customSource);

    setAppState({
      kind: AppStateKind.pending,
      data: { kind: PendingKind.new, mode },
    });
  };

  /* *** */

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
        t={i18nContext.t}
        toHome={() => setAppState({ kind: AppStateKind.menu })}
        actions={
          <HeaderAction
            config={config}
            setConfig={setConfig}
            configLists={configLists}
          />
        }
      >
        <Show when={AppState().kind === AppStateKind.pending} keyed>
          <TypingHeaderNav
            t={i18nContext.t}
            start={start}
            gameOptions={persistedOptions}
            content={(AppState() as any).data.content}
            setGameOptions={setPersistedOptions}
            setContentGeneration={setContentGeneration}
          />
        </Show>
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
            <Match when={AppState().kind === AppStateKind.menu}>
              <GameModeMenu
                t={t}
                gameOptions={persistedOptions}
                setContentGeneration={setContentGeneration}
                start={start}
              />
            </Match>
            <Match
              when={AppState().kind === AppStateKind.pending && AppState()}
              keyed
            >
              <Suspense>
                <TypingGameManager
                  t={t}
                  status={(AppState() as any).data}
                  setPending={setAppState}
                  gameOptions={persistedOptions}
                  showKb={config.showKb}
                  kbLayout={kbLayout()}
                  onExit={goHome}
                  onOver={over}
                />
              </Suspense>
            </Match>
            <Match when={AppState().kind === AppStateKind.resume}>
              <TypingMetricsResume
                t={t}
                kbLayout={kbLayout()}
                metrics={(AppState() as any).metrics}
              >
                {(metricsResume) => (
                  <ActionsResume
                    t={t}
                    gameOptions={persistedOptions}
                    content={(AppState() as any).content}
                    metrics={(AppState() as any).metrics}
                    metricsResume={metricsResume}
                    setContentGeneration={setContentGeneration}
                    start={start}
                    redo={redo}
                  />
                )}
              </TypingMetricsResume>
            </Match>
          </Switch>
        </Transition>
      </main>
    </div>
  );
};

export default App;

/* *** */
// inspiration: https://learnhub.top/
//
//

// css grid animation
//https://codepen.io/t_afif/pen/WNzxeOO

// https://codepen.io/t_afif/pen/WNzxeOO
//https://css-tricks.com/animating-css-grid-how-to-examples/
//
//Anime js
//
// https://devsnap.me/anime-js-examples
//
// https://github.com/alikinvv/stepper-iteration
// Svg Morphing
//
// Coo animation
// https://codepen.io/fitzsyke/pen/pKdYyE
//
// Card flip
// https://codepen.io/hellomp/pen/ZvrmdN
//
// BOOM effect
// https://codepen.io/alexzaworski/pen/mEZvrG
//
// Sliding rebound
// https://codepen.io/ershad989/pen/LYVbvmj
