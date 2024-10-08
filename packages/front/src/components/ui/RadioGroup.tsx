import { Show, type JSXElement, For } from "solid-js";
import { css } from "solid-styled";

type InputProps<Value> = {
  label: string;
  value: Value;
  icon?: JSXElement;
};

type RadioGroupProps<Value> = {
  name: string;
  values: InputProps<Value>[];
  compare: (value: Value) => boolean;
  setChecked: (value: Value) => void;
  children?: JSXElement;
  tiny?: boolean;
};

function RadioGroup<Value>(props: RadioGroupProps<Value>) {
  css`
    .icon {
      height: 15px;
      padding: 4px 8px;
      padding-top: 0;
      display: inline-block;
      justify-content: center;
      align-items: center;
    }

    .icon.time {
      padding-top: 3px;
    }

    .icon.repeat-content {
      padding-top: 4px;
    }

    .radio-group {
      --padding: 8px 20px;
      border-radius: 10px;
      background-color: var(--background-radiogroup);
      padding: var(--padding);

      position: relative;
      display: flex;
      border: 1px solid var(--background-color);
      transition: all 100ms linear;
    }

    .radio-group.tiny {
      --padding: 8px 20px;
    }

    .radio-group input:not(:checked) + label:hover {
      color: var(--color-primary-100);
    }

    .radio-group input:not(:checked) + label:hover {
      background-color: var(--color-primary-600);
      fill: var(--text-color-black);
    }
    .radio-group input:not(:checked) + label:hover span {
      color: var(--text-color-black);
    }

    .input + .input {
      margin-left: 6px;
    }
    .radio-group input {
      display: none;
    }

    .radio-group input + label {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      width: auto;
      height: 15px;
      cursor: pointer;
      border-radius: 6px;
      padding: 4px 8px;
      color: var(--text-color);
      text-transform: capitalize;
      fill: var(--text-color);
      font-size: 14px;
      transition: all 100ms linear;
    }

    .label-text {
      font-size: 14px;
      padding-top: 2px;
    }

    .radio-group input:checked + label {
      background-color: var(--color-primary-400);
      color: var(--text-color-black);
      fill: var(--text-color-black);
      animation: rubberBand 0.6s both;
    }

    .radio-group input:checked + label .label-text {
      color: var(--color-selected);
    }

    @media screen and (max-width: 1300px) {
      .radio-group {
        padding: 4px 18px;
      }
    }

    @keyframes rubberBand {
      0% {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
      }

      30% {
        -webkit-transform: scale3d(1.25, 0.75, 1);
        transform: scale3d(1.25, 0.75, 1);
      }

      40% {
        -webkit-transform: scale3d(0.75, 1.25, 1);
        transform: scale3d(0.75, 1.25, 1);
      }

      50% {
        -webkit-transform: scale3d(1.15, 0.85, 1);
        transform: scale3d(1.15, 0.85, 1);
      }

      65% {
        -webkit-transform: scale3d(0.95, 1.05, 1);
        transform: scale3d(0.95, 1.05, 1);
      }

      75% {
        -webkit-transform: scale3d(1.05, 0.95, 1);
        transform: scale3d(1.05, 0.95, 1);
      }

      100% {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
      }
    }
  `;
  return (
    <div
      class="radio-group"
      classList={{
        tiny: props.tiny,
      }}
    >
      <For each={props.values}>
        {(value) => (
          <div class="input">
            <input
              type="radio"
              id={value.label}
              name={value.label}
              value={value.value as string}
              checked={props.compare(value.value)}
            />
            <label
              for={value.label}
              onClick={(_) => props.setChecked(value.value)}
            >
              <Show when={value.icon}>{value.icon}</Show>
              <span class="label-text">{value.label}</span>
            </label>
          </div>
        )}
      </For>
    </div>
  );
}

export default RadioGroup;
