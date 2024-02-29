import { createSignal } from "solid-js";
import { css } from "solid-styled";

type GameCustomParamsProps = {
  setContent: (content: string) => void;
};

const GameCustomParams = (props: GameCustomParamsProps) => {
  css`
div {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  width: 100%;
  padding: 0 30px;
}

textarea {
  margin: 12px;
}

`;
  let inputRef: HTMLTextAreaElement;
  return (
    <div>
      <textarea ref={inputRef!}></textarea>
      <button onClick={() => props.setContent(inputRef.value)}>
        Let's go !
      </button>
    </div>
  );
};

export default GameCustomParams;
