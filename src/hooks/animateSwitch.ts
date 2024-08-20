import { Accessor } from "solid-js";
import {
    AnimateState,
  AnimationComp,
  MinimalAnimationInstance,
} from "~/animations/animation";

type AnimationSwitchCallbacks = {
  toInitial: () => void;
  toTarget: () => void;
};

export interface AnimateSwitchProps {
  animation: AnimationComp;
  state: Accessor<AnimateState>;
  setState: (value: AnimateState) => void;
  on?: AnimationSwitchCallbacks;
}


const useAnimateSwitch = (props: AnimateSwitchProps) => {
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
      if (props.on) props.on.toTarget();
      props.setState(AnimateState.target);
    });
  };

  const toInitial = () => {
    if (props.state() !== AnimateState.target) return;
    return animationHandler(props.animation.leave, () => {
      if (props.on) props.on.toInitial();
      props.setState(AnimateState.initial);
    });
  };

  const toggle = () => {
    switch (props.state()) {
      case AnimateState.initial:
        return toTarget();
      case AnimateState.target:
        return toInitial();
    }
  };

  return { toggle, toTarget, toInitial };
};

export default useAnimateSwitch;
