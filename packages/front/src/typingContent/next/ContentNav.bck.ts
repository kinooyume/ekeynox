// NOTE: not used
// import type { DLinkedList } from "../List";

// export type NavHooksProps = {
//   back?: boolean;
// };
//
// export type NavHooks = {
//   enter: (p: NavHooksProps) => void;
//   exit: (p: NavHooksProps) => void;
// };
//
// const composeHooks = (parentHooks: NavHooks, childHooks: NavHooks) => ({
//   enter: (p: NavHooksProps) => {
//     parentHooks.enter(p);
//     childHooks.enter(p);
//   },
//   exit: (p: NavHooksProps) => {
//     parentHooks.exit(p);
//     childHooks.exit(p);
//   },
// });
//
// const rootHooks: NavHooks = {
//   enter: () => {},
//   exit: () => {},
// };
//
// export type MakeNavHooks<T> = (key: T) => NavHooks;
//
// // TODO: rename this, Hooks meta ?
// export type NavMeta<T> = {
//   value: T;
//   hooks: NavHooks;
// };
//
// export type NavParentMeta<T, H> = {
//   value: T;
//   hooks: NavHooks;
//   child: ContentIterator<DLinkedList<NavMeta<H>>>;
// };
//
// const hookWrapper = <T>(value: T, hooks: MakeNavHooks<T>): NavMeta<T> => ({
//   value,
//   hooks: hooks(value),
// });
//
// // same as circularList, but with callbacks..
// // hum hum..
//
// export type ContentIterator<T> = {
//   value: T;
//   prev: () => ContentIterator<T> | null;
//   next: () => ContentIterator<T> | null;
// };
//
// const rootIterator = {
//   value: null,
//   prev: () => null,
//   next: () => null,
// };
//
// type IteratorFromMetaNav<T> = (
//   value: DLinkedList<NavMeta<T>>,
// ) => ContentIterator<DLinkedList<NavMeta<T>>>;
//
// type MakeIteratorFromMetaNav<T> = (
//   parent: ContentIterator<DLinkedList<NavMeta<T>>>,
// ) => IteratorFromMetaNav<T>;
//
// //const makeParentIterator = <T, H>() =>
//
// const metaIterator = <T>(value: DLinkedList<NavMeta<T>>) => ({
//   value: [value.value],
//   prev: () => {
//     value.value.hooks.exit({ back: true });
//     if (value.prev === null) return null;
//     value.prev.value.hooks.enter({ back: true });
//     return metaIterator(value.prev);
//   },
//   next: () => {
//     value.value.hooks.exit({});
//     if (value.next === null) return null;
//     value.next.value.hooks.enter({});
//     return metaIterator(value.next);
//   },
// });
//
// const makeParentMetaIterator = <T, H>(
//   parent: DLinkedList<NavParentMeta<T, Array<H>>>,
// ) => {
//   const parentIterator = () => {
//     return {
//       value: [parent.value, ...parent.value.child.value.value.value],
//       prev: () => {
//         const child = parent.value.child;
//         child.value.value.hooks.exit({ back: true });
//         const prevChild = child.prev();
//         if (prevChild) {
//           parent.value.child = prevChild;
//           return parentIterator();
//         }
//         parent.value.hooks.exit({ back: true });
//         const prevParent = parent.prev;
//         if (!prevParent) return null;
//         prevParent.value.hooks.enter({ back: true });
//         prevParent.value.child.value.value.hooks.enter({ back: true });
//         return makeParentMetaIterator(prevParent);
//       },
//       next: () => {
//         const child = parent.value.child;
//         child.value.value.hooks.exit({ back: true });
//         const nextChild = child.next();
//         if (nextChild) {
//           parent.value.child = nextChild;
//           return parentIterator();
//         }
//         parent.value.hooks.exit({ back: true });
//         const nextParent = parent.next;
//         if (!nextParent) return null;
//         nextParent.value.hooks.enter({ back: true });
//         nextParent.value.child.value.value.hooks.enter({ back: true });
//         return makeParentMetaIterator(nextParent);
//       },
//     };
//   };
//   return parentIterator;
// };
//
// //
//
// /* Side Effect */
// const appendParentHooks = <T, H>(
//   parent: NavMeta<T>,
//   children: DLinkedList<NavMeta<H>>,
// ) => {
//   const lastChild = children.prev || children;
//   children.value.hooks = composeHooks(parent.hooks, children.value.hooks);
//   lastChild.value.hooks.exit = (p) => {
//     lastChild.value.hooks.exit(p);
//     parent.hooks.exit(p);
//   };
// };
//
// /* ***  */
//
// // const curryAndApplyIterator =
// //   <T>(value: DLinkedList<NavMeta<T>>) =>
// //   (parent: ContentIterator<DLinkedList<NavMeta<T>>>) =>
// //     makeIteratorFromMetaNav(parent)(value);
//
// export {
//   hookWrapper,
//   metaIterator,
//   appendParentHooks,
//   composeHooks,
//   rootIterator,
//   rootHooks,
// };
//
// // NOTE: we want to dynamicly flat the nested double linked list
