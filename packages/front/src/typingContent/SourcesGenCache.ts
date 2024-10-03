import { ContentGeneration } from "~/typingOptions/typingOptions";

type Cached = Record<string, Record<string, Promise<string[]>>>;

const fetchSourceGen = async ({
  language,
  category,
}: ContentGeneration): Promise<string[]> => {
  const response = await fetch(`/contents/${language}/${category}.json`);
  const data = await response.json();
  const responseError = (message: string) =>
    Promise.reject(new Error(`Error: ${language}/${category} - ${message}`));
  if (!response.ok) {
    return responseError(data.message);
  } else if (!data.data) {
    return responseError("No words found");
  } else if (!Array.isArray(data.data)) {
    return responseError("Invalid data");
  }
  if (!data.data) return responseError("No words found");
  if (!Array.isArray(data.data)) return responseError("Invalid data");
  return Promise.resolve(data.data);
};

export type SourcesGenFetch = (opts: ContentGeneration) => Promise<string[]>;

export type SourcesGenCache = {
  cached: Cached;
  fetch: SourcesGenFetch;
};

const create = (): SourcesGenCache => {
  const cached: Cached = {};
  return {
    cached,
    fetch: ({ language, category }: ContentGeneration) => {
      if (!cached[language]) cached[language] = {};
      return (
        cached[language][category] ||
        (cached[language][category] = fetchSourceGen({
          language,
          category,
        }))
      );
    },
  };
};

export default { create };
