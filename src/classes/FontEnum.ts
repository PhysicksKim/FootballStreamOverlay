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
