import anime from "animejs";
import { JSX, createComputed, createSignal, on, onMount } from "solid-js";
import { css } from "solid-styled";

type VerticalDropdownProps = {
  id: string;
  label: JSX.Element | JSX.Element[];
  children: JSX.Element | JSX.Element[];
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
      height: 0;
      width: 150px;
      right: 0;
    }

    .open .vertical-dropdown {
      display: flex;
      padding: 24px;
      height: auto;
      top: 0;
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
  `;

  let openAnimation: () => anime.AnimeInstance;
  let closeAnimation: () => anime.AnimeInstance;

  let dropdown: HTMLDivElement;
  let dropdownMargin: HTMLDivElement;
  let label: HTMLDivElement;

  onMount(() => {
    openAnimation = () =>
      anime
        .timeline({
          autoplay: false,
          easing: "easeOutElastic(1, 0.9)",
        })
        .add({
          targets: dropdown,
          height: [0, dropdown.children[0].clientHeight],
          marginTop: label.clientHeight,
          opacity: [0, 1],
          duration: 650,
        })
        .add(
          {
            targets: `#${`dropdown-${props.id}`} .elem`,
            translateY: [20, 0],
            opacity: [0, 1],
            duration: 400,
            delay: (el, i, l) => i * 60,
          },
          "-=425",
        );
    closeAnimation = () =>
      anime({
        targets: dropdown,
        height: 0,
        opacity: [1, 0],
        duration: 0,
        easing: "easeOutExpo",
      });

    createComputed(
      on(
        isOpen,
        (isOpen) => {
          if (isOpen) {
            const anim = openAnimation();
            anim.finished.then(() => {
              document
                .querySelectorAll(`#${`dropdown-${props.id}`} .elem`)
                ?.forEach((el) => el.removeAttribute("style"));
            });
            anim.play();
            anim.finished.then(() => {
              setPendingAnimation(false);
              if (!hover()) setIsOpen(false);
            });
            setPendingAnimation(true);
          } else {
            const anim = closeAnimation();
            anim.finished.then(() => {
              setPendingAnimation(false);
            });
            setPendingAnimation(true);
            anim.play();
          }
        },
        { defer: true },
      ),
    );

    createComputed(
      on(hover, (hover) => {
        if (pendingAnimation() || hover) return;
        setIsOpen(false);
      }),
    );
  });

  const [isOpen, setIsOpen] = createSignal<boolean>(false);
  const [pendingAnimation, setPendingAnimation] = createSignal(false);
  const [hover, setHover] = createSignal(false);

  const toggle = () => !pendingAnimation() && setIsOpen(!isOpen());

  return (
    <div
      class="vertical-dropdown-wrapper"
      classList={{ open: isOpen() }}
      ref={(el) => {
        dropdownMargin = el;
        el.addEventListener("mouseleave", () => setHover(false));
        el.addEventListener("mouseenter", () => setHover(true));
      }}
    >
      <div
        class="label"
        ref={label!}
        onClick={() => setIsOpen((isOpen) => !isOpen)}
      >
        {props.label}
      </div>
      <div
        class="vertical-dropdown"
        id={`dropdown-${props.id}`}
        ref={dropdown!}
      >
        {props.children}
      </div>
    </div>
  );
};

export default VerticalDropdown;
