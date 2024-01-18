import { Time } from '@src/types/types';

export const timeToZeroFillString = (time: Time) =>
  `${time.min.toString().padStart(2, '0')}:${time.sec
    .toString()
    .padStart(2, '0')}`;
