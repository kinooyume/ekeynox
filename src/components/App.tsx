import * as i18n from "@solid-primitives/i18n";
// use `type` to not include the actual dictionary in the bundle
import type * as en from "../../public/i18n/en.json";
import { createResource, createSignal } from "solid-js";

export type Locale = "en" | "fr";
export type RawDictionary = typeof en;

export type Dictionary = i18n.Flatten<RawDictionary>;

async function fetchDictionary(locale: Locale): Promise<Dictionary> {
  const dict: RawDictionary = (await import(`../../public/i18n/${locale}.ts`))
    .dict;
  return i18n.flatten(dict); // flatten the dictionary to make all nested keys available top-level
}

const App = () => {
  const [locale, setLocale] = createSignal<Locale>("en");

  // https://www.solidjs.com/tutorial/stores_context
  const [dict] = createResource(locale, fetchDictionary);

  dict(); // => Dictionary
}

export default App;
