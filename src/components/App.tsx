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

/* i18n */
import * as i18n from "@solid-primitives/i18n";

import type * as en from "../i18n/en.json";
import en_dict from "../i18n/en.json";
import fr_dict from "../i18n/fr.json";

/* *** */

import Header from "./Header";
import GameModeMenu from "./GameModeMenu";
import TypingGame from "./TypingGame";
import { createStore } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage";
import HeaderAction from "./HeaderAction";
import { fetchWords } from "./fetchContent";
import { randomWords, randomQuote } from "./randomContent";
import Content, { type ContentData } from "./Content";
import { Transition } from "solid-transition-group";

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

export enum NumberSelectionType {
  selected,
  custom,
}

export type NumberSelection =
  | { type: NumberSelectionType.selected; value: number }
  | { type: NumberSelectionType.custom; value: number };

export enum WordsCategory {
  words1k = "words1k",
  quotes = "quotes",
  custom = "custom",
}

export type Languages = "en" | "fr";

export enum GameMode {
  monkey = "monkey",
  rabbit = "rabbit",
}

export type GameModePending = GameMode | "none";
export type GameOptions = {
  lastGameMode: GameMode;
  wordNumber: NumberSelection;
  wordsCategory: WordsCategory;
  time: NumberSelection;
  language: Languages;
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

  const [gameOptions, setGameOptions] = makePersisted(
    createStore<GameOptions>(
      {
        lastGameMode: GameMode.monkey,
        wordNumber: { type: NumberSelectionType.selected, value: 10 },
        time: { type: NumberSelectionType.selected, value: 10 },
        wordsCategory: WordsCategory.words1k,
        language: "en",
      },
      { name: "gameOptions" },
    ),
  );

  const [data] = createResource(
    () => ({
      language: gameOptions.language,
      wordsCategory: gameOptions.wordsCategory,
    }),
    fetchWords,
  );
  /* i18n */
  const dict = createMemo(() => i18n.flatten(dictionaries[config.locale]));
  const t = i18n.translator(dict);
  const i18nContext: I18nContext = { t };
  /* *** */

  const [gameMode, setGameMode] = createSignal<GameModePending>("none");
  const [content, setContent] = createSignal<string>("");

  const getSource = (wordNumber: number): (() => ContentData) => {
    switch (gameOptions.wordsCategory) {
      case WordsCategory.words1k:
        return () => Content.parseWords(randomWords(data() || [])(wordNumber));
      case WordsCategory.quotes:
        return () => Content.parse(randomQuote(data() || []));
      case WordsCategory.custom:
        return () => Content.parse(content());
    }
  };

  const getMonkeySource = (): (() => ContentData) =>
    getSource(gameOptions.wordNumber.value);

  css``;
  return (
    <div class="app" classList={{ dark: config.dark }}>
      <Header
        i18n={i18nContext}
        toHome={() => setGameMode("none")}
        gameMode={gameMode()}
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
            <Match when={gameMode() === "none"}>
              <GameModeMenu
                t={t}
                setGameMode={setGameMode}
                setContent={setContent}
                setGameOptions={setGameOptions}
                gameOptions={gameOptions}
              />
            </Match>
            <Match when={gameMode() === GameMode.monkey}>
              <Suspense>
                <Show when={data()}>
                  <TypingGame
                    i18n={i18nContext}
                    kb={config.kb}
                    getContent={getMonkeySource()}
                  />
                </Show>
              </Suspense>
            </Match>
            <Match when={gameMode() === GameMode.rabbit}>
              <Suspense>
                <Show when={data()}>
                  <TypingGame
                    i18n={i18nContext}
                    kb={config.kb}
                    timer={gameOptions.time.value * 1000}
                    getContent={getSource(gameOptions.time.value * 4)}
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
