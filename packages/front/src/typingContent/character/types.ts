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

// Prompt
export type MetaCharacter = {
  // index: number;
  status: CharacterStatus;
  focus: CharacterFocus;
  ghostFocus: CharacterFocus;
  // wasInvalid: boolean;
  char: string;
};

/* *** */
/* Event */
/* *** */

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
  // separator - Added/deleted
}

// CharacterEvent -> CharacterEventInfo
// CharacterEventTuple -> CharacterEvent

export type CharacterEvent =
  | { kind: CharacterEventKind.added; status: CharacterAdded }
  | { kind: CharacterEventKind.deleted; status: CharacterStatus }
  | { kind: CharacterEventKind.back }
  | { kind: CharacterEventKind.ignore };

export type CharacterEventTuple = [key: string, CharacterEvent];

/* *** */
/* TypingState */
/* *** */

export type TypingCharacter = {
  keyMetrics: CharacterEventTuple; // event
  timestamp: number;
  focusIsSeparator: boolean; // NOTE: could be prevKeySeparator
};
