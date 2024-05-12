import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export enum FontEnum {
  ONE_MOBILE_TITLE = 'ONE-Mobile-Title',
  TAEBEAK = 'TAEBAEKfont',
}

export interface FontInfo {
  code: FontEnum;
  name: string;
}

export const fontInfos: Record<FontEnum, FontInfo> = {
  [FontEnum.ONE_MOBILE_TITLE]: {
    code: FontEnum.ONE_MOBILE_TITLE,
    name: '원스토어 모바일고딕 제목체',
  },
  [FontEnum.TAEBEAK]: { code: FontEnum.TAEBEAK, name: '태백체' },
};

const initFont = FontEnum.ONE_MOBILE_TITLE;

const initialState: FontInfo = {
  code: initFont,
  name: fontInfos[initFont].name,
};

const fontSlice = createSlice({
  name: 'font',
  initialState,
  reducers: {
    updateGlobalFont: (state, action: PayloadAction<FontEnum>) => {
      state.code = action.payload;
      state.name = fontInfos[action.payload].name;
    },
  },
});

export const { updateGlobalFont } = fontSlice.actions;
export default fontSlice.reducer;
