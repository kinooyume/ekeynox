import { JSX } from "solid-js";
import { css } from "solid-styled";

type SettingMenuProps = {
  title: string;
  children: JSX.Element | JSX.Element[];
};

const SettingMenu = (props: SettingMenuProps) => {
  css`

.title {
font-size: 18px;
margin: 0;
font-weight: 400;
text-transform: capitaize;
color: var(--text-secondary-color);
}
`

  return <div class="setting-menu">
    <p class="title">{props.title}</p>
    <div class="content">
      {props.children}
    </div>
  </div>;
};

export default SettingMenu;

