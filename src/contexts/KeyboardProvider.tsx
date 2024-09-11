import { JSX, createContext, useContext } from "solid-js";
import { KeyboardLayoutName } from "~/settings/settings";
import KeyboardLayout, { HigherKeyboard } from "../settings/keyboardLayout.ts";

const keyboardContext = createContext<HigherKeyboard>();

export function useKeyboard() {
  const keyboard = useContext(keyboardContext);
  if (keyboard === undefined) {
    throw new Error("useKeyboard must be used within a KeyboardProvider");
  }
  return keyboard;
}

export function KeyboardProvider(props: {
  kbName: KeyboardLayoutName;
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <keyboardContext.Provider value={KeyboardLayout.create(props.kbName)}>
      {props.children}
    </keyboardContext.Provider>
  );
}
