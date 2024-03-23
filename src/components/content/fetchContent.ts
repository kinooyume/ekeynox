import { type ContentGeneration } from "../gameSelection/GameOptions.ts";

type cached = Record<string, Record<string, string[]>>;

// TODO: handle errors
const createFetchWords = () => {
  const cached: cached = {};
  return async ({
    language,
    category: wordsCategory,
  }: ContentGeneration): Promise<string[]> => {
    if (!cached[language]) cached[language] = {};
    if (cached[language][wordsCategory]) return cached[language][wordsCategory];
    const response = await fetch(`/contents/${language}/${wordsCategory}.json`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    } else if (!data.data) {
      throw new Error("No words found");
    } else if (!Array.isArray(data.data)) {
      throw new Error("Invalid data");
    }
    cached[language][wordsCategory] = data.data;
    return data.data;
  };
};

export { createFetchWords };
