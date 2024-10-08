import {
  createSignal,
  type JSX,
  type Accessor,
  type Setter,
  Show,
} from "solid-js";
import { css } from "solid-styled";
import {
  AnimateState,
  createAnimationComp,
  isInitialAnimation,
} from "~/animations/animation";
import Cross from "~/svgs/cross";
import useAnimateModal from "~/primitives/useAnimateModal";

// Dropdown like animation with anime.js
// https://codepen.io/NielsVoogt/pen/dyGpNOx

type DropdownProps = {
  id: string;
  label: (isOpen: Accessor<boolean>, hover: Accessor<boolean>) => JSX.Element;
  reverse?: boolean;
  children: (setIsOpen: Setter<boolean>) => JSX.Element;
};

const Dropdown = (props: DropdownProps) => {
  const [dropdown, setDropdown] = createSignal<HTMLDivElement>();

  const [state, setState] = createSignal<AnimateState>(AnimateState.initial);

  const [hover, setHover] = createSignal(false);

  const animation = createAnimationComp({
    parent: {
      enter: () => ({
        timeline: { easing: "easeOutElastic(1, 0.9)" },
        params: {
          targets: dropdown(),
          padding: ["0", "8px 26px 26px"],
          height: [48, 380],
          top: ["0", "-8px"],
          width: [200, 820],
          duration: 650,
        },
      }),
      leave: () => ({
        timeline: {
          easing: "easeOutCubic",
        },
        params: {
          targets: dropdown(),
          padding: ["8px 26px 26px", "0"],
          top: ["-8px", "0"],
          width: ["800px", "200px"],
          height: [380, 48],
          duration: 250,
        },
      }),
    },
    children: {
      enter: [
        {
          params: {
            targets: `#${props.id} .elem`,
            translateY: [20, 0],
            opacity: [0, 1],
            duration: 400,
            delay: (el, i, l) => i * 120,
          },
          offset: "-=425",
        },
      ],
      leave: [
        {
          params: {
            targets: `#${props.id} .elem`,
            translateY: [0, 20],
            opacity: [1, 0],
            duration: 160,
            delay: (el, i, l) => i * 120,
          },
          offset: "-=600",
        },
      ],
    },
  });
  const { toggle, toInitial } = useAnimateModal({
    animation,
    state,
    setState,
    element: dropdown,
  });

  css`
    .dropdown-wrapper {
      position: relative;
      margin-left: 12px;
      width: 200px;
      display: block;
      min-width: 200px !important;
      z-index: 205;
      height: 48px;
    }

    .dropdown-label {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 60px;
    }
    .dropdown {
      overflow: hidden;
      position: absolute;
      border-radius: 12px;
      z-index: 999;
      width: 200px;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      border: 1px solid transparent;
      background-color: var(--color-surface-100);
      transition-duration: 0.5s;
      transition-timing-function: cubic-bezier(0.48, 1.08, 0.5, 0.63);
      transition-property: transform;
    }
    .dropdown-wrapper.reverse .dropdown {
      right: 0;
    }

    .dropdown:hover {
      border: 1px solid var(--background-color);
    }

    .dropdown-wrapper.open .dropdown {
      background-color: var(--color-surface-100);
      padding: 8px 26px 26px;
      top: -8px;
      border: 1px solid var(--background-color);
      box-shadow:
        0.6px 1.8px 2.2px rgba(0, 0, 0, 0.02),
        1.5px 4.3px 5.3px rgba(0, 0, 0, 0.028),
        2.9px 8px 10px rgba(0, 0, 0, 0.035),
        5.1px 14.3px 17.9px rgba(0, 0, 0, 0.042),
        9.6px 26.7px 33.4px rgba(0, 0, 0, 0.05),
        23px 64px 80px rgba(0, 0, 0, 0.07);
    }

    .dropdown-wrapper.open .dropdown label {
      background-color: var(--color-surface-100);
    }
    .dropdown-wrapper.open .dropdown label:hover {
      background-color: var(--background-color);
    }

    .dropdown-content {
      display: flex;
      height: 0;
    }

    .open .dropdown-content {
      height: 260px;
    }

    .cross {
      cursor: pointer;
      opacity: 0.8;
    }

    .cross:hover {
      opacity: 1;
    }
  `;

  return (
    <div
      id={props.id}
      class={`dropdown-wrapper`}
      classList={{
        open: !isInitialAnimation(state()),
        reverse: props.reverse,
      }}
      ref={(el) => {
        el.addEventListener("mouseleave", () => setHover(false));
        el.addEventListener("mouseenter", () => setHover(true));
      }}
    >
      <div class="dropdown" ref={setDropdown}>
        <div class="dropdown-label" onClick={toggle}>
          {props.label(() => !isInitialAnimation(state()), hover)}
          <Show when={!isInitialAnimation(state())}>
            <div class="cross">
              <Cross />
            </div>
          </Show>
        </div>
        <Show when={!isInitialAnimation(state())}>
          <div class="dropdown-content">{props.children(toInitial)}</div>
        </Show>
      </div>
    </div>
  );
};

export default Dropdown;
