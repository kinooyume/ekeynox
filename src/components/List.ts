export type LinkedList<T> = {
  value: T;
  next: LinkedList<T> | null;
} | null;

const make = <T>(next: LinkedList<T> | null, value: T): LinkedList<T> => ({
  value,
  next,
});

export type CircularList<T> = {
  value: T;
  prev: CircularList<T>;
  next: CircularList<T>;
};

const makeCircular = <T>(
  value: T,
  prev: CircularList<T>,
  next: CircularList<T>,
): CircularList<T> => ({ value, prev, next });

const makeCircularNext =
  <T>(value: T, prev: CircularList<T>) =>
  (next: CircularList<T>) =>
    makeCircular(value, prev, next);

const makeCircularPrev =
  <T>(value: T, next: CircularList<T>) =>
  (prev: CircularList<T>) =>
    makeCircular(value, prev, next);

export default {
  make,
  makeCircular,
  makeCircularNext,
  makeCircularPrev,
};
