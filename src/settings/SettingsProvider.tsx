import * as storage from "@solid-primitives/storage";
import { trackStore } from "@solid-primitives/deep";
import {
  Accessor,
  JSX,
  createComputed,
  createContext,
  createSignal,
  on,
  onMount,
  useContext,
} from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";
import {
  Settings,
  SettingsOriginType,
  Theme,
  defaultSettings,
  getDefaultLocale,
  getKeyboardByLocale,
  isDarkTheme,
} from "./settings";
import { I18nProvider } from "./i18nProvider";
import { KeyboardProvider } from "./KeyboardProvider";

type SettingsProviderProps = {
  settings: Settings;
  dark: Accessor<boolean>;
  setSettings: SetStoreFunction<Settings>;
};

const settingsContext = createContext<SettingsProviderProps>(
  {} as SettingsProviderProps,
);

export function useSettings() {
  return useContext(settingsContext);
}

export function SettingsProvider(props: {
  children: JSX.Element | JSX.Element[];
}) {
  const [settings, setSettings] = createStore(defaultSettings());
  const [dark, setDark] = createSignal(false);

  const [persistedSettings, setPersistedSettings] = storage.makePersisted(
    createStore(defaultSettings()),
    {
      name: "settings",
    },
  );

  onMount(() => {
    createComputed(() => {
      trackStore(persistedSettings);
      setSettings(persistedSettings);
    });

    createComputed(() => {
      setDark(isDarkTheme(settings.theme.value));
    });

    createComputed(() => {
      document.getElementsByTagName("html")[0].dataset.theme = dark()
        ? "dark"
        : "light";
    });

    createComputed(() => {
      if (settings.locale.kind === SettingsOriginType.auto) {
        const locale = getDefaultLocale();
        if (locale)
          setPersistedSettings("locale", {
            kind: SettingsOriginType.auto,
            value: locale,
          });
      }
      if (settings.kb.kind === SettingsOriginType.auto) {
        const kbLayout = getKeyboardByLocale(settings.locale.value);
        if (kbLayout)
          setPersistedSettings("kb", {
            kind: SettingsOriginType.auto,
            value: kbLayout,
          });
      }
    });
  });

  return (
    <settingsContext.Provider
      value={{
        settings,
        dark,
        setSettings: setPersistedSettings,
      }}
    >
      <I18nProvider locale={settings.locale.value}>
        {props.children}
      </I18nProvider>
    </settingsContext.Provider>
  );
}
