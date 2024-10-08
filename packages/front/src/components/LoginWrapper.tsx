import { Component } from "solid-js";
import Login from "~/components/login/Login";
import { useI18n } from "~/contexts/i18nProvider";
import { createSignal, Match, onMount, Switch } from "solid-js";

import { css } from "solid-styled";
import Register from "./login/Register";

enum Mode {
  LOGIN = "login",
  REGISTER = "register",
  FORGOT_PASSWORD = "forgotPassword",
}

const LoginWrapper: Component<{}> = (props) => {
  const t = useI18n();

  const [mode, setMode] = createSignal(Mode.REGISTER);

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
            <Login>
              <div class="switch-mode">
                <button onClick={() => setMode(Mode.REGISTER) }>Don't have an account ?</button>
              </div>
            </Login>
          </Match>
          <Match when={mode() === Mode.REGISTER}>
            <Register>
                <button onClick={() => setMode(Mode.LOGIN) }>
                Already have an account ?
              </button>
            </Register>
          </Match>
        </Switch>
      </div>
    </section>
  );
};

export default LoginWrapper;
