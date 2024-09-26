export const keyboardLayoutName = ["qwerty", "azerty"];
export type KeyboardLayoutName = (typeof keyboardLayoutName)[number];

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
