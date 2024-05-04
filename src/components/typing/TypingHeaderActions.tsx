import { css } from "solid-styled";
import HeaderNavAction from "./HeaderNavAction";
import Resume from "../svgs/Resume";
import Reset from "../svgs/reset";
import Cross from "../svgs/cross";
import Shuffle from "../svgs/shuffle";
import { Show } from "solid-js";
import Ghost from "../svgs/ghost";

type TypingHeaderActionsProps = {
  paused: boolean;
  isRedo: boolean;
  isGenerated: boolean;
  onShuffle: () => void;
  onPause: () => void;
  onReset: () => void;
  onExit: () => void;
};

const TypingHeaderActions = (props: TypingHeaderActionsProps) => {
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
      <Show when={props.isRedo}>
        <HeaderNavAction
          svg={<Ghost />}
          clickable={false}
          action={() => {}}
        />
      </Show>
      <HeaderNavAction
        svg={<Resume paused={props.paused} />}
        clickable={!props.paused}
        action={props.onPause}
      />
      <HeaderNavAction
        svg={<Reset />}
        clickable={true}
        action={props.onReset}
      />
      <Show when={props.isGenerated && !props.isRedo}>
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

export default TypingHeaderActions;
