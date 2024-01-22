import React, { ReactNode, createContext, useContext, useState } from 'react';

interface MainTimeDisplay {
  mainTimeDisplay: string;
  setMainTimeDisplay: React.Dispatch<React.SetStateAction<string>>;
}

const MainTimeDisplayContext = createContext<MainTimeDisplay | undefined>(
  undefined,
);

export const useMainTimeDisplay = () => {
  const context = useContext(MainTimeDisplayContext);
  if (!context) {
    throw new Error(
      'useMainTimeDisplay must be used within a MainTimerStateRoot',
    );
  }
  return context;
};

export const MainTimeDisplayProvider: React.FC<{
  children: ReactNode;
  mainTimeDisplay: string;
  setMainTimeDisplay: React.Dispatch<React.SetStateAction<string>>;
}> = ({ children, mainTimeDisplay, setMainTimeDisplay }) => {
  return (
    <MainTimeDisplayContext.Provider
      value={{ mainTimeDisplay, setMainTimeDisplay }}
    >
      {children}
    </MainTimeDisplayContext.Provider>
  );
};
