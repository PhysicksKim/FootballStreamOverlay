import { Time } from '@src/types/types';

export const timeToZeroFillString = (time: Time) =>
  `${time.min.toString().padStart(2, '0')}:${time.sec
    .toString()
    .padStart(2, '0')}`;

export const Urls = {
  apiUrl: process.env.API_URL || window.location.origin,
  websocketUrl: (process.env.WEBSOCKET_URL || window.location.origin) + '/ws',
};
