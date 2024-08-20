import { Component } from "solid-js";
import { emptyAnimationChildren } from "~/animations/animation";
import Modal from "../ui/Modal";
import Morphing from "../ui/Morphing";
import QuestionMark from "../ui/QuestionMark";
import ContactForm from "./AboutContactForm";
import AboutInfo from "./AboutInfo";

type AboutProps = {};

const About: Component<AboutProps> = (props) => {
  return (
    <div
      class="info"
      style={{
        display: "flex",
        gap: "4px",
      }}
    >
      <span
        class="version"
        style={{
          "font-weight": 200,
          color: "var(--text-secondary-color)",
        }}
      >
        Alpha 0.13-3 ·
      </span>
      <Modal
        portalId="modal-portal"
        childrenAnimation={{
          enter: [
            {
              params: {
                targets: ".modal-about-content.project",
                opacity: [0, 1],
                translateX: [20, 0],
                duration: 500,
              },
              offset: "-=300",
            },
            {
              params: {
                targets: ".modal-about-content.me",
                opacity: [0, 1],
                translateX: [-20, 0],
                duration: 500,
              },
              offset: "-=500",
            },
          ],
          leave: [
            {
              params: {
                targets:
                  ".modal-about-content p, .modal-about-content .animate, .modal-about-content h2",
                opacity: [1, 0],
                translateY: [0, 20],
                delay: (el, i, l) => i * 60,
                duration: 550,
              },
            },
          ],
        }}
        button={(toInitial) => (
          <QuestionMark
            onClick={toInitial}
            colorVariable="text-secondary-color"
          />
        )}
      >
        <Morphing
          sourceAnimation={emptyAnimationChildren}
          targetAnimation={emptyAnimationChildren}
          target={(back) => <ContactForm back={back} />}
        >
          {(t) => <AboutInfo next={t} />}
        </Morphing>
      </Modal>
    </div>
  );
};

export default About;
