import { Accessor, Component, createEffect, on } from "solid-js";
import {
  AnimateState,
  AnimationComp,
  MinimalAnimationInstance,
} from "~/animations/animation";

type AnimationSwitchCallbacks = {
  transition?: (s: AnimateState) => void;
  toInitial?: () => void;
  toTarget?: () => void;
};

export interface AnimateSwitchProps {
  animation: AnimationComp;
  state: Accessor<AnimateState>;
  setState: (value: AnimateState) => void;
  on?: AnimationSwitchCallbacks;
}

function useAnimateSwitch(props: AnimateSwitchProps) {
  type AnimationHandlerProps = {
    getAnimation: () => MinimalAnimationInstance;
    after: () => void;
  };

  const animationHandler = (
    getAnimation: () => MinimalAnimationInstance,
    after: () => void,
  ) => {
    props.setState(AnimateState.transition);
    const animation = getAnimation();
    animation.play();
    animation.finished.then(after);
  };

  const toTarget = () => {
    if (props.state() !== AnimateState.initial) return;
    animationHandler(props.animation.enter, () => {
      props.setState(AnimateState.target);
    });
  };

  const toInitial = () => {
    if (props.state() !== AnimateState.target) return;
    return animationHandler(props.animation.leave, () => {
      props.setState(AnimateState.initial);
    });
  };

  if (props.on) {
    createEffect(
        on(props.state, (state, prevState) => {
          switch (state) {
            case AnimateState.transition:
              props.on?.transition?.(prevState!);
              break;
            case AnimateState.target:
              props.on?.toTarget?.();
              break;
            case AnimateState.initial:
              props.on?.toInitial?.();
              break;
          }
          return state;
        }),
      props.state(),
    );
  }

  const toggle = () => {
    switch (props.state()) {
      case AnimateState.initial:
        return toTarget();
      case AnimateState.target:
        return toInitial();
    }
  };

  return { toggle, toTarget, toInitial };
}

export default useAnimateSwitch;
