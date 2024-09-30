import { css } from "solid-styled";

import Logo from "../svgs/logo.tsx";
import HeaderSettings from "./HeaderSettings.tsx";
import { onMount, Show } from "solid-js";
import anime from "animejs";
import { useWindowSize } from "@solid-primitives/resize-observer";
import LogoTiny from "../svgs/logoTiny.tsx";

const Header = () => {
  css`
    .header {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      z-index: 100;
      display: flex;
      gap: 36px;
      align-items: center;
      justify-content: space-between;
      height: 72px;
      padding: 1rem 2rem;
      padding-bottom: 0;
      margin-bottom: 1rem;
      background-color: var(--color-surface-100);
    }
    .home {
      cursor: pointer;
    }

    .header .left {
      display: flex;
      align-items: center;
    }

    .center {
      flex-grow: 1;
      z-index: 920;
    }

    @media screen and (max-width: 860px) {
      .header {
        height: 48px;
        gap: 16px;
        padding: 12px 16px;
      }
    }
  `;
  // const { mutation: navigation } = useAppState();
  // const navigate = useNavigate();

  const size = useWindowSize();

  onMount(() => {
    anime.timeline().add({
      targets: ".header > div",
      translateY: [-80, 0],
      opacity: [0, 1],
      easing: "easeOutElastic(1, 0.9)",
      duration: 800,
      delay: (el, i) => 100 * i,
    });
  });
  return (
    <div class="header">
      <div class="left">
        <a class="home" aria-label="ekeynox" href="/">
          <Show when={size.width > 860} fallback={<LogoTiny />}>
            <Logo />
          </Show>
        </a>
      </div>
      <div class="center">
        <div id="header-nav-actions-portal" />
      </div>
      <div class="right">
        <HeaderSettings />
      </div>
    </div>
  );
};

export default Header;

// https://codepen.io/dev_loop/pen/KKdEgdz
// cool magnet menu selection, + custom cursor
