import { Accessor, createSignal } from "solid-js";
import { FocusType, useFocus } from "../contexts/FocusProvider";
import { AnimeTimelineInstance } from "animejs";
import {
  AnimationComp,
  MinimalAnimationInstance,
} from "~/animations/animation";

export interface AnimateToggleProps {
  animation: AnimationComp;
  isOpen: Accessor<boolean>;
  setIsOpen: (value: boolean) => void;
}

export type AnimateToggleType = {
  toggle: () => void;
  open: () => void;
  close: () => void;
  pendingAnimation: Accessor<boolean>;
};

const useAnimateToggle = (props: AnimateToggleProps) => {
  const [pendingAnimation, setPendingAnimation] = createSignal(false);

  const { setFocus } = useFocus();
  const animationHandler = (
    animation: MinimalAnimationInstance,
    after: () => void,
  ) => {
    setPendingAnimation(true);
    animation.play();
    animation.finished.then(after);
  };

  const open = () => {
    if (pendingAnimation()) return;
    props.setIsOpen(true);
    animationHandler(props.animation.enter(), () => {
      setFocus(FocusType.Hud);
      setPendingAnimation(false);
    });
  };

  const close = () => {
    if (pendingAnimation()) return;
    return animationHandler(props.animation.leave(), () => {
      setFocus(FocusType.View);
      setPendingAnimation(false);
      props.setIsOpen(false);
    });
  };

  const toggle = () => {
    props.isOpen() ? close() : open();
  };

  return { toggle, open, close, pendingAnimation };
};

export default useAnimateToggle;
