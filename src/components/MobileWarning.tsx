import { Component, onCleanup, onMount } from "solid-js";
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
      width: calc(100vw - 56px);
      height: 100vh;
      padding: 28px;
      background-color: var(--color-surface-100);
      z-index: 1000;
    }
  `;

  // Quick & dirty screen lock
  onMount(() => {
    window.scrollTo(0, 0);
    document.body.style.position = "fixed";
    document.body.style.overflowY = "scroll";
  });

  onCleanup(() => {
    document.body.style.position = "inherit";
    document.body.style.overflowY = "inherit";

  });
  return (
    <div>
      <p>{t("mobileWarning")}</p>
    </div>
  );
};

export default MobileWarning;
