import { Show } from "solid-js";
import { css } from "solid-styled";
import "balloon-css";
import type { KeyMetricsProjection } from "./KeyMetrics";

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
  data: Array<KeyMetricsProjection | undefined>;
  pressed: boolean;
};

/* faire le truc correct, incorrect, was incorrect */

const KeyboardKeyResume = (props: KeyboardKeyResumeProps) => {
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
      color: rgb(0, 31, 63);
      border-radius: 8px;
      background: #e0e0e0;
      box-shadow:
        2px 2px 7px #bebebe,
        -2px -2px 7px #ffffff;
    }
    .pressed {
      background: #e0e0e0;
      box-shadow:
        inset 2px 2px 7px #bebebe,
        inset -2px -2px 7px #ffffff;
    }
    .concave {
      background: linear-gradient(145deg, #cacaca, #f0f0f0);
      box-shadow:
        6px 6px 12px #bebebe,
        -6px -6px 12px #ffffff;
    }
    .convex {
      background: linear-gradient(145deg, #f0f0f0, #cacaca);
      box-shadow:
        4px 4px 12px #bebebe,
        -4px -4px 12px #ffffff;
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
      font-size: 0.9em;
    }
    .secondary {
      font-size: 0.6em;
      opacity: 0.5;
      position: absolute;
      top: 9px;
      right: 16px;
      float: right;
    }
    .correct {
      background: #8ff0a4;
      box-shadow:
        2px 2px 7px #7acc8b,
        -2px -2px 7px #a4ffbd;
    }
    .correct.pressed {
      box-shadow:
        inset 2px 2px 7px #7acc8b,
        inset -2px -2px 7px #a4ffbd;
    }
    .incorrect {
      background: #f66151;
      box-shadow:
        2px 2px 7px #d15245,
        -2px -2px 7px #ff705d;
    }
    .incorrect.pressed {
      box-shadow:
        inset 2px 2px 7px #d15245,
        inset -2px -2px 7px #ff705d;
    }
    .corrected {
      background: #ffbe6f;
      box-shadow:
        2px 2px 7px #d9a25e,
        -2px -2px 7px #ffdb80;
    }
    .corrected.pressed {
      box-shadow:
        inset 2px 2px 7px #d9a25e,
        inset -2px -2px 7px #ffdb80;
    }
    .current {
      background: #99c1f1;
      box-shadow:
        2px 2px 7px #82a4cd,
        -2px -2px 7px #b0deff;
    }
    .current.pressed {
      box-shadow:
        inset 2px 2px 7px #82a4cd,
        inset -2px -2px 7px #b0deff;
    }
    .key:not(.used) {
      opacity: 0.6;
    }
  `;

  const getInfo = (data: Array<KeyMetricsProjection | undefined>) =>
    data.reduce((acc, cur) => {
      if (cur) {
        if (!acc) return cur;
        acc.correct += cur.correct;
        acc.incorrect += cur.incorrect;
        acc.deletedCorrect += cur.deletedCorrect;
        acc.deletedIncorrect += cur.deletedIncorrect;
        acc.missed += cur.missed;
        acc.extra += cur.extra;
        acc.total += cur.total;
      }
      return acc;
    });

  // show accuracy
  const infoToString = (data: Array<KeyMetricsProjection | undefined>) => {
    const info = getInfo(data);
    return info ? ` ${info.correct - info.deletedCorrect} / ${info.total}` : "";
  };

  //   const infoToString = () =>
  //     info
  //       ? `
  // Correct: ${info.correct - info.deletedCorrect}\n
  // Incorrect: ${info.incorrect}\n
  // Missed: ${info.missed}\n
  // Extra: ${info.extra}\n
  // Total: ${info.total}
  // `
  //       : "";
  const status = (data: Array<KeyMetricsProjection | undefined>, k: string) => {
    const info = getInfo(data);
    if (!info) return "";
    const correct = info?.correct - info?.deletedCorrect;
    const incorrect = info?.incorrect - info?.deletedIncorrect;
    if (incorrect > 0) return "incorrect";
    if (correct > 0) return info?.incorrect > 0 ? "corrected" : "correct";
  };

  return (
    <div
      aria-label={infoToString(props.data)}
      data-balloon-pos="up"
      class={`key ${props.pressed ? "pressed" : ""} ${props.used ? "used" : ""} ${status(props.data, props.key[0])} ${props.size}`}
    >
      <Show when={props.key[1] !== undefined}>
        <span class="secondary">{props.key[1]}</span>
      </Show>
      <span class="primary">{transform(props.key[0])}</span>
    </div>
  );
};

export default KeyboardKeyResume;
