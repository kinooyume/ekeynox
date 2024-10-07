import { type Cursor } from "./Cursor";

// NOTE: on appelle l'enfant dans le parent (key->word)
// Donc on doit pouvoir refacto ca
// et lié chaque Hooks d'un parent a un enfant

export type NodeHooks = {
  enter: (cursor: Cursor) => void;
  leave: (cursor: Cursor) => void;
};

export type NavHooks = {
  prev: NodeHooks;
  next: NodeHooks;
};

export type CursorNavHooks = {
  paragraph: NavHooks;
  word: NavHooks;
  character: NavHooks;
};
