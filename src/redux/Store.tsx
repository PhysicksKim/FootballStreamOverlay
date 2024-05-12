import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/CounterSlice';
import fontReducer from './slices/FontSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    font: fontReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
