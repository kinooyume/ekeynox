import { Match, Switch } from "solid-js";
import { GameMode, type GameModePending, type I18nContext } from "./App";

type HeaderNavProps = {
  mode: GameModePending;
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
    </Switch>
  );
};

export default HeaderNav;
