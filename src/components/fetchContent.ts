import { type Languages, WordsCategory } from "./App";

type FetchWordsProps = {
  wordsCategory: WordsCategory;
  language: Languages;
};

const fetchWords = async ({
  language,
  wordsCategory,
}: FetchWordsProps): Promise<string[]> => {
  const response = await fetch(`/contents/${language}/${wordsCategory}.json`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  } else if (!data.words) {
    throw new Error("No words found");
  } else if (!Array.isArray(data.words)) {
    throw new Error("Invalid data");
  }
  return data.words;
};

export { fetchWords };
