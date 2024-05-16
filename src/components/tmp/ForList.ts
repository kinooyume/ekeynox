import { createMemo, type Accessor, type JSX, mapArray } from "solid-js";
import type { DLinkedList, LinkedList } from "./List";

export function For<T extends readonly any[], U extends JSX.Element>(props: {
  each: T | undefined | null | false;
  fallback?: JSX.Element;
  children: (item: T[number], index: Accessor<number>) => U;
}) {
  const fallback = "fallback" in props && { fallback: () => props.fallback };
  return ("_SOLID_DEV_"
    ? createMemo(
        mapArray(() => props.each, props.children, fallback || undefined),
        undefined,
        { name: "value" },
      )
    : createMemo(
        mapArray(() => props.each, props.children, fallback || undefined),
      )) as unknown as JSX.Element;
}

export function ForList<T extends LinkedList<T>, U extends JSX.Element>(props: {
  each: T | undefined | null | false;
  fallback?: JSX.Element;
  children: (item: T) => U;
}) {
  const fallback =
    "fallback" in props ? { fallback: () => props.fallback } : undefined;
  return ("_SOLID_DEV_"
    ? createMemo(
        mapArray(() => props.each, props.children, fallback),
        undefined,
        { name: "value" },
      )
    : createMemo(
        mapArray(() => props.each, props.children, fallback),
      )) as unknown as JSX.Element;
}

