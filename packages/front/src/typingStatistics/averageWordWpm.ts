import { MetaWord } from "~/typingContent/word/types";

export type WordSpeed = {
  word: string;
  averageWpm: number;
  wpm: number[];
};

// Duplicate blanckCharacters
const blankCharacters = [" ", "Enter"];

export default (words: Array<MetaWord>): Array<WordSpeed> => {
  let result: WordSpeed[] = [];
  words.forEach((word) => {
    if (!word.isCorrect || word.wpm === 0 || blankCharacters.includes(word.characters[0].char))
      return;
    const keys = word.characters.map((k) => k.char).join("");
    if (keys.length < 5) return;

    const wordResult = result.find((r) => r.word === keys);
    if (wordResult) {
      wordResult.wpm.push(word.wpm);
      wordResult.averageWpm = Math.round(
        wordResult.wpm.reduce((a, b) => a + b, 0) / wordResult.wpm.length,
      );
    } else {
      result.push({
        word: keys,
        wpm: [word.wpm],
        averageWpm: word.wpm,
      });
    }
  });
  return result;
};
