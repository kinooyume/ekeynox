import {
  Accessor,
  JSX,
  Show,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { css } from "solid-styled";
import Cross from "../svgs/cross";
import {
  AnimateState,
  createAnimationComp,
  isInitialAnimation,
} from "~/animations/animation";
import useAnimateModal from "~/hooks/useAnimateModal";

type VerticalPopoverProps = {
  id: string;
  label: (show: Accessor<boolean>) => JSX.Element | JSX.Element[];
  children: (close: () => void) => JSX.Element | JSX.Element[];
};

const VerticalPopover = (props: VerticalPopoverProps) => {
  css`
    .vertical-popover-wrapper {
      position: relative;
    }

    .vertical-popover {
      border-radius: 12px;
      position: absolute;
      background-color: var(--color-surface-100);
      opacity: 0;
      width: 180px;
      pointer-events: none;
    }

    .open .vertical-popover {
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
      padding: 0;
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

  const [popover, setPopover] = createSignal<HTMLDivElement>();
  const [label, setLabel] = createSignal<HTMLDivElement>();

  const [wrapper, setWrapper] = createSignal<HTMLDivElement>();

  const animation = createAnimationComp({
    parent: {
      enter: () => {
        const height = popover()!.children[0].clientHeight;
        return {
          timeline: { easing: "easeOutElastic(1, 0.9)" },
          params: {
            targets: popover(),
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
          targets: popover(),
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
            targets: `#${`popover-${props.id}`} .elem`,
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

  const [state, setState] = createSignal<AnimateState>(AnimateState.initial);

  const { toggle, toTarget, toInitial } = useAnimateModal({
    animation,
    state,
    setState,
    element: popover,
  });

  const Popover = () => {
    onMount(() => {
      // focus
      // listen for escape
    });

    onCleanup(() => {});

    return (
      <div
        class="vertical-popover"
        ref={setPopover}
        role="dialog"
        id={`popover-${props.id}`}
        aria-labelledby={`popover-${props.id}`}
        aria-modal="false"
      >
        {props.children(toInitial)}
        <div class="cross" onClick={toggle}>
          <Cross />
        </div>
      </div>
    );
  };
  return (
    <div
      class="vertical-popover-wrapper"
      ref={setWrapper}
      classList={{ open: !isInitialAnimation(state()) }}
    >
      <button
        aria-expanded={!isInitialAnimation(state())}
        aria-haspopup="dialog"
        aria-controls={`popover-${props.id}`}
        class="label"
        ref={setLabel}
        onClick={toggle}
      >
        {props.label(() => !isInitialAnimation(state()))}
      </button>
      <Show when={!isInitialAnimation(state())}>
        <Popover />
      </Show>
    </div>
  );
};

export default VerticalPopover;
