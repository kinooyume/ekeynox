// get all json content in a gien path forlder
// read all files in a folder, path of folder
import fs from "fs";

// On est pas obligé en vrai, ca va pas changer regulierement
// on peut juste centraliser

const json = (path: string): Record<string, string> => {
  const a = fs.readdirSync(path, { withFileTypes: true });
  const record: Record<string, string> = a.reduce(
    (acc, dirent) => {
      if (dirent.isFile() && dirent.name.endsWith(".json")) {
        const content = fs.readFileSync(`${path}/${dirent.name}`, "utf8");
        const key = dirent.name.split(".")[0];
        // parse json file, from content
        const jsonContent = JSON.parse(content);
        acc[key] = content;
      }
      return acc;
    },
    {} as Record<string, string>,
  );
  return record;
};

export {};
