type GameParams = {
  content: string;
};

type GameTimedParams = {
  game: GameParams;
  duration: number;
};

enum GameContentLang {
  fr,
  en,
}

enum RandomContent {
  word,
  quote
}

type GameRandomContent = {lang: GameContentLang; available: Array<RandomContent>};

type GameRandomParams = {
  lang: string;
};
