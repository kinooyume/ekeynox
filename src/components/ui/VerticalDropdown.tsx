import anime from "animejs";
import { Accessor, JSX, Show, createSignal } from "solid-js";
import { css } from "solid-styled";
import Cross from "../svgs/cross";
import { createAnimationComp } from "~/animations/animation";
import useAnimateModal from "~/hooks/animateModal";

type VerticalDropdownProps = {
  id: string;
  label: (show: Accessor<boolean>) => JSX.Element | JSX.Element[];
  children: (close: () => void) => JSX.Element | JSX.Element[];
};

const VerticalDropdown = (props: VerticalDropdownProps) => {
  css`
    .vertical-dropdown-wrapper {
      position: relative;
    }

    .vertical-dropdown {
      border-radius: 12px;
      position: absolute;
      background-color: var(--color-surface-100);
      opacity: 0;
      width: 150px;
      pointer-events: none;
    }

    .open .vertical-dropdown {
      display: flex;
      padding: 24px;
      pointer-events: auto;
      height: auto;
      top: 0;
      right: 0;
      border: 1px solid var(--background-color);
      box-shadow:
        0.6px 1.8px 2.2px rgba(0, 0, 0, 0.02),
        1.5px 4.3px 5.3px rgba(0, 0, 0, 0.028),
        2.9px 8px 10px rgba(0, 0, 0, 0.035),
        5.1px 14.3px 17.9px rgba(0, 0, 0, 0.042),
        9.6px 26.7px 33.4px rgba(0, 0, 0, 0.05),
        23px 64px 80px rgba(0, 0, 0, 0.07);
    }
    .label {
      cursor: pointer;
    }

    .cross {
      position: absolute;
      opacity: 0.8;
      cursor: pointer;
      right: 24px;
      z-index: 200;
      transition: opacity 0.2s ease-in-out;
    }

    .cross:hover {
      opacity: 1;
    }
  `;

  const [dropdown, setDropdown] = createSignal<HTMLDivElement>();
  const [label, setLabel] = createSignal<HTMLDivElement>();

  const [wrapper, setWrapper] = createSignal<HTMLDivElement>();

  const animation = createAnimationComp({
    parent: {
      enter: () => {
        const height = dropdown()!.children[0].clientHeight;
        return {
          timeline: { easing: "easeOutElastic(1, 0.9)" },
          params: {
            targets: dropdown(),
            height: [0, height],
            marginTop: label()!.clientHeight,
            opacity: [0, 1],
            duration: 650,
          },
        };
      },
      leave: () => ({
        timeline: { easing: "easeOutExpo" },
        params: {
          targets: dropdown(),
          height: 0,
          opacity: [1, 0],
          duration: 0,
          easing: "easeOutExpo",
        },
      }),
    },
    children: {
      enter: [
        {
          params: {
            targets: `#${`dropdown-${props.id}`} .elem`,
            translateY: [20, 0],
            opacity: [0, 1],
            duration: 400,
            delay: (el, i, l) => i * 60,
          },
          offset: "-=425",
        },
      ],
      leave: [],
    },
  });

  const [isOpen, setIsOpen] = createSignal<boolean>(false);

  const { toggle } = useAnimateModal({
    animation,
    isOpen,
    setIsOpen,
    element: wrapper,
  });

  return (
    <div
      class="vertical-dropdown-wrapper"
      ref={setWrapper}
      classList={{ open: isOpen() }}
    >
      <div class="label" ref={setLabel} onClick={toggle}>
        {props.label(isOpen)}
      </div>
      <Show when={isOpen()}>
        <div
          class="vertical-dropdown"
          id={`dropdown-${props.id}`}
          ref={setDropdown}
        >
          {props.children(() => setIsOpen(false))}
          <div class="cross" onClick={toggle}>
            <Cross />
          </div>
        </div>
      </Show>
    </div>
  );
};

export default VerticalDropdown;
