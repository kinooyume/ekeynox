import {
  Accessor,
  JSX,
  createContext,
  createSignal,
  useContext,
} from "solid-js";

export enum FocusType {
  Hud,
  View,
}

type FocusProps = {
  focus: Accessor<FocusType>;
  setFocus: (focus: FocusType) => void;
};

const focusContext = createContext<FocusProps>({} as FocusProps);

export function useFocus() {
  const focus = useContext(focusContext);
  if (focus === undefined) {
    throw new Error("useFocus must be used within a FocusProvider");
  }
  return focus;
}

export function FocusProvider(props: {
  children: JSX.Element | JSX.Element[];
}) {
  const [focus, setFocus] = createSignal<FocusType>(FocusType.View);

  return (
    <focusContext.Provider
      value={{
        focus,
        setFocus,
      }}
    >
      {props.children}
    </focusContext.Provider>
  );
}
