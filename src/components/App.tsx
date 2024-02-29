/* i18n */
import * as i18n from "@solid-primitives/i18n";

import type * as en from "../i18n/en.json";
import en_dict from "../i18n/en.json";
import fr_dict from "../i18n/fr.json";

/* *** */
import { css } from "solid-styled";
import { Match, Switch, createMemo, createSignal } from "solid-js";

import Header from "./Header";
import GameModeMenu from "./GameModeMenu";
import TypingGame from "./TypingGame";

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
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translator;
};

export enum GameMode {
  monkey,
  rabbit,
  chameleon,
  none,
}

const App = () => {
  /* i18n */
  const [locale, setLocale] = createSignal<Locale>("en");
  const dict = createMemo(() => i18n.flatten(dictionaries[locale()]));
  const t = i18n.translator(dict);
  const i18nContext: I18nContext = { locale: locale(), setLocale, t };
  /* *** */

  const [gameMode, setGameMode] = createSignal<GameMode>(GameMode.none);
  const [content, setContent] = createSignal<string>("");

  css``;
  return (
    <div class="app">
      <Header
        i18n={i18nContext}
        toHome={() => setGameMode(GameMode.none)}
        gameMode={gameMode()}
      />
      <Switch>
        <Match when={gameMode() === GameMode.none}>
          <GameModeMenu
            t={t}
            setGameMode={setGameMode}
            setContent={setContent}
          />
        </Match>
        <Match when={gameMode() === GameMode.monkey}>
          <TypingGame source={content()} />
        </Match>
        <Match when={gameMode() === GameMode.chameleon}>
          <TypingGame source={content()} />
        </Match>
        <Match when={gameMode() === GameMode.rabbit}>
          <TypingGame source={content()} />
        </Match>
      </Switch>
    </div>
  );
};

export default App;
