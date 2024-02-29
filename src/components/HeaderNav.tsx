import { Match, Switch } from "solid-js";
import { GameMode, type I18nContext } from "./App";

type HeaderNavProps = {
  mode: GameMode;
  i18n: I18nContext;
};

const HeaderNav = (props: HeaderNavProps) => {
  return (
    <Switch>
      <Match when={props.mode === GameMode.monkey}>
        <p>{props.i18n.t("gameMode.monkey.title")}</p>
      </Match>
      <Match when={props.mode === GameMode.rabbit}>
        <p>{props.i18n.t("gameMode.rabbit.title")}</p>
      </Match>
      <Match when={props.mode === GameMode.chameleon}>
        <p>{props.i18n.t("gameMode.chameleon.title")}</p>
      </Match>
    </Switch>
  );
};

export default HeaderNav;
