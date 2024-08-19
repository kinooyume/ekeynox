import { Accessor } from "solid-js";
import {
  AnimationComp,
  MinimalAnimationInstance,
} from "~/animations/animation";

export enum AnimateSwitchState {
  source,
  transition,
  target,
}

export interface AnimateSwitchProps {
  animation: AnimationComp;
  state: Accessor<AnimateSwitchState>;
  setState: (value: AnimateSwitchState) => void;
}

const useAnimateSwitch = (props: AnimateSwitchProps) => {
  const animationHandler = (
    animation: MinimalAnimationInstance,
    after: () => void,
  ) => {
    props.setState(AnimateSwitchState.transition);
    animation.play();
    animation.finished.then(after);
  };

  const open = () => {
    if (props.state() !== AnimateSwitchState.source) return;
    animationHandler(props.animation.enter(), () => {
      // setFocus(FocusType.Hud);
      props.setState(AnimateSwitchState.target);
    });
  };

  const close = () => {
    if (props.state() !== AnimateSwitchState.target) return;
    return animationHandler(props.animation.leave(), () => {
      // setFocus(FocusType.View);
      props.setState(AnimateSwitchState.source);
    });
  };

  const toggle = () => {
    switch (props.state()) {
      case AnimateSwitchState.source:
        return open();
      case AnimateSwitchState.target:
        return close();
    }
  };

  return { toggle, open, close };
};

export default useAnimateSwitch;
