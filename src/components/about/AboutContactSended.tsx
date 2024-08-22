import { Component } from "solid-js";

type AboutContactSendedProps = {
}

const AboutContactSended: Component<AboutContactSendedProps> = (props) => {
  return <div class="message-sended">
    <h2>Message envoyé !</h2>
    <p>Merci, je vous recontacterais au plus vite. A bientot !</p>
    </div>
}

export default AboutContactSended;
