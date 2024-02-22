import { For, createComputed, createSignal, onMount } from "solid-js";
import kblayout from "./kb-layout.json";
import { css } from "solid-styled";
import KeyboardKey from "./KeyboardKey";
import type { KeysProjection } from "./KeyMetrics";

type Size = {
  default: number;
  special: { [key: string]: string };
};

const currentKb = "qwerty";
const size: Size = kblayout[currentKb].positions;
const layoutKeys = kblayout[currentKb].keys;

const getSize = (k: string): string => {
  const special = size.special[k];
  return typeof special === "string" ? special : "";
};

type keyCb = (key: string) => void;

export type TypingKeyboardRef = {
  keyUp: keyCb;
  keyDown: keyCb;
};

type KeyboardProps = {
  ref?: (ref: TypingKeyboardRef) => void;
  metrics: KeysProjection;
  layout: string;
  keySet: Set<string>;
  // children: (props: KeyboardKeyProps) => JSX.Element;
  currentKey: string;
};

const Keyboard = (props: KeyboardProps) => {
  const [pressedKeys, setPressedKeys] = createSignal([] as string[]);

  const findPrimaryKey = (key: string) => {
    let keyFound;
    layoutKeys.some((row) =>
      row.some((fullKey) => {
        let keyIndex = fullKey.findIndex((k) => k === key);
        if (keyIndex === -1) return false;
        keyFound = fullKey[0];
        return true;
      }),
    );
    return keyFound;
  };

  // NOTE: use a store/memo maybe ?
  const addKey = (key: string) => {
    const keyFound = findPrimaryKey(key);
    if (keyFound) setPressedKeys([...pressedKeys(), keyFound]);
  };

  const removeKey = (key: string) => {
    const keyFound = findPrimaryKey(key);
    if (keyFound) setPressedKeys(pressedKeys().filter((k) => k !== keyFound));
  };

  onMount(() => {
    props.ref?.({ keyUp: removeKey, keyDown: addKey });
  });
  css`
    .kb {
      display: flex;
      opacity: 0.8;
      flex-direction: column;
      width: 100%;
      user-select: none;
    }
    .row {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `;

  return (
    <div class="kb">
      <For each={layoutKeys}>
        {(row) => (
          <div class="row">
            <For each={row}>
              {(k) => (
                <KeyboardKey
                  key={k}
                  current={k.includes(props.currentKey)}
                  data={k.map((c) => props.metrics[c])}
                  size={getSize(k[0])}
                  pressed={pressedKeys().includes(k[0])}
                />
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  );
};

export default Keyboard;
