import { Accessor } from "solid-js";
import { FocusType, useFocus } from "~/contexts/FocusProvider";
import useAnimateSwitch, { AnimateSwitchProps } from "./useAnimateSwitch";
import useClickOutside from "./useClickOutside";
import { AnimateState } from "~/animations/animation";

export interface AnimateModalProps extends AnimateSwitchProps {
  element: Accessor<HTMLElement | undefined>;
}

const useAnimateModal = (props: AnimateModalProps) => {
  const { setFocus } = useFocus();
  const animation = useAnimateSwitch({
    ...props,
    on: {
      toInitial: () => setFocus(FocusType.View),
      toTarget: () => setFocus(FocusType.Hud),
    },
  });

  useClickOutside(props.element, () => {
    if (props.state() === AnimateState.target) {
      animation.toInitial();
    }
  });

  return animation;
};

export default useAnimateModal;
