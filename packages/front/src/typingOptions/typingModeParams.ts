import { Component } from "solid-js";
import { TypingOptions } from "./typingOptions";
import { SetStoreFunction } from "solid-js/store";

export type TypingModeParamValue<Value> = {
  label: string;
  content: Value;
  icon?: () => Component;
};

export type TypingModeParam<Value> = {
  name: string;
  label: string;
  values: TypingModeParamValue<Value>[];
  compare: (value: Value) => boolean;
  setValue: (value: Value) => void;
};

export type TypingModeProps = {
  typingOptions: TypingOptions;
  setTypingOptions: SetStoreFunction<TypingOptions>;
}

export type MakeTypingModeParam<Value> = (
  typingOptions: TypingOptions,
  setTypingOptions: SetStoreFunction<TypingOptions>
) => TypingModeParam<Value>;

