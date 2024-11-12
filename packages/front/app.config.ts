import { defineConfig } from "@solidjs/start/config";
import type { PluginOption } from "vite";
import solidStyled from "vite-plugin-solid-styled";
import devtools from "solid-devtools/vite";

export default defineConfig({
  vite: {
    plugins: [
      solidStyled({
        filter: {
          include: "src/**/*.tsx",
          exclude: "node_modules/**/*.{ts,js}",
        },
      }) as PluginOption,
      devtools({
        /* features options - all disabled by default */
        autoname: true, // e.g. enable autoname
      }),
    ],
  },
  server: {
    prerender: {
      routes: ["/", "/typing"],
    },
  },
});
