// NOTE: Not used
////
//import type { DLinkedList, DLinkedListBound } from "../List";
//import type { MetaCharacter, MetaWord } from "./ContentList.ts.bck";
//import type { NavMeta } from "./ContentNav";
//
//type ContentContainer = {};
//
//type ContentIterator = {
//  paragraph: DLinkedList<MetaWord>;
//  word: MetaWord;
//  key: MetaCharacter;
//  next: () => ContentIterator | null;
//  prev: () => ContentIterator | null;
//};
//
//const wrapParentHooks = <T, H>(
//  parent: NavMeta<T>,
//  children: DLinkedListBound<NavMeta<H>>,
//) => {
//  return {
//    next: () => {},
//    prev: () => {},
//  };
//};
//
//export  {
//  wrapParentHooks,
//}
