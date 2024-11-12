export type TimeArray = [number, number];

const toFixedNumber = (num: number, digits: number, base: number = 10) => {
  const pow = Math.pow(base, digits);
  return Math.round(num * pow) / pow;
};

const timeFromNumber = (duration: number): TimeArray => {
  // from miliseconds to minutes and seconds
  const minutes = Math.floor(duration / 60000);
  const seconds = toFixedNumber((duration % 60000) / 1000, 0);
  return [minutes, seconds];
};

const timeStringFromNumber = (duration: number): string => {
  const minutes = Math.floor(duration / 60000);
  const seconds = ((duration % 60000) / 1000).toFixed(0);
  const secString = `${seconds}s`;
  if (minutes === 0) return secString;
  return `${minutes}m${secString}`;
};

export { timeFromNumber, timeStringFromNumber };
