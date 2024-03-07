import { createSignal, Show, type JSXElement } from "solid-js";
import { css } from "solid-styled";
import { Transition } from "solid-transition-group";

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
      height: 40px;
      cursor: pointer;
    }
    .selected-container {
      box-sizing: border-box;
      position: relative;
      height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease-out;
      overflow: hidden;
    }

    .value-box {
      display: flex;
      max-width: 0;
      margin-botto: 4px;
      opacity: 0;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      font-size: 1em;
      transition: all 0.25s ease-out;
    }

    .value-box span {
      color: var(--text-color);
    }

    .value-box span:last-child {
      font-size: 0.8em;
      margin-left: 4px;
    }

    .tiny-select:hover .selected-container .value-box,
    .open .selected-container .value-box {
      opacity: 1;
      max-width: 100px;
    }

    .options {
      display: flex;
      height: object-fit;
      background-color: var(--color-surface-100);
      transition: all 0.25s ease-out;
      flex-direction: column;
      justify-content: flex-end;
      border-radius: 10px;
      border: 1px solid var(--color-surface-200);
      box-shadow:
        2.8px 2.8px 2.2px rgba(0, 0, 0, 0.02),
        6.7px 6.7px 5.3px rgba(0, 0, 0, 0.028),
        12.5px 12.5px 10px rgba(0, 0, 0, 0.035),
        22.3px 22.3px 17.9px rgba(0, 0, 0, 0.042),
        41.8px 41.8px 33.4px rgba(0, 0, 0, 0.05),
        100px 100px 80px rgba(0, 0, 0, 0.07);
    }

    .option {
      display: inline-flex;
      justify-content: flex-start;
      padding: 1rem;
      border-radius: 0.5rem;
      color: var(--text-color);
      cursor: pointer;
    }

    .option p {
      margin: 0;
    }
    .option:hover p {
      color: var(--ui-primary-color);
    }
    .icon-container {
      padding: 0.5rem;
    }
    .icon-container {
      fill: var(--ui-secondary-color);
      transition: all 0.25s ease-out;
    }
    .tiny-select:hover .selected-container .icon-container {
      fill: var(--text-color);
    }
    .tiny-select.open .selected-container .icon-container {
      fill: var(--ui-primary-color);
    }
  `;

  return (
    <div
      class="tiny-select"
      classList={{ open: open() }}
      onMouseLeave={() => {
        if (open() === true) setOpen(false);
      }}
    >
      <div class="selected-container" onClick={() => setOpen(!open())}>
        <div class="icon-container">{props.children}</div>
        <div class="value-box">
          <span>{props.selected as string}</span>
          <span>{open() ? "▲" : "▼"}</span>
        </div>
      </div>
      <Transition
        onEnter={(el, done) => {
          const a = el.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 80,
          });
          a.finished.then(done);
        }}
        onExit={(el, done) => {
          const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 0,
          });
          a.finished.then(done);
        }}
      >
        <Show when={open() === true}>
          <div class="options">
            {props.list
              .filter((e) => e !== props.selected)
              .map((item) => (
                <div
                  class="option"
                  onClick={() => {
                    props.action(item);
                  }}
                >
                  <p>{item as string}</p>
                </div>
              ))}
          </div>
        </Show>
      </Transition>
    </div>
  );
}

export default TinySelect;
