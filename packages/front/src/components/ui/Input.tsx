import { Maybe } from "@modular-forms/solid";
import { Component, Show } from "solid-js";
import { css } from "solid-styled";

type Props = {
  label: string;
  type: string;
  error: string;
  value: Maybe<string>;
  placeholder: string;
  inputProps?: Record<string, any>;
  required?: boolean;
};

const Input: Component<Props> = (props) => {
  css`
    .input-wrapper {
      display: flex;
      flex-direction: column;
    }

    label {
      margin: 4px 0;
      font-size: 14px;
      font-weight: 400;
      text-transform: capitalize;
    }

    .input-wrapper.invalid input {
      border-color: red;
    }

    input {
      padding: 16px 20px;
    }

    .error-wrapper {
      height: 24px;
      width: 100%;
      padding-bottom: 6px;
    }

    .error {
      color: red;
      height: 20px;
      margin: 4px;
    }
  `;

  return (
    <div class="input-wrapper" classList={{ invalid: props.error.length > 0 }}>
      <label>{props.label}</label>
      <input
        type={props.type}
        {...props.inputProps}
        value={props.value}
        placeholder={props.placeholder}
        required={props.required}
      />
      <p class="error">{props.error}</p>
    </div>
  );
};

export default Input;
