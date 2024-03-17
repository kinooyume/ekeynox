export type LinkedList<T> = {
  value: T;
  next: LinkedList<T> | null;
} | null;

const make = <T>(next: LinkedList<T> | null, value: T): LinkedList<T> => ({
  value,
  next,
});

export type DLinkedList<T> = {
  value: T;
  prev: DLinkedList<T> | null;
  next: DLinkedList<T> | null;
};

export type DLinkedListBound<T> = [head: DLinkedList<T>, tail: DLinkedList<T>];

const makeDLinkedList = <T>(
  value: T,
  prev: DLinkedList<T> | null,
  next: DLinkedList<T> | null,
): DLinkedList<T> => ({ value, prev, next });

type ExtraValue<T, U> = {
  condition: (array: Array<T>, index: number) => boolean;
  value: () => U;
};

const mergeDLinkedList = <T>(
  target: DLinkedList<T>,
  source: DLinkedList<T>,
) => {
  target.next = source;
  source.prev = target;
};

const expandDLinkedList = <T>(target: DLinkedList<T>, elem: T) => {
  const list = makeDLinkedList(elem, target, null);
  target.next = list;
  return list;
};

type NonEmptyArray<T> = [T, T[]];

const makeDLinkedListFromArray = <T, U>(
  [first, rest]: NonEmptyArray<T>,
  transform: (v: T) => U,
): DLinkedListBound<U> => {
  const head = makeDLinkedList(transform(first), null, null);
  const tail = rest.reduce(
    (acc, value) => expandDLinkedList(acc, transform(value)),
    head,
  );
  return [head, tail];
};

const makeDLinkedListFromArrayWithExtra = <T, U>(
  [first, rest]: NonEmptyArray<T>,
  transform: (v: T) => U,
  extra: ExtraValue<T, U>,
): DLinkedListBound<U>  => {
  const head = makeDLinkedList(transform(first), null, null);
  const tail = rest.reduce((acc, value, index) => {
    const list = expandDLinkedList(acc, transform(value));
    if (!extra.condition(rest, index)) return list;
    return expandDLinkedList(list, extra.value());
  }, head);
  return [head, tail];
};

const copyDLinkedList = <T>(
  parse: (v: T) => T,
  list: DLinkedList<T>,
): DLinkedList<T> => {
  const copy = makeDLinkedList(list.value, list.prev, list.next);
  let current = list.next;
  let copyCurrent = copy;
  while (current !== null) {
    copyCurrent.next = makeDLinkedList(parse(current.value), copyCurrent, null);
    copyCurrent = copyCurrent.next;
    current = current.next;
  }
  return copy;
};

export default {
  make,
  makeDLinkedList,
  makeDLinkedListFromArray,
  makeDLinkedListFromArrayWithExtra,
  copyDLinkedList,
  mergeDLinkedList,
};
