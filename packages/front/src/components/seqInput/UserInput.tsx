import {
  createComputed,
  on,
  onCleanup,
  onMount,
} from "solid-js";

import { FocusType, useFocus } from "~/contexts/FocusProvider.tsx";

import useClickOutside from "~/primitives/useClickOutside.ts";

import {
  TypingStateKind,
  type TypingState,
} from "~/typingState";


export type UserInputRef = {
  focus: () => void;
};

type UserInputProps = {
  typingState: TypingState;
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
      () => props.typingState,
      () => {
        switch (props.typingState.kind) {
          case TypingStateKind.unstart:
            input.value = "";
            input.focus();
          case TypingStateKind.pending:
          // case TypingStatusKind.pause:

          case TypingStateKind.over:
        }
      },
      { defer: true },
    ),
  );

  /* Key Handlers */

  // NOTE: composing for accents, could be great to have some visual feedback
  const handleInputEvent = (event: Event) => {
    if (event instanceof InputEvent) {
      if (event.isComposing) {
        return;
      }
    }

    const timestamp = performance.now();
    const input = event.target as HTMLInputElement;
    // Multi-platform backspace
    // if (input.value.length === 0) {
    //   // backspace !!
    // }
    
    // Was great, but doesn't work properly on chrome when backspace
    // const value = input.value.slice(-1);
    // input.value = " ";
    
    const value = input.value;
     input.value = "";
    // *** /
    props.onKeyAdd(value, timestamp);
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    props.onKeyUp(event.key);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
    }
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
        autocapitalize="off"
        spellcheck={false}
        list="autocompleteOff"
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
