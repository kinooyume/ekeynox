import ActionsResume from "~/components/resume/ActionsResume";
import TypingMetricsResume from "~/components/resume/TypingMetricsResume";
import KeyboardLayout from "../settings/keyboardLayout.ts";
import { useAppState } from "~/appState/AppStateProvider.tsx";
import { useSettings } from "~/settings/SettingsProvider.tsx";
import { useGameOptions } from "~/gameOptions/GameOptionsProvider.tsx";
import { GameOptions } from "~/gameOptions/gameOptions.ts";

export default function Resume() {
  const { gameOptions, setGameOptions, setContentGeneration, getPendingMode } =
    useGameOptions();

  const { navigation } = useAppState();
  const { state } = useAppState();
  const [settings] = useSettings();

  const start = (opts: GameOptions, customSource: string) => {
    setGameOptions(opts);
    setGameOptions("custom", customSource);

    // NOTE: ca va pas, on en a fait une fonction side effect
    // alors qu'on veut surtout le start qui ne change pas
    // tout ca a cause du generationSource
    // putain
    navigation.start(getPendingMode());
  };
  return (
    <TypingMetricsResume
      kbLayout={KeyboardLayout.create(settings.kb)}
      metrics={(state() as any).metrics}
    >
      {(metricsResume) => (
        <ActionsResume
          gameOptions={gameOptions}
          content={(state as any).content}
          metrics={(state as any).metrics}
          metricsResume={metricsResume}
          setContentGeneration={setContentGeneration}
          start={start}
          redo={() =>
            navigation.redo((state as any).content, (state as any).metrics)
          }
        />
      )}
    </TypingMetricsResume>
  );
}
