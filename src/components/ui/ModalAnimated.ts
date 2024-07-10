import { Accessor, createComputed, createSignal, on } from "solid-js";
import { FocusType, useFocus } from "../ui/FocusProvider";
import useClickOutside from "solid-click-outside";
import { AnimeTimelineInstance } from "animejs";

/*
 * - Made for different open/close Animation
 * -  Manage animation
 * - Add a toggle managing animation
 * - clickOutside
 */

type ModalAnimationProps = {
  element: Accessor<HTMLElement | undefined>;
  openAnimation: () => anime.AnimeTimelineInstance;
  closeAnimation: () => anime.AnimeTimelineInstance;
  isOpen: Accessor<boolean>;
  setIsOpen: (value: boolean) => void;
};

const useModalAnimated = (props: ModalAnimationProps) => {
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
    animationHandler(props.openAnimation(), () => {
      setFocus(FocusType.Hud);
      setPendingAnimation(false);
    });
  };

  const close = () =>
    animationHandler(props.closeAnimation(), () => {
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

export default useModalAnimated;
