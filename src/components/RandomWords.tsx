const randomWords = (data: Array<string>) => (nbr: number) : string => {
  const words = [];
  for (let i = 0; i < nbr; i++) {
    const index = Math.floor(Math.random() * data.length);
    words.push(data[index]);
  }
  return words.join(" ");
};

export default randomWords;
