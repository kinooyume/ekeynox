import { Accessor, createSignal } from "solid-js";
import { FocusType, useFocus } from "../contexts/FocusProvider";
import { AnimeTimelineInstance } from "animejs";
import { AnimationComp } from "~/animations/animation";

export type AnimateToggleProps = {
  element: Accessor<HTMLElement | undefined>;
  animation: AnimationComp;
  isOpen: Accessor<boolean>;
  setIsOpen: (value: boolean) => void;
};

const useAnimateToggle = (props: AnimateToggleProps) => {
  const [pendingAnimation, setPendingAnimation] = createSignal(false);

  const { setFocus } = useFocus();

  const animationHandler = (
    animation: AnimeTimelineInstance,
    after: () => void,
  ) => {
    setPendingAnimation(true);
    animation.play();
    animation.finished.then(after);
  };

  const open = () => {
    props.setIsOpen(true);
    animationHandler(props.animation.enter(), () => {
      setFocus(FocusType.Hud);
      setPendingAnimation(false);
    });
  };

  const close = () =>
    animationHandler(props.animation.leave(), () => {
      setFocus(FocusType.View);
      setPendingAnimation(false);
      props.setIsOpen(false);
    });

  const toggle = () => {
    if (pendingAnimation()) return;
    props.isOpen() ? close() : open();
  };

  return { toggle, open, close, pendingAnimation };
};

export default useAnimateToggle;
