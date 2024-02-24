import { Show, createSignal } from "solid-js";
import TypingGame from "./TypingGame";

const CustomGame = () => {
  const [text, setText] = createSignal("");
  const [ready, setReady] = createSignal(false);

  let inputRef: HTMLTextAreaElement;

  return (
    <Show when={!ready()} fallback={<TypingGame source={text()} />}>
      <div>
        <textarea  ref={inputRef!}></textarea>
        <button
          onClick={() => {
            setText(inputRef.value);
            setReady(true);
          }}
        >
          Let's go !
        </button>
      </div>
    </Show>
  );
};

export default CustomGame;
