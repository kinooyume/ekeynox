function makeReactiveParent() {
  let value = 0;
  const observers: Function[] = [];
  function set(v: number) {
    value = v;
    observers.forEach((observer) => observer());
  }
  function get() {
    const parent = arguments.callee;
    // parent function current arguments
    observers.push(parent);
    return value;
  }
  return [get, set];
}
