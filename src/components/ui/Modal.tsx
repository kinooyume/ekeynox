import { Accessor, JSX, Show, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import { css } from "solid-styled";
import anime from "animejs";
import useModalAnimated from "./ModalAnimated";
import Cross from "../svgs/cross";

type AnimationProps = {
  params: anime.AnimeParams;
  offset?: string;
};

type ModalProps = {
  button: (isOpen: Accessor<boolean>, toggle: () => void) => JSX.Element;
  portalId: string;
  openAnimation: AnimationProps[];
  closeAnimation: AnimationProps[];
  children: JSX.Element | JSX.Element[];
};

const Modal = (props: ModalProps) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [modalElement, setModalElement] = createSignal<HTMLDivElement>();

  const openAnimation = () => {
    const a = anime
      .timeline({
        easing: "easeOutElastic(1, 0.9)",
        autoplay: false,
      })
      .add({
        targets: modalElement(),
        height: [0, modalElement()!.clientHeight],
        opacity: [0, 1],
        duration: 650,
      });
    props.openAnimation.forEach((step) => {
      a.add(step.params, step.offset);
    });
    return a;
  };

  const closeAnimation = () => {
    const height = modalElement()!.clientHeight - 34;
    const a = anime.timeline({
      easing: "easeOutElastic(1, 0.9)",
      autoplay: false,
    });

    props.closeAnimation.forEach((step) => {
      a.add(step.params, step.offset);
    });

    a.add(
      {
        targets: modalElement(),
        opacity: [1, 0],
        height: [height, 0],
        duration: 550,
      },
      "-=425",
    );
    return a;
  };

  const { toggle } = useModalAnimated({
    openAnimation,
    closeAnimation,
    isOpen,
    setIsOpen,
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
      top: 80px;
      margin: 0 auto;
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
      {props.button(isOpen, toggle)}
      <Show when={isOpen()}>
        <Portal mount={document.getElementById(props.portalId)!}>
          <div class="blur"></div>
          <div class="modal" ref={setModalElement}>
            <div class="cross" onClick={toggle}>
              <Cross />
            </div>
            <div class="modal_content">
              {props.children}
            </div>
          </div>
        </Portal>
      </Show>
    </div>
  );
};

export default Modal;
