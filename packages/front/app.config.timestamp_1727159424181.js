// app.config.ts
import { defineConfig } from "@solidjs/start/config";
import solidStyled from "vite-plugin-solid-styled";
var app_config_default = defineConfig({
  vite: {
    plugins: [
      solidStyled({
        filter: {
          include: "src/**/*.tsx",
          exclude: "node_modules/**/*.{ts,js}"
        }
      })
    ]
  },
  server: {
    prerender: {
      routes: ["/", "/typing"]
    }
  }
});
export {
  app_config_default as default
};
