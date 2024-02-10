import { For, Show, createSignal, onMount } from "solid-js";
import kblayout from "./kb-layout.json";
import { css } from "solid-styled";

const size = kblayout.positions.iso;

type keyCb = (key: string) => void;

export type TypingKeyboardRef = {
  keyUp: keyCb;
  keyDown: keyCb;
};

type KeyboardProps = {
  ref?: (ref: TypingKeyboardRef) => void;
};

const Keyboard = (props: KeyboardProps) => {
  const [keys, setKeys] = createSignal([] as string[]);

  const addKey = (key: string) => setKeys([...keys(), key]);
  const removeKey = (key: string) => setKeys(keys().filter((k) => k !== key));

  onMount(() => {
    props.ref?.({ keyUp: removeKey, keyDown: addKey });
  })
  css`
    .kb {
      display: flex;
      flex-direction: column;
      width: 100%;
      user-select: none;
    }
    .row {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .key,
    .flat {
      display: flex;
      position: relative;
      justify-content: center;
      align-items: center;
      margin: 8px;
      min-width: 50px;
      padding: 10px;
      height: 50px;
      border-radius: 16px;
      background: #e0e0e0;
      box-shadow:
        6px 6px 12px #bebebe,
        -6px -6px 12px #ffffff;
    }
    .concave {
      background: linear-gradient(145deg, #cacaca, #f0f0f0);
      box-shadow:
        6px 6px 12px #bebebe,
        -6px -6px 12px #ffffff;
    }
    .convex {
      background: linear-gradient(145deg, #f0f0f0, #cacaca);
      box-shadow:
        6px 6px 12px #bebebe,
        -6px -6px 12px #ffffff;
    }
    .pressed {
      background: #e0e0e0;
      box-shadow:
        inset 6px 6px 12px #bebebe,
        inset -6px -6px 12px #ffffff;
    }

    .key.double {
      width: 100px;
    }

    .key.two {
      width: 65px;
    }

    .key.five {
      width: 75px;
    }

    .key.seven {
      width: 90px;
    }
    .key.space {
      width: 450px;
    }

    .primary {
      font-size: 1em;
    }
    .secondary {
      font-size: 0.7em;
      color: #666;
      position: absolute;
      top: 9px;
      right: 16px;
      float: right;
    }
  `;

  const transform = (k: string) => {
    switch (k) {
      case "Tab":
        return "↹";
      case "Enter":
        return "⏎";
      case "Backspace":
        return "⌫";
      case "Shift":
        return "⇧";
      case "CapsLock":
        return "⇪";
      case "Control":
        return "Ctrl";
      case "Alt":
        return "Alt";
      case " ":
        return "␣";
      default:
        return k;
    }
  };

  const getSize = (k: string): string => {
    const keyTyped = k as keyof typeof size.special;
    const special = size.special[keyTyped];
    if (typeof special === "string") return special;
    return "";
  };

  return (
    <div class="kb">
      <For each={kblayout.qwerty.keys}>
        {(row) => (
          <div class="row">
            <For each={row}>
              {(k) => (
                <div
                  class={`${k.some((ck) => keys().includes(ck)) ? "pressed" : ""} key ${getSize(k[0])}`}
                >
                  <Show when={k[1] !== undefined}>
                    <span class="secondary">{k[1]}</span>
                  </Show>
                  <span class="primary">{transform(k[0])}</span>
                </div>
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  );
};

export default Keyboard;
