import { Component } from "solid-js";

// NOTE: note use after all, was initially for settings
type ConditionalWrapperProps<T> = {
  cond: boolean;
  DefaultWrapper: Component<T>;
  ConditionalWrapper: Component<T>;
  childrenProps: T;
};

export default function ConditionalWrapper<T>(props: ConditionalWrapperProps<T>) {
  return props.cond
    ? props.ConditionalWrapper(props.childrenProps)
    : props.DefaultWrapper(props.childrenProps);
}
