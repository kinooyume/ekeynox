export type CustomInputRef = {
  ref?: HTMLTextAreaElement;
};

export type CustomInputPros = {
  value: string;
  customInput: CustomInputRef;
};

const CustomInput = ({ value, customInput }: CustomInputPros) => (
  <textarea ref={customInput.ref} value={value}></textarea>
);

export default CustomInput;
