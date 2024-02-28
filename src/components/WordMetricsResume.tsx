import { For } from "solid-js";
import type { Paragraphs } from "./Content";

type WordMetricsResumeProps = {
  paragraphs: Paragraphs;
};

const WordMetricsResume = (props: WordMetricsResumeProps) => {
  const wordsWpm = props.paragraphs
    .map((paragraph) => {
      // TODO: take average if multiple time the same words, keep count
      return paragraph.map((word) => {
        return {
          word: word.keys.map(k => k.key).join(""),
          wpm: word.wpm,
        };
      }).filter((word) => word.word.length > 1);
    })
    .flat();
  return (
    <ul class="wordsWpm">
      <For each={wordsWpm}>
        {(word) => (
          <li>
            {word.word}: {word.wpm.toFixed(2)} Wpm
          </li>
        )}
      </For>
    </ul>
  );
};

export default WordMetricsResume;
