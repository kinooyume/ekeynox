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
import Tooltip from "./ui/Tooltip.tsx";
import VerticalRadioBox from "./ui/VerticalRadioBox.tsx";
import { useI18n } from "~/settings/i18nProvider.tsx";
import SettingMenu from "./settings/SettingMenu.tsx";
import VerticalDropdown from "./ui/VerticalDropdown.tsx";

const HeaderAction = () => {

  const t = useI18n();
  const { settings, setSettings, dark } = useSettings();
  css`
    .actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  `;
  return (
    <ul class="actions">
      <VerticalDropdown label={
        <Tooltip content={<p>{settings.kb.value}</p>}>
          <KeyboardIcon />
        </Tooltip>
      }>
        <SettingMenu title={t("keyboard")}>
          <VerticalRadioBox
            title={t("layout")}
            list={keyboardLayoutName}
            selected={settings.kb.value}
            onClick={(s) =>
              setSettings("kb", { kind: SettingsOriginType.user, value: s })
            }
          /></SettingMenu></VerticalDropdown>
      <VerticalDropdown label={
        <Tooltip content={<p>{settings.locale.value}</p>}>
          <GlobeIcon />
        </Tooltip>
      }>
        <SettingMenu title={t("language")}>
          <VerticalRadioBox
            list={locales}
            selected={settings.locale.value}
            onClick={(s) =>
              setSettings("locale", { kind: SettingsOriginType.user, value: s })
            }
          /></SettingMenu></VerticalDropdown>
      <div class="toggle">
        <DarkModeToggle
          dark={dark()}
          setTheme={(s) => {
            const theme = s ? Theme.dark : Theme.light;
            setSettings("theme", {
              kind: SettingsOriginType.user,
              value: theme,
            });
          }}
        />
      </div>
    </ul>
  );
};

export default HeaderAction;
