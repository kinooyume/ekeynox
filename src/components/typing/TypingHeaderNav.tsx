import type { SetStoreFunction } from "solid-js/store";
import TypingHeaderMenu from "./TypingHeaderMenu";
import { css } from "solid-styled";
import { ContentGeneration, GameOptions } from "~/gameOptions/gameOptions";
import { PendingMode } from "~/appState/appState";
import TypingHeaderActions from "./TypingHeaderActions";
import { JSX, onCleanup, onMount } from "solid-js";
import anime from "animejs";
import { Transition } from "solid-transition-group";

export type LeavingFn = (fn: () => void) => void;

type TypingHeaderNavProps = {
  start: (opts: GameOptions) => void;
  gameOptions: GameOptions;
  setLeavingAnimate: (anim: () => anime.AnimeTimelineInstance) => void;
  fetchSourcesGen: (opts: ContentGeneration) => Promise<Array<string>>;
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

  return (
    <div class="header-nav">
      <div class="left">
        <TypingHeaderMenu {...props} />
      </div>
      <div class="right">{props.children}</div>
    </div>
  );
};

export default TypingHeaderNav;
