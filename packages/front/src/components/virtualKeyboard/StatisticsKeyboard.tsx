import { For } from "solid-js";
import { css } from "solid-styled";
import { CharacterStats } from "~/typingContent/character/stats";
import { KeyboardLayout } from "~/typingKeyboard/keyboardLayout";
import KeyboardKeyResume from "./StatisticsKeyboardKey";

type KeyboardProps = {
  metrics: CharacterStats;
  layout: KeyboardLayout;
};

const StatisticsKeyboard = (props: KeyboardProps) => {
  css`
    .kb {
      display: flex;
      opacity: 0.8;
      flex-direction: column;
      width: 100%;
      max-width: 1032px;
      user-select: none;
    }
    .row {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .extraKeys {
      margin-top: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `;

  // TODO: Keypress metrics, better handle separator
  const blankCharacters = [" ", "Enter"];
  return (
    <div class="kb">
      <For each={props.layout.layout}>
        {(row) => (
          <div class="row">
            <For each={row}>
              {(lKey) => (
                <KeyboardKeyResume
                  key={lKey.all}
                  used={lKey.used}
                  data={
                    blankCharacters.includes(lKey.primary)
                      ? []
                      : lKey.all.map((c) => props.metrics[c]).filter((c) => c)
                  }
                  size={lKey.size}
                />
              )}
            </For>
          </div>
        )}
      </For>
      <div class="extraKeys">
        <For each={props.layout.extra}>
          {(lKey) => (
            <KeyboardKeyResume
              key={lKey.all}
              used={lKey.used}
              data={lKey.all.map((c) => props.metrics[c]).filter((c) => c)}
              size={lKey.size}
            />
          )}
        </For>
      </div>
    </div>
  );
};

export default StatisticsKeyboard;
