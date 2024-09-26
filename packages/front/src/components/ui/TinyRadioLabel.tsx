import { JSX } from "solid-js";
import { css } from "solid-styled";

type TinyRadioLabelProps = {
  id: string;
  checked: boolean;
  children: JSX.Element;
};

function TinyRadioLabel(props: TinyRadioLabelProps) {
  css`
    label {
      display: flex;
      align-items: center;
      width: 80%;
      height: 24px;
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
      {props.children}
    </label>
  );
}

export default TinyRadioLabel;
