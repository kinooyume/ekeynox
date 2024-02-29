import type { JSXElement } from "solid-js";
import { css } from "solid-styled";

export type GameModeCardProps = {
  title: string;
  description: string;
  picture?: string;
  onClick: () => void;
  selected?: boolean;
  children?: JSXElement;
};

const GameModeCard = (props: GameModeCardProps) => {
  css`
    .card {
      display: flex;
      border: 2px solid #000;
      border-radius: 8px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 300px;
      cursor: pointer;
      min-height: 400px;
      border-radius: 8px;
      box-shadow:
        2px 2px 7px #000,
        -2px -2px 7px #000;
      margin: 16px;
    }
    .card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .card-picture {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 16px;
    }
    img {
      width: 100%;
      max-width: 162px;
      height: 100%;
      border-radius: 8px;
    }
    .title {
      font-size: 1.5rem;
      font-weight: light;
    }
    .description {
      font-weight: normal;
    }
    .description {
      text-align: center;
      margin-top: 0;
    }

    a .params {
      display: none;
    }
    a.selected .params {
      display: flex;
      width: 100%;
      padding-bottom: 26px;
    }
  `;

  return (
    <a
      onClick={props.onClick}
      classList={{ selected: props.selected }}
      class="card"
    >
      <div class="card-picture">
        <img src={props.picture} alt={props.title} />
      </div>
      <div class="card-content">
        <p class="title">{props.title}</p>
        <p class="description">{props.description}</p>
      </div>
      <div class="params">{props.children}</div>
    </a>
  );
};

export default GameModeCard;
