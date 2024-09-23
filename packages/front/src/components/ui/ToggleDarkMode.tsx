import { css } from "solid-styled";

type DarkModeToggleProps = {
  dark: boolean;
  setDark: (dark: boolean) => void;
};

const ToggleDarkMode = (props: DarkModeToggleProps) => {
  css`
    .input-wrapper {
      max-width: 40px;
      height: 40px;
      min-width: 40px;
      background-color: red;
    }
    .input-wrapper {
      max-width: 100px;
    }
  `;

  return <div class="input-wrapper"></div>;
};

export default ToggleDarkMode;
