export enum CharacterStatus {
  unset = "unset",
  match = "match",
  unmatch = "unmatch",
  extra = "extra",
  missed = "missed",
}

export enum CharacterFocus {
  unset = "unset",
  focus = "focus",
  unfocus = "unfocus",
  back = "back",
}

export type MetaCharacter = {
  status: CharacterStatus;
  wasInvalid: boolean;
  focus: CharacterFocus;
  ghostFocus: CharacterFocus;
  char: string;
};

export type CharacterAdded =
  | { kind: CharacterStatus.match }
  | { kind: CharacterStatus.extra }
  | { kind: CharacterStatus.missed; typed: string }
  | { kind: CharacterStatus.unmatch; typed: string };

export enum CharacterEventKind {
  added,
  deleted,
  back,
  ignore,
}

export type CharacterEvent =
  | { kind: CharacterEventKind.added; status: CharacterAdded }
  | { kind: CharacterEventKind.deleted; status: CharacterStatus }
  | { kind: CharacterEventKind.back }
  | { kind: CharacterEventKind.ignore };

export type CharacterEventTuple = [key: string, CharacterEvent];

export type TypingCharacter = {
  keyMetrics: CharacterEventTuple;
  timestamp: number;
  focusIsSeparator: boolean;
};
