import globals from "globals";
import js from "@eslint/js";
import solid from "eslint-plugin-solid/configs/typescript.js";
import * as tsParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ...solid,
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parser: tsParser,
      parserOptions: {
        project: "tsconfig.json",
      },
    },
  },
];
