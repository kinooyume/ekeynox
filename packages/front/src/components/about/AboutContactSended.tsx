import { Component } from "solid-js";
import { css } from "solid-styled";

type AboutContactSendedProps = {
  close: () => void;
};

const AboutContactSended: Component<AboutContactSendedProps> = (props) => {
  css`
    .message-sended {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      padding: 32px;
      margin-bottom: 32px;
    }
    .actions {
      margin-top: 32px;
    }
    h2 {
      font-weight: 200;
      margin-bottom: 16px;
      font-size: 38px;
      color: var(--text-secondary-color);
    }
    p {
    }
  `;

  return (
    <div class="message-sended">
      <h2>Message envoyé !</h2>
      <p>Merci, je vous recontacterais au plus vite. A bientot !</p>
      <div class="actions">
        <button onClick={props.close} class="primary">
          Ok
        </button>
      </div>
    </div>
  );
};

export default AboutContactSended;
