import { Component } from "solid-js";
import { ListSettings, SettingsUI } from "./HeaderSettingsGlobal";
import VerticalDropdown from "../ui/VerticalDropdown";
import Tooltip from "../ui/Tooltip";
import SettingMenu from "../settings/SettingMenu";
import DarkModeToggle from "../ui/DarkModeToggle";

const ListSettingsDesktop: Component<ListSettings> = (props) => (
  <VerticalDropdown
    id={props.id}
    label={(isOpen) => (
      <Tooltip
        show={!isOpen()}
        content={<p class="tooltip-label">{props.tooltip()}</p>}
      >
        <props.Icon />
      </Tooltip>
    )}
  >
    {() => (
      <SettingMenu title={props.title()}>
        <props.List />
      </SettingMenu>
    )}
  </VerticalDropdown>
);

const HeaderSettingsDesktop: Component<SettingsUI> = (props) => (
  <>
    <ListSettingsDesktop {...props.keyboard} />
    <ListSettingsDesktop {...props.langue} />
    <DarkModeToggle {...props.darkMode} />
  </>
);

export default HeaderSettingsDesktop;
