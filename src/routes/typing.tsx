import { useAppState } from "~/appState/AppStateProvider";
import TypingGameManager from "~/components/typing/TypingGameManager";

import KeyboardLayout, {
} from "../settings/keyboardLayout.ts";
import { useGameOptions } from "~/gameOptions/GameOptionsProvider";
import { useSettings } from "~/settings/SettingsProvider";
import { AppState, AppStateKind, PendingState } from "~/appState/appState.ts";
import { GameOptions } from "~/gameOptions/gameOptions.ts";

const getStatus = (state: AppState, gameOptions: GameOptions) => { 
  if (state.kind === AppStateKind.pending) return state.data;
  
}
export default function Typing() {
  const { state } = useAppState();
  const { gameOptions, setGameOptions, setContentGeneration, getPendingMode } =
    useGameOptions();
  const [settings] = useSettings();

  const { navigation } = useAppState();

  return (
    <TypingGameManager
      status={(state() as PendingState).data}
      gameOptions={gameOptions}
      showKb={settings.showKb}
      kbLayout={KeyboardLayout.create(settings.kb)}
      onExit={navigation.menu}
      onOver={navigation.over}
    />
  );
}
