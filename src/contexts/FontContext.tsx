import React, { createContext, useState, useContext, ReactNode } from 'react';
import { FontEnum, FontInfo, fontInfos } from '@src/classes/FontEnum';

interface FontContextProps {
  fontInfo: FontInfo;
  updateGlobalFont: (font: FontEnum) => void;
}

const FontContext = createContext<FontContextProps | undefined>(undefined);

/**
 * { fontInfo, updateGlobalFont }
 * @returns FontContextProps : { fontInfo, updateGlobalFont }
 */
export const useFont = () => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
};

export const FontProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [fontInfo, setFontInfo] = useState<FontInfo>(
    fontInfos[FontEnum.ONE_MOBILE_TITLE],
  );

  const updateGlobalFont = (font: FontEnum) => {
    setFontInfo(fontInfos[font]);
  };

  return (
    <FontContext.Provider value={{ fontInfo, updateGlobalFont }}>
      {children}
    </FontContext.Provider>
  );
};
