import useModalAnimated from "./ModalAnimated";
import { JSX, Show, createSignal } from "solid-js";
import anime from "animejs";
import { css } from "solid-styled";
import Cross from "../svgs/cross";

// NOTE: très similaire à modal

type AnimationProps = {
  params: anime.AnimeParams;
  offset?: string;
};

type MorphingProps = {
  openAnimation: AnimationProps[];
  closeAnimation: AnimationProps[];
  to: (close: () => void) => JSX.Element | JSX.Element[];
  children: (toggle: () => void) => JSX.Element | JSX.Element[];
};

const Morphing = (props: MorphingProps) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [morphedElement, setMorphedElement] = createSignal<HTMLDivElement>();

  // NOTE: notably similar system; parentAnimation
  const openAnimation = () => {
    const a = anime
      .timeline({
        easing: "easeOutElastic(1, 0.9)",
        autoplay: false,
      })
      .add({
        targets: morphedElement(),
        height: [0, morphedElement()!.clientHeight],
        opacity: [0, 1],
        duration: 650,
      });
    props.openAnimation.forEach((step) => {
      a.add(step.params, step.offset);
    });
    return a;
  };
  const closeAnimation = () => {
    const height = morphedElement()!.clientHeight - 34;
    const a = anime.timeline({
      easing: "easeOutElastic(1, 0.9)",
      autoplay: false,
    });

    props.closeAnimation.forEach((step) => {
      a.add(step.params, step.offset);
    });
    a.add(
      {
        targets: morphedElement(),
        opacity: [1, 0],
        height: [height, 0],
        duration: 550,
      },
      "-=425",
    );
    return a;
  };

  const { toggle, open, close } = useModalAnimated({
    element: morphedElement,
    openAnimation,
    closeAnimation,
    isOpen,
    setIsOpen,
  });

  css`
    .morphing-wrapper {
      display: relative;
    }
    .morphed {
      display: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  `;
  return (
    <div class="morphing-wrapper">
      <div class="source">{props.children(toggle)}</div>
      <Show when={isOpen()}>
        <div class="morphed" ref={setMorphedElement}>
          {props.to(close)}
        </div>
      </Show>
    </div>
  );
};
export default Morphing;

