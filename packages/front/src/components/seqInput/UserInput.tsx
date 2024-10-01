import { createComputed, on, onCleanup, onMount } from "solid-js";
import {
  TypingEventKind,
  type TypingEventType,
} from "../typing/TypingEvent.ts";
import { FocusType, useFocus } from "~/contexts/FocusProvider.tsx";
import useClickOutside from "~/hooks/useClickOutside.ts";

export type UserInputRef = {
  focus: () => void;
};

type UserInputProps = {
  typingEvent: TypingEventType;
  onKeyDown: (key: string) => void;
  onKeyUp: (key: string) => void;
  onKeyAdd: (key: string, timestamp: number) => void;
  ref?: (ref: UserInputRef) => void;
};

const UserInput = (props: UserInputProps) => {
  let input: HTMLInputElement;

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
    // NOTE: composing for accents, could be great to have some visual feedback
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

    //   console.log("Focus from input !")
    // input.addEventListener("focus", () => {
    // })
    // input.addEventListener("blur", () => {
    //   console.log("blur from input !")
    // })
    props.ref?.(input);
    // unfocus input
    input.focus();
  });

  onCleanup(() => {
    input.removeEventListener("input", handleInputEvent);
    input.removeEventListener("keydown", handleKeyDown);
    input.removeEventListener("keyup", handleKeyUp);
  });
  /****/

  return (
    <>
      <label
        for="user-input"
        style={{ position: "fixed", top: "-100px" }}
        aria-hidden
      >
        User input
      </label>
      <input
        ref={input!}
        name="user-input"
        id="user-input"
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
    </>
  );
};

export default UserInput;
