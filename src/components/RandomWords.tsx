const randomWords =
  (data: Array<string>) =>
  (nbr: number): string => {
    const words = [];
    for (let i = 0; i < nbr; i++) {
      const index = Math.floor(
        (crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296) *
          data.length,
      );
      words.push(data[index]);
    }
    return words.join(" ");
  };

export default randomWords;
