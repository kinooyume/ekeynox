import { css } from "solid-styled";
import { useI18n } from "~/settings/i18nProvider";

export type CustomInputRef = {
  ref?: HTMLTextAreaElement;
};

export type CustomInputPros = {
  value: string;
  customInput: CustomInputRef;
  onInput: (s: string) => void;
};

const CustomInput = (props: CustomInputPros) => {
  const t = useI18n();

  css`
    .custom-input {
      width: calc(100% - 24px);
    }
    textarea {
      width: 100%;
    }
    span {
      opacity: 0.6;
      margin: 12px 6px;
    }
  `;

  return (
    <div class="custom-input">
      <textarea
        ref={props.customInput.ref}
        value={props.value}
        onInput={(event) =>
          props.onInput((event.target as HTMLTextAreaElement).value)
        }
      ></textarea>
    </div>
  );
};

export default CustomInput;
