import { onMount } from "solid-js";
import LoginWrapper from "~/components/LoginWrapper";
import { useAppState } from "~/contexts/AppStateProvider";

export default () => {
  const { mutation } = useAppState();

  onMount(() => {
    mutation.login();
  });
  return <LoginWrapper />;
};
