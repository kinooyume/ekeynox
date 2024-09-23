import { For } from "solid-js";
import { css } from "solid-styled";

type TabContainerProps = {
  elems: string[];
  isChecked: number;
  onTabChange: (index: number) => void;
};

const TabContainer = (props: TabContainerProps) => {
  css`
    .tab-container {
      position: relative;

      display: flex;
      flex-direction: row;
      align-items: flex-start;

      padding: 2px;

      background-color: #dadadb;
      border-radius: 9px;
    }

    .indicator {
      content: "";
      width: 130px;
      height: 28px;
      background: #ffffff;
      position: absolute;
      top: 2px;
      left: 2px;
      z-index: 9;
      border: 0.5px solid rgba(0, 0, 0, 0.04);
      box-shadow:
        0px 3px 8px rgba(0, 0, 0, 0.12),
        0px 3px 1px rgba(0, 0, 0, 0.04);
      border-radius: 7px;
      transition: all 0.2s ease-out;
    }

    .tab {
      width: 130px;
      height: 28px;
      position: absolute;
      z-index: 99;
      outline: none;
      opacity: 0;
    }

    .tab_label {
      width: 130px;
      height: 28px;

      position: relative;
      z-index: 201;

      display: flex;
      align-items: center;
      justify-content: center;

      border: 0;

      font-size: 0.75rem;
      opacity: 0.6;

      cursor: pointer;
    }
  `;
  return (
    <div class="tab-container" style={{ width: `${props.elems.length * 132}px` }}>
      <For each={props.elems}>
        {(label, index) => (
          <div class="tab-wrapper">
            <input
              type="radio"
              name="tab"
              checked={props.isChecked === index()}
              id={`tab-${index()}`}
              class="tab"
            />
            <label
              onClick={() => props.onTabChange(index())}
              class="tab_label"
              for={`tab-${index()}`}
            >
              {label}
            </label>
          </div>
        )}
      </For>

      <div
        class="indicator"
        style={{ left: `${props.isChecked * 130 + 2}px` }}
      ></div>
    </div>
  );
};

export default TabContainer;
