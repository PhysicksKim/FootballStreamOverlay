import React, { createContext, useState, useContext, ReactNode } from 'react';
import { FontEnum, FontInfo, fontInfos } from '@src/classes/FontEnum';

interface FontContextProps {
  fontInfo: FontInfo;
  updateGlobalFont: (font: FontEnum) => void;
}

const FontContext = createContext<FontContextProps | undefined>(undefined);

export const useFont = () => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
};

interface FontProviderProps {
  children: ReactNode;
}

export const FontProvider: React.FC<FontProviderProps> = ({ children }) => {
  const [fontInfo, setFontInfo] = useState<FontInfo>(
    fontInfos[FontEnum.ONE_MOBILE_TITLE],
  );

  const updateGlobalFont = (font: FontEnum) => {
    setFontInfo(fontInfos[font]);
    console.log('font 변경 ', font);
  };

  return (
    <FontContext.Provider value={{ fontInfo, updateGlobalFont }}>
      {children}
    </FontContext.Provider>
  );
};
