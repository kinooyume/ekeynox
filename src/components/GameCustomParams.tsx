import { createSignal } from "solid-js";

type GameCustomParamsProps = {
  setContent: (content: string) => void;
};

const GameCustomParams = (props: GameCustomParamsProps) => {

  let inputRef: HTMLTextAreaElement;
  return (
    <div>
      <textarea ref={inputRef!}></textarea>
      <button onClick={() => props.setContent(inputRef.value)}>Let's go !</button>
    </div>
  );
};

export default GameCustomParams;
