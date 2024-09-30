import { ListSettings, SettingsUI } from "./HeaderSettingsGlobal";
import { Component, createSignal } from "solid-js";

import Kebab from "../svgs/kebab";

  const HeaderSettingsMobile: Component<SettingsUI> = (props) => {
    const [open, setOpen] = createSignal<boolean>(false);
    return <div>
    <Kebab />
  </div>;
  };

  export default HeaderSettingsMobile;
