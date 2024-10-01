import { css } from "solid-styled";
import HeaderNavAction from "./HeaderTypingAction";
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

    @media screen and (max-width: 860px) {
      .nav-actions {
        justify-content: space-between;
        width: 100%;
      }
    }
  `;
  return (
    <div class="nav-actions">
      <Show when={props.isRedo}>
        <HeaderNavAction clickable={false}>
          <Ghost />
        </HeaderNavAction>
      </Show>
      <HeaderNavAction clickable={!props.paused} action={() => props.onPause}>
        <Resume paused={props.paused} />
      </HeaderNavAction >
      <HeaderNavAction clickable={true} action={props.onReset}>
        <Reset />
      </HeaderNavAction>
      <Show when={props.isGenerated && !props.isRedo}>
        <HeaderNavAction clickable={true} action={props.onShuffle}>
          <Shuffle />
        </HeaderNavAction>
      </Show>
      <HeaderNavAction clickable={true} action={props.onExit}>
        <Cross />
      </HeaderNavAction>
    </div>
  );
};

export default TypingHeaderActions;
