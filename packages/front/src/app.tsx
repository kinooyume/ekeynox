import { Link, Meta, MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";

import {
  ParentProps,
  Show,
  Suspense,
  createEffect,
  createSignal,
} from "solid-js";
import { Transition, TransitionGroup } from "solid-transition-group";

import Header from "./components/Header";

import { useAssets } from "solid-js/web";

import { StyleRegistry, css, renderSheets, type StyleData } from "solid-styled";

import "./styles/fonts.css";
import "./styles/global.css";

import { AppStateProvider } from "./contexts/AppStateProvider";
import { GameOptionsProvider } from "./contexts/GameOptionsProvider";
import { SettingsProvider } from "./contexts/SettingsProvider";
import { FocusProvider } from "./contexts/FocusProvider";
import { useWindowSize } from "@solid-primitives/resize-observer";
import MobileWarning from "./components/MobileWarning";

export default function App() {
  const sheets: StyleData[] = [];
  useAssets(() => renderSheets(sheets));

  const [showWarning, setShowWarning] = createSignal(false);
  createEffect(() => {
    if (size.width < 1050) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  });
  const size = useWindowSize();
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
    .modal {
      position: absolute;
    }
  `;

  const PageTransition = (props: ParentProps) => (
    <div class="transition-container">
      <Transition
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
        lid
        {props.children}
      </Transition>
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
                  <FocusProvider>
                    <Header />
                    <Title>Ekeynox</Title>
                    <Meta
                      name="description"
                      content="Learn to type while having fun"
                    />
                    <Meta property="og:title" content="Ekeynox" />
                    <Meta
                      property="og:description"
                      content="Learn to type while having fun"
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
                      content="Learn to type while having fun"
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
                      {/* <Show when={showWarning()}> */}
                      {/*   <MobileWarning /> */}
                      {/* </Show> */}
                      <Suspense fallback={<div>Loading..</div>}>
                        <PageTransition {...props} />
                      </Suspense>
                      <div class="modal" id="modal-portal"></div>
                      <div class="modal" id="modal-toaster"></div>
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
