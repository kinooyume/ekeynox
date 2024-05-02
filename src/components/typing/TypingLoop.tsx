/* *** */

import { createComputed, createSignal } from "solid-js";

// TIMER LOOP ONLY: extraEnd

// ==> peut reagir a TypingEvent
// if (
//   props.extraEnd &&
//   props.extraEnd[0] === cursor.positions.paragraph() &&
//   props.extraEnd[1] === cursor.positions.word()
// ) {
//   props.onOver();
// }
//
// /* GameHandler ici ca pourrais etre de l'autre coté aussi */
// // Peu reagir aussi si acces au hasNext
// if (!hasNext) {
//   cursor.set.wordStatus(WordStatus.over, false);
//   cursor.set.keyFocus(KeyFocus.unfocus);
//   props.onOver();
// }
//}

// C'est la next key
// props.setPromptKey(cursor.get.key().key);
//};
//
type TypingLoopProps = {
  wordsCount: number;
  onWordsLimit: () => void;
};

const TypingLoop = (props: TypingLoopProps) => {
  // WordsCount devrait etre ici, utile qu'ici
  // ==> WordsCount incrémenté par game Handler
  // ==> callback at KeyPress
  // Donc ouai bon on va laisser la
  // En mode fix, on connait deja le nombre de mots pour les metrics

  const [wordsLimit, setWordsLimit] = createSignal(0);

  createComputed(() => {
    if (props.wordsCount !== wordsLimit()) return;
    props.onWordsLimit();

  });
};

export default TypingLoop;
