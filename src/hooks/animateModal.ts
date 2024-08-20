import { Accessor } from "solid-js";
import { FocusType, useFocus } from "~/contexts/FocusProvider";
import useAnimateSwitch, {
  AnimateSwitchProps,
} from "./animateSwitch";
import useClickOutside from "./useClickOutside";
import { AnimateState } from "~/animations/animation";

interface AnimateModalProps extends AnimateSwitchProps {
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

  // TODO:  should be mount with the component
  // to avoir unecessary listener
  useClickOutside(props.element, () => {
    if (props.state() === AnimateState.target) {
      animation.toInitial();
    }
  });

  return animation;
};

export default useAnimateModal;
