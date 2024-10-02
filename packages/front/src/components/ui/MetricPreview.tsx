import type { JSX } from "solid-js";
import { css } from "solid-styled";

type MetricPreviewProps = {
  picto: JSX.Element;
  children: JSX.Element;
};

const MetricPreview = (props: MetricPreviewProps) => {
  css`
    .metric-preview {
      position: relative;
      display: flex;
      align-content: center;
      justify-content: center;
      padding: 4px;
      height: 24px;
      border-radius: 10px;
      background-color: var(--color-background-metric-preview);
      border: 1px solid var(--background-color);
      transition: all 100ms linear;
    }
    .picto {
      height: 15px;
      width: 15px;
      padding: 4px 8px;
      padding-top: 0;
      display: inline-block;
    }
    .value {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-left: 8px;
      margin-right: 4px;
      font-size: 22px;
      min-width: 14px;
      cursor: pointer;
      border-radius: 6px;
      color: var(--text-color);
      fill: var(--text-color);
      font-size: 14px;
      transition: all 100ms linear;
    }
  `;
  return (
    <div class="metric-preview">
      <div class="value">{props.children}</div>
      <div class="picto">{props.picto}</div>
    </div>
  );
};

export default MetricPreview;
