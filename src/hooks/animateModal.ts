import useClickOutside from "solid-click-outside";
import useAnimateToggle, { type AnimateToggleProps } from "./animateToggle";

const useAnimateModal = (props : AnimateToggleProps) => {
const animateToggle = useAnimateToggle(props)

  useClickOutside(props.element, () => {
    if (animateToggle.pendingAnimation()) return;
    if (props.isOpen()) {
      close();
    }
  });
  return animateToggle;
}

export default useAnimateModal;
