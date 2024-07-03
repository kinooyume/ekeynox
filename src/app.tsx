import { Link, Meta, MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
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
import { FocusProvider } from "./components/ui/FocusProvider";
import { useI18n } from "./settings/i18nProvider";

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
            duration: 140,
          });
          a.finished.then(done);
        }}
        onExit={(el, done) => {
          const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 0,
          });
          a.finished.then(done);
        }}
      >
        {props.children}
      </TransitionGroup>
    </div>
  );

  const t = useI18n();

  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <StyleRegistry styles={sheets}>
            <SettingsProvider>
              <GameOptionsProvider>
                <AppStateProvider>
                  <FocusProvider>
                    <Header />
                    <Title>Ekeynox</Title>
                    <Meta name="description" content={t("webDescription")} />
                    <Meta property="og:title" content="Ekeynox" />
                    <Meta
                      property="og:description"
                      content={t("webDescription")}
                    />
                    <Meta property="og:type" content="website" />
                    <Meta property="og:url" content="https://ekeynox.xyz" />
                    <Meta
                      property="og:image"
                      content="https://ekeynox.xyz/ekeynox-og.jpg"
                    />
                    <Meta property="og:image:type" content="image/jpeg" />
                    <Meta property="og:image:width" content="1200" />
                    <Meta property="og:image:height" content="630" />
                    <Meta
                      property="og:image:alt"
                      content={t("webDescription")}
                    />
                    <Link
                      rel="preload"
                      href="/fonts/Larsseit/Larsseit.woff2"
                      as="font"
                      type="font/woff2"
                      crossorigin="anonymous"
                    />
                    <Link
                      rel="preload"
                      href="/fonts/Larsseit/Larsseit-Bold.woff2"
                      as="font"
                      type="font/woff2"
                      crossorigin="anonymous"
                    />
                    <Link
                      rel="preload"
                      href="/fonts/Larsseit/Larsseit-Thin.woff2"
                      as="font"
                      type="font/woff2"
                      crossorigin="anonymous"
                    />
                    <Link
                      rel="preload"
                      href="/fonts/Larsseit/Larsseit-Light.woff2"
                      as="font"
                      type="font/woff2"
                      crossorigin="anonymous"
                    />
                    <Link
                      rel="preload"
                      href="/fonts/OdudoMono/OdudoMono-Regular.woff2"
                      as="font"
                      type="font/woff2"
                      crossorigin="anonymous"
                    />
                    <main>
                      <Suspense fallback={<div>Loading..</div>}>
                        <PageTransition {...props} />
                      </Suspense>
                    </main>
                  </FocusProvider>
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
