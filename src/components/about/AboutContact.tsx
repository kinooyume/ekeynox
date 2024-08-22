import { Component, onMount } from "solid-js";
import Morphing, { TransitionSize } from "../ui/Morphing";
import AboutContactForm from "./AboutContactForm";
import { emptyAnimationChildren } from "~/animations/animation";
import AboutContactSended from "./AboutContactSended";
import { css } from "solid-styled";

type AboutContactProps = {
  back: () => void;
  onTransition?: (t: TransitionSize) => void;
};

// NOTE: example of nested morphing
// example aussi de Morphing unilateral

const AboutContact: Component<AboutContactProps> = (props) => {
  css`
    .about-contact {
      display: block;
      width: 400px;
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
        target={() => <AboutContactSended />}
      >
        {(t) => <AboutContactForm back={props.back} />}
      </Morphing>
    </div>
  );
};

export default AboutContact;
