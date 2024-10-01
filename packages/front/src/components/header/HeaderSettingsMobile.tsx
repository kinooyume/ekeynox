import {
  DarkModeSettings,
  ListSettings,
  SettingsUI,
} from "./HeaderSettingsGlobal";
import Drawer from "@corvu/drawer";

import { Component, createSignal, onCleanup } from "solid-js";
import "./Drawer.css";
import Kebab from "../svgs/kebab";
import { css } from "solid-styled";
import { useI18n } from "~/contexts/i18nProvider";
import VerticalRadioBox from "../ui/VerticalRadioBox";
import TinyRadioLabel from "../ui/TinyRadioLabel";
import Moon from "../svgs/moon";
import Sun from "../svgs/sun";
import Cross from "../svgs/cross";
import { FocusType, useFocus } from "~/contexts/FocusProvider";
import { useAppState } from "~/contexts/AppStateProvider";
import { AppStateKind } from "~/appState/appState";

const ListSettingsMobile: Component<ListSettings> = (props) => {
  css`
    .title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      text-transform: capitalize;
      gap: 8px;
    }
    .title p {
      color: var(--text-color);
      color: var(--text-secondary-color);
      font-size: 19px;
    }
    .params {
      padding-left: 16px;
    }
    .icon-wrapper {
    }
  `;
  return (
    <>
      <div class="title">
        <div class="icon-wrapper">
          <props.Icon />
        </div>
        <p>{props.title()}</p>
      </div>
      <div class="params">
        <props.List />
      </div>
    </>
  );
};

// TODO: who, to refacto
// Probably get back the auto stuff
// style not shared, so probably module for that

// NOTE: en fait ça, ca va convertir le  toggle en radiobox
//
const DarkModeToggleToRadioBox: Component<DarkModeSettings> = (props) => {
  const t = useI18n();
  const theme = ["light", "dark"];

  css`
    p {
      text-transform: capitalize;
      color: var(--text-secondary-color);
    }
  `;
  return (
    <>
      <VerticalRadioBox
        name="keyboardLayout"
        each={theme}
        selected={props.value() ? "dark" : "light"}
        onChange={(s) => props.set(s === "dark")}
      >
        {(id, checked, elem) => (
          <TinyRadioLabel id={id} checked={checked}>
            <p class="opt">{t(`${elem}`)}</p>
          </TinyRadioLabel>
        )}
      </VerticalRadioBox>
    </>
  );
};

const IconDarkMode: Component<SettingsUI> = (props) => {
  css`
    .sun {
      padding-bottom: -2px;
    }
  `;
  return (
    <>
      {props.darkMode.value() ? (
        <Moon />
      ) : (
        <div class="sun">
          <Sun />
        </div>
      )}
    </>
  );
};

const HeaderSettingsContent: Component<SettingsUI> = (props) => {
  const t = useI18n();
  css`
    li + li {
      border-top: 1px solid var(--background-color);
      margin-top: 18px;
    }
    h3 {
      font-size: 24px;
      margin: 0;
      color: var(--text-secondary-color);
      font-weight: 300;
      text-transform: capitalize;
    }
    .title {
      margin: 24px 0;
      display: flex;
      justify-content: space-between;
    }
  `;
  return (
    <>
      <div class="title">
        <h3>{t("parameters")}</h3>
        <Drawer.Close class="reset">
          <Cross />
        </Drawer.Close>
      </div>
      <ul>
        <li>
          <ListSettingsMobile {...props.langue} />
        </li>
        <li>
          <ListSettingsMobile
            id="theme"
            Icon={() => <IconDarkMode {...props} />}
            tooltip={() => ""}
            title={() => t("theme")}
            List={() => <DarkModeToggleToRadioBox {...props.darkMode} />}
          />
        </li>
      </ul>
    </>
  );
};

// Interessant ce fonctionnement !
const HeaderSettingsMobile: Component<SettingsUI> = (props) => {
  const { setFocus } = useFocus();
  const { state } = useAppState();

  // TODO: should not be here
  // ==> trigger when switching desktop/mobile
  onCleanup(() => {
    setFocus(FocusType.View);
  });

  return (
    <Drawer
      side="right"
      onFinalFocus={(e) => {
        // NOTE:  should let the game handle the focus
        if (state().kind === AppStateKind.pending) {
          e.preventDefault();
        }
      }}
      onOpenChange={(open) => {
        if (open) {
          setFocus(FocusType.Hud);
        } else {
          setFocus(FocusType.View);
        }
      }}
    >
      <Drawer.Trigger class="reset">
        <Kebab />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay style={{ "background-color": "rgba(0, 0, 0, 0.2)" }} />
        <Drawer.Content>
          <HeaderSettingsContent {...props} />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer>
  );
};

export default HeaderSettingsMobile;
