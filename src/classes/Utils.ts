import { Time } from '@src/types/types';

export const timeToZeroFillString = (time: Time) =>
  `${time.min.toString().padStart(2, '0')}:${time.sec
    .toString()
    .padStart(2, '0')}`;

export const parseFlagClassName = (
  country: string,
  isSquared: boolean = false,
) => {
  if (isSquared) {
    // 1 by 1 ratio
    return `fi fi-${country.toLowerCase()} fis`;
  } else {
    // 4 by 3 ratio
    return `fi fi-${country.toLowerCase()}`;
  }
};
