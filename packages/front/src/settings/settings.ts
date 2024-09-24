import { KeyboardLayoutName, Locale, locales, localeToKeyboard, Settings, SettingsOriginType, Theme } from "common/settings"

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

// NOTE: on veut quand meme avoir white ou black, pour les themes
// chart.js

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
