import TypingHeaderMenu from "./TypingHeaderMenu";
import { css } from "solid-styled";
import { JSX, onCleanup, onMount, Show } from "solid-js";
import anime from "animejs";
import { GameOptions } from "~/typingOptions/gameOptions";
import { useWindowSize } from "@solid-primitives/resize-observer";

export type LeavingFn = (fn: () => void) => void;

type TypingHeaderNavProps = {
  start: (opts: GameOptions) => void;
  gameOptions: GameOptions;
  setLeavingAnimate: (anim: () => anime.AnimeTimelineInstance) => void;
  children: JSX.Element | JSX.Element[];
};

const TypingHeaderNav = (props: TypingHeaderNavProps) => {
  css`
    .header-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      border-left: 2px solid var(--border-color);
      border-right: 2px solid var(--border-color);
      padding-bottom: 3px;
    }
    .left {
      z-index: 9;
    }
    @media screen and (max-width: 860px) {
      .header-nav {
        height: 24px;
        justify-content: center;
      }
      .right {
        width: 100%;
        max-width: 300px;
        padding: 0 20px;
      }
    }
  `;

  onMount(() => {
    anime.timeline().add({
      targets: ".header-nav .animate",
      translateY: [-80, 0],
      opacity: [0, 1],
      easing: "easeOutElastic(1, 0.9)",
      duration: 800,
      delay: (el, i) => 100 * i,
    });

    props.setLeavingAnimate(() => {
      return anime.timeline().add({
        targets: ".header-nav .animate",
        translateY: [0, -80],
        opacity: [1, 0],
        easing: "easeInElastic(1, 0.9)",
        duration: 300,
        delay: (el, i) => 20 * i,
      });
    });
  });

  const size = useWindowSize();

  return (
    <div class="header-nav">
      <Show when={size.width > 860}>
        <div class="left">
          <TypingHeaderMenu {...props} />
        </div>
      </Show>
      <div class="right">{props.children}</div>
    </div>
  );
};

export default TypingHeaderNav;
