import { Show } from "solid-js";

import { css } from "solid-styled";
import "balloon-css";
import {
  createCharacterMetrics,
  pushCharacterMetrics,
  CharacterMetrics,
} from "~/typingContent/character/stats/metrics";
import { diffCharacterScore } from "~/typingContent/character/stats/score";

type transform = Array<[string, string]>;

const transform = (k: string) => {
  switch (k) {
    case "Tab":
      return "↹";
    case "Enter":
      return "⏎";
    case "Backspace":
      return "⌫";
    case "Shift":
      return "⇧";
    case "CapsLock":
      return "⇪";
    case "Control":
      return "Ctrl";
    case "Alt":
      return "Alt";
    case " ":
      return "␣";
    default:
      return k;
  }
};

export type KeyboardKeyResumeProps = {
  key: Array<string>;
  size: string;
  used: boolean;
  data: Array<CharacterMetrics>;
};

/* faire le truc correct, incorrect, was incorrect */

const StatisticsKeyboardKey = (props: KeyboardKeyResumeProps) => {
  css`
    .key,
    .flat {
      display: flex;
      position: relative;
      justify-content: center;
      align-items: center;
      margin: 6px;
      min-width: 40px;
      padding: 10px;
      height: 40px;
      color: var(--text-color);
      border-radius: 8px;
      background: var(--key-metric-bg-color);
      box-shadow:
        2px 2px 7px var(--key-metric-color),
        -2px -2px 7px var(--key-metric-color-alt);
    }
    .pressed {
      background: var(--key-metric-bg-color);
      box-shadow:
        inset 2px 2px 7px var(--key-metric-color),
        inset -2px -2px 7px var(--key-metric-color-alt);

      transform: translate(1px, 1px);
      transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
    }
    .key.double {
      width: 120px;
    }

    .key.two {
      width: 50px;
    }

    .key.five {
      width: 60px;
    }

    .key.seven {
      width: 85px;
    }
    .key.space {
      width: 500px;
    }

    .primary {
      font-size: 15px;
    }
    .secondary {
      font-size: 11px;
      opacity: 0.65;
      position: absolute;
      top: 9px;
      right: 16px;
      float: right;
    }
    .correct {
      background: var(--key-correct-bg-color);
      box-shadow:
        2px 2px 7px var(--key-correct-color),
        -2px -2px 7px var(--key-correct-color-alt);
    }
    .correct.pressed {
      box-shadow:
        inset 2px 2px 7px var(--key-correct-color),
        inset -2px -2px 7px var(--key-correct-color-alt);
    }
    .incorrect {
      background: var(--key-incorrect-bg-color);
      box-shadow:
        2px 2px 7px var(--key-incorrect-color),
        -2px -2px 7px var(--key-incorrect-color-alt);
    }
    .incorrect.pressed {
      box-shadow:
        inset 2px 2px 7px var(--key-incorrect-color),
        inset -2px -2px 7px var(--key-incorrect-color-alt);
    }
    .corrected {
      background: var(--key-corrected-bg-color);
      box-shadow:
        2px 2px 7px var(--key-corrected-color),
        -2px -2px 7px var(--key-corrected-color-alt);
    }
    .corrected.pressed {
      box-shadow:
        inset 2px 2px 7px var(--key-corrected-color),
        inset -2px -2px 7px var(--key-corrected-color-alt);
    }
    .current {
      background: var(--key-focus-bg-color);
      box-shadow:
        2px 2px 7px var(--key-focus-color),
        -2px -2px 7px var(--key-focus-color-alt);
    }
    .current.pressed {
      box-shadow:
        inset 2px 2px 7px var(--key-focus-color),
        inset -2px -2px 7px var(--key-focus-color-alt);
    }
    .key:not(.used) {
      opacity: 0.6;
    }
  `;

  // duplicate getInfo
  const getInfo = (data: Array<CharacterMetrics>) => {
    const info =
      data.length === 1
        ? data[0]
        : data.reduce((acc, cur) => {
            if (cur) pushCharacterMetrics(acc, cur);
            return acc;
          }, createCharacterMetrics());
    return [diffCharacterScore(info), info.total];
  };

  // show accuracy
  const infoToString = (data: Array<CharacterMetrics>) => {
    const [info, total] = getInfo(data);
    return info ? ` ${info.match} / ${total}` : "";
  };

  // PERF: lot of stuff at each keypress
  const status = (data: Array<CharacterMetrics>) => {
    if (data.length === 0) return "";
    const info =
      data.length === 1
        ? data[0]
        : data.reduce((acc, cur) => {
            if (cur) pushCharacterMetrics(acc, cur);
            return acc;
          }, createCharacterMetrics());
    const result = diffCharacterScore(info);

    const incorrect = result.unmatch + result.missed + result.extra;
    const wasIncorrect =
      info.added.unmatch + info.added.missed + info.added.extra;
    if (incorrect > 0) return "incorrect";
    if (result.match > 0) return wasIncorrect > 0 ? "corrected" : "correct";
  };
  // PERF: finda better way for "was incorrect" ? linked to promptKey

  return (
    <div
      // aria-label={infoToString(props.data)}
      data-balloon-pos="up"
      class={`key ${props.used ? "used" : ""} ${status(props.data)} ${props.size}`}
    >
      <Show when={props.key[1] !== undefined}>
        <span class="secondary">{props.key[1]}</span>
      </Show>
      <span class="primary">{transform(props.key[0])}</span>
    </div>
  );
};

export default StatisticsKeyboardKey;
