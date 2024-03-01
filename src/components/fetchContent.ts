import { type Languages, WordsCategory } from "./App";

type FetchWordsProps = {
  wordsCategory: WordsCategory;
  language: Languages;
};

const fetchWords = async ({
  language,
  wordsCategory,
}: FetchWordsProps): Promise<string[]> => {
  if (wordsCategory === WordsCategory.custom) return [];
  const response = await fetch(`/contents/${language}/${wordsCategory}.json`);
  const data = await response.json();
  const key = wordsCategory === WordsCategory.quotes ? "quotes" : "words"
  if (!response.ok) {
    throw new Error(data.message);
  } else if (!data[key]) {
    throw new Error("No words found");
  } else if (!Array.isArray(data[key])) {
    throw new Error("Invalid data");
  }
  return data[key];
};

export { fetchWords };
