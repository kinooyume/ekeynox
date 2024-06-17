import DarkModeToggle from "./ui/DarkModeToggle.tsx";
import KeyboardIcon from "./svgs/keyboardIcon.tsx";
import GlobeIcon from "./svgs/globe.tsx";
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

    .subtitle {
      font-size: 15px;
      font-weight: 600;
      margin-top: 0;
      color: var(--text-secondary-color);
      opacity: 0.9;
      text-transform: capitalize;
    }

    .sub-content {
    }

    label {
      color: var(--text-secondary-color);
    }
    .opt {
      margin: 0;
      color: var(--text-secondary-color);
      text-transform: capitalize;
    }

    input[type="checkbox"] {
      margin: 0;
    }
  `;
  return (
    <ul class="actions">
      <VerticalDropdown
        label={
          <Tooltip content={<p>{settings.kb.value}</p>}>
            <KeyboardIcon />
          </Tooltip>
        }
      >
        <SettingMenu title={t("keyboard")}>
          <div class="sub-content">
            <p class="subtitle">{t("layout")}</p>
            <VerticalRadioBox
              name="keyboardLayout"
              list={keyboardLayoutName}
              selected={settings.kb.value}
              onClick={(s) =>
                setSettings("kb", { kind: SettingsOriginType.user, value: s })
              }
            >
              {(s) => <p class="opt">{s}</p>}
            </VerticalRadioBox>
          </div>
          <div class="sub-content">
            <input
              type="checkbox"
              name="show-keyboard"
              id="show-keyboard"
              onChange={(e) => {
                setSettings("showKb", e.target.checked);
              }}
              checked={settings.showKb}
            />
            <label for="show-keyboard">{t("showKeyboard")}</label>
          </div>
        </SettingMenu>
      </VerticalDropdown>
      <VerticalDropdown
        label={
          <Tooltip content={<p>{t(settings.locale.value as "en")}</p>}>
            <GlobeIcon />
          </Tooltip>
        }
      >
        <SettingMenu title={t("language")}>
          <div class="sub-content">
            <VerticalRadioBox
              name="locale"
              list={locales}
              selected={settings.locale.value}
              onClick={(s) =>
                setSettings("locale", {
                  kind: SettingsOriginType.user,
                  value: s,
                })
              }
            >
              {(s) => <p class="opt">{t(s as "en" | "fr")}</p>}
            </VerticalRadioBox>
          </div>
        </SettingMenu>
      </VerticalDropdown>
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
