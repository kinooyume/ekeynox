import { For, createSignal, onMount } from "solid-js";
import { css } from "solid-styled";
import KeyboardKey from "./KeyboardKey";
import type { KeysProjection } from "./KeyMetrics";
import type { KeyboardLayout } from "./KeyboardLayout";

export type TypingKeyboardRef = {
  keyUp: (key: string) => void;
  keyDown: (key: string) => void;
};

type KeyboardProps = {
  ref?: (ref: TypingKeyboardRef) => void;
  metrics: KeysProjection;
  layout: KeyboardLayout;
  // children: (props: KeyboardKeyProps) => JSX.Element;
  currentKey: string;
};

const Keyboard = (props: KeyboardProps) => {
  const [pressedKeys, setPressedKeys] = createSignal<string[]>([]);

  const findPrimaryKey = (key: string) => {
    const keyFound =
      props.layout.layoutFlat.find((lKey) => lKey.all.includes(key)) ||
      props.layout.extra.find((lKey) => lKey.all.includes(key));
    return keyFound ? keyFound.primary : "";
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
      max-width: 1032px;
      user-select: none;
    }
    .row {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .extraKeys {
      margin-top: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `;

  return (
    <div class="kb">
      <For each={props.layout.layout}>
        {(row) => (
          <div class="row">
            <For each={row}>
              {(lKey) => (
                <KeyboardKey
                  key={lKey.all}
                  used={lKey.used}
                  current={lKey.all.includes(props.currentKey)}
                  data={lKey.all.map((c) => props.metrics[c])}
                  size={lKey.size}
                  pressed={pressedKeys().includes(lKey.primary)}
                />
              )}
            </For>
          </div>
        )}
      </For>
      <div class="extraKeys">
        <For each={props.layout.extra}>
          {(lKey) => (
            <KeyboardKey
              key={lKey.all}
              used={lKey.used}
              current={lKey.all.includes(props.currentKey)}
              data={lKey.all.map((c) => props.metrics[c])}
              size={lKey.size}
              pressed={pressedKeys().includes(lKey.primary)}
            />
          )}
        </For>
      </div>
    </div>
  );
};

export default Keyboard;
