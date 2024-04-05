import { css } from "solid-styled";

export type CustomInputRef = {
  ref?: HTMLTextAreaElement;
};

export type CustomInputPros = {
  value: string;
  customInput: CustomInputRef;
};

const CustomInput = ({ value, customInput }: CustomInputPros) => {
  css`
    textarea {
      width: calc(100% - 24px);
    }
  `;
  return <textarea ref={customInput.ref} value={value}></textarea>;
};

export default CustomInput;
