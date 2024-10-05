import { createContext, useContext, ParentComponent } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";
import { PendingStatus } from "~/states";
import { Paragraphs } from "~/typingContent/paragraphs/types";
import { TypingState } from "~/typingState";

type TypingContextState = {
  paragraphs: Paragraphs;
  setParagraphs: SetStoreFunction<Paragraphs>;
  status: PendingStatus;
  typingState: TypingState;
};

const TypingGameContext = createContext<[state: TypingContextState, actions: {}]>([
  {} as TypingContextState,
  {},
]);

export const TypingGameProvider: ParentComponent<TypingContextState> = (props) => {
  // const [state, setState] = createStore(props);

  const actions = {};

  return (
    <TypingGameContext.Provider value={[props, actions]}>
      {props.children}
    </TypingGameContext.Provider>
  );
};

export const useTyping = () => useContext(TypingGameContext);
