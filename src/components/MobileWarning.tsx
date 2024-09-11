import { Component } from "solid-js";
import { css } from "solid-styled";
import { useI18n } from "~/contexts/i18nProvider";

const MobileWarning: Component<{}> = (props) => {
  const t = useI18n();

  css`
    div {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      pointer-events: none;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 28px;
      background-color: var(--color-surface-100);
      z-index: 1000;
    }
  `;
  return (
    <div>
      <p>{t("mobileWarning")}</p>
    </div>
  );
};

export default MobileWarning;
