import { CharacterFocus, CharacterStatus, MetaCharacter } from "./types";

const createCharacter = (character: string): MetaCharacter => ({
  char: character,
  status: CharacterStatus.unset,
  focus: CharacterFocus.unset,
  ghostFocus: CharacterFocus.unset,
});

export { createCharacter };
