import type { DLinkedList, DLinkedListBound } from "../List";
import type { MetaKey, MetaWord } from "./ContentList.ts.bck";
import type { NavMeta } from "./ContentNav";

type ContentContainer = {};

type ContentIterator = {
  paragraph: DLinkedList<MetaWord>;
  word: MetaWord;
  key: MetaKey;
  next: () => ContentIterator | null;
  prev: () => ContentIterator | null;
};

const wrapParentHooks = <T, H>(
  parent: NavMeta<T>,
  children: DLinkedListBound<NavMeta<H>>,
) => {
  return {
    next: () => {},
    prev: () => {},
  };
};

export  {
  wrapParentHooks,
}
