import { Index, Show } from "solid-js";
import { css } from "solid-styled";

type VerticalRadioBoxProps = {
  title?: string;
  list: string[];
  selected: string;
  onClick: (item: string) => void;
};

const VerticalRadioBox = (props: VerticalRadioBoxProps) => {
  css`
.title {
font-weight: 400;
font-size: 14px;
}

`

  return <div class="vertical-radiobox">
    <Show when={props.title}>
      <p class="title">{props.title}</p>
    </Show>
    <ul>
      <Index each={props.list}>{
        (elem) => <li classList={{ selected: elem() === props.selected }} onClick={() => props.onClick(elem())}>{elem()}</li>
      }</Index>
    </ul></div>
};

export default VerticalRadioBox;

