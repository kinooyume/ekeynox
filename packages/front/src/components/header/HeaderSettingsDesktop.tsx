import { Component, onCleanup } from "solid-js";
import { ListSettings, SettingsUI } from "./HeaderSettingsGlobal";
import VerticalPopover from "../ui/VerticalDropdown";
import Tooltip from "../ui/Tooltip";
import SettingMenu from "../settings/SettingMenu";
import DarkModeToggle from "../ui/DarkModeToggle";
import { css } from "solid-styled";
import { FocusType, useFocus } from "~/contexts/FocusProvider";

const ListSettingsDesktop: Component<ListSettings> = (props) => (
  <VerticalPopover
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
  </VerticalPopover>
);

const HeaderSettingsDesktop: Component<SettingsUI> = (props) => {
  const { setFocus } = useFocus();
  // TODO: should not be here
  // ==> trigger when switching desktop/mobile
  onCleanup(() => {
    setFocus(FocusType.View);
  });
  css`
    ul {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  `;
  return (
    <ul>
      <li>
        <ListSettingsDesktop {...props.keyboard} />
      </li>
      <li>
        <ListSettingsDesktop {...props.langue} />
      </li>
      <li>
        <DarkModeToggle {...props.darkMode} />
      </li>
      {/* <li> */}
      {/*   <a href="/login" >login</a> */}
      {/* </li> */}
    </ul>
  );
};

export default HeaderSettingsDesktop;
function setFocus(View: any) {
  throw new Error("Function not implemented.");
}
