import { MetaProvider, Title } from "@solidjs/meta";
import { Router, useLocation, useNavigate } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";

import { ParentProps, Show, Suspense, onMount } from "solid-js";
import { Transition, TransitionGroup } from "solid-transition-group";

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

  const PageTransition = (props: ParentProps) => (
    <div class="transition-container">
      <TransitionGroup
        onEnter={(el, done) => {
          const a = el.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 140
          });
          a.finished.then(done);
        }}
        onExit={(el, done) => {
          const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 0
          });
          a.finished.then(done);
        }}
        >
        {props.children}
      </TransitionGroup>
    </div>
  );

  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <StyleRegistry styles={sheets}>
            <SettingsProvider>
              <GameOptionsProvider>
                <AppStateProvider>
                  <Header />
                  <Title>Ekeynox</Title>
                  <main>
                      <Suspense fallback={<div>Loading..</div>}>
                      <PageTransition {...props}/>
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
