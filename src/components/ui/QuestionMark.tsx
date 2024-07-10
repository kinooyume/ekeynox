import { css } from "solid-styled";

type QuestionMarkProps = {
  onClick: () => void;
  colorVariable: string;
};

const QuestionMark = (props: QuestionMarkProps) => {
  css`
    button {
      border-radius: 50%;
      background-color: var(--color-surface-alt);
      filter: grayscale(80%);
      cursor: pointer;
      width: 18px;
      height: 18px;
      padding: 2px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    span {
      color: ${`var(--${props.colorVariable})`};
      font-size: 12px;
    }
    button:hover {
      filter: none;
    }
  `;
  return (
    <button onClick={props.onClick}>
      <span>?</span>
    </button>
  );
};

export default QuestionMark;
