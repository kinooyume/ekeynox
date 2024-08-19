import useClickOutside from "solid-click-outside";
import useAnimateToggle, { type AnimateToggleProps } from "./animateToggle";
import { Accessor } from "solid-js";

interface AnimateModalProps extends AnimateToggleProps {
  element: Accessor<HTMLElement | undefined>;
}

const useAnimateModal = (props : AnimateModalProps) => {
const animateToggle = useAnimateToggle(props)

  useClickOutside(props.element, () => {
    if (animateToggle.pendingAnimation()) return;
    if (props.isOpen()) {
      animateToggle.close();
    }
  });
  return animateToggle;
}

export default useAnimateModal;
