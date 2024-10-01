import { JSX } from "solid-js";
import { css } from "solid-styled";

type SettingMenuProps = {
  title: string;
  children: JSX.Element | JSX.Element[];
};

const SettingMenu = (props: SettingMenuProps) => {
  css`
    .setting-menu {
      padding-top: 3px;
      width: 100%;
    }
    .title {
      font-size: 19px;
      margin: 0;
      font-weight: 400;
      text-transform: capitalize;
      color: var(--text-secondary-color);
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-top: 24px;
      margin-left: 4px;
      margin-bottom: 12px;
    }
  `;

  return (
    <div class="setting-menu">
      <p class="title elem">{props.title}</p>
      <div class="content">{props.children}</div>
    </div>
  );
};

export default SettingMenu;
