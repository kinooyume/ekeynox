import { JSX, Match, Show, Switch, createSignal } from "solid-js";
import anime from "animejs";
import { css } from "solid-styled";

import Cross from "../svgs/cross";
import {
  type AnimationChildren,
  createAnimation,
} from "~/animations/animation";
import useAnimateToggle from "~/hooks/animateToggle";

type MorphingProps = {
  to: (close: () => void) => JSX.Element | JSX.Element[];
  children: (toggle: () => void) => JSX.Element | JSX.Element[];
};

const Morphing = (props: MorphingProps) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [morphedElement, setMorphedElement] = createSignal<HTMLDivElement>();

  const animation = createAnimation({
    parent: {
      enter: () => ({
        timeline: { easing: "easeOutElastic(1, 0.9)" },
        params: {
          targets: morphedElement(),
          padding: ["0", "8px 26px 26px"],
          height: [48, 320],
          top: ["0", "-8px"],
          width: [200, 820],
          duration: 650,
        },
      }),
      leave: () => ({
        timeline: {
          easing: "easeOutCubic",
        },
        params: {
          targets: morphedElement(),
          padding: ["8px 26px 26px", "0"],
          top: ["-8px", "0"],
          width: ["800px", "200px"],
          height: [320, 48],
          duration: 250,
        },
      }),
    },
    children: {
      enter: [],
      leave: [],
    },
  });

  const { toggle, open, close } = useAnimateToggle({
    element: morphedElement,
    animation,
    isOpen,
    setIsOpen,
  });

  css`
    .morphing-wrapper {
      display: relative;
    }
    .morphed {
      display: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  `;
  return (
    <div class="morphing-wrapper" ref={setMorphedElement}>
      <Switch>
        <Match when={isOpen()}>
          <div class="morphed">{props.to(toggle)}</div>
        </Match>
        <Match when={!isOpen()}>
          <div class="source">{props.children(toggle)}</div>
        </Match>
      </Switch>
    </div>
  );
};
export default Morphing;
