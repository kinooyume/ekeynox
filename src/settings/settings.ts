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

export enum Theme {
  light,
  dark,
  auto,
}

export type Settings = {
  theme: Theme;
  locale: Locale;
  kb: KeyboardLayoutName;
  showKb: boolean;
};

export const defaultSettings = (): Settings => ({
  theme: Theme.auto,
  locale: "en",
  kb: "qwerty",
  showKb: true,
});

// dark: window.matchMedia("(prefers-color-scheme: dark)").matches,
