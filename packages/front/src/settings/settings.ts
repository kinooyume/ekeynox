import { KeyboardLayoutName } from "~/typingKeyboard/keyboardLayout";

export const locales = ["en", "fr"];
export type Locale = (typeof locales)[number];

export type LocaleToKeyboard = Record<Locale, KeyboardLayoutName>;

export const localeToKeyboard: LocaleToKeyboard = {
  en: "qwerty",
  fr: "azerty",
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
const toLocale = (s: string): Locale | null => (locales.includes(s) ? s : null);

const getDefaultLocale = (): Locale | null => {
  let locale = toLocale(navigator.language.slice(0, 2));
  if (locale) return locale;

  locale = toLocale(navigator.language.toLocaleLowerCase());
  if (locale) return locale;

  return null;
};

const getKeyboardByLocale = (locale: Locale): KeyboardLayoutName | null =>
  localeToKeyboard[locale] || null;

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
export { defaultSettings, getDefaultLocale, isDarkTheme, getKeyboardByLocale };
