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
}

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

    const input = event.target as HTMLInputElement;
    // Multi-platform backspace
    // if (input.value.length === 0) {
    //   // backspace !!
    // }

    // Was great, but doesn't work properly on chrome when backspace
    // const value = input.value.slice(-1);
    // input.value = " ";

    // NOTE: Je peux peut etre ne pas remplacer le value plutot
    // En fait, j'ai peur que ça devienne de plus en plus lent
    // Mais a voir, en vrai y'en aura pas beaucoup
    // Mais, peut etre que c'est la manière universelle de faire
    const value = input.value;
    input.value = "";
    // *** /

    // const ev = keypressHandler().addKey(value, timestamp);
    // if (!ev) return;
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
