import { movies } from './movies';

export const generateRandomSet = (count = 3) => {
  return Array(count)
    .fill(movies)
    .flat()
    .sort(() => Math.random() - 0.5);
};

export const randomMoviesSet1 = generateRandomSet(3);
export const randomMoviesSet2 = generateRandomSet(3).sort(() => Math.random() - 0.5); 