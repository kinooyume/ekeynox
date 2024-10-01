import { Match, Switch, createEffect, createSignal, onMount } from "solid-js";
import type { Translator } from "../App";
import type { KeyboardHandler } from "../keyboard/TypingKeyboard";
import { css } from "solid-styled";
import HeaderNavAction from "./HeaderTypingAction";
import Resume from "../svgs/Resume";

type TypingHelpProps = {
  t: Translator;
  isPaused: boolean;
  keyboard?: (kbHandler: KeyboardHandler) => void;
  onReset: () => void;
};

const TypingHelp = (props: TypingHelpProps) => {
  type resetKeys = {
    ctrl: boolean;
    shift: boolean;
    space: boolean;
  };

  let [resetKeys, setresetKeys] = createSignal<resetKeys>({
    ctrl: false,
    shift: false,
    space: false,
  });

  const keyDown = (key: string) => {
    if (key === "Control") setresetKeys({ ...resetKeys(), ctrl: true });
    else if (key === "Shift") setresetKeys({ ...resetKeys(), shift: true });
    else if (key === " ") setresetKeys({ ...resetKeys(), space: true });
  };

  const keyUp = (key: string) => {
    if (key === "Control") setresetKeys({ ...resetKeys(), ctrl: false });
    else if (key === "Shift") setresetKeys({ ...resetKeys(), shift: false });
    else if (key === " ") setresetKeys({ ...resetKeys(), space: false });
  };

  createEffect(() => {
    if (
      !props.isPaused &&
      resetKeys().ctrl &&
      resetKeys().shift &&
      resetKeys().space
    ) {
      props.onReset();
    }
  });

  onMount(() => {
    props.keyboard?.({ keyUp, keyDown });
  });

  css`
    .help {
      display: flex;
      gap: 16px;
      font-size: 17px;
    }
    span {
      color: var(--text-secondary-color);
    }
    .help-content {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .help .key {
      border-radius: 6px;
      background-color: var(--text-secondary-color);
      color: var(--color-surface-alt);
      font-size: 12px;
      padding: 6px 8px;
    }

    .type-to-play {
      animation: blink-slow 2s infinite;
    }
  `;
  return (
    <div class="help">
      <Switch>
        <Match when={props.isPaused}>
          <div class="help-content type-to-play">
            <span>{props.t("typingGame.typeToPlay")}</span>
          </div>
        </Match>
        <Match when={!props.isPaused}>
          <div class="help-content">
            <span class="key">Ctrl</span>
            <span>+</span>
            <span class="key">Shift</span>
            <span>+</span>
            <span class="key">{props.t("space")}</span>
            <br/>
            <span> {props.t("typingGame.toReset")}</span>
          </div>
        </Match>
      </Switch>
    </div>
  );
};

export default TypingHelp;
