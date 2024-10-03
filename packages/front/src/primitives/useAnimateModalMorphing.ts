import { AnimateState, MinimalAnimationInstance } from "~/animations/animation";
import useAnimateModal, { AnimateModalProps } from "./useAnimateModal";

interface AnimateModalMorhingProps<Hooks> extends AnimateModalProps {
  transitions: Hooks;
}

export type AnimateHookProps<Hook> = (h: Hook) => MinimalAnimationInstance;
export type AnimateHookType<Hook> = (h: Hook) => Promise<void>;

export type AnimateModalHooksProps = {
  resize: AnimateHookProps<{ width: number; height: number }>;
};

export type AnimateModalHooks = {
  resize: AnimateHookType<{ width: number; height: number }>;
};

const useAnimateModalMorphing = (
  props: AnimateModalMorhingProps<AnimateModalHooksProps>,
) => {
  const animation = useAnimateModal(props);

  const resize = async ({
    width,
    height,
  }: {
    width: number;
    height: number;
  }) => {
    const prevState = props.state();
    if (prevState === AnimateState.transition) return;
    props.setState(AnimateState.transition);
    const animation = props.transitions.resize({ width, height });
    animation.play();
    return animation.finished.then(() => {
      props.setState(prevState);
    });
  };

  const transitions = {
    resize,
  };

  return { ...animation, transitions };
};

export default useAnimateModalMorphing;
