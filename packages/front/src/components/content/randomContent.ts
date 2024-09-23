const random = (length: number) =>
  Math.floor(
    (crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296) * length,
  );

const randomQuote = (data: Array<string>) => data[random(data.length)];

const randomWords =
  (data: Array<string>) =>
  (nbr: number): Array<string> => {
    const words = [];
    for (let i = 0; i < nbr; i++) {
      words.push(data[random(data.length)]);
    }
    return words;
  };

export { randomWords, randomQuote }
