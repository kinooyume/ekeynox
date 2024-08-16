import * as i18n from "@solid-primitives/i18n";

import type * as DictionaryType from "../i18n/en.json";

export type RawDictionary = typeof DictionaryType;

import en_dict from "../i18n/en.json";
import fr_dict from "../i18n/fr.json";

import { JSX, createContext, createMemo, useContext } from "solid-js";
import { Locale } from "./settings";

// https://github.com/solidjs/solid-site/blob/cbbbe43a40272d8a78cb94ad81a17d7128912304/src/AppContext.tsx

type Dictionaries = Record<Locale, RawDictionary>;

// TODO: simple read file in folder
const dictionaries: Dictionaries = {
  en: en_dict,
  fr: fr_dict,
};

export type Dictionary = i18n.Flatten<RawDictionary>;
export type Translator = i18n.Translator<Dictionary>;

type I18nProviderProps = {
  locale: Locale;
  children: JSX.Element | JSX.Element[];
};

// TODO: check when undefined 
const i18nContext = createContext<Translator>({} as Translator);

export function useI18n() {
  return useContext(i18nContext);
}

export function I18nProvider(props: I18nProviderProps) {
  const dict = createMemo(() => i18n.flatten(dictionaries[props.locale]));
  const t = i18n.translator(dict);
  return (
    <i18nContext.Provider value={t}>{props.children}</i18nContext.Provider>
  );
}
