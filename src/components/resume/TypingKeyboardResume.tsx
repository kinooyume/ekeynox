import { For, createSignal, onMount } from "solid-js";
import { css } from "solid-styled";
import KeyboardKeyResume from "./KeyboardKeyResume";
import type { KeysProjection } from "../metrics/KeysProjection";
import type { KeyboardLayout } from "../keyboard/KeyboardLayout";

type KeyboardProps = {
  metrics: KeysProjection;
  layout: KeyboardLayout;
};

const KeyboardResume = (props: KeyboardProps) => {
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
                <KeyboardKeyResume
                  key={lKey.all}
                  used={lKey.used}
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
            <KeyboardKeyResume
              key={lKey.all}
              used={lKey.used}
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

export default KeyboardResume;
