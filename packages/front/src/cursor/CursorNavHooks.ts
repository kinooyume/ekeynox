import { type Cursor } from "./Cursor";


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
