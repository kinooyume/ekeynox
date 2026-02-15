import { createComputed, on, onCleanup, onMount } from "solid-js";

import { FocusType, useFocus } from "~/contexts/FocusProvider.tsx";

import useClickOutside from "~/primitives/useClickOutside.ts";

import { TypingStateKind, type TypingState } from "~/typingState";

export type UserInputRef = {
  focus: () => void;
};

export type UserInputExtends = {
  onKeyDown: (key: string) => void;
  onKeyUp: (key: string) => void;
  ref?: (ref: UserInputRef) => void;
};

type Props = {
  typingState: TypingState;

  onKeyAdd: (key: string) => void;
} & UserInputExtends;

const UserInput = (props: Props) => {
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
          case TypingStateKind.over:
        }
      },
      { defer: true },
    ),
  );

  /* Key Handlers */

  const handleInputEvent = (event: Event) => {
    if (event instanceof InputEvent) {
      if (event.isComposing) {
        return;
      }
    }

    const input = event.target as HTMLInputElement;

    const value = input.value.slice(-1);
    input.value = " ";

    if (value.length === 0) {
      return;
    }

    props.onKeyAdd(value);
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

  const handleCompositionEnd = (event: CompositionEvent) => {
    input.value = "";
    if (event.data.length > 0) {
      const value = event.data;
      props.onKeyAdd(value);
    }
  };

  const { focus: globalFocus, setFocus: setGlobalFocus } = useFocus();

  onMount(() => {
    input.addEventListener("compositionend", handleCompositionEnd);
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

    props.ref?.(input);
    input.focus();
  });

  onCleanup(() => {
    input.removeEventListener("input", handleInputEvent);
    input.removeEventListener("keydown", handleKeyDown);
    input.removeEventListener("keyup", handleKeyUp);
  });

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
