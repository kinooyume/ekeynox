// NOTE: not used
// d
export type TypingModeProps<T> = {
  // onOver: () => void;
};

export type TypingModeEndpoint = {

};

export type TypingMode<T> = (
  props: T,
) => TypingModeEndpoint;
