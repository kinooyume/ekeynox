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
  locked: Accessor<boolean>;
  setLocked: (locked: boolean) => void;
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
  const [locked, setLocked] = createSignal<boolean>(false);

  return (
    <focusContext.Provider
      value={{
        focus,
        setFocus,
        locked,
        setLocked: (a) => {
          // console.log("setLocked", a);
          setLocked(a);
        },
      }}
    >
      {props.children}
    </focusContext.Provider>
  );
}
