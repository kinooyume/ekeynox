import { css } from "solid-styled";
import { useI18n } from "~/settings/i18nProvider";

export type CustomInputRef = {
  ref?: HTMLTextAreaElement;
};

export type CustomInputPros = {
  value: string;
  customInput: CustomInputRef;
};

const CustomInput = ({ value, customInput }: CustomInputPros) => {
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
      <textarea ref={customInput.ref} value={value}></textarea>
      {/* <span>{t("customLimit")}</span> */}
    </div>
  );
};

export default CustomInput;
