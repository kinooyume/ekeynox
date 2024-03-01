import { createSignal } from "solid-js";
import { css } from "solid-styled";
import type { Translator } from "./App";

type GameCustomParamsProps = {
  setContent: (content: string) => void;
  t: Translator;
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
        {props.t("letsGo")}
      </button>
    </div>
  );
};

export default GameCustomParams;
