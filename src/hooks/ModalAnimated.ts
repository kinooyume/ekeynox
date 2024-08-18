import { Accessor, createComputed, createSignal, on } from "solid-js";
import { FocusType, useFocus } from "..components//ui/FocusProvider";
import useClickOutside from "solid-click-outside";
import { AnimeTimelineInstance } from "animejs";
import { AnimationComp } from "~/animations/animation";

/*
 * - Made for different open/close Animation
 * -  Manage animation
 * - Add a toggle managing animation
 * - clickOutside
 */

// it's an hook

type ToggleAnimatedProps = {
  element: Accessor<HTMLElement | undefined>;
  animation: AnimationComp;
  isOpen: Accessor<boolean>;
  setIsOpen: (value: boolean) => void;
};

const useToggleAnimated = (props: ToggleAnimatedProps) => {
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

  useClickOutside(props.element, () => {
    if (pendingAnimation()) return;
    if (props.isOpen()) {
      close();
    }
  });

  return { toggle, open, close, pendingAnimation };
};

export default useToggleAnimated;
