import { For } from "solid-js";
import { css } from "solid-styled";
import type { GameMode, Translator } from "./App";
import ChooseClip from "./ui/choose-clip";

type GameModePreview = {
  title: string;
  description: string;
};

type GameModeSelectionProps = {
  t: Translator;
  modes: Record<GameMode, GameModePreview>;
  selected: GameMode;
  setSelected: (mode: GameMode) => void;
};

const GameModeSelection = (props: GameModeSelectionProps) => {
  css`
    .mode-selection {
      width: 430px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.6rem;
    }

    .info {
      width: 250px;
      margin-left: 1rem;
    }

    .info .title {
      font-size: 1.8rem;
      font-weight: 200;
      margin: 0;
    }

    .info .description {
      font-size: 0.9rem;
      font-weight: 200;
      color: var(--color-primary-600);
    }
    .main-view {
      width: 100%;
    }
  `;
  return (
    <div class="mode-selection">
      <div class="info">
        <p class="title">{props.modes[props.selected].title}</p>
        <p class="description">{props.modes[props.selected].description}</p>
      </div>
      <div class="modes">
        <For each={Object.keys(props.modes)}>
          {(modeKey) => (
            <div class={`${modeKey}`}>
              <input
                type="radio"
                name="mode"
                id={modeKey}
                checked={props.selected === modeKey}
                onChange={() => props.setSelected(modeKey as GameMode)}
              />
              <label for={modeKey}>.</label>
            </div>
          )}
        </For>
      </div>
      <ChooseClip></ChooseClip>
    </div>
  );
};

export default GameModeSelection;
