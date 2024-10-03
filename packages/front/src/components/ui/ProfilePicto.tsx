import { Component, Match, Switch } from "solid-js";
import { css } from "solid-styled";
import Profile from "~/svgs/profile";

type Props = {
  logged: boolean;
  name?: string;
};

const ProfilePicto: Component<Props> = (props) => {
  css`
    a {
      width: 16px;
      height: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      border: 1px solid var(--text-secondary-color);
    }
  `;

  return (
    <Switch>
      <Match when={!props.logged}>
        <a href="/login">
          <Profile />
        </a>
      </Match>
      <Match when={props.logged}>
        <a href="/profile">
          <p>{props.name![0]}</p>
        </a>
      </Match>
    </Switch>
  );
};

export default ProfilePicto;
