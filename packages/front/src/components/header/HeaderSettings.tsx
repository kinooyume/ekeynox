import KeyboardIcon from "../svgs/keyboardIcon.tsx";
import GlobeIcon from "../svgs/globe.tsx";
import { css } from "solid-styled";
import {
  SettingsOriginType,
  Theme,
  keyboardLayoutName,
  locales,
} from "~/settings/settings.ts";
import VerticalRadioBox from "../ui/VerticalRadioBox.tsx";
import TinyRadioLabel from "../ui/TinyRadioLabel.tsx";
import { useI18n } from "~/contexts/i18nProvider.tsx";
import { useSettings } from "~/contexts/SettingsProvider.tsx";
import { useWindowSize } from "@solid-primitives/resize-observer";
import { Show } from "solid-js";
import { ListSettings, SettingsUI } from "./HeaderSettingsGlobal.tsx";
import HeaderSettingsDesktop from "./HeaderSettingsDesktop.tsx";
import HeaderSettingsMobile from "./HeaderSettingsMobile.tsx";
import EyeToggle from "../ui/EyeToggle.tsx";

const HeaderSettings = () => {
  const t = useI18n();
  const { settings, setSettings, dark } = useSettings();

  css`
    .subtitle {
      font-size: 15px;
      font-weight: 600;
      margin-top: 0;
      color: var(--text-secondary-color);
      opacity: 0.9;
      text-transform: capitalize;
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

    .show-keyboard-toggle {
      margin-top: 8px;
    }
    @media screen and (max-width: 860px) {
      .actions {
        display: block;
      }
    }
  `;

  const keyboardSettings: ListSettings = {
    id: "keyboard-settings",
    Icon: () => (
      <div class="keyboard-adjust">
        <KeyboardIcon />
      </div>
    ),
    title: () => t("keyboard"),
    tooltip: () => settings.kb.value,
    List: () => (
      <>
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
        <div class="sub-content elem show-keyboard-toggle">
          <EyeToggle
            id="show-keyboard"
            onChange={(value) => {
              setSettings("showKb", value);
            }}
            checked={settings.showKb}
          >
            <>{t("showKeyboard")}</>
          </EyeToggle>
        </div>
      </>
    ),
  };

  const languageSettings: ListSettings = {
    id: "language",
    Icon: () => <GlobeIcon />,
    title: () => t("language"),
    tooltip: () => t(settings.locale.value as "en"),
    List: () => (
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
    ),
  };

  const darkModeSettings = {
    value: () => dark(),
    set: (s: boolean) => {
      const theme = s ? Theme.dark : Theme.light;
      setSettings("theme", {
        kind: SettingsOriginType.user,
        value: theme,
      });
    },
  };

  const settingsUI: SettingsUI = {
    keyboard: keyboardSettings,
    langue: languageSettings,
    darkMode: darkModeSettings,
  };

  const size = useWindowSize();

  return (
    <div class="actions">
      <Show
        when={size.width > 860}
        fallback={<HeaderSettingsMobile {...settingsUI} />}
      >
        <HeaderSettingsDesktop {...settingsUI} />
      </Show>
      {/* <div class="profile-adjust"> */}
      {/*   <ProfilePicto logged={false} /> */}
      {/* </div> */}
    </div>
  );
};

export default HeaderSettings;

// Checkbox ui
// https://uiverse.io/Shoh2008/big-deer-80
