import { For, createSignal, onMount } from "solid-js";
import kblayout from "./kb-layout.json";
import { css } from "solid-styled";
import KeyboardKeyResume  from "./KeyboardKeyResume";
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
};

const Keyboard = (props: KeyboardProps) => {
  const [keys, setKeys] = createSignal([] as string[]);

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

  const addKey = (key: string) => {
    const keyFound = findPrimaryKey(key);
    if (keyFound) setKeys([...keys(), keyFound]);
  };

  const removeKey = (key: string) => {
    const keyFound = findPrimaryKey(key);
    if (keyFound) setKeys(keys().filter((k) => k !== keyFound));
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
                <KeyboardKeyResume
                  key={k}
                  data={k.map((c) => props.metrics[c])}
                  size={getSize(k[0])}
                  pressed={keys().some((ks) => ks === k[0])}
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
