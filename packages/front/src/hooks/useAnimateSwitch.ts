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
  locked: () => boolean;
  setLocked: (value: boolean) => void;
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
    props.setLocked(true);
    props.setState(AnimateState.transition);
    const animation = getAnimation();
    animation.play();
    animation.finished.then(() => {
      props.setLocked(false);
      after();
    });
  };

  const toTarget = () => {
    if (props.locked() || props.state() !== AnimateState.initial) return;
    props.on?.toTarget?.();
    animationHandler(props.animation.enter, () => {
      props.setState(AnimateState.target);
    });
  };

  const toInitial = () => {
    if (props.state() !== AnimateState.target) return;
    return animationHandler(props.animation.leave, () => {
      props.setState(AnimateState.initial);
      props.on?.toInitial?.();
    });
  };

  if (props.on) {
    createEffect(
      on(props.state, (state, prevState) => {
        switch (state) {
          case AnimateState.transition:
            props.on?.transition?.(prevState!);
            break;
          // NOTE: was used for morphing
          //
          // case AnimateState.target:
          //   props.on?.toTarget?.();
          //   break;
          // case AnimateState.initial:
          //   props.on?.toInitial?.();
          //   break;
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
