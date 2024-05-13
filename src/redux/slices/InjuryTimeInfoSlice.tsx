import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

/**
 * ```
 * givenInjuryTime: number;
 * isShowInjuryTimer: boolean;
 * ```
 */
export interface InjuryTimeInfoState {
  givenInjuryTime: number;
  isShowInjuryTimer: boolean;
}

const initialState: InjuryTimeInfoState = {
  givenInjuryTime: 0,
  isShowInjuryTimer: false,
};

const injuryTimeInfoSlice = createSlice({
  name: 'injuryTimeInfo',
  initialState,
  reducers: {
    updateGivenInjuryTime: (state, action: PayloadAction<number>) => {
      state.givenInjuryTime = action.payload;
    },
    showInjuryTimer: (state) => {
      console.log('showInjuryTimer');
      state.isShowInjuryTimer = true;
    },
    disappearInjuryTimer: (state) => {
      console.log('disappearInjuryTimer');
      state.isShowInjuryTimer = false;
    },
  },
});

export const { updateGivenInjuryTime, showInjuryTimer, disappearInjuryTimer } =
  injuryTimeInfoSlice.actions;
export default injuryTimeInfoSlice.reducer;
