import { Component } from "solid-js";
import Login from "~/components/login/Login";
import { useI18n } from "~/contexts/i18nProvider";
import { createSignal, Match, onMount, Switch } from "solid-js";

import { css } from "solid-styled";

enum Mode {
  LOGIN = "login",
  REGISTER = "register",
}

const LoginWrapper: Component<{}> = (props) => {
  const t = useI18n();

  const [mode, setMode] = createSignal(Mode.LOGIN);

  css`
    .form-wrapper {
      max-width: 400px;
      padding: 60px 100px;
      border-radius: 22px;
      margin: 0 auto;
      background-color: var(--color-surface-mixed-200);
      border: 1px solid var(--background-color);
    }

    h1 {
      margin: 0;
      font-weight: 200;
      font-size: 32px;
      margin-bottom: 8px;
    }
    p {
      color: var(--text-secondary-color);
      margin: 0;
    }
    .intro {
      margin-bottom: 32px;
    }
  `;
  return (
    <section>
      <div class="form-wrapper">
        <div class="intro">
          <h1>{t(`${mode()}.title`)}</h1>
          <p>{t(`${mode()}.description`)}</p>
        </div>
        <Switch>
          <Match when={mode() === Mode.LOGIN}>
            <Login />
          </Match>
        </Switch>
      </div>
    </section>
  );
};

export default LoginWrapper;
