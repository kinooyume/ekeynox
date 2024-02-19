import { defineConfig } from "astro/config";
import solidStyled from "unplugin-solid-styled";

import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs()],
  compressHTML: true,
  vite: {
    plugins: [
      solidStyled.vite({
        prefix: "example",
        filter: {
          include: "src/**/*.tsx",
          exclude: "node_modules/**/*.{ts,js}",
        },
      }),
    ],
  },
});
