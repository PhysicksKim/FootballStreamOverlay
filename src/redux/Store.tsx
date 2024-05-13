import { configureStore } from '@reduxjs/toolkit';
import CounterReducer from './slices/CounterSlice';
import FontReducer from './slices/FontSlice';
import InjuryTimeInfoReducer from './slices/InjuryTimeInfoSlice';

export const store = configureStore({
  reducer: {
    counter: CounterReducer,
    font: FontReducer,
    injuryTimeInfo: InjuryTimeInfoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
