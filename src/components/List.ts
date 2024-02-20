export type LinkedList<T> = {
  value: T;
  next: LinkedList<T> | null;
};

const make = <T>(
  list: LinkedList<T> | null,
  value: T,
): LinkedList<T> => {
  return { value, next: list };
};

export default {
  make
}
