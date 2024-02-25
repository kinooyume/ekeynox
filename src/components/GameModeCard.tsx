import { css } from "solid-styled";

export type GameModeCardProps = {
  title: string;
  description: string;
  url: string;
  picture?: string;
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
      height: 400px;
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
    .description {
      text-align: center;
      margin-top: 0;
    }
  `;
  return (
    <a href={props.url} class="card">
      <div class="card-picture">
        <img src={props.picture} alt={props.title} />
      </div>
      <div class="card-content">
        <h2>{props.title}</h2>
        <p class="description">{props.description}</p>
      </div>
    </a>
  );
};

export default GameModeCard;
