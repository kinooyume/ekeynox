import { MetaProvider } from "@solidjs/meta";
import { Router, useLocation, useNavigate } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";

import { Show, Suspense, onMount } from "solid-js";
import { Transition } from "solid-transition-group";

import Header from "./components/Header";
import TypingHeaderNav from "./components/typing/TypingHeaderNav";

import { useAssets } from "solid-js/web";

import { StyleRegistry, css, renderSheets, type StyleData } from "solid-styled";

import "./styles/fonts.css";
import "./styles/global.css";

import { AppStateProvider } from "./appState/AppStateProvider";
import { GameOptionsProvider } from "./gameOptions/GameOptionsProvider";
import { SettingsProvider } from "./settings/SettingsProvider";

export default function App() {
  const sheets: StyleData[] = [];
  useAssets(() => renderSheets(sheets));

  css`
    .app {
      display: grid;
      margin: 0;
      min-height: 100%;
      background-color: var(--color-surface-100);
    }
    main {
      margin-top: 96px;
      display: grid;
      grid-template-columns:
        1fr
        min(1400px, 100%)
        1fr;
      grid-template-rows: 1f;
    }
  `;

  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <StyleRegistry styles={sheets}>
            <SettingsProvider>
              <GameOptionsProvider>
                <AppStateProvider>
                  <Header />

                  <main>
                    <Suspense fallback={<div>Loading..</div>}>
                      <div>{props.children}</div>
                    </Suspense>
                  </main>
                </AppStateProvider>
              </GameOptionsProvider>
            </SettingsProvider>
          </StyleRegistry>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
