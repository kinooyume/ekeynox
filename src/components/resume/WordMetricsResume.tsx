import { For } from "solid-js";
import type { WordSpeed } from "../metrics/Metrics";

type WordMetricsResumeProps = {
  words: WordSpeed[];
};

const WordMetricsResume = (props: WordMetricsResumeProps) => {
  return (
    <ul class="wordsWpm">
      <For each={props.words}>
        {(word) => (
          <li>
            {word.word}: {word.averageWpm} Wpm
          </li>
        )}
      </For>
    </ul>
  );
};

export default WordMetricsResume;
