import DarkModeToggle from "./ui/DarkModeToggle.tsx";
import KeyboardIcon from "./svgs/keyboardIcon.tsx";
import GlobeIcon from "./svgs/globe.tsx";
import TinySelect from "./ui/TinySelect.tsx";
import type { SetStoreFunction } from "solid-js/store";
import { css } from "solid-styled";
import { useSettings } from "~/settings/SettingsProvider.tsx";
import { Theme, keyboardLayoutName, locales } from "~/settings/settings.ts";

const HeaderAction = () => {
  const settings = useSettings();
  css`
    .actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  `;
  return (
    <div class="actions">
      <TinySelect
        list={keyboardLayoutName}
        selected={settings[0].kb}
        action={(s) => settings[1]("kb", s)}
      >
        <KeyboardIcon />
      </TinySelect>
      <TinySelect
        list={locales}
        selected={settings[0].locale}
        action={(s) => settings[1]("locale", s)}
      >
        <GlobeIcon />
      </TinySelect>
      <div class="toggle">
        <DarkModeToggle
          dark={settings[0].theme === Theme.dark}
          setTheme={(theme) => settings[1]("theme", theme)}
        />
      </div>
    </div>
  );
};

export default HeaderAction;
