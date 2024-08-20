import { Accessor, JSX, Show, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import { css } from "solid-styled";

import Cross from "../svgs/cross";
import {
  type AnimationChildren,
  createAnimationComp,
  AnimateState,
  isInitialAnimation,
} from "~/animations/animation";
import useAnimateModal from "~/hooks/animateModal";

type ModalProps = {
  button: (toggle: () => void) => JSX.Element;
  portalId: string;
  childrenAnimation: AnimationChildren;
  children: JSX.Element | JSX.Element[];
};

const Modal = (props: ModalProps) => {
  const [state, setState] = createSignal<AnimateState>(
    AnimateState.initial,
  );
  const [modalElement, setModalElement] = createSignal<HTMLDivElement>();

  const animation = createAnimationComp({
    parent: {
      enter: () => {
        const height = modalElement()!.clientHeight;
        return {
          timeline: {
            easing: "easeOutElastic(1, 0.9)",
          },
          params: {
            targets: modalElement(),
            height: [0, height],
            opacity: [0, 1],
            duration: 650,
          },
        };
      },
      leave: () => {
        const height = modalElement()!.clientHeight - 34;
        return {
          timeline: {
            easing: "easeOutElastic(1, 0.9)",
          },
          params: {
            targets: modalElement(),
            opacity: [1, 0],
            height: [height, 0],
            duration: 550,
          },
          offset: "-=425",
        };
      },
    },
    children: props.childrenAnimation,
  });

  const { toInitial, toggle } = useAnimateModal({
    animation,
    state,
    setState,
    element: modalElement,
  });

  css`
    .blur {
      position: absolute;
      opacity: 0.2;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      backdrop-filter: grayscale(80%);
    }
    .modal {
      position: absolute;
      background-color: red;
overflow: hidden;
      top: 80px;
      margin: 0 auto;
      opacity: 0;
      right: 0;
      left: 0;
      max-width: 800px;
      width: 100%;
      background-color: var(--color-surface-100);
      padding: 8px 26px 26px;
      border: 1px solid var(--background-color);
      border-radius: 12px;
      box-shadow:
        0.6px 1.8px 2.2px rgba(0, 0, 0, 0.02),
        1.5px 4.3px 5.3px rgba(0, 0, 0, 0.028),
        2.9px 8px 10px rgba(0, 0, 0, 0.035),
        5.1px 14.3px 17.9px rgba(0, 0, 0, 0.042),
        9.6px 26.7px 33.4px rgba(0, 0, 0, 0.05),
        23px 64px 80px rgba(0, 0, 0, 0.07);
      z-index: 100;
    }

    .modal_content {
      margin: 24px;
      margin-top: 42px;
    }

    .cross {
      position: absolute;
      opacity: 0.8;
      cursor: pointer;
      right: 24px;
      top: 24px;
      z-index: 200;
      transition: opacity 0.2s ease-in-out;
    }

    .cross:hover {
      opacity: 1;
    }
  `;

  return (
    <div class="modal-wrapper">
      {props.button(toggle)}
      <Show when={!isInitialAnimation(state())}>
        <Portal mount={document.getElementById(props.portalId)!}>
          <div class="blur"></div>
          <div class="modal" ref={setModalElement}>
            <div class="cross" onClick={toInitial}>
              <Cross />
            </div>
            <div class="modal_content">{props.children}</div>
          </div>
        </Portal>
      </Show>
    </div>
  );
};

export default Modal;
