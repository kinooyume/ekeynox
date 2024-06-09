import { JSX, createSignal } from "solid-js";
import { css } from "solid-styled";

type VerticalDropdownProps = {
  label: JSX.Element | JSX.Element[];
  children: JSX.Element | JSX.Element[];
};

const VerticalDropdown = (props: VerticalDropdownProps) => {
  const [isOpen, setIsOpen] = createSignal<boolean>(false);
  css`
    .vertical-dropdown-wrapper {
position: relative;

}
.vertical-dropdown {
      border-radius: 12px;
position: absolute;
      background-color: var(--color-surface-100);
height: 0;
width: 150px;
right: 0;
overflow: hidden;
}
.open .vertical-dropdown {
display: flex;
padding: 24px;
height: auto;
      border: 1px solid var(--background-color);
      box-shadow:
        0.6px 1.8px 2.2px rgba(0, 0, 0, 0.02),
        1.5px 4.3px 5.3px rgba(0, 0, 0, 0.028),
        2.9px 8px 10px rgba(0, 0, 0, 0.035),
        5.1px 14.3px 17.9px rgba(0, 0, 0, 0.042),
        9.6px 26.7px 33.4px rgba(0, 0, 0, 0.05),
        23px 64px 80px rgba(0, 0, 0, 0.07);
}
.label {
cursor: pointer;
}
`

  return <li class="vertical-dropdown-wrapper" classList={{ open: isOpen() }}>
    <div class="label" onClick={() => setIsOpen((isOpen) => !isOpen)} >
      {props.label}
    </div>
    <div class="vertical-dropdown">
      {props.children}
    </div>
  </li>;
};

export default VerticalDropdown;

