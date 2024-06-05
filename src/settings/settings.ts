export const keyboardLayoutName = ["qwerty", "azerty"];
export type KeyboardLayoutName = (typeof keyboardLayoutName)[number];

export const locales = ["en", "fr"];
export type Locale = (typeof locales)[number];

const toLocale = (s: string): Locale | null => (s in locales ? s : null);

const getDefaultLocale = (): Locale => {
  let locale = toLocale(navigator.language.slice(0, 2));
  if (locale) return locale;

  locale = toLocale(navigator.language.toLocaleLowerCase());
  if (locale) return locale;

  return "en";
};

export enum SettingsOriginType {
  auto,
  user,
}

export type SettingsOrigin<T> =
  | {
      kind: SettingsOriginType.auto;
      value: T;
    }
  | {
      kind: SettingsOriginType.user;
      value: T;
    };

export enum Theme {
  light,
  dark,
  auto,
}

export type Settings = {
  theme: SettingsOrigin<Theme>;
  locale: SettingsOrigin<Locale>;
  kb: SettingsOrigin<KeyboardLayoutName>;
  showKb: boolean;
};

const defaultSettings = (): Settings => ({
  theme: { kind: SettingsOriginType.auto, value: Theme.auto },
  locale: { kind: SettingsOriginType.auto, value: "en" },
  kb: { kind: SettingsOriginType.auto, value: "qwerty" },
  showKb: true,
});

const isDarkTheme = (theme: Theme): boolean => {
  switch (theme) {
    case Theme.light:
      return false;
    case Theme.dark:
      return true;
    case Theme.auto:
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
};
export { defaultSettings, getDefaultLocale, isDarkTheme };
