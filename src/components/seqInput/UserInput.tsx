import { createComputed, on, onCleanup, onMount } from "solid-js";
import {
  TypingEventKind,
  type TypingEventType,
} from "../typing/TypingEvent.ts";
import useClickOutside from "solid-click-outside";
import { FocusType, useFocus } from "~/contexts/FocusProvider.tsx";

export type UserInputProps = {
  typingEvent: TypingEventType;
  // setWordsCount: (n: number) => void;
  onKeyDown: (key: string) => void;
  onKeyUp: (key: string) => void;
  onKeyAdd: (key: string, timestamp: number) => void;

  setFocus: (focus: () => void) => void;
};

const UserInput = (props: UserInputProps) => {
  let input: HTMLInputElement;
  // const [wordsCount, setWordsCount] = createSignal(0);

  // PendingStatus change
  createComputed(
    on(
      () => props.typingEvent,
      () => {
        switch (props.typingEvent.kind) {
          case TypingEventKind.unstart:
            input.value = "";
            input.focus();
          // props.setWordsCount(0);
          case TypingEventKind.pending:
          // case TypingStatusKind.pause:

          case TypingEventKind.over:
        }
      },
      { defer: true },
    ),
  );

  /* Key Handlers */

  const handleInputEvent = (event: Event) => {
    // TODO: composing for accents, could be great to have some visual feedback
    if (event instanceof InputEvent) {
      if (event.isComposing) {
        return;
      }
    }
    const timestamp = performance.now();
    const input = event.target as HTMLInputElement;
    const value = input.value;
    input.value = "";

    props.onKeyAdd(value, timestamp);
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    props.onKeyUp(event.key);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    props.onKeyDown(event.key);
  };

  /* *** */

  const { focus: globalFocus, setFocus: setGlobalFocus } = useFocus();

  onMount(() => {
    input.addEventListener("input", handleInputEvent);
    input.addEventListener("keydown", handleKeyDown);
    input.addEventListener("keyup", handleKeyUp);

    useClickOutside(
      () => input,
      () => {
        if (globalFocus() === FocusType.View) {
          input.focus();
        }
      },
    );
    // props.setPromptKey(cursor.get.key().key);

    props.setFocus(() => input.focus());
    input.focus();
  });

  onCleanup(() => {
    input.removeEventListener("input", handleInputEvent);
    input.removeEventListener("keydown", handleKeyDown);
    input.removeEventListener("keyup", handleKeyUp);
  });
  /****/

  return (
    <input
      ref={input!}
      type="text"
      autofocus
      autocorrect="off"
      autocomplete="off"
      autocapitalize="none"
      spellcheck={false}
      aria-hidden
      data-gramm="false"
      data-gramm_editor="false"
      data-enable-grammarly="false"
      style={{ position: "fixed", top: "-100px" }}
    />
  );
};

export default UserInput;
