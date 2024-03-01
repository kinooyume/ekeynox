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
import { randomWords, randomQuote } from "./RandomWords";

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

export type GameOptions = {
  wordNumber: NumberSelection;
  wordsCategory: WordsCategory;
  time: NumberSelection;
  language: Languages;
};

export enum GameMode {
  monkey,
  rabbit,
  none,
}

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

  const [gameMode, setGameMode] = createSignal<GameMode>(GameMode.none);
  const [content, setContent] = createSignal<string>("");

  const getSource = (wordNumber: number): string => {
    switch (gameOptions.wordsCategory) {
      case "words1k":
        return randomWords(data() || [])(wordNumber);
      case "quotes":
        return randomQuote(data() || []);
      case "custom":
        return content();
    }
    return "";
  };

  const getMonkeySource = (): string => getSource(gameOptions.wordNumber.value)

  css``;
  return (
    <div class="app" classList={{ dark: config.dark }}>
      <Header
        i18n={i18nContext}
        toHome={() => setGameMode(GameMode.none)}
        gameMode={gameMode()}
      >
        <HeaderAction
          config={config}
          setConfig={setConfig}
          configLists={configLists}
        />
      </Header>
      <main>
        <Switch>
          <Match when={gameMode() === GameMode.none}>
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
                  source={getMonkeySource()}
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
                  source={getSource(50)}
                />
              </Show>
            </Suspense>
          </Match>
        </Switch>
      </main>
    </div>
  );
};

export default App;
