import anime from "animejs";
import {
  createSignal,
  onMount,
  type JSX,
  createEffect,
  on,
  type Accessor,
  type Setter,
} from "solid-js";
import { css } from "solid-styled";

// Dropdown like animation with anime.js
// https://codepen.io/NielsVoogt/pen/dyGpNOx

type DropdownProps = {
  id: string;
  label: (isOpen: Accessor<boolean>, hover: Accessor<boolean>) => JSX.Element;
  reverse?: boolean;
  children: (setIsOpen: Setter<boolean>) => JSX.Element;
};

const Dropdown = (props: DropdownProps) => {
  const [isOpen, setIsOpen] = createSignal<boolean>(false);
  const [pendingAnimation, setPendingAnimation] = createSignal(false);
  const [hover, setHover] = createSignal(false);

  const toggle = () => setIsOpen(!isOpen());

  /* Animation */
  let dropdown: HTMLDivElement;
  let dropContent: HTMLDivElement;

  let openAnimation: anime.AnimeInstance;
  let closeAnimation: anime.AnimeInstance;

  onMount(() => {
    closeAnimation = anime
      .timeline({
        easing: "easeOutCubic",
        autoplay: false,
        reverse: true,
      })
      .add({
        targets: dropdown,
        padding: ["8px 26px 26px", "0"],
        top: ["-8px", "0"],
        width: ["800px", "200px"],
        duration: 250,
      })
      .add(
        {
          targets: dropContent,
          height: [280, 0],
          duration: 250,
        },
        "-=150",
      )
      .add(
        {
          targets: `#${props.id} .elem`,
          translateY: [0, 20],
          opacity: [1, 0],
          duration: 160,
          delay: (el, i, l) => i * 120,
        },
        "-=600",
      );

    openAnimation = anime
      .timeline({
        easing: "easeOutElastic(3, 0.8)",
        autoplay: false,
      })
      .add({
        targets: dropdown,
        easing: "easeOutElastic(6, 0.7)",
        padding: ["0", "8px 26px 26px"],
        top: ["0", "-8px"],
        width: ["200px", "800px"],
        duration: 750,
      })
      .add(
        {
          targets: dropContent,
          easing: "easeOutElastic(2, 0.7)",
          height: [0, 280],
          duration: 850,
        },
        "-=650",
      )
      .add(
        {
          targets: `#${props.id} .elem`,
          translateY: [20, 0],
          opacity: [0, 1],
          duration: 300,
          delay: (el, i, l) => i * 120,
        },
        "-=725",
      );
  });

  createEffect(
    on(
      isOpen,
      (isOpen) => {
        if (isOpen) {
          openAnimation.finished.then(() => {
            setPendingAnimation(false);
            if (!hover()) setIsOpen(false);
          });
          setPendingAnimation(true);
          openAnimation.play();
        } else {
          closeAnimation.finished.then(() => {
            setPendingAnimation(false);
          });
          setPendingAnimation(true);
          closeAnimation.play();
        }
      },
      { defer: true },
    ),
  );

  createEffect(
    on(hover, (hover) => {
      if (pendingAnimation() || hover) return;
      setIsOpen(false);
    }),
  );

  css`
    .dropdown-wrapper {
      position: relative;
      margin-left: 12px;
      width: 200px;
      display: block;
      min-width: 200px;
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
      width: 200px;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
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
      width: 800px;
      background-color: var(--color-surface-100);
      height: unset;
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
    }
  `;

  return (
    <div
      id={props.id}
      class={`dropdown-wrapper`}
      classList={{ open: isOpen(), reverse: props.reverse }}
      ref={(el) => {
        el.addEventListener("mouseleave", () => setHover(false));
        el.addEventListener("mouseenter", () => setHover(true));
      }}
    >
      <div class="dropdown" ref={dropdown!}>
        <div class="dropdown-label" onClick={toggle}>
          {props.label(isOpen, hover)}
        </div>
        <div class="dropdown-content" ref={dropContent!}>
          {props.children(setIsOpen)}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
