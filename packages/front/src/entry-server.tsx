// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

import "./styles/fonts.css";
import "./styles/global.css";

export default createHandler(() => {
  return (
    <StartServer
      document={({ assets, children, scripts }) => (
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1 interactive-widget=resizes-content"
            />
            <link rel="icon" href="/favicon.svg" />
            {assets}
          </head>
          <body>
            <div id="app">{children}</div>
            {scripts}
          </body>
        </html>
      )}
    />
  );
});
