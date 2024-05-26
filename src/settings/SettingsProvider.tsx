import * as storage from "@solid-primitives/storage";
import { JSX, createContext, useContext } from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";
import { Settings, defaultSettings } from "./settings";
import { I18nProvider } from "./i18nProvider";
import { KeyboardProvider } from "./KeyboardProvider";

const settingsContext = createContext<[Settings, SetStoreFunction<Settings>]>([
  {} as Settings,
  () => {},
]);

export function useSettings() {
  return useContext(settingsContext);
}

export function SettingsProvider(props: {
  children: JSX.Element | JSX.Element[];
}) {
  // NOTE: a voir si on peut le mettre en dehors de la fonction
  const settings = storage.makePersisted(createStore(defaultSettings()), {
    name: "settings",
  });
  return (
    <settingsContext.Provider value={settings}>
      <I18nProvider locale={settings[0].locale}>{props.children}</I18nProvider>
    </settingsContext.Provider>
  );
}
