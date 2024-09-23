import { For, Show, createEffect, createSignal, onMount } from "solid-js";
import { useWindowSize } from "@solid-primitives/resize-observer";
import { css } from "solid-styled";
import type { KeysProjection } from "../metrics/KeysProjection";
import KeyboardKey from "./KeyboardKey";
import { KeyboardLayout } from "~/settings/keyboardLayout";

export type KeyboardHandler = {
  keyUp: (key: string) => void;
  keyDown: (key: string) => void;
};

type KeyboardProps = {
  ref?: (ref: KeyboardHandler) => void;
  metrics: KeysProjection;
  layout: KeyboardLayout;
  // children: (props: KeyboardKeyProps) => JSX.Element;
  currentKey: string;
};

const Keyboard = (props: KeyboardProps) => {
  const [pressedKeys, setPressedKeys] = createSignal<string[]>([]);
  const [showKb, setShowKb] = createSignal(true);

  const size = useWindowSize();
  createEffect(() => {
    if (size.width < 1120 || size.height < 800) {
      setShowKb(false);
    } else {
      setShowKb(true);
    }
  });
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
      flex-direction: column;
      width: 100%;
      max-width: 1032px;
      user-select: none;
      margin: auto 0;
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

  // PERF: key.data, find a way to not redo a map each time
  // maybe just used signal ?
  // ON a deja la separaton en used..
  // OUAI ! Ou alors juste, on recupere les used separement
  // et on crée un signal pour key
  // qui lui envois le nouveau truc du coup

  const blankCharacters = [" ", "Enter"];
  return (
    <Show when={showKb()}>
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
                    data={
                      blankCharacters.includes(lKey.primary)
                        ? []
                        : lKey.all.map((c) => props.metrics[c]).filter((c) => c)
                    }
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
                data={lKey.all.map((c) => props.metrics[c]).filter((c) => c)}
                size={lKey.size}
                pressed={pressedKeys().includes(lKey.primary)}
              />
            )}
          </For>
        </div>
      </div>
    </Show>
  );
};

export default Keyboard;
