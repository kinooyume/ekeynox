import { JSX, Show, createSignal } from "solid-js";
import { css } from "solid-styled";

import {
  type AnimationParent,
  AnimationChildren,
  createAnimationEnter,
  createAnimationLeave,
  createParallelAnimationComp,
  AnimateState,
  isInitialAnimation,
} from "~/animations/animation";
import useAnimateSwitch, {
} from "~/hooks/animateSwitch";

type MorphingProps = {
  target: (close: () => void) => JSX.Element | JSX.Element[];
  sourceAnimation: AnimationChildren;
  targetAnimation: AnimationChildren;
  children: (toggle: () => void) => JSX.Element | JSX.Element[];
};

const Morphing = (props: MorphingProps) => {
  const [state, setState] = createSignal<AnimateState>(
    AnimateState.initial,
  );

  const [source, setSource] = createSignal<HTMLDivElement>();
  const [target, setTarget] = createSignal<HTMLDivElement>();

  let sourceHeight = 0;
  let targetHeight = 0;

  const sourceAnimation: AnimationParent = {
    enter: () => ({
      timeline: { easing: "easeOutElastic(1, 0.9)" },
      params: {
        targets: source(),
        opacity: [0, 1],
        height: [0, sourceHeight],
        duration: 250,
      },
    }),
    leave: () => {
      sourceHeight = source()!.clientHeight;
      return {
        timeline: {
          easing: "easeOutCubic",
        },
        params: {
          targets: source(),
          opacity: [1, 0],
          height: [sourceHeight, 0],
          duration: 250,
        },
      };
    },
  };

  const targetAnimation: AnimationParent = {
    enter: () => ({
      timeline: { easing: "easeOutElastic(1, 0.9)" },
      params: {
        targets: target(),
        opacity: [0, 1],
        duration: 250,
      },
    }),
    leave: () => ({
      timeline: {
        easing: "easeOutCubic",
      },
      params: {
        targets: target(),
        padding: ["8px 26px 26px", "0"],
        duration: 250,
      },
    }),
  };

  const animation = createParallelAnimationComp({
    enter: [
      createAnimationLeave(sourceAnimation.leave, props.sourceAnimation.leave),
      createAnimationEnter(targetAnimation.enter, props.targetAnimation.enter),
    ],
    leave: [
      createAnimationEnter(sourceAnimation.enter, props.sourceAnimation.enter),
      createAnimationLeave(targetAnimation.leave, props.targetAnimation.leave),
    ],
  });

  const { toggle } = useAnimateSwitch({
    animation,
    state,
    setState,
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
    .source {
      overflow: hidden;
    }
  `;
  return (
    <div class="morphing-wrapper">
      <Show when={state() !== AnimateState.target}>
        <div class="source" ref={setSource}>
          {props.children(toggle)}
        </div>
      </Show>
      <Show when={!isInitialAnimation(state())}>
        <div class="morphed target" ref={setTarget}>
          {props.target(toggle)}
        </div>
      </Show>
    </div>
  );
};
export default Morphing;
