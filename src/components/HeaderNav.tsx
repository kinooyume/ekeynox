import { Match, Switch } from "solid-js";
import { GameModeKind, type I18nContext } from "./App";

type HeaderNavProps = {
  mode: GameModeKind;
  i18n: I18nContext;
};

const HeaderNav = (props: HeaderNavProps) => {
  return (
    <Switch>
      <Match when={props.mode === GameModeKind.monkey}>
        <p>{props.i18n.t("gameMode.monkey.title")}</p>
      </Match>
      <Match when={props.mode === GameModeKind.rabbit}>
        <p>{props.i18n.t("gameMode.rabbit.title")}</p>
      </Match>
    </Switch>
  );
};

export default HeaderNav;
