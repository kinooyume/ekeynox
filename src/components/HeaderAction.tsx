import DarkModeToggle from "./ui/DarkModeToggle.tsx";
import KeyboardIcon from "./svgs/keyboardIcon.tsx";
import GlobeIcon from "./svgs/globe.tsx";
import TinySelect from "./ui/TinySelect.tsx";
import type { SetStoreFunction } from "solid-js/store";
import { css } from "solid-styled";
import { useSettings } from "~/settings/SettingsProvider.tsx";
import {
  SettingsOriginType,
  Theme,
  keyboardLayoutName,
  locales,
} from "~/settings/settings.ts";

const HeaderAction = () => {
  const { settings, setSettings } = useSettings();
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
        selected={settings.kb.value}
        action={(s) =>
          setSettings("kb", { kind: SettingsOriginType.user, value: s })
        }
      >
        <KeyboardIcon />
      </TinySelect>
      <TinySelect
        list={locales}
        selected={settings.locale.value}
        action={(s) =>
          setSettings("locale", { kind: SettingsOriginType.user, value: s })
        }
      >
        <GlobeIcon />
      </TinySelect>
      <div class="toggle">
        <DarkModeToggle
          dark={settings.theme.value === Theme.dark}
          setTheme={(s) =>
            setSettings("theme", { kind: SettingsOriginType.user, value: s })
          }
        />
      </div>
    </div>
  );
};

export default HeaderAction;
