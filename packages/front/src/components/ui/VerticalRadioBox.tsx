import { Index, JSX, Show, onMount } from "solid-js";
import { css } from "solid-styled";

type VerticalRadioBoxProps<T> = {
  name: string;
  each: T[];
  selected: T;
  onChange: (item: T) => void;
  children: (
    id: string,
    checked: boolean,
    item: T,
  ) => JSX.Element | JSX.Element[];
};

function VerticalRadioBox<T>(props: VerticalRadioBoxProps<T>) {
  css`
    ul {
      list-style-type: none;
      padding: 0;
      position: relative;
      list-style-position: inside;
    }

    li {
      padding: 4px 8px;
      transition: all 0.2s ease-in-out;
    }

    .input-wrapper {
      display: flex;
      align-items: center;
      width: 100%;
    }

    li:hover {
      border-radius: 12px;
      background-color: var(--background-color);
    }

/*
    li:hover .input-wrapper {
      transform: translateX(4px);
      transition: all 0.2s ease-in-out;
    }
*/

    input {
      -webkit-appearance: none;
      -moz-appearance: none;
      position: relative;
      width: 16px;
      height: 16px;
      outline: none;
      margin: 0;
      cursor: pointer;
      border: 2px solid var(--text-secondary-color);
      background: transparent;
      border-radius: 50%;
      display: grid;
      justify-self: end;
      justify-items: center;
      align-items: center;
      overflow: hidden;
      transition: border 0.5s ease;
    }

    input::before,
    input::after {
      content: "";
      display: flex;
      justify-self: center;
      border-radius: 50%;
    }

    input::before {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
      opacity: var(--opacity, 1);
    }

    input::after {
      position: relative;
      width: calc(100% / 2);
      height: calc(100% / 2);
      background: var(--text-secondary-color);
      top: var(--y, 100%);
      transition: top 0.5s cubic-bezier(0.48, 1.97, 0.5, 0.63);
    }

    li:has(input:checked) {
      --y: 0%;
    }

    input:checked::after {
      opacity: 1;
      animation: stretch-animate 0.3s ease-out 0.17s;
    }

    li:has(input:checked) ~ li {
      --y: -100%;
    }
  `;

  return (
    <fieldset>
      <ul role="group" aria-label="Game mode selection">
        <Index each={props.each}>
          {(elem, index) => (
            <li>
              <div class="elem input-wrapper">
                <input
                  type="radio"
                  name={props.name}
                  class="select"
                  id={`${props.name}-${index}`}
                  checked={elem() === props.selected}
                  onChange={() => props.onChange(elem())}
                />
                {props.children(
                  `${props.name}-${index}`,
                  elem() === props.selected,
                  elem(),
                )}
              </div>
            </li>
          )}
        </Index>
      </ul>
    </fieldset>
  );
}

export default VerticalRadioBox;
