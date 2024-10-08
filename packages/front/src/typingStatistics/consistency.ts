// Shamelessly stolen from monkeytype

/**
 * Calculates the standard deviation of an array of numbers.
 * @param array An array of numbers.
 * @returns The standard deviation of the input array.
 */

function stdDeviation(array: number[]): number {
  try {
    const n = array.length;
    const mean = array.reduce((a, b) => a + b) / n;
    return Math.sqrt(
      array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n,
    );
  } catch (e) {
    return 0;
  }
}

/**
 * Calculates the mean (average) of an array of numbers.
 * @param array An array of numbers.
 * @returns The mean of the input array.
 */
function mean(array: number[]): number {
  try {
    return (
      array.reduce((previous, current) => (current += previous)) / array.length
    );
  } catch (e) {
    return 0;
  }
}

/**
 * Calculates consistency by mapping COV from [0, +infinity) to [100, 0).
 * The mapping function is a version of the sigmoid function tanh(x) that is closer to the identity function tanh(arctanh(x)) in [0, 1).
 * @param cov The coefficient of variation of an array of numbers (standard deviation / mean).
 * @returns Consistency
 */

function kogasa(cov: number): number {
  return (
    100 * (1 - Math.tanh(cov + Math.pow(cov, 3) / 3 + Math.pow(cov, 5) / 5))
  );
}

const consistency = (values: number[]): number => {
  return kogasa(stdDeviation(values) / mean(values));
};

export { consistency };
