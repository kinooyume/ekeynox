import { css } from "solid-styled";
import type { Translator } from "../App";
import { createSignal, Show, type JSX } from "solid-js";
import Resume from "../svgs/Resume";
import Cross from "../svgs/cross";
import Shuffle from "../svgs/shuffle";
import Reset from "../svgs/reset";

type HeaderNavActionsProps = {
  t: Translator;
  isPaused: boolean;
  isGenerated: boolean;
  onPause: () => void;
  onReset: () => void;
  onShuffle: () => void;
  onExit: () => void;
  children?: JSX.Element;
};

// TODO: could be clean to have an array of actions
//
type HeaderNavActionProps = {
  svg: JSX.Element;
  clickable?: boolean;
  action: () => void;
};

const HeaderNavAction = (props: HeaderNavActionProps) => {
  css`
    .nav-action {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      border-radius: 12px;
      border: 1px solid transparent;
    }
    .nav-action.clickable {
      cursor: pointer;
    }
    .nav-action.clickable:hover {
      border: 1px solid var(--background-color);
    }
  `;

  return (
    <div
      class="nav-action"
      classList={{ clickable: props.clickable }}
      onClick={props.action}
    >
      {props.svg}
    </div>
  );
};

const HeaderNavActions = (props: HeaderNavActionsProps) => {
  css`
    .nav-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 16px;
    }
  `;
  return (
    <div class="nav-actions">
      <Show when={props.children}>{props.children}</Show>
      <HeaderNavAction
        svg={<Resume paused={props.isPaused} />}
        clickable={!props.isPaused}
        action={props.onPause}
      />
      <HeaderNavAction
        svg={<Reset />}
        clickable={true}
        action={props.onReset}
      />
      <Show when={props.isGenerated}>
        <HeaderNavAction
          svg={<Shuffle />}
          clickable={true}
          action={props.onShuffle}
        />
      </Show>
      <HeaderNavAction svg={<Cross />} clickable={true} action={props.onExit} />
    </div>
  );
};

export default HeaderNavActions;
