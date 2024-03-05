import { createSignal, type JSXElement } from "solid-js";
import { css } from "solid-styled";

type TinySelectProps<State> = {
  children: JSXElement;
  list: Array<State>;
  selected: State;
  action: (selected: State) => void;
};

type TinySelect<State> = (props: TinySelectProps<State>) => JSXElement;

function TinySelect<State>(props: TinySelectProps<State>) {
  const [open, setOpen] = createSignal(false);

  css`
    .tiny-select {
      position: relative;
      box-sizing: border-box;
      width: fit-content;
      height: 100%;
      cursor: pointer;
    }
    .selected-container {
      box-sizing: border-box;
      position: relative;
      height: 40px;
      width: 40px;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      justify-content: center;
      border-radius: 160px;
      transition: all 0.3s ease;
    }

    .value-box {
      height: 0;
      width: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .selected-container:hover .value-box {
      box-sizing: border-box;
      height: 100%;
      width: 100%;
      background-color: transparent;
      border: none;
      outline: none;
      padding-bottom: 4px;
      padding-left: 10px;
      font-size: 1em;
      color: white;
      transition: all 0.3s ease;
    }


    .selected-container:hover {
      width: 130px;

      background: var(--background-color);
      box-shadow:
        inset 2px 2px 7px var(--key-color),
        inset -2px -2px 7px var(--key-color-alt);
    }

    .options {
      position: absolute;
      top: 100%;
      left: 0;
      display: none;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.5rem;
      border-radius: 0.5rem;
      background-color: var(--bg-secondary-color);
      box-shadow: 0 0 4px var(--shadow-color);
    }
    .options.open {
      display: flex;
    }
    .option {
      padding: 0.5rem;
      border-radius: 0.5rem;
      color: var(--text-color);
      cursor: pointer;
    }
    .option:hover {
      background-color: var(--bg-tertiary-color);
    }
    .icon-container {
      padding: 0.5rem;
    }
    .icon-container {
      fill: var(--text-secondary-color);
    }
  `;

  return (
    <div class="tiny-select">
      <div class="selected-container" onClick={() => setOpen(!open())}>
        <div class="value-box">
          <span>{props.selected as string}</span>
          <span>{open() ? "▲" : "▼"}</span>
        </div>

        <div class="icon-container">{props.children}</div>
      </div>
      <div class={`options ${open() ? "open" : ""}`}>
        {props.list.filter( (e) => e !== props.selected ).map((item) => (
          <div
            class="option"
            onClick={() => {
              props.action(item);
              setOpen(false);
            }}
          >
            {item as string}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TinySelect;
