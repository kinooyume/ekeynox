import { JSX } from "solid-js";
import { css } from "solid-styled";

type HugeRadioLabelProps = {
  id: string;
  checked: boolean;
  children: (checked: boolean) => JSX.Element;
};

function HugeRadioLabel(props: HugeRadioLabelProps) {
  css`
    label {
      display: flex;
      align-items: center;
      width: 88%;
      height: 56px;
      padding-left: 8px;
      user-select: none;
      transition: all 0.2s ease-in-out;
      cursor: pointer;
    }

    label.checked {
      font-weight: 600;
    }
  `;
  return (
    <label classList={{ checked: props.checked }} for={props.id}>
      {props.children(props.checked)}
    </label>
  );
}

export default HugeRadioLabel;
