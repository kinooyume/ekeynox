import {
  type ContentGeneration,
  WordsGenerationCategory,
} from "../App";

const fetchWords = async ({
  language,
  category: wordsCategory,
}: ContentGeneration): Promise<string[]> => {
  const response = await fetch(`/contents/${language}/${wordsCategory}.json`);
  const data = await response.json();
  const key =
    wordsCategory === WordsGenerationCategory.quotes ? "quotes" : "words";
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
