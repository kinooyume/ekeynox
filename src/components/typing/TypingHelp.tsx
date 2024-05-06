import { Match, Switch, createEffect, createSignal, onMount } from "solid-js";
import type { Translator } from "../App";
import type { KeyboardHandler } from "../keyboard/TypingKeyboard";
import BunnyHead from "../svgs/bunnyHead";
import { css } from "solid-styled";

type TypingHelpProps = {
  t: Translator;
  isPaused: boolean;
  keyboard?: (kbHandler: KeyboardHandler) => void;
  onPause: () => void;
};

const TypingHelp = (props: TypingHelpProps) => {
  type PauseKeys = {
    ctrl: boolean;
    shift: boolean;
    space: boolean;
  };

  let [pauseKeys, setPauseKeys] = createSignal<PauseKeys>({
    ctrl: false,
    shift: false,
    space: false,
  });

  const keyDown = (key: string) => {
    if (key === "Control") setPauseKeys({ ...pauseKeys(), ctrl: true });
    else if (key === "Shift") setPauseKeys({ ...pauseKeys(), shift: true });
    else if (key === " ") setPauseKeys({ ...pauseKeys(), space: true });
  };

  const keyUp = (key: string) => {
    if (key === "Control") setPauseKeys({ ...pauseKeys(), ctrl: false });
    else if (key === "Shift") setPauseKeys({ ...pauseKeys(), shift: false });
    else if (key === " ") setPauseKeys({ ...pauseKeys(), space: false });
  };

  createEffect(() => {
    if (
      !props.isPaused &&
      pauseKeys().ctrl &&
      pauseKeys().shift &&
      pauseKeys().space
    ) {
      props.onPause();
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
      padding: 6px 6px;
      font-weight: 600;
    }

    .type-to-play {
      animation: blink-slow 2s infinite;
    }
    .character {
      display: none;
      width: 80px;
      border-radius: 10px;
      background-color: white;
      padding: 20px 30px;
      padding-bottom: 40px;
    }
  `;
  return (
    <div class="help">
      <div class="character">
        <BunnyHead />
      </div>
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
            <span> {props.t("typingGame.toPause")}</span>
          </div>
        </Match>
      </Switch>
    </div>
  );
};

export default TypingHelp;
