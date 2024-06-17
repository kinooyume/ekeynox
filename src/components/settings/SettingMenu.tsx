import { JSX } from "solid-js";
import { css } from "solid-styled";

type SettingMenuProps = {
  title: string;
  children: JSX.Element | JSX.Element[];
};

const SettingMenu = (props: SettingMenuProps) => {
  css`
    .setting-menu {
      width: 100%;
    }
    .title {
      font-size: 21px;
      margin: 0;
      font-weight: 400;
      text-transform: capitalize;
      color: var(--text-color);
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
      <p class="title">{props.title}</p>
      <div class="content">{props.children}</div>
    </div>
  );
};

export default SettingMenu;
