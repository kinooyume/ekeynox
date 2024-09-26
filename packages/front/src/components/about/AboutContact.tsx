import { Component, onMount } from "solid-js";
import Morphing  from "../ui/Morphing";
import AboutContactForm from "./AboutContactForm";
import { emptyAnimationChildren } from "~/animations/animation";
import AboutContactSended from "./AboutContactSended";
import { css } from "solid-styled";
import ContactForm from "./AboutContactForm";

type AboutContactProps = {
  back: () => void;
  exit: () => void;
  onTransition?: (t: TransitionSize) => void;
};

// NOTE: example of nested morphin
// example aussi de Morphing unilateral

const AboutContact: Component<AboutContactProps> = (props) => {
  css`
    .about-contact {
      display: block;
    }
  `;
  return (
    <div
      class="about-contact"
      ref={(el) => {
        console.log(el.clientWidth);
      }}
    >
      <Morphing
        sourceAnimation={emptyAnimationChildren}
        targetAnimation={emptyAnimationChildren}
        onTransition={props.onTransition}
        target={() => <AboutContactSended close={props.exit} />}
      >
        {(toggle) => <ContactForm back={props.back} onSuccess={toggle} />}
      </Morphing>
    </div>
  );
};

export default AboutContact;
