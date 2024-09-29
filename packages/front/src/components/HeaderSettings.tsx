import DarkModeToggle from "./ui/DarkModeToggle.tsx";
import KeyboardIcon from "./svgs/keyboardIcon.tsx";
import GlobeIcon from "./svgs/globe.tsx";
import { css } from "solid-styled";
import {
  SettingsOriginType,
  Theme,
  keyboardLayoutName,
  locales,
} from "~/settings/settings.ts";
import Tooltip from "./ui/Tooltip.tsx";
import VerticalRadioBox from "./ui/VerticalRadioBox.tsx";
import SettingMenu from "./settings/SettingMenu.tsx";
import VerticalDropdown from "./ui/VerticalDropdown.tsx";
import TinyRadioLabel from "./ui/TinyRadioLabel.tsx";
import { useI18n } from "~/contexts/i18nProvider.tsx";
import { useSettings } from "~/contexts/SettingsProvider.tsx";
import ProfilePicto from "./ui/ProfilePicto.tsx";

const HeaderSettings = () => {
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

    .profile-adjust {
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 6px;
      padding-left: 15px;
    }
.keyboard-adjust {
padding-bottom: 2px;
}
  `;
  return (
    <div class="actions">
      <VerticalDropdown
        id="keyboard"
        label={(isOpen) => (
          <Tooltip
            show={!isOpen()}
            content={<p class="tooltip-label">{settings.kb.value}</p>}
          >
            <div class="keyboard-adjust">
            <KeyboardIcon />
            </div>
          </Tooltip>
        )}
      >
        {() => (
          <SettingMenu title={t("keyboard")}>
            <div class="sub-content">
              <p class="subtitle elem">{t("layout")}</p>
              <VerticalRadioBox
                name="keyboardLayout"
                each={keyboardLayoutName}
                selected={settings.kb.value}
                onChange={(s) =>
                  setSettings("kb", { kind: SettingsOriginType.user, value: s })
                }
              >
                {(id, checked, elem) => (
                  <TinyRadioLabel id={id} checked={checked}>
                    <p class="opt">{elem}</p>
                  </TinyRadioLabel>
                )}
              </VerticalRadioBox>
            </div>
            <div class="sub-content elem">
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
        )}
      </VerticalDropdown>
      <VerticalDropdown
        id="language"
        label={(isOpen) => (
          <Tooltip
            show={!isOpen()}
            content={
              <p class="tooltip-label">{t(settings.locale.value as "en")}</p>
            }
          >
            <GlobeIcon />
          </Tooltip>
        )}
      >
        {(close) => (
          <SettingMenu title={t("language")}>
            <div class="sub-content">
              <VerticalRadioBox
                name="locale"
                each={locales}
                selected={settings.locale.value}
                onChange={(s) => {
                  setSettings("locale", {
                    kind: SettingsOriginType.user,
                    value: s,
                  });
                  close();
                }}
              >
                {(id, checked, elem) => (
                  <TinyRadioLabel id={id} checked={checked}>
                    <p class="opt">{t(elem as "en" | "fr")}</p>
                  </TinyRadioLabel>
                )}
              </VerticalRadioBox>
            </div>
          </SettingMenu>
        )}
      </VerticalDropdown>
      {/* https://uiverse.io/Shoh2008/big-deer-80 */}
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
      {/* <div class="profile-adjust"> */}
      {/*   <ProfilePicto logged={false} /> */}
      {/* </div> */}
    </div>
  );
};

export default HeaderSettings;
