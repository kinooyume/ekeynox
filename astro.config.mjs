import { defineConfig } from "astro/config";
import solidStyled from "unplugin-solid-styled";
import sitemap from "@astrojs/sitemap";

import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  site: "https://ekeynox.xyz",
  integrations: [solidJs(), sitemap()],
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
