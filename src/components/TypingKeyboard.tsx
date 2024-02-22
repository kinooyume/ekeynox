import { For, createComputed, createSignal, onMount } from "solid-js";
import kblayout from "./kb-layout.json";
import { css } from "solid-styled";
import KeyboardKey from "./KeyboardKey";
import type { KeysProjection } from "./KeyMetrics";

export type TypingKeyboardRef = {
  keyUp: (key: string) => void;
  keyDown: (key: string) => void;
};

type KeyboardProps = {
  ref?: (ref: TypingKeyboardRef) => void;
  metrics: KeysProjection;
  layout: string;
  keySet: Set<string>;
  // children: (props: KeyboardKeyProps) => JSX.Element;
  currentKey: string;
};

type KeySize = Record<string, string>;
const Keyboard = (props: KeyboardProps) => {
  const [pressedKeys, setPressedKeys] = createSignal<string[]>([]);
  const [layoutKeys, setLayoutKeys] = createSignal<string[][][]>([]);
  const [keySizes, setKeySizes] = createSignal<KeySize>({});

  createComputed(() => {
    const layout = kblayout[props.layout as keyof typeof kblayout];
    if (!layout) return;
    // TODO: merge keys & positions
    setLayoutKeys(layout.keys);
    setKeySizes(layout.positions);
  });

  const findPrimaryKey = (key: string) => {
    let keyFound;
    layoutKeys().some((row) =>
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
      <For each={layoutKeys()}>
        {(row) => (
          <div class="row">
            <For each={row}>
              {(k) => (
                <KeyboardKey
                  key={k}
                  current={k.includes(props.currentKey)}
                  data={k.map((c) => props.metrics[c])}
                  size={keySizes()[k[0]] || ""}
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
