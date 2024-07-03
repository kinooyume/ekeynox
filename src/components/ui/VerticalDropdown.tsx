import anime from "animejs";
import useClickOutside from "solid-click-outside";
import {
  Accessor,
  JSX,
  Setter,
  Show,
  createComputed,
  createSignal,
  on,
  onMount,
} from "solid-js";
import { css } from "solid-styled";
import Cross from "../svgs/cross";
import { FocusType, useFocus } from "./FocusProvider";

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
      height: 0;
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

  let openAnimation: () => anime.AnimeInstance;
  let closeAnimation: () => anime.AnimeInstance;

  let dropdown: HTMLDivElement;
  let dropdownMargin: HTMLDivElement;
  let label: HTMLDivElement;

  const [wrapper, setWrapper] = createSignal<HTMLDivElement>();
  const [currentAnime, setCurrentAnime] = createSignal<
    anime.AnimeInstance | undefined
  >();

  useClickOutside(wrapper, () => {
    // TODO: cancel animation instead
    if (isOpen()) {
      const ca = currentAnime();
      if (ca) {
        ca.pause();
        setPendingAnimation(false);
      }
      setIsOpen(false);
    }
  });

  onMount(() => {
    openAnimation = () => {
      const a = anime
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
      setCurrentAnime(a);
      return a;
    };
    closeAnimation = () => {
      const a = anime({
        targets: dropdown,
        height: 0,
        opacity: [1, 0],
        duration: 0,
        easing: "easeOutExpo",
      });
      setCurrentAnime(a);
      return a;
    };

    const { setFocus } = useFocus();

    createComputed(
      on(
        isOpen,
        (isOpen) => {
          if (pendingAnimation()) return;
          if (isOpen) {
            const anim = openAnimation();
            setFocus(FocusType.Hud);
            setPendingAnimation(true);
            anim.finished.then(() => {
              document
                .querySelectorAll(`#${`dropdown-${props.id}`} .elem`)
                ?.forEach((el) => el.removeAttribute("style"));
            });
            anim.play();
            anim.finished.then(() => {
              setPendingAnimation(false);
            });
          } else {
            setFocus(FocusType.View);
            setPendingAnimation(true);
            const anim = closeAnimation();
            anim.finished.then(() => {
              setPendingAnimation(false);
            });
            anim.play();
          }
        },
        { defer: true },
      ),
    );
  });

  const [isOpen, setIsOpen] = createSignal<boolean>(false);
  const [pendingAnimation, setPendingAnimation] = createSignal(false);

  const toggle = () => !pendingAnimation() && setIsOpen(!isOpen());

  return (
    <div
      class="vertical-dropdown-wrapper"
      ref={setWrapper}
      classList={{ open: isOpen() }}
    >
      <div class="label" ref={label!} onClick={() => toggle()}>
        {props.label(isOpen)}
      </div>
      <div
        class="vertical-dropdown"
        id={`dropdown-${props.id}`}
        ref={dropdown!}
      >
        {props.children(() => setIsOpen(false))}
        <Show when={isOpen()}>
          <div class="cross" onClick={toggle}>
            <Cross />
          </div>
        </Show>
      </div>
    </div>
  );
};

export default VerticalDropdown;
