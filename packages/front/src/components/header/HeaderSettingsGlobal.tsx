import { Accessor, JSXElement } from "solid-js";

export type ListSettings = {
  id: string;
  Icon: () => JSXElement;
  tooltip: () => string;
  title: () => string;
  List: () => JSXElement;
};

export type DarkModeSettings = {
  value: Accessor<boolean>;
  set: (dark: boolean) => void;
};

export type SettingsUI = {
  keyboard: ListSettings;
  langue: ListSettings;
  darkMode: DarkModeSettings;
};
