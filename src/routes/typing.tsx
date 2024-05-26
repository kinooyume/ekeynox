import { useAppState } from "~/appState/AppStateProvider";
import TypingGameManager from "~/components/typing/TypingGameManager";

import KeyboardLayout, {
} from "../settings/keyboardLayout.ts";
import { useGameOptions } from "~/gameOptions/GameOptionsProvider";
import { useSettings } from "~/settings/SettingsProvider";

export default function Typing() {
  const { state } = useAppState();
  const { gameOptions, setGameOptions, setContentGeneration, getPendingMode } =
    useGameOptions();
  const [settings] = useSettings();

  const { navigation } = useAppState();

  return (
    <TypingGameManager
      status={(state as any).data}
      gameOptions={gameOptions}
      showKb={settings.showKb}
      kbLayout={KeyboardLayout.create(settings.kb)}
      onExit={navigation.menu}
      onOver={navigation.over}
    />
  );
}
